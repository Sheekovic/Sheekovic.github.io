const tools = [
  // Existing Tools
  { file: "age.html", name: "Age Calculator", description: "Calculate your exact age in years, months, and days." },
  { file: "pixformat.html", name: "PixFormat", description: "Convert images to different formats easily." },
  { file: "youtube.html", name: "YouTube LSC", description: "YouTube Live Subscribers Counter." },
  { file: "to-do.html", name: "To-Do List", description: "Manage your daily tasks with this simple to-do list." },
  { file: "binance.html", name: "Binance Strategy Tester", description: "Backtest Binance Futures trading strategies with customizable parameters and performance analysis." },
  { file: "sheekryptor.html", name: "SheeKryptor", description: "Encrypt, decrypt, password generator, API testing and much more." },
  { file: "acrossboard/app.html", name: "AcrossBoard App", description: "Clipboard-sharing tool for seamless data transfer." },
  { file: "github.html", name: "GitHub Repo Viewer", description: "View your GitHub repositories and user info." },
  { file: "password.html", name: "Personalized Password", description: "Generate a personalized password based on your name and date of birth." },
  
  // Text & Data Tools
  { file: "qrcode.html", name: "QR Code Generator", description: "Generate QR codes from text or URLs with customizable sizes." },
  { file: "base64.html", name: "Base64 Encoder/Decoder", description: "Encode and decode text or files to/from Base64 format." },
  { file: "json-formatter.html", name: "JSON Formatter", description: "Format, minify, and validate JSON data with syntax highlighting." },
  { file: "markdown-preview.html", name: "Markdown Preview", description: "Live preview of Markdown with HTML export." },
  { file: "hash-generator.html", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for text or files." },
  { file: "url-tool.html", name: "URL Encoder/Decoder", description: "Encode and decode URLs and URI components." },
  
  // Converters
  { file: "unit-converter.html", name: "Unit Converter", description: "Convert between length, weight, temperature, area, and volume units." },
  { file: "color-converter.html", name: "Color Converter", description: "Convert colors between HEX, RGB, HSL, and CMYK formats with color picker." },
  { file: "currency-converter.html", name: "Currency Converter", description: "Convert between different currencies with exchange rates." },
  { file: "file-size-calc.html", name: "File Size Calculator", description: "Convert file sizes between bytes, KB, MB, GB, and TB." },
  
  // Calculators
  { file: "bmi-calculator.html", name: "BMI Calculator", description: "Calculate Body Mass Index with metric and imperial units." },
  { file: "loan-calculator.html", name: "Loan Calculator", description: "Calculate monthly payments, total interest, and payment schedules for loans." },
  { file: "tip-calculator.html", name: "Tip Calculator", description: "Calculate tips and split bills with customizable percentages." },
  { file: "percentage-calc.html", name: "Percentage Calculator", description: "Calculate percentages, percentage changes, and increases/decreases." },
  
  // Developer Tools
  { file: "regex-tester.html", name: "RegEx Tester", description: "Test and debug regular expressions with live matching and highlighting." },
  { file: "code-beautifier.html", name: "Code Beautifier", description: "Format and minify JavaScript, HTML, CSS, and JSON code." },
  { file: "lorem-ipsum.html", name: "Lorem Ipsum Generator", description: "Generate placeholder text in paragraphs, words, or sentences." },
  { file: "gradient-generator.html", name: "CSS Gradient Generator", description: "Create linear and radial CSS gradients with visual preview." },
  { file: "box-shadow-generator.html", name: "Box Shadow Generator", description: "Generate CSS box-shadow code with live preview and customization." },
  
  // Media Tools
  { file: "image-compressor.html", name: "Image Compressor", description: "Compress images to reduce file size with adjustable quality settings." },
  { file: "pdf-merger.html", name: "PDF Merger", description: "Merge multiple PDF files into a single document." },
  { file: "text-to-speech.html", name: "Text to Speech", description: "Convert text to speech with adjustable voice, speed, and pitch." },
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
