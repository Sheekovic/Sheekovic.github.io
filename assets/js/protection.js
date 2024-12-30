// Disable right-click and alert the user
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert("Right click is disabled.");
});

// Disable specific key combinations
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === 'i' || e.key === 'j' || e.key === 'u')) {
        e.preventDefault();
    }
});

// Disable F12 key
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12') {
        e.preventDefault();
        alert("DevTools are disabled.");
        // Optionally refresh the page
        setTimeout(() => {
            location.reload();
        }, 100);
    }
});
