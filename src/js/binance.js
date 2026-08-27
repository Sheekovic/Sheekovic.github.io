async function getHistoricalData() {
    const symbol = document.getElementById("cryptoPairInput").value; // Get selected crypto pair
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=720`;
    const response = await fetch(url);
    const data = await response.json();

    return data.map(candle => ({
        time: new Date(candle[0]),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4])
    }));
}

function filterMorningCandles(candles) {
    return candles.filter(candle => {
        let hour = candle.time.getUTCHours();
        return hour >= 0 && hour <= 12;
    });
}

function analyzeDailyRange(candles) {
    let dailyData = {};

    candles.forEach(candle => {
        let date = candle.time.toISOString().split("T")[0];
        if (!dailyData[date]) dailyData[date] = { highs: [], lows: [] };

        dailyData[date].highs.push(candle.high);
        dailyData[date].lows.push(candle.low);
    });

    return Object.keys(dailyData).map(date => ({
        date,
        lowest: Math.min(...dailyData[date].lows),
        highest: Math.max(...dailyData[date].highs)
    }));
}

function formatDuration(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function backtestStrategy(candles, leverage, initialBalance, tradeEntryPercent, takeProfitROI, stopLossROI) {
    let balance = initialBalance;
    let tradeResults = [];
    let dailyRanges = analyzeDailyRange(filterMorningCandles(candles));
    let balanceHistory = [];

    dailyRanges.forEach(day => {
        let startWalletBalance = balance;
        let initialMargin = startWalletBalance * (tradeEntryPercent / 100);  
        let positionSize = initialMargin;  
        let tradeOpenTime = null;
        let tradeCloseTime = null;
        let tradeDuration = "N/A";
        let entryPrice = null;
        let exitPrice = null;
        let positionType = null;  // "LONG" or "SHORT"
        let liqPrice = null;
        let tpPrice = null;
        let slPrice = null;
        let tradeOpened = false;

        // Find candles AFTER 11:01 AM
        let tradingCandles = candles.filter(c => {
            let candleDate = c.time.toISOString().split("T")[0];
            let hour = c.time.getUTCHours();
            return candleDate === day.date && hour >= 11;
        });

        for (let candle of tradingCandles) {
            // Open LONG at Lowest Price
            if (!tradeOpened && candle.low <= day.lowest) {
                positionType = "LONG";
                entryPrice = day.lowest;
                tradeOpenTime = candle.time;
                liqPrice = entryPrice / (1 + ((startWalletBalance - initialMargin) / initialMargin) * (1 / leverage));
                tpPrice = entryPrice * (1 + (takeProfitROI / (100 * leverage)));
                slPrice = entryPrice * (1 - (stopLossROI / (100 * leverage)));
                tradeOpened = true;
            }
            // Close LONG
            if (tradeOpened && positionType === "LONG") {
                if (candle.low <= slPrice) {
                    exitPrice = slPrice;
                    tradeCloseTime = candle.time;
                    break;
                } else if (candle.high >= tpPrice) {
                    exitPrice = tpPrice;
                    tradeCloseTime = candle.time;
                    break;
                }
            }
        }

        if (tradeOpened) {
            let dayProfitLoss = (positionSize / entryPrice) * (exitPrice - entryPrice) * leverage;
            balance += dayProfitLoss;

            tradeResults.push({
                date: day.date,
                startWalletBalance,
                initialMargin,
                leverage,
                quantity: positionSize * leverage, 
                tradeOpenTime: tradeOpenTime ? tradeOpenTime.toISOString().split("T")[1].slice(0, 5) + " UTC" : "N/A",
                tradeDuration,
                entry: entryPrice,
                stopLoss: slPrice,
                takeProfit: tpPrice,
                liquidationPrice: liqPrice,
                outcome: dayProfitLoss > 0 ? "WIN" : dayProfitLoss < 0 ? "LOSS" : "NO TRADE",
                positionType,
                dayProfitLoss,
                endWalletBalance: balance
            });

            tradeOpened = false;  // Reset for Short Trade
        }

        // Open SHORT at Highest Price after LONG trade completes
        for (let candle of tradingCandles) {
            if (!tradeOpened && candle.high >= day.highest) {
                positionType = "SHORT";
                entryPrice = day.highest;
                tradeOpenTime = candle.time;
                liqPrice = entryPrice / (1 - ((startWalletBalance - initialMargin) / initialMargin) * (1 / leverage));
                tpPrice = entryPrice * (1 - (takeProfitROI / (100 * leverage)));
                slPrice = entryPrice * (1 + (stopLossROI / (100 * leverage)));
                tradeOpened = true;
            }
            // Close SHORT
            if (tradeOpened && positionType === "SHORT") {
                if (candle.high >= slPrice) {
                    exitPrice = slPrice;
                    tradeCloseTime = candle.time;
                    break;
                } else if (candle.low <= tpPrice) {
                    exitPrice = tpPrice;
                    tradeCloseTime = candle.time;
                    break;
                }
            }
        }

        if (tradeOpened) {
            let dayProfitLoss = (positionSize / entryPrice) * (entryPrice - exitPrice) * leverage;
            balance += dayProfitLoss;

            tradeResults.push({
                date: day.date,
                startWalletBalance,
                initialMargin,
                leverage,
                quantity: positionSize * leverage, 
                tradeOpenTime: tradeOpenTime ? tradeOpenTime.toISOString().split("T")[1].slice(0, 5) + " UTC" : "N/A",
                tradeDuration,
                entry: entryPrice,
                stopLoss: slPrice,
                takeProfit: tpPrice,
                liquidationPrice: liqPrice,
                outcome: dayProfitLoss > 0 ? "WIN" : dayProfitLoss < 0 ? "LOSS" : "NO TRADE",
                positionType,
                dayProfitLoss,
                endWalletBalance: balance
            });
        }

        balanceHistory.push({ date: day.date, balance });
        
    });

    return { finalBalance: balance, trades: tradeResults, balanceHistory };
    
}





async function runBacktest() {
    let candles = await getHistoricalData();
    let leverage = parseInt(document.getElementById("leverageInput").value);
    let walletBalance = parseFloat(document.getElementById("walletBalanceInput").value);
    let tradeEntryPercent = parseFloat(document.getElementById("tradeEntryInput").value);
    let takeProfitROI = parseFloat(document.getElementById("takeProfitROI").value);
    let stopLossROI = parseFloat(document.getElementById("stopLossROI").value);

    // Pass takeProfitROI and stopLossROI to the strategy function
    let result = backtestStrategy(candles, leverage, walletBalance, tradeEntryPercent, takeProfitROI, stopLossROI);

    const tableBody = document.getElementById("tradeResults");
    const rows = document.createDocumentFragment();
    result.trades.forEach(trade => {
        let outcomeColor = trade.outcome === "WIN" ? "green" :
                           trade.outcome === "LOSS" ? "red" : "gray";

        const row = document.createElement("tr");
        const values = [
            trade.date,
            `$${trade.startWalletBalance.toFixed(2)}`,
            `$${trade.initialMargin.toFixed(2)}`,
            trade.quantity.toFixed(2),
            trade.tradeOpenTime,
            trade.tradeDuration,
            trade.entry.toFixed(2),
            trade.stopLoss.toFixed(2),
            trade.takeProfit.toFixed(2),
            trade.liquidationPrice.toFixed(2),
            trade.positionType,
            trade.outcome,
            `${trade.dayProfitLoss >= 0 ? "+" : ""}$${trade.dayProfitLoss.toFixed(2)}`,
            `$${trade.endWalletBalance.toFixed(2)}`,
        ];
        values.forEach((value, index) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            if (index === 10) {
                cell.style.color = trade.positionType === "LONG" ? "green" : "red";
                cell.style.fontWeight = "bold";
            }
            if (index === 11) {
                cell.style.color = outcomeColor;
                cell.style.fontWeight = "bold";
            }
            row.appendChild(cell);
        });
        rows.appendChild(row);
    });
    tableBody.replaceChildren(rows);

    const summary = document.getElementById("backtestSummary");
    const startBalance = document.createElement("strong");
    const endBalance = document.createElement("strong");
    startBalance.textContent = `$${walletBalance.toFixed(2)}`;
    endBalance.textContent = `$${result.finalBalance.toFixed(2)}`;
    summary.replaceChildren(
        "You started with ",
        startBalance,
        " and after the backtest, you ended with ",
        endBalance,
        `. ${result.finalBalance > walletBalance ? "Your strategy showed promising gains." : "Time to tweak your approach."}`,
    );

    updateChart(result.balanceHistory);
}

document.getElementById("runBacktestButton").addEventListener("click", runBacktest);



function updateChart(balanceHistory) {
    if (!balanceHistory || balanceHistory.length === 0) {
        console.error("No balance history data to plot.");
        return;
    }

    const ctx = document.getElementById('balanceChart').getContext('2d');

    // Properly check if the chart exists and destroy it
    if (window.balanceChart instanceof Chart) {
        window.balanceChart.destroy();
    }

    window.balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: balanceHistory.map(b => b.date),
            datasets: [{
                label: 'Balance ($)',
                data: balanceHistory.map(b => b.balance),
                borderColor: 'gold',
                fill: false
            }]
        }
    });
}
