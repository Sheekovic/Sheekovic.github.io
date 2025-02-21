document.getElementById("generateButton").addEventListener("click", function () {
    document.getElementById("loadingSpinner").style.display = "block";

    setTimeout(() => {
        const name = document.getElementById("nameInput").value;
        const favoriteWord = document.getElementById("favoriteWordInput").value;
        const date = document.getElementById("dateInput").value;
        const length = parseInt(document.getElementById("lengthInput").value);
        const dateFormat = document.getElementById("dateFormat").value;

        let dateFormatted = date.replace(/-/g, "");
        if (dateFormat === "ddmmyyyy") {
            dateFormatted = date.split("-").reverse().join("");
        } else if (dateFormat === "none") {
            dateFormatted = "";
        }

        let basePassword = name + favoriteWord + dateFormatted;
        let generatedPassword = basePassword;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        while (generatedPassword.length < length) {
            generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        document.getElementById("passwordOutput").textContent = generatedPassword.slice(0, length);
        checkPasswordStrength(generatedPassword.slice(0, length));
        document.getElementById("loadingSpinner").style.display = "none";
    }, 500);
});

document.getElementById("resetButton").addEventListener("click", function () {
    document.getElementById("nameInput").value = "";
    document.getElementById("favoriteWordInput").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("lengthInput").value = "";
    document.getElementById("passwordOutput").textContent = "";
    document.getElementById("strengthLevel").textContent = "Unknown";
});

document.getElementById("copyButton").addEventListener("click", function () {
    const password = document.getElementById("passwordOutput").textContent;
    if (password) {
        navigator.clipboard.writeText(password).then(() => {
            alert("Password copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy password.");
        });
    }
});

document.getElementById("darkModeToggle").addEventListener("click", function () {
    // if button text is "Dark Mode", change to "Light Mode"
    if (darkModeToggle.textContent === "Dark Mode") {
        darkModeToggle.textContent = "Light Mode";
        document.body.classList.toggle("dark-mode");
    }
    else {
        // if button text is "Light Mode", change to "Dark Mode"
        darkModeToggle.textContent = "Dark Mode";
        document.body.classList.toggle("dark-mode");
    }
});

function checkPasswordStrength(password) {
    let strength = "Weak";
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()]/.test(password)) {
        strength = "Strong";
    } else if (password.length >= 10 && (/[A-Za-z]/.test(password) && /\d/.test(password))) {
        strength = "Moderate";
    }
    document.getElementById("strengthLevel").textContent = strength;
}
