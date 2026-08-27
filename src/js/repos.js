const usernameInput = document.getElementById('usernameInput');
const userInfo = document.getElementById('user-info');
const repoContainer = document.getElementById('github-repos');

function textRow(label, value) {
  const row = document.createElement('p');
  row.textContent = `${label}: ${value ?? ''}`;
  return row;
}

function showError(container, prefix, error) {
  const message = document.createElement('p');
  message.textContent = `${prefix}: ${error.message}`;
  container.replaceChildren(message);
}

async function githubJSON(path) {
  const response = await fetch(`https://api.github.com/${path}`);
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response.json();
}

async function fetchUserInfo(username) {
  try {
    const user = await githubJSON(`users/${encodeURIComponent(username)}`);
    const image = document.createElement('img');
    const info = document.createElement('div');
    const heading = document.createElement('h2');
    image.src = user.avatar_url;
    image.alt = `${user.login} avatar`;
    image.width = 120;
    image.height = 120;
    info.className = 'info';
    heading.textContent = user.name || user.login;
    info.append(
      heading,
      textRow('Username', user.login),
      textRow('Bio', user.bio),
      textRow('Location', user.location),
      textRow('Followers', user.followers),
      textRow('Following', user.following),
      textRow('Public repos', user.public_repos),
    );
    userInfo.replaceChildren(image, info);
    document.title = `GitHub Repo Viewer — ${user.name || user.login}`;
    document.getElementById('user-repos').textContent = `${user.name || user.login}'s GitHub repos`;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = user.avatar_url;
  } catch (error) {
    showError(userInfo, 'Unable to load user', error);
  }
}

async function fetchRepos(username) {
  repoContainer.replaceChildren();
  try {
    const repos = await githubJSON(`users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`);
    for (const repo of repos) {
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      const description = document.createElement('p');
      const stats = document.createElement('p');
      article.className = 'repo';
      link.href = repo.html_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = repo.name;
      heading.append(link);
      description.textContent = repo.description || 'No description available.';
      stats.textContent = `Stars: ${repo.stargazers_count} · Forks: ${repo.forks_count}`;
      article.append(heading, description, stats);
      repoContainer.append(article);
    }
  } catch (error) {
    showError(repoContainer, 'Unable to load repositories', error);
  }
}

function loadUsername() {
  const username = usernameInput?.value.trim() || 'Sheekovic';
  fetchUserInfo(username);
  fetchRepos(username);
}

document.getElementById('repo-search')?.addEventListener('submit', (event) => {
  event.preventDefault();
  loadUsername();
});

loadUsername();
