// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const crypto = require('crypto');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Brak tokena

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) return res.sendStatus(403); // Token jest niepoprawny

    // Sprawdzenie sesji w bazie danych
    db.query('SELECT session_key FROM users WHERE id = ?', [payload.id], (err, results) => {
      if (err) {
        console.error('Błąd zapytania do bazy danych:', err);
        return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
      }

      if (results.length === 0 || results[0].session_key !== payload.sessionKey) {
        return res.sendStatus(403); // Sesja jest niepoprawna
      }

      req.user = payload;
      next();
    });
  });
};



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

  if (!username || !password) {
    return res.status(400).json({ error: 'Username i hasło są wymagane' });
  }

  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Błąd zapytania do bazy danych:', err);
        return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Nieprawidłowy username lub hasło' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        const sessionKey = crypto.randomBytes(64).toString('hex');
        
        // Aktualizacja klucza sesji w bazie danych
        db.query('UPDATE users SET session_key = ? WHERE id = ?', [sessionKey, user.id], (err) => {
          if (err) {
            console.error('Błąd aktualizacji klucza sesji:', err);
            return res.status(500).json({ error: 'Błąd aktualizacji klucza sesji' });
          }
          
          // Generowanie tokena JWT
          const token = jwt.sign({ id: user.id, username: user.username, sessionKey }, SECRET_KEY, { expiresIn: '1h' });
          res.json({ token });
        });
      } else {
        return res.status(400).json({ error: 'Nieprawidłowy username lub hasło' });
      }
    });
  } catch (error) {
    console.error('Błąd serwera:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Chroniona trasa (przykład)
router.get('/protected', authenticateToken, (req, res) => {
  res.json({});
});

module.exports = { authenticateToken, router };
