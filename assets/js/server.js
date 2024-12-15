const express = require('express');
const firebase = require('firebase/app');
require('firebase/auth');

const app = express();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
firebase.initializeApp(firebaseConfig);

// Middleware to parse JSON
app.use(express.json());

// Route for GitHub login
app.get('/login/github', (req, res) => {
  const auth = firebase.auth();
  const provider = new firebase.auth.GithubAuthProvider();
  auth.signInWithRedirect(provider);
});

// Handle GitHub callback
app.get('/auth/github/callback', async (req, res) => {
  try {
    const result = await firebase.auth().getRedirectResult();
    if (result.credential) {
      const user = result.user;
      res.redirect('/profile'); // Redirect to profile or dashboard
    }
  } catch (error) {
    console.error(error);
    res.redirect('/'); // Redirect to home or error page
  }
});

// Route for profile page
app.get('/profile', (req, res) => {
  if (req.user) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login/github');
  }
});

// Route for logout
app.get('/logout', (req, res) => {
  firebase.auth().signOut().then(() => {
    res.redirect('/');
  }).catch((error) => {
    console.error(error);
    res.redirect('/'); // Redirect to home on error
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
