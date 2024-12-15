const cors = require('cors');

// Enable CORS for all origins
app.use(cors());

// Replace with specific origin for security (optional)
app.use(cors({ origin: 'https://sheekovic.github.io/index.html' }));
