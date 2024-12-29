// import firebase app so we can define uid, username, and email
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./assets/database/user_data.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the user_data.db database.');
});

db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
        return;
    }
    console.log('Database connection closed.');
});

// save user data to the database
function saveUserData(user) {
    const db = new sqlite3.Database('./assets/database/user_data.db', (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
            return;
        }
    });

    // Use only the fields `uid`, `username`, and `email`
    const sql = 'INSERT INTO users (uid, username, email) VALUES (?, ?, ?)';
    const values = [user.uid, user.displayName, user.email || 'Anonymous', user.email];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error saving user data:', err.message);
        } else {
            console.log('User data saved successfully.');
        }
        db.close();
    });
}