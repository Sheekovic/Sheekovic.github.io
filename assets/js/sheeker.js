document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("checker-form");
    const modal = document.getElementById("balance-modal");
    const closeModal = document.querySelector(".close");
    const datadomeCookie = "datadome=hiYIViBP87cMcdMA9UcN2GieOqoqmKFYn6OuupIcB3NkLytmCtUsjBrladGoALE805YYaGjGrOZK35xnZMmlyzoSwU97EVlw6PqLItZugG38xrtPtEa0MhTdX_qMUeS~";
    const clientConfigId = "VNTVQSWJQ54TV27KDCZ7CMH5HW";

    // Mobile User-Agent Generator
    function generateUserAgent() {
        const androidDevices = [
            "Linux; Android 12; SM-S901B",
            "Linux; Android 13; Pixel 7 Pro",
            "Linux; Android 11; SM-G991B"
        ];
        const iosDevices = [
            "iPhone; CPU iPhone OS 16_5 like Mac OS X",
            "iPad; CPU OS 17_0 like Mac OS X"
        ];
        const chromeVersions = ["114.0.5735.196", "115.0.5790.166"];
        const safariVersions = ["16.5", "17.0"];
        
        const isAndroid = Math.random() > 0.5;
        const device = isAndroid 
            ? androidDevices[Math.floor(Math.random() * androidDevices.length)]
            : iosDevices[Math.floor(Math.random() * iosDevices.length)];

        if (isAndroid) {
            return `Mozilla/5.0 (${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
                chromeVersions[Math.floor(Math.random() * chromeVersions.length)]
            } Mobile Safari/537.36`;
        } else {
            return `Mozilla/5.0 (${device}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${
                safariVersions[Math.floor(Math.random() * safariVersions.length)]
            } Mobile/15E148 Safari/604.1`;
        }
    }

    // Generate UUID for request headers
    function generateUUID() {
        return crypto.randomUUID();
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const userAgent = generateUserAgent();
        const requestUUID = generateUUID();

        // Get input values
        const giftCardNumber = document.getElementById("giftCard").value.trim();
        const expiry = document.getElementById("expiry").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        // Validation checks (keep existing validation code)
        // ...

        try {
            // Get RMS Session ID
            const rmsResponse = await fetch("https://notification.blackhawknetwork.com/riskService/v1/riskWidget/getRiskProviders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "clientconfigid": clientConfigId,
                    "requestid": requestUUID,
                    "unique-id": requestUUID,
                    "User-Agent": userAgent,
                    "Referer": "https://www.fivebackgift.com/",
                    "Cookie": datadomeCookie
                },
                body: JSON.stringify({ clientConfigId })
            });
            
            const rmsData = await rmsResponse.json();
            const rmsSessionId = rmsData.rmsId;

            // Get Card Balance
            const [expiryMonth, expiryYear] = expiry.split("/");
            const balancePayload = {
                cardNumber: giftCardNumber,
                expirationMonth: parseInt(expiryMonth),
                expirationYear: 2000 + parseInt(expiryYear),
                securityCode: cvv,
                rmsSessionId
            };

            const balanceResponse = await fetch("https://www.fivebackgift.com/api/card/getCardBalanceSummary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": userAgent,
                    "Referer": "https://www.fivebackgift.com/",
                    "Cookie": datadomeCookie
                },
                body: JSON.stringify(balancePayload)
            });

            const balanceData = await balanceResponse.json();
            
            if (balanceData.success) {
                // Get Transactions
                const transactionsResponse = await fetch("https://www.fivebackgift.com/api/card/getCardTransactions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": userAgent,
                        "Referer": "https://www.fivebackgift.com/",
                        "token": balanceData.access_token,
                        "Cookie": datadomeCookie
                    },
                    body: JSON.stringify({
                        pageIndex: 0,
                        itemPerPage: 25,
                        endDate: new Date().toISOString(),
                        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                        preferredLanguage: "en-US",
                        rmsSessionId
                    })
                });

                const transactionsData = await transactionsResponse.json();

                // Update Modal
                document.getElementById("modal-giftCard").textContent = giftCardNumber;
                document.getElementById("modal-expiry").textContent = expiry;
                document.getElementById("modal-cvv").textContent = "***";
                document.getElementById("modal-balance").textContent = `Balance: ${balanceData.result.balances.pendingBalance} ${balanceData.result.balances.currencyCode}`;
                
                const transactionsHTML = transactionsData.result.transactions.map(tx => 
                    `<li>${new Date(tx.transactionDate).toLocaleDateString()} - ${tx.detail.merchantName}: ${tx.amount} ${tx.currency}</li>`
                ).join("");
                
                document.getElementById("modal-transactions").innerHTML = `<ul>${transactionsHTML}</ul>`;
                modal.style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });

    // Existing modal close handlers
    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });
});