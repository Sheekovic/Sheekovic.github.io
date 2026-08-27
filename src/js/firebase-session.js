// Import Firebase SDKs and your Firebase configuration 
import { firebaseApp } from './assets/js/firebase-config.js'; // Import initialized app
import firebaseConfig from './assets/js/firebase-config.js'; // Import the config if needed for debugging
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";

// Firebase services
const auth = getAuth(firebaseApp); // Use the already initialized Firebase app
const githubProvider = new GithubAuthProvider();
auth.languageCode = 'en';
const analytics = getAnalytics(firebaseApp); // Use analytics if needed

// Get the GitHub sign-up button
const githubSignUpButton = document.getElementById('github-signup');

// Check if a user is already signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, update the button
    const userProfilePic = user.photoURL || "default-avatar.png"; // Fallback image if photoURL is not available
    const userName = user.displayName || "Anonymous"; // Fallback name if displayName is not available
    const email = user.email || "Not provided";
    const uid = user.uid;

    githubSignUpButton.innerHTML = `
      <img src="${userProfilePic}" alt="Profile Picture" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;">
      <span>${userName}</span>
    `;
    githubSignUpButton.style.display = "flex";
    githubSignUpButton.style.alignItems = "center";

  } else {
    // User is not signed in, display the original button
    githubSignUpButton.innerHTML = '<button id="github-signup" class="button primary">Sign Up with GitHub</button>';
  }
});

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