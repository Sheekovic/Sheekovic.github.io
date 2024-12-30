// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnzRojHjTeb1e_enXi6YWMse7X6w0vPXo",
  authDomain: "sheeko-github.firebaseapp.com",
  projectId: "sheeko-github",
  storageBucket: "sheeko-github.firebasestorage.app",
  messagingSenderId: "77160038597",
  appId: "1:77160038597:web:964aa0a9b4a426ffcc30ac",
  measurementId: "G-3E4W2ESB42"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp); // Export analytics if needed
export default firebaseConfig; // Export firebaseConfig for use in other files
