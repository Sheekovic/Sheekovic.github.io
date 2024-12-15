// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
initializeApp();

app.use(express.json());

// GitHub login route
app.post('/login/github', async (req, res) => {
  try {
    const token = req.body.token; // Assuming frontend sends GitHub OAuth token
    const userCredential = await getAuth().verifyIdToken(token);

    // Additional user information can be retrieved using userCredential
    res.send({ success: true, message: 'GitHub login successful', user: userCredential });
  } catch (error) {
    console.error('Error verifying GitHub token:', error);
    res.status(401).send({ success: false, message: 'GitHub login failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
