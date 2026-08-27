import { firebaseApp } from './firebase-config.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase services
const auth = getAuth(firebaseApp); // Use the already initialized Firebase app

// Firebase services for binance.js
export const binanceAuth = getAuth(firebaseApp);
export const binanceGithubProvider = new GithubAuthProvider();
export const binanceGoogleProvider = new GoogleAuthProvider();

// Providers
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();
auth.languageCode = 'en';

// Handle Sign-In
document.addEventListener('DOMContentLoaded', () => {
  // GitHub Sign-In
  document.getElementById('github-signup').addEventListener('click', () => {
    signInWithPopup(auth, githubProvider)
      .then(response => updateUI(response.user))
      .catch(error => console.error("GitHub Sign-In Error:", error));
  });

  // Google Sign-In
  document.getElementById('google-signup').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
      .then(response => updateUI(response.user))
      .catch(error => console.error("Google Sign-In Error:", error));
  });

  // Email/Password Sign-In
  document.getElementById('email-login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(response => updateUI(response.user))
      .catch(error => console.error("Email/Password Sign-In Error:", error));
  });
});

// Sign-Out
document.getElementById('sign-out')?.addEventListener('click', () => {
  auth.signOut()
    .then(() => console.log("Sign-Out Successful"))
    .catch(error => console.error("Sign-Out Error:", error));
});

// Update UI After Sign-In
export function updateUI(user) {
  const userProfilePic = user.photoURL || "https://avatars.githubusercontent.com/u/78682787?v=4";
  const userName = user.displayName || user.email || "Anonymous";
  const container = document.getElementById('user-info');
  const image = document.createElement('img');
  const name = document.createElement('span');
  const message = document.createElement('p');
  image.src = userProfilePic;
  image.alt = '';
  image.width = 24;
  image.height = 24;
  name.textContent = userName;
  message.textContent = 'Redirecting to your profile in 5 seconds…';
  container.replaceChildren(image, name, message);

  // Wait for 5 seconds, then redirect to profile.html
  setTimeout(() => {
    window.location.href = "profile.html";
  }, 5000);
}
