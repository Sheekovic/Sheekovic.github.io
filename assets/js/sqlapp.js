const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assets/database/user_data.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the user_data.db database.');
    }
});

// Save user data to the database
function saveUserData(user) {
    const sql = 'INSERT INTO users (uid, username, email) VALUES (?, ?, ?)';
    const values = [user.uid, user.displayName || 'Anonymous', user.email || 'Not provided'];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error saving user data:', err.message);
        } else {
            console.log('User data saved successfully.');
        }
    });
}

// Close the database connection when needed
function closeDb() {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

module.exports = { saveUserData, closeDb };
