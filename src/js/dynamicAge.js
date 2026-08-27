// dynamicAge.js

// Set your birthdate (e.g., June 15, 1998)
const birthDate = new Date('1998-08-13');

// Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Update the age in the DOM
document.addEventListener('DOMContentLoaded', () => {
    const ageElement = document.getElementById('dynamic-age');
    if (ageElement) {
        ageElement.textContent = calculateAge(birthDate);
    }
});
