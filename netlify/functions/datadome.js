// netlify/functions/datadome.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { userAgent, formData } = JSON.parse(event.body);
    
    const response = await fetch('https://api-js.datadome.co/js/', {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.fivebackgift.com/',
        'Origin': 'https://www.fivebackgift.com'
      },
      body: new URLSearchParams(formData)
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: await response.text()
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message
    };
  }
};