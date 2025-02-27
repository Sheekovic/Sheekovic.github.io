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
            alert("Invalid Gift Card Number! It should be 12 to 19 digits.");
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

        // Simulated response (Replace with actual API logic)
        document.getElementById("modal-giftCard").textContent = giftCardNumber;
        document.getElementById("modal-expiry").textContent = expiry;
        document.getElementById("modal-cvv").textContent = "***"; 
        document.getElementById("modal-balance").textContent = ""; 
        document.getElementById("modal-Transactions").textContent = "";

        // Show modal
        modal.style.display = "block";
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
