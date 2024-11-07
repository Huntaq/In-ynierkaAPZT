const express = require('express');
const db = require('../config/db');
const router = express.Router();

//banowanie usera
router.post('/ban/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const userId = req.params.id;
    const sql = 'UPDATE users SET is_banned = 1 WHERE id = ?';
    
    db.query(sql, [userId], (err) => {
        if (err) {
            console.error('query error', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'user banned' });
    });
});

//unban usera
router.post('/unban/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const userId = req.params.id;
    const sql = 'UPDATE users SET is_banned = 0 WHERE id = ?';
    
    db.query(sql, [userId], (err) => {
        if (err) {
            console.error('query error', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'user unbanned' });
    });
});

module.exports = router;
