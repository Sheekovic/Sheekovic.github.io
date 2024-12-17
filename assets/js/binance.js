import firebaseConfig from './assets/js/firebase-config.js'; // Import the config if needed for debugging
import { firebaseApp } from './assets/js/firebase-config.js'; // Import initialized app
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";

// Firebase services
const auth = getAuth(firebaseApp); // Use the already initialized Firebase app
const githubProvider = new GithubAuthProvider();
auth.languageCode = 'en';
const analytics = getAnalytics(firebaseApp); // Use analytics if needed

// Initialize Elements
const githubSignUpButton = document.getElementById('github-signup');
const registerButton = document.getElementById('register-btn');

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
      // User is signed in
      const userProfilePic = user.photoURL || "default-avatar.png";
      const userName = user.displayName || "Anonymous";

      githubSignUpButton.innerHTML = `
          <img src="${userProfilePic}" alt="Profile Picture" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
          <span>${userName}</span>
      `;
      githubSignUpButton.style.display = "flex";
      githubSignUpButton.style.alignItems = "center";
  } else {
      // User is not signed in
      githubSignUpButton.innerHTML = `
          <button id="github-signup" class="btn btn-primary">Sign Up with GitHub</button>
      `;
  }
});

// GitHub Sign-Up Button Click Event
githubSignUpButton.addEventListener('click', () => {
  signInWithPopup(auth, githubProvider)
      .then(response => updateUI(response.user))
      .catch(error => console.error("GitHub Sign-Up Error:", error));
});

// Register Telegram ID
registerButton.addEventListener('click', () => {
  const telegramId = document.getElementById('telegram-id').value;
  if (telegramId) {
      // Simulate Telegram ID registration (Implement Firebase logic here)
      alert(`Registered Telegram ID: ${telegramId}`);
  } else {
      alert('Please enter a valid Telegram ID.');
  }
});
