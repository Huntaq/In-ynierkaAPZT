const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:user_id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = req.params.user_id;


    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const sqlFriends = `
        SELECT user_id, friend_id, status 
        FROM friends 
        WHERE user_id = ? OR friend_id = ?
    `;

    db.query(sqlFriends, [userId, userId], (err, friends) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'DB error' });
        }

        res.json(friends);
    });
});




module.exports = router;
