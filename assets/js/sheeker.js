document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("checker-form");
    const modal = document.getElementById("balance-modal");
    const closeModal = document.querySelector(".close");
    const clientConfigId = "VNTVQSWJQ54TV27KDCZ7CMH5HW";
    const STATIC_DDK = "1407E38FBD2A073DB0436A40888C6D";
    const STATIC_CID = "7HyorOAny7ZO_F6iHOO22O8u3QCpWOaXYSd7UAuNkGeE4OKa5YZBg_0w3egAndgv_ZIvs1GV6ZYPSzUjmOT1Y~NkydM40trKl6qQxCAi_Xr4F8BqeCVeiSm6F~Ii8hk3";

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
        const isAndroid = Math.random() > 0.5;
        const device = isAndroid
            ? androidDevices[Math.floor(Math.random() * androidDevices.length)]
            : iosDevices[Math.floor(Math.random() * iosDevices.length)];

        if (isAndroid) {
            return `Mozilla/5.0 (${device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36`;
        } else {
            return `Mozilla/5.0 (${device}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1`;
        }
    }

    // DataDome Validation
    async function validateDataDome(userAgent) {
        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomResolution() {
            return {
                br_oh: randomInt(1000, 2000),
                br_ow: randomInt(1000, 3000),
                br_h: randomInt(1000, 2000),
                br_w: randomInt(1000, 3000),
                rs_h: randomInt(1000, 2000),
                rs_w: randomInt(1000, 3000),
                ars_h: randomInt(1000, 2000),
                ars_w: randomInt(1000, 3000)
            };
        }

        const payload = {
            jsData: encodeURIComponent(JSON.stringify({
                ttst: randomInt(40, 50),
                ifov: Math.random() > 0.5,
                hc: randomInt(1, 5),
                ...randomResolution(),
                ua: userAgent,
                wbd: Math.random() > 0.5,
                tagpu: parseFloat((Math.random() * 9 + 1).toFixed(6)),
                tz: randomInt(-720, 720),
                jset: Math.floor(Date.now() / 1000),
                tzp: Math.random() > 0.5 ? "America/Los_Angeles" : "America/New_York",
                mp_cx: randomInt(100, 200),
                mp_cy: randomInt(1000, 2000),
                pr: randomInt(1, 2),
                plgod: Math.random() > 0.5,
                glrd: Math.random() > 0.5 ?
                    "ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0)" :
                    "NVIDIA Corporation",
                med: Math.random() > 0.5 ? "defined" : "undefined",
                aco: Math.random() > 0.5 ? "probably" : "maybe",
                vch: Math.random() > 0.5 ? "probably" : "maybe",
                vcw: Math.random() > 0.5 ? "probably" : "maybe"
            })),
            eventCounters: encodeURIComponent(JSON.stringify({
                mousemove: randomInt(0, 10),
                click: randomInt(0, 2),
                scroll: randomInt(0, 2),
                touchstart: 0,
                touchend: 0,
                touchmove: 0,
                keydown: randomInt(0, 2),
                keyup: randomInt(0, 2)
            })),
            jsType: 'le',
            cid: STATIC_CID,
            ddk: STATIC_DDK,
            Referer: 'https://www.fivebackgift.com/',
            request: '/',
            responsePage: 'origin',
            ddv: '4.43.1'
        };

        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(payload)) {
            formData.append(key, value);
        }

        try {
            // make request to DataDome proxy in /api/datadome/dd.js
            const response = await fetch('http://sheekovic.netlify.app/api/datadome', {
                method: 'POST',
                headers: {
                    'User-Agent': userAgent,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://www.fivebackgift.com/',
                    'Origin': 'https://www.fivebackgift.com',
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site',

                },
                body: formData
            });

            const text = await response.text();
            const datadomeCookie = text.match(/datadome=(.*?);/)[1];
            return datadomeCookie;
        } catch (error) {
            console.error('DataDome validation failed:', error);
            throw error;
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Generate fresh user agent for each request
        const userAgent = generateUserAgent();

        try {
            // Step 1: Validate DataDome
            const datadomeCookie = await validateDataDome(userAgent);

            // Step 2: Get RMS Session ID
            const requestUUID = crypto.randomUUID();
            const rmsResponse = await fetch("https://notification.blackhawknetwork.com/riskService/v1/riskWidget/getRiskProviders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "clientconfigid": clientConfigId,
                    "requestid": requestUUID,
                    "unique-id": requestUUID,
                    "User-Agent": userAgent,
                    "Cookie": `datadome=${datadomeCookie}`
                },
                body: JSON.stringify({ clientConfigId })
            });

            const rmsData = await rmsResponse.json();
            const rmsSessionId = rmsData.rmsId;

            // Step 3: Get Card Details
            const giftCardNumber = document.getElementById("giftCard").value.trim();
            const expiry = document.getElementById("expiry").value.trim();
            const cvv = document.getElementById("cvv").value.trim();
            const [expiryMonth, expiryYear] = expiry.split("/");

            // Step 4: Get Balance
            const balanceResponse = await fetch("https://www.fivebackgift.com/api/card/getCardBalanceSummary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": userAgent,
                    "Cookie": `datadome=${datadomeCookie}`
                },
                body: JSON.stringify({
                    cardNumber: giftCardNumber,
                    expirationMonth: parseInt(expiryMonth),
                    expirationYear: 2000 + parseInt(expiryYear),
                    securityCode: cvv,
                    rmsSessionId
                })
            });

            const balanceData = await balanceResponse.json();

            if (balanceData.success) {
                // Step 5: Get Transactions
                const transactionsResponse = await fetch("https://www.fivebackgift.com/api/card/getCardTransactions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": userAgent,
                        "token": balanceData.access_token,
                        "Cookie": `datadome=${datadomeCookie}`
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
                document.getElementById("modal-balance").textContent =
                    `Balance: ${balanceData.result.balances.pendingBalance} ${balanceData.result.balances.currencyCode}`;

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