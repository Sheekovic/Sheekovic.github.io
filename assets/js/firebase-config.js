import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { publicConfig } from "./public-config.js";

const apiKey = publicConfig.firebase.sheeko.apiKey;

if (!apiKey) {
  throw new Error(
    "Firebase public config is missing. Render assets/js/public-config.js before serving the site."
  );
}

const firebaseConfig = {
  apiKey,
  authDomain: "sheeko-github.firebaseapp.com",
  projectId: "sheeko-github",
  storageBucket: "sheeko-github.firebasestorage.app",
  messagingSenderId: "77160038597",
  appId: "1:77160038597:web:964aa0a9b4a426ffcc30ac",
  measurementId: "G-3E4W2ESB42"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export default firebaseConfig;
