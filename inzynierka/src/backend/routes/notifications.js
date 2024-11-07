const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const { content, header } = req.body;

  const sqlInsertNotification = 'INSERT INTO notifications_popup (content, header) VALUES (?, ?)';

  db.query(sqlInsertNotification, [content, header], (err, result) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.status(200).json({ message: 'success' });
  });
});

router.get('/popup', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const sqlGetNotifications = 'SELECT id,content, header FROM notifications_popup';

  db.query(sqlGetNotifications, (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.status(200).json(results);
  });
});

router.delete('/popup/:id', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const { id } = req.params;

  const sqlDeleteNotification = 'DELETE FROM notifications_popup WHERE id = ?';

  db.query(sqlDeleteNotification, [id], (err, result) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'error' });
    }
    res.status(200).json({ message: 'success' });
  });
});

module.exports = router;