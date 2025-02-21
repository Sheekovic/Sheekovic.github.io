const tools = [
  { file: "age.html", name: "Age Calculator", description: "Calculate your exact age in years, months, and days." },
  { file: "pixformat.html", name: "PixFormat", description: "Convert images to different formats easily." },
  { file: "youtube.html", name: "YouTube LSC", description: "YouTube Live Subscribers Counter." },
  { file: "to-do.html", name: "To-Do List", description: "Manage your daily tasks with this simple to-do list." },
  { file: "binance.html", name: "Binance Tracker", description: "Track cryptocurrency prices and market trends." },
  { file: "sheekryptor.html", name: "SheeKryptor", description: "Encrypt, decrypt, password generator, API testing and much more." },
  { file: "acrossboard/app.html", name: "AcrossBoard App", description: "Clipboard-sharing tool for seamless data transfer." },
  { file: "github.html", name: "GitHub Repo Viewer", description: "View your GitHub repositories and user info." },
  // Add more tool files and descriptions here
];

// Sort tools alphabetically by the first character of the name
tools.sort((a, b) => a.name.localeCompare(b.name));

// Dynamically generate the tool list
const toolListDiv = document.getElementById("tool-list");
tools.forEach(tool => {
  const link = document.createElement("a");
  link.href = tool.file;
  link.classList.add("tool-link");

  // Create tool name as a span for styling
  const toolName = document.createElement("span");
  toolName.textContent = tool.name;
  toolName.classList.add("tool-name");

  // Create tool description as a span for styling
  const toolDescription = document.createElement("span");
  toolDescription.textContent = tool.description;
  toolDescription.classList.add("tool-description");

  // Append name and description to the link
  link.appendChild(toolName);
  link.appendChild(toolDescription);

  toolListDiv.appendChild(link);
});
