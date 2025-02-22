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

function backtestStrategy(candles, leverage, initialBalance, stopLossPercent, tradeEntryPercent) {
    let balance = initialBalance;
    let tradeResults = [];
    let dailyRanges = analyzeDailyRange(filterMorningCandles(candles));
    let balanceHistory = [];

    dailyRanges.forEach(day => {
        let dayStartBalance = balance; // Save balance at start of the day
        let tradeEntryBalance = dayStartBalance * (tradeEntryPercent / 100); // Trade Entry Balance

        let entryPrice = (day.lowest + day.highest) / 2;
        let stopLoss = entryPrice * (1 - stopLossPercent / 100);
        let targetProfit = day.highest;
        let positionSize = (tradeEntryBalance * leverage) / entryPrice;

        let tradeOpenTime = candles.find(c => c.time.toISOString().split("T")[0] === day.date)?.time;
        let tradeCloseTime = null;
        let tradeDuration = "N/A";

        for (let candle of candles) {
            let candleDate = candle.time.toISOString().split("T")[0];

            if (candleDate === day.date) {
                if (candle.low <= stopLoss) {
                    tradeCloseTime = candle.time;
                    break;
                } else if (candle.high >= targetProfit) {
                    tradeCloseTime = candle.time;
                    break;
                }
            }
        }

        if (tradeCloseTime) {
            let durationMs = tradeCloseTime - tradeOpenTime;
            tradeDuration = formatDuration(durationMs);
        }

        let dayProfitLoss = 0; // Calculate profit/loss for the day

        if (day.lowest <= stopLoss) {
            dayProfitLoss = -(tradeEntryBalance * (stopLossPercent / 100)); // Loss calculation
        } else if (day.highest >= targetProfit) {
            dayProfitLoss = tradeEntryBalance * (leverage / 100); // Profit calculation
        }

        let endDayBalance = dayStartBalance + dayProfitLoss; // End of day balance

        let tradeResult = {
            date: day.date,
            dayStartBalance,
            tradeEntryBalance,
            tradeOpenTime: tradeOpenTime ? tradeOpenTime.toISOString().split("T")[1].slice(0, 5) + " UTC" : "N/A",
            tradeDuration,
            entry: entryPrice,
            stopLoss,
            targetProfit,
            outcome: dayProfitLoss > 0 ? "WIN" : dayProfitLoss < 0 ? "LOSS" : "NO TRADE",
            dayProfitLoss,
            endDayBalance
        };

        balance = endDayBalance; // Update balance for next day
        tradeResults.push(tradeResult);
        balanceHistory.push({ date: day.date, balance });
    });

    return { finalBalance: balance, trades: tradeResults, balanceHistory };
}




async function runBacktest() {
    let candles = await getHistoricalData();
    let leverage = parseInt(document.getElementById("leverageInput").value);
    let stopLossPercent = parseFloat(document.getElementById("stopLossInput").value);
    let walletBalance = parseFloat(document.getElementById("walletBalanceInput").value);
    let tradeEntryPercent = parseFloat(document.getElementById("tradeEntryInput").value);

    let result = backtestStrategy(candles, leverage, walletBalance, tradeEntryPercent, stopLossPercent);

    document.getElementById("tradeResults").innerHTML = result.trades.map(trade => `
        <tr>
            <td>${trade.date}</td>
            <td>$${trade.dayStartBalance.toFixed(2)}</td>
            <td>$${trade.tradeEntryBalance.toFixed(2)}</td>
            <td>${trade.tradeOpenTime}</td>
            <td>${trade.tradeDuration}</td>
            <td>${trade.entry.toFixed(2)}</td>
            <td>${trade.stopLoss.toFixed(2)}</td>
            <td>${trade.targetProfit.toFixed(2)}</td>
            <td>${trade.outcome}</td>
            <td>${trade.dayProfitLoss >= 0 ? "+" : ""}$${trade.dayProfitLoss.toFixed(2)}</td>
            <td>$${trade.endDayBalance.toFixed(2)}</td>
        </tr>
    `).join("");

    document.getElementById("backtestSummary").innerHTML = `
    You started with <strong>$${walletBalance.toFixed(2)}</strong> and after the backtest, 
    you ended with <strong>$${result.finalBalance.toFixed(2)}</strong>. 
    ${result.finalBalance > walletBalance ? "🔥 Your strategy showed promising gains!" : "⚠️ Time to tweak your approach!"}
`;



    updateChart(result.balanceHistory);
}



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
