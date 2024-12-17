import '*/assets/css/main.css';
import { app } from './firebase-config';
import { getAuth, signInWithPopup, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

function App() {
  const auth = getAuth();
  const githubProvider = new GithubAuthProvider();
  const githubSignUp = () => {
    signInWithPopup(auth, githubProvider)
    .then((response) => {
      console.log(response.user)
    })
    .catch((error) => {
      console.log(error)
    })
  }
  return (
    <div className='auth-container'>
      <button onClick={githubSignUp}>GitHub</button>
    </div>
  );
}

export default App;
