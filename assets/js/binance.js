// Import Firebase Auth
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

const githubSignUpButton = document.getElementById('login-btn');

// Check if a user is already signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, update the button
    const userProfilePic = user.photoURL || "default-avatar.png"; // Fallback image if photoURL is not available
    const userName = user.displayName || "Anonymous"; // Fallback name if displayName is not available

    githubSignUpButton.innerHTML = `
      <img src="${userProfilePic}" alt="Profile Picture" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
      <span>${userName}</span>
    `;
    githubSignUpButton.style.display = "flex";
    githubSignUpButton.style.alignItems = "center";
  } else {
    // User is not signed in, display the original button
    githubSignUpButton.innerHTML = '<button id="login-btn" class="btn btn-primary">Sign Up with GitHub</button>';
  }
});

document.getElementById('register-btn').addEventListener('click', function() {
    const telegramId = document.getElementById('telegram-id').value;
    if (telegramId) {
        // Send Telegram ID to Firebase for registration (implement Firebase logic here)
        alert(`Registered Telegram ID: ${telegramId}`);
    } else {
        alert('Please enter a valid Telegram ID.');
    }
});
