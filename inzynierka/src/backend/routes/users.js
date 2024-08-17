const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'Id jest wymagane' });
  }

  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    }
    res.json(results);
  });
});

router.get('/:id/routes', (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'Id jest wymagane' });
  }

  const sql = 'SELECT * FROM user_routes WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
    }
    res.json(results);
  });
});

module.exports = router;
