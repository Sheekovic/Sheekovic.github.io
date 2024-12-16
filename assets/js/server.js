import './App.css';
import { app } from './firebase-config';
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

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
