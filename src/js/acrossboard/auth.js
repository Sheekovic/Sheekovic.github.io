import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { firebaseApp } from "./firebase-config.js";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function redirectToApp() {
  window.location.href = "app.html";
}

function showAuthError(error) {
  console.error("AcrossBoard sign-in failed:", error);
  alert(error.message || "Sign-in failed. Please try again.");
}

document.getElementById("email-login")?.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password).then(redirectToApp).catch(showAuthError);
});

document.getElementById("google-login")?.addEventListener("click", () => {
  signInWithPopup(auth, googleProvider).then(redirectToApp).catch(showAuthError);
});

document.getElementById("github-login")?.addEventListener("click", () => {
  signInWithPopup(auth, githubProvider).then(redirectToApp).catch(showAuthError);
});
