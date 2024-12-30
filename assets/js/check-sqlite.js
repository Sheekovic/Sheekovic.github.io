const sqlite3 = require('sqlite3').verbose();

// Test SQLite connection
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Failed to connect to SQLite:', err.message);
    process.exit(1);
  }
  console.log('Connected to an in-memory SQLite database.');
});

db.close((err) => {
  if (err) {
    console.error('Failed to close the database:', err.message);
    process.exit(1);
  }
  console.log('Closed the database successfully.');
});
