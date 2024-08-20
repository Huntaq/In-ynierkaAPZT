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
router.put('/:id/notifications', async (req, res) => {
  const { email_notifications, push_notifications } = req.body;
  const userId = req.params.id;

  try {
    
    const updateQuery = 'UPDATE users SET email_notifications = ?, push_notifications = ? WHERE id = ?';
    db.query(updateQuery, [email_notifications, push_notifications, userId], (err, result) => {
      if (err) {
        console.error('Błąd podczas aktualizacji ustawień:', err);
        return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji ustawień.' });
      }
      
      if (result.affectedRows > 0) {
      } else {
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji ustawień.' });
  }
});

module.exports = router;
