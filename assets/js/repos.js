// Handle username input for searching GitHub user on 'Enter' key press
function handleUsernameInput() {
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const username = usernameInput.value || 'Sheekovic';
                fetchUserInfo(username);
                fetchRepos(username);
            }
        });
    }
}

// Fetch and display user information
function fetchUserInfo(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(user => {
            const userInfoElement = document.getElementById('user-info');
            if (user.name) {
                document.title = `GitHub Repo Viewer - ${user.name}`;
                document.getElementById('user-repos').textContent = `${user.name}'s GitHub Repos`;
                // change page favicon to user avatar
                const faviconLink = document.querySelector('link[rel="icon"]');
                faviconLink.href = user.avatar_url;
            }
            userInfoElement.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.name}">
                <div class="info">
                    <h2>${user.name}</h2>
                    <p>Username: ${user.login}</p>
                    <p>${user.bio || ''}</p>
                    <p>Location: ${user.location || ''}</p>
                    <p>Followers: ${user.followers}</p>
                    <p>Following: ${user.following}</p>
                    <p>Public Repos: ${user.public_repos}</p>
                </div>
            `;
        })
        .catch(error => {
            document.getElementById('github-repos').innerHTML = `<p>Error loading user info: ${error.message}</p>`;
        });
}

// Fetch and display GitHub repositories
function fetchRepos(username) {
    const repoContainer = document.getElementById('github-repos');
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            repoContainer.innerHTML = ''; // Clear previous content
            repos.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.classList.add('repo');
                repoElement.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                    <p>${repo.description || "No description available."}</p>
                    <p>⭐ Stars: ${repo.stargazers_count}</p>
                    <p>🔄 Forks: ${repo.forks_count}</p>
                `;
                repoContainer.appendChild(repoElement);
            });
        })
        .catch(error => {
            repoContainer.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
        });
}

// Handle light/dark mode toggle
function handleThemeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeLink = document.getElementById('themeStylesheet'); // Ensure the <link> element has this ID

    darkModeToggle.addEventListener('click', () => {
        if (darkModeToggle.textContent === 'Dark Mode') {
            darkModeToggle.textContent = 'Light Mode';
            themeLink.setAttribute('href', 'assets/css/reposlight.css');
        } else {
            darkModeToggle.textContent = 'Dark Mode';
            themeLink.setAttribute('href', 'assets/css/repos.css');
        }
    });
}

// Initialize all event listeners and fetch default user data
function init() {
    handleUsernameInput();
    handleThemeToggle();
    const defaultUsername = 'Sheekovic';
    fetchUserInfo(defaultUsername);
    fetchRepos(defaultUsername);
}

// Run the initialization
init();