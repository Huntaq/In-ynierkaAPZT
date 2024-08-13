// routes/users.js
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Endpoint do pobierania użytkowników na podstawie id
router.get('/:id', (req, res) => {
  const id = req.params.id;

  // Sprawdź, czy id zostało przekazane
  if (!id) {
    return res.status(400).json({ error: 'Id jest wymagane' });
  }

  // Przygotuj zapytanie SQL z warunkiem WHERE
  const sql = 'SELECT * FROM users WHERE id = ?';

  // Wykonaj zapytanie
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    }
    res.json(results);
  });
});

module.exports = router;
