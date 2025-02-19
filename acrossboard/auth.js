// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCh99bQnshUyqOSV0LVbyq0LRAPaqHlEjA",
    authDomain: "acrossboard-aae2d.firebaseapp.com",
    databaseURL: "https://acrossboard-aae2d-default-rtdb.firebaseio.com",
    projectId: "acrossboard-aae2d",
    storageBucket: "acrossboard-aae2d.firebasestorage.app",
    messagingSenderId: "184930326464",
    appId: "1:184930326464:web:1c6fbcb43f102cdaf45a25",
    measurementId: "G-ZHRPXYG2MZ"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Email & Password Login
document.getElementById("email-login").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "app.html"; // Redirect after login
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Google Login
document.getElementById("google-login").addEventListener("click", function () {
    signInWithPopup(auth, googleProvider)
        .then(() => {
            window.location.href = "app.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

// GitHub Login
document.getElementById("github-login").addEventListener("click", function () {
    signInWithPopup(auth, githubProvider)
        .then(() => {
            window.location.href = "app.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});
