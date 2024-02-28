const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000; 
const saltRounds = 10;
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the users database.');
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )`);

app.use(cors()); // Enable CORS
app.use(express.json()); // For parsing JSON request bodies

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      return res.status(400).json({ error: 'User signup failed' });
    }
    res.status(201).json({ message: 'User created' });
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, message: 'Login successful' }); 
    } else {
      res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
