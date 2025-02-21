const tools = [
    "age.html",
    "pixformat.html",
    "youtube.html",
    "to-do.html",
    "binance.html",
    "sheekryptor.html",
    "acrossboard/app.html",
    // Add more tool files here
  ];
  
  // Dynamically generate the tool list
  const toolListDiv = document.getElementById("tool-list");
  tools.forEach(tool => {
    const link = document.createElement("a");
    link.href = tool;
    link.textContent = tool.replace(".html", ""); // Display without the ".html" extension
    // replace / with space for better readability
    link.textContent = link.textContent.replace("/", " ");
    toolListDiv.appendChild(link);
  });
  