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

const iconMapping = {
    "Age Calculator": { icon: "fa-calendar-alt", type: "solid" },
    "PixFormat": { icon: "fa-images", type: "solid" },
    "YouTube LSC": { icon: "fa-youtube", type: "brands" },
    "To-Do List": { icon: "fa-tasks", type: "solid" },
    "Binance Tracker": { icon: "fa-chart-line", type: "solid" },
    "SheeKryptor": { icon: "fa-lock", type: "solid" },
    "AcrossBoard App": { icon: "fa-clipboard", type: "solid" },
    "GitHub Repo Viewer": { icon: "fa-github", type: "brands" },
    "Personalized Password": { icon: "fa-key", type: "solid" },
};

const iconSize = "fa-3x";
const iconMotion = "fa-fade";


// Sort tools alphabetically by name
tools.sort((a, b) => a.name.localeCompare(b.name));

// Function to dynamically generate the tool list
function generateToolList(filteredTools) {
    toolListDiv.innerHTML = ""; // Clear the current list

    filteredTools.forEach(tool => {
        const section = document.createElement("section");
        section.classList.add("col-4", "col-6-medium", "col-12-xsmall");

        const iconData = iconMapping[tool.name] || { icon: "fa-cogs", type: "solid" };
        const icon = document.createElement("span");
        
        // Dynamically add the correct style and icon classes
        if (iconData.type === "brands") {
            icon.classList.add("fa-brands", iconData.icon, iconMotion, iconSize);
        } else {
            icon.classList.add("fa-solid", iconData.icon, iconMotion, iconSize);
        }
        // add a space under the icon
        icon.style.marginBottom = "40px";

        const title = document.createElement("h3");
        title.textContent = tool.name;

        const description = document.createElement("p");
        description.textContent = tool.description;

        const link = document.createElement("a");
        link.href = tool.file;
        link.classList.add("button", "small");
        link.textContent = `Try ${tool.name}`;

        // Append elements to the section
        section.appendChild(icon);
        section.appendChild(title);
        section.appendChild(description);
        section.appendChild(link);

        // Add the section to the tool list div
        toolListDiv.appendChild(section);
    });
}


const toolListDiv = document.getElementById("tool-list");
generateToolList(tools); // Initial list generation

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
