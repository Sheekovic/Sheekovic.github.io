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
const yourUsername = document.getElementById('username');
const telegramInput = document.getElementById('telegram-id');
const registerResult = document.getElementById('register-result');

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

      yourUsername.innerText = userName;
  } else {
      // User is not signed in
      githubSignUpButton.innerHTML = `
          <button id="github-signup" class="btn btn-primary">Sign Up with GitHub</button>
      `;
      yourUsername.innerText = "Anonymous";
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
    const telegramId = telegramInput.value;
    if (telegramId) {
        // Save Telegram ID in Firebase
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const userData = {
                username: user.displayName || "Anonymous",
                telegramId: telegramId
            };
            const userRef = firebaseApp.database().ref(`users/${userId}`);
            userRef.set(userData)
                .then(() => {
                    console.log("User data saved successfully.");
                    registerResult.innerText = "Registration successful!";
                })
                .catch(error => console.error("Error saving user data:", error));
        }
    } else {
        alert('Please enter a valid Telegram ID.');
    }
});