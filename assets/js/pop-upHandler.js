document.addEventListener("DOMContentLoaded", () => {
    const checkCompatibility = document.getElementById("check-compatibility");
    const popup = document.getElementById("popup");
    const closePopupBtn = document.getElementById("close-popup");

    function openPopUp() {
        if (popup) {
            popup.classList.add("open-popup");
            console.log("Popup opened");
        }
    }

    function closePopUp() {
        if (popup) {
            popup.classList.remove("open-popup");
            console.log("Popup closed");
        }
    }

    function checkCompatibilityBtnVisible() {
        if (checkCompatibility) {
            checkCompatibility.classList.add("check-compatibility-visible");
            console.log("check-compatibility-visible class added");
        } else {
            console.log("Compatibility button invisible");
        }
    }

    function checkCompatibilityBtnInvisible() {
        if (checkCompatibility) {
            checkCompatibility.classList.remove("check-compatibility-visible");
        }
    }

    // Attach event listeners
    if (checkCompatibility) {
        checkCompatibility.addEventListener("click", openPopUp);
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener("click", closePopUp);
    }

    // Example usage
    checkCompatibilityBtnVisible();
});
