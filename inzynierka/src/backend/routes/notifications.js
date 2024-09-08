const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/', (req, res) => {
  const { content, header } = req.body;

  const sqlInsertNotification = 'INSERT INTO notifications_popup (content, header) VALUES (?, ?)';

  db.query(sqlInsertNotification, [content, header], (err, result) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.status(200).json({ message: 'Notification sent successfully' });
  });
});
router.get('/popup', (req, res) => {
  const sqlGetNotifications = 'SELECT id,content, header FROM notifications_popup';

  db.query(sqlGetNotifications, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.status(200).json(results);
  });
});
router.delete('/popup/:id', (req, res) => {
  const { id } = req.params;


  if (!id) {
    return res.status(400).json({ error: 'Invalid notification ID' });
  }

  const sqlDeleteNotification = 'DELETE FROM notifications_popup WHERE id = ?';

  db.query(sqlDeleteNotification, [id], (err, result) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    console.log('Delete operation result:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  });
});

module.exports = router;