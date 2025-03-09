const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors()); // Enable CORS for all routes

app.post('/datadome-proxy', async (req, res) => {
  try {
    const response = await fetch('https://api-js.datadome.co/js/', {
      method: 'POST',
      headers: {
        'User-Agent': req.body.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.fivebackgift.com/',
      },
      body: req.body.formData
    });
    const text = await response.text();
    res.send(text);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));