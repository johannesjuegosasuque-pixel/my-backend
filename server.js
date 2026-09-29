
const express = require('express'); // Import Express
const mysql = require('mysql2');
const app = express();              // Create an Express app
const PORT = 3000;                  // Set the server port

// Create and connect to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Transman', // Replace with your MySQL password
    database: 'my_database'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database!');
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Route: Home
app.get('/', (req, res) => {
    res.send('Welcome to My Backend Server!');
});

// Route: API Example
app.get('/api/user', (req, res) => {
    res.json({
        name: "John Doe",
        email: "john@example.com"
    });
});

// Route: Contact
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body; // Extract data from request body

    // Validation: check if email contains '@'
    if (!email || !email.includes('@')) {
        return res.status(400).json({
            error: "Invalid email address"
        });
    }

    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Failed to save contact:', err);
            return res.status(500).json({ error: 'Failed to save contact' });
        }

        res.json({
            message: `Thank you ${name}, your message has been saved!`,
            data: { id: result.insertId, name, email, message }
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

