document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("checker-form");
    const modal = document.getElementById("balance-modal");
    const closeModal = document.querySelector(".close");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        // Get input values
        const giftCardNumber = document.getElementById("giftCard").value.trim();
        const expiry = document.getElementById("expiry").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        // Validation checks
        if (!/^\d{12,19}$/.test(giftCardNumber)) {
            alert("Invalid Gift Card Number! It should be between 12 and 19 digits.");
            return;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            alert("Invalid Expiry Date! Use MM/YY format.");
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert("Invalid CVV! It should be 3 digits.");
            return;
        }

        // Extract month and year from expiry date
        const [expiryMonth, expiryYear] = expiry.split("/");

        // Function to get rmsSessionId
        function getRmsSessionId() {
            return new Promise((resolve, reject) => {
                const data = JSON.stringify({
                    'clientConfigId': 'VNTVQSWJQ54TV27KDCZ7CMH5HW'
                });

                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open('POST', 'https://notification.blackhawknetwork.com/riskService/v1/riskWidget/getRiskProviders');
                xhr.setRequestHeader('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0');
                xhr.setRequestHeader('accept', 'application/json, text/plain, */*');
                xhr.setRequestHeader('accept-language', 'en-US,en;q=0.5');
                xhr.setRequestHeader('referer', 'https://mygift.giftcardmall.com/');
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.setRequestHeader('requestid', '6293b3f1-c990-4aeb-affe-a87d2c273e9a');
                xhr.setRequestHeader('unique-id', '6293b3f1-c990-4aeb-affe-a87d2c273e9a');
                xhr.setRequestHeader('clientconfigid', 'VNTVQSWJQ54TV27KDCZ7CMH5HW');
                xhr.setRequestHeader('origin', 'https://mygift.giftcardmall.com');
                xhr.setRequestHeader('sec-fetch-dest', 'empty');
                xhr.setRequestHeader('sec-fetch-mode', 'cors');
                xhr.setRequestHeader('sec-fetch-site', 'cross-site');
                xhr.setRequestHeader('dnt', '1');
                xhr.setRequestHeader('sec-gpc', '1');
                xhr.setRequestHeader('te', 'trailers');

                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response.rmsId);
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                            console.log("Raw response text:", xhr.responseText);
                            alert("An error occurred while retrieving session ID. Please try again later.");
                            reject(null);
                        }
                    } else {
                        console.error("Error fetching rmsSessionId:", xhr.statusText);
                        alert("An error occurred while retrieving session ID. Please try again later.");
                        reject(null);
                    }
                };

                xhr.onerror = function() {
                    console.error("Network error while fetching rmsSessionId.");
                    alert("A network error occurred. Please try again later.");
                    reject(null);
                };

                xhr.send(data);
            });
        }

        // Function to get card balance
        function getCardBalance(rmsSessionId) {
            const payload = {
                cardNumber: giftCardNumber,
                expirationMonth: parseInt(expiryMonth, 10),
                expirationYear: 2000 + parseInt(expiryYear, 10), // Convert YY to YYYY
                securityCode: cvv,
                rmsSessionId: rmsSessionId
            };

            return fetch("https://mygift.giftcardmall.com/api/card/getCardBalanceSummary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*",
                    "Referer": "https://mygift.giftcardmall.com/",
                    "Origin": "https://mygift.giftcardmall.com"
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.balance) {
                    document.getElementById("modal-giftCard").textContent = giftCardNumber;
                    document.getElementById("modal-expiry").textContent = expiry;
                    document.getElementById("modal-cvv").textContent = "***"; 
                    document.getElementById("modal-balance").textContent = `Balance: ${data.balance}`;
                    document.getElementById("modal-Transactions").textContent = `Transactions: ${JSON.stringify(data.transactions)}`;

                    // Show modal
                    modal.style.display = "block";
                } else {
                    alert("Failed to retrieve balance. Please check your card details and try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while retrieving balance. Please try again later.");
            });
        }

        // Execute the steps
        getRmsSessionId().then(rmsSessionId => {
            if (rmsSessionId) {
                getCardBalance(rmsSessionId);
            }
        });
    });

    // Close modal on X button click
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});