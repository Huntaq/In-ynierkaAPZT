const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const crypto = require('crypto');


//obsługa rejestracji
router.post('/register', async (req, res) => {
  const { name, password, email, age, gender } = req.body;

  if (!name || !password || !email || !age || !gender) {
    return res.status(400).json({ error: 'missing field' });
  }

  try {
    const checkQuery = `
      SELECT * FROM users WHERE username = ? OR email = ?
    `;
    const checkValues = [name, email];

    db.query(checkQuery, checkValues, async (err, results) => { 
      if (err) {
        console.error('DB error', err);
        return res.status(500).json({ error: 'DB error' });
      }

      if (results.length > 0) {
        const existingUser = results[0];
        if (existingUser.username === name) {
            return res.status(400).json({ error: 'username exists' });
        }
        if (existingUser.email === email) {
            return res.status(400).json({ error: 'email exists' });
        }
    }

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
          console.error('DB error', err);
          return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'success' });
      });
    });
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'error' });
  }
});

//obsługa loginu
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json('Username and pass are required');
  }

  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        res.status(500).json('error');
      }

      if (results.length === 0) {
        return res.status(400).json('error');
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        const sessionKey = crypto.randomBytes(64).toString('hex');
        
        db.query('UPDATE users SET session_key = ? WHERE id = ?', [sessionKey, user.id], (err) => {
          if (err) {
            return res.status(500);
          }
          
          const token = jwt.sign({ id: user.id, username: user.username,Admin: user.is_Admin, sessionKey }, SECRET_KEY, { expiresIn: '12h' });
          res.json({ token });
        });
      } else {
        return res.status(400).json('error');
      }
    });
  } catch (error) {
    res.status(500).json('error');
  }
});



module.exports = { router };
