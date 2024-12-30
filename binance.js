// Firebase Configuration
import firebaseConfig from './assets/js/firebase-config.js'; 
import { firebaseApp } from './assets/js/firebase-config.js'; 
import { getAuth, GithubAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";

// Initialize Firebase services
const auth = getAuth(firebaseApp); 
const githubProvider = new GithubAuthProvider();
auth.languageCode = 'en';
const analytics = getAnalytics(firebaseApp); 

// Initialize Elements
const githubSignUpButton = document.getElementById('github-signup');
const registerButton = document.getElementById('register-btn');
const yourUsername = document.getElementById('username');
const telegramInput = document.getElementById('telegram-id');
const registerResult = document.getElementById('register-result');

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
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
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const userData = {
                username: user.displayName || "Anonymous",
                telegramId: telegramId
            };

            // Prepare data to be written
            const data = `${userId},${userData.username},${userData.telegramId}\n`;

            // Write to a text file using File System API or Local Storage as alternatives
            try {
                const blob = new Blob([data], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = './assets/database/users.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                console.error("Error saving user data:", error);
            }
        }
    } else {
        alert('Please enter a valid Telegram ID.');
    }
});

