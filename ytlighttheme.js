
const darkModeToggle = document.getElementById('darkModeToggle');

// Check if dark mode is already enabled
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    // Update button text accordingly
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        darkModeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});