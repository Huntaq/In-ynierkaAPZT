// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, password, email, age, gender } = req.body;
  console.log('Received data:', { name, password, email, age, gender });
  
  if (!name || !password || !email || !age || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      password: hashedPassword,
      email,
      age,
      gender,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    const query = `
      INSERT INTO users (username, password_hash, email, age, gender, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userData.name,
      userData.password,
      userData.email,
      userData.age,
      userData.gender,
      userData.created_at
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Błąd zapytania:', err);
        return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
      }
      res.json({ message: 'User registered successfully!' });
      console.log('udalo sie');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login data:', { username, password });
  
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: 'Database query error' });
        }
  
        if (results.length === 0) {
          console.log('User not found');
          return res.status(400).json({ error: 'Invalid username or password' });
        }
  
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
  
        if (isMatch) {
          res.json({ message: 'Login successful', id: user.id });
        } else {
          console.log('Password mismatch');
          res.status(400).json({ error: 'Invalid username or password' });
        }
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
