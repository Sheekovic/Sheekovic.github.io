const auth = firebase.auth();

// Email & Password Login
document.getElementById("email-login").addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "app.html"; // Redirect after login
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Google Login
document.getElementById("google-login").addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            window.location.href = "app.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

// GitHub Login
document.getElementById("github-login").addEventListener("click", function () {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            window.location.href = "app.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});
