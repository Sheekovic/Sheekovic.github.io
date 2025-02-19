// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp); // Export analytics if needed
export default firebaseConfig; // Export firebaseConfig for use in other files
