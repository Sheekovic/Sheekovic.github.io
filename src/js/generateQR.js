document.addEventListener("DOMContentLoaded", function () {
    let binancePayLink = "https://s.binance.com/yGqr4KAd"; // Your Binance Pay link
    let qrContainer = document.getElementById("binanceQR");

    // Generate QR code using qrcode.js
    new QRCode(qrContainer, {
        text: binancePayLink,
        width: 150,
        height: 150,
        colorDark: "#ffcc00", // Gold
        colorLight: "#121212", // Dark background
        correctLevel: QRCode.CorrectLevel.H
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let binancePayLink = "https://www.buymeacoffee.com/sheekovic"; // Your buy me a coffee Pay link
    let qrContainer = document.getElementById("buymeacoffeeQR");

    // Generate QR code using qrcode.js
    new QRCode(qrContainer, {
        text: binancePayLink,
        width: 150,
        height: 150,
        colorDark: "#ffcc00", // Gold
        colorLight: "#121212", // Dark background
        correctLevel: QRCode.CorrectLevel.H
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let binancePayLink = "https://www.ko-fi.com/sheekovic"; // Your ko-fi Pay link
    let qrContainer = document.getElementById("ko-fiQR");

    // Generate QR code using qrcode.js
    new QRCode(qrContainer, {
        text: binancePayLink,
        width: 150,
        height: 150,
        colorDark: "#ffcc00", // Gold
        colorLight: "#121212", // Dark background
        correctLevel: QRCode.CorrectLevel.H
    });
});
