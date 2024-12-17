// Import Firebase SDKs
require('dotenv').config();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getAuth, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
auth.languageCode = 'en';
const analytics = getAnalytics(app);

// Get the GitHub sign-up button
const githubSignUpButton = document.getElementById('github-signup');

// Add click event listener for sign-in
githubSignUpButton.addEventListener('click', function () {
  signInWithPopup(auth, githubProvider)
    .then((response) => {
      const user = response.user;

      // Log user details for debugging
      console.log("User details:", user);

      // Update button to show profile picture and name
      const userProfilePic = user.photoURL || "default-avatar.png"; // Fallback image if photoURL is not available
      const userName = user.displayName || "Anonymous"; // Fallback name if displayName is not available

      githubSignUpButton.innerHTML = `
        <img src="${userProfilePic}" alt="Profile Picture" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
        <span>${userName}</span>
      `;
      githubSignUpButton.style.display = "flex";
      githubSignUpButton.style.alignItems = "center";
    })
    .catch((error) => {
      console.error("Error during GitHub sign-up:", error);
    });
});
