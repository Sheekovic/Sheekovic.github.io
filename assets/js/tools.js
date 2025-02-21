const tools = [
  { file: "age.html", name: "Age Calculator", description: "Calculate your exact age in years, months, and days." },
  { file: "pixformat.html", name: "PixFormat", description: "Convert images to different formats easily." },
  { file: "youtube.html", name: "YouTube LSC", description: "YouTube Live Subscribers Counter." },
  { file: "to-do.html", name: "To-Do List", description: "Manage your daily tasks with this simple to-do list." },
  { file: "binance.html", name: "Binance Tracker", description: "Track cryptocurrency prices and market trends." },
  { file: "sheekryptor.html", name: "SheeKryptor", description: "Encrypt, decrypt, password generator, API testing and much more." },
  { file: "acrossboard/app.html", name: "AcrossBoard App", description: "Clipboard-sharing tool for seamless data transfer." },
  { file: "github.html", name: "GitHub Repo Viewer", description: "View your GitHub repositories and user info." },
  { file: "password.html", name: "Personalized Password", description: "Generate a personalized password based on your name and date of birth." },
];

// Sort tools alphabetically by the first character of the name
tools.sort((a, b) => a.name.localeCompare(b.name));

// Function to dynamically generate the tool list
function generateToolList(filteredTools) {
  toolListDiv.innerHTML = ""; // Clear the current list
  filteredTools.forEach(tool => {
    const link = document.createElement("a");
    link.href = tool.file;
    link.classList.add("tool-link");

    const toolName = document.createElement("span");
    toolName.textContent = tool.name;
    toolName.classList.add("tool-name");

    const toolDescription = document.createElement("span");
    toolDescription.textContent = tool.description;
    toolDescription.classList.add("tool-description");

    link.appendChild(toolName);
    link.appendChild(toolDescription);
    toolListDiv.appendChild(link);
  });
}

const toolListDiv = document.getElementById("tool-list");
generateToolList(tools); // Initial list generation

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const themeLink = document.getElementById('themeStylesheet'); // Ensure the <link> element has this ID
darkModeToggle.addEventListener("click", () => {
  // if button text is "Dark Mode", change to "Light Mode"
  if (darkModeToggle.textContent === "Dark Mode") {
    darkModeToggle.textContent = "Light Mode";
    themeLink.setAttribute('href', 'assets/css/toolslight.css');
  }
  else {
    // if button text is "Light Mode", change to "Dark Mode"
    darkModeToggle.textContent = "Dark Mode";
    themeLink.setAttribute('href', 'assets/css/tools.css');
  }
});

// Search Input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query) || 
    tool.description.toLowerCase().includes(query)
  );
  generateToolList(filteredTools);
});
