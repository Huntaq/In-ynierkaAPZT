const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/ban/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const sql = 'UPDATE users SET is_banned = 1 WHERE id = ?';
    
    db.query(sql, [userId], (err) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'User banned successfully' });
    });
});

router.post('/unban/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const sql = 'UPDATE users SET is_banned = 0 WHERE id = ?';
    
    db.query(sql, [userId], (err) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'User unbanned successfully' });
    });
});

module.exports = router;
