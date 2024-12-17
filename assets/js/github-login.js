// github-login.js
import { getAuth, signInWithPopup, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { firebaseConfig } from './firebase-config';

const auth = getAuth(firebaseConfig);

export function githubLogin() {
  signInWithPopup(auth, new GithubAuthProvider())
    .then(async (result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Send the token to the backend
      const response = await fetch('/login/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      if (data.success) {
        // Handle successful login
        console.log('GitHub login successful:', data.user);
      } else {
        // Handle failed login
        console.error('GitHub login failed');
      }
    })
    .catch((error) => {
      console.error('Error during GitHub login:', error);
    });
}
