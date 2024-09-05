const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sessionKey = req.headers['sessionkey'];

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }


  const sqlUser = 'SELECT * FROM users WHERE id = ?';
  db.query(sqlUser, [id], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    if (results.length > 0) {
      const user = results[0];

      if (user.session_key === sessionKey) {
        res.json(results); 
      } else {
        res.status(403).json({ error: 'no access' });
      }
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  });
});
router.get('/:id/routes_with_usernames', (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'Id is required' });
  }

  const sql = `
    SELECT ur.*, u.username 
    FROM user_routes ur
    JOIN users u ON ur.user_id = u.id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    
    res.json(results);
  });
});

router.get('/:id/routes', (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'Id is required' });
  }

  const sql = 'SELECT * FROM user_routes WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ error: 'DB error' });
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
