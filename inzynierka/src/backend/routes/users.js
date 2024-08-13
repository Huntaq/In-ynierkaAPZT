// routes/users.js
const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
      return;
    }
    res.json(results);
  });
});

module.exports = router;
