document.getElementById('settings-icon').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'flex';
});

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-modal').style.display = 'none';
});

document.getElementById('generate-colors').addEventListener('click', () => {
    // Fetch the color palettes from the CSV file and apply a random palette
    fetch('/assets/css/colors.csv')
        .then(response => response.text())
        .then(data => {
            const palettes = parseCSV(data);
            const randomPalette = getRandomPalette(palettes);
            applyColors(randomPalette);
            changeBackground();
        })
        .catch(error => {
            console.error('Error loading color palettes:', error);
        });
});

// Function to parse the CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    return lines.map(line => line.split(',').map(color => `#${color.trim()}`));
}

// Function to get a random color palette from the CSV data
function getRandomPalette(palettes) {
    const randomIndex = Math.floor(Math.random() * palettes.length);
    return palettes[randomIndex];
}

// Function to apply the colors to various page elements
function applyColors(colors) {
    // Apply colors to body, header, todo container, footer, buttons, and links
    document.body.style.backgroundColor = colors[0];
    document.querySelector("header").style.backgroundColor = colors[1];
    document.querySelector(".todo-container").style.backgroundColor = colors[2];
    document.querySelector("footer").style.backgroundColor = colors[1];

    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.backgroundColor = colors[3];
        button.style.color = colors[4];
    });

    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.style.color = colors[4];
    });
}

// change background image on load
function changeBackground() {
    // Array of 10 background image URLs
    const backgrounds = [
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1466853817435-05b43fe45b39?q=80&w=1999&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1473800447596-01729482b8eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1482784160316-6eb046863ece?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1499678329028-101435549a4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1431440869543-efaf3388c585?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1441260038675-7329ab4cc264?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1484542603127-984f4f7d14cb?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    // Select a random background image from the list
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Set the background image URL to the random choice
    document.querySelector('.background').style.backgroundImage = `url(${randomBackground})`;

    // change background color every 60 seconds
    setInterval(() => {
        const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        document.querySelector('.background').style.backgroundImage = `url(${randomBackground})`;
    }, 60000);
}