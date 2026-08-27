async function fetchData() {
  const output = document.getElementById('api-response');
  output.style.display = 'block';
  output.textContent = 'Loading…';

  try {
    const response = await fetch('/api/api.json');
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    output.textContent = JSON.stringify(await response.json(), null, 2);
  } catch (error) {
    output.textContent = `Unable to load the sample API: ${error.message}`;
  }
}

document.getElementById('fetch-api-data').addEventListener('click', fetchData);
