import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { publicConfig } from "../public-config.js";

const apiKey = publicConfig.firebase.acrossboard.apiKey;

if (!apiKey) {
  throw new Error(
    "Firebase public config is missing. Render assets/js/public-config.js before serving the site."
  );
}

const firebaseConfig = {
  apiKey,
  authDomain: "acrossboard-aae2d.firebaseapp.com",
  databaseURL: "https://acrossboard-aae2d-default-rtdb.firebaseio.com",
  projectId: "acrossboard-aae2d",
  storageBucket: "acrossboard-aae2d.firebasestorage.app",
  messagingSenderId: "184930326464",
  appId: "1:184930326464:web:1c6fbcb43f102cdaf45a25",
  measurementId: "G-ZHRPXYG2MZ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export default firebaseConfig;
