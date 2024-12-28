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

// SQLite setup (for Node.js or other environments where SQLite can be used)
import sqlite3 from 'sqlite3'; 
const db = new sqlite3.Database('./mydatabase.sqlite');

db.serialize(() => {
    // Create users table if not exists
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT UNIQUE,
            username TEXT,
            telegramId TEXT
        )
    `);
});

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

            const query = `INSERT INTO users (userId, username, telegramId) VALUES (?, ?, ?)`;
            db.run(query, [userId, userData.username, userData.telegramId], function(error) {
                if (error) {
                    console.error("Error saving user data:", error);
                } else {
                    console.log("User data saved successfully.");
                    registerResult.innerText = "Registration successful!";
                }
            });
        }
    } else {
        alert('Please enter a valid Telegram ID.');
    }
});
