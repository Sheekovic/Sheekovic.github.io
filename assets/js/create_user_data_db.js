const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database
const db = new sqlite3.Database('user_data.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the user_data.db database.');
});

// Create the `users` table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Users table created or already exists.');
      }
    }
  );
});

// Function to insert a user into the database
function insertUser(uid, username, email) {
  const query = `INSERT INTO users (uid, username, email) VALUES (?, ?, ?)`;
  db.run(query, [uid, username, email], (err) => {
    if (err) {
      console.error('Error inserting user:', err.message);
    } else {
      console.log(`User ${username} added successfully.`);
    }
  });
}

// Function to display all users
function displayAllUsers() {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return;
    }
    console.log('All users:');
    rows.forEach((row) => {
      console.log(row);
    });
  });
}

// Example usage
insertUser('1', 'test_user', 'test_user@example.com'); // Add a test user
displayAllUsers(); // Show all users

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
