// Import Firebase SDKs and your Firebase configuration
import { firebaseApp } from './assets/js/firebase-config.js'; // Import initialized app
import firebaseConfig from './assets/js/firebase-config.js'; // Import the config if needed for debugging
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Firebase services
const auth = getAuth(firebaseApp); // Use the already initialized Firebase app
const githubProvider = new GithubAuthProvider();
auth.languageCode = 'en';
const analytics = getAnalytics(firebaseApp); // Use analytics if needed

// Get the GitHub sign-up button
const githubSignUpButton = document.getElementById('github-signup');

// Firestore instance
const db = getFirestore(firebaseApp);

// Function to save user data
async function saveUserData(user) {
  try {
    const userData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
    // Update or create user data in Firestore
    await setDoc(doc(db, "user_data", user.uid), userData);
    console.log("User data saved successfully!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

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

    // Save user data to Firestore
    saveUserData(user);
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

      // Save user data to Firestore
      saveUserData(user);
    })
    .catch((error) => {
      console.error("Error during GitHub sign-up:", error);
    });
});
