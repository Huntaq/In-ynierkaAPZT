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
router.post('/accept/:user_id', (req, res) => {
    console.log('Received request body:', req.body);

    const { friendId } = req.body;
    const userId = req.params.user_id; 


    const updateQuery = 'UPDATE friends SET status = "accepted" WHERE user_id = ? AND friend_id = ?';
    db.query(updateQuery, [friendId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
    });
});
router.post('/decline/:user_id', (req, res) => {
    console.log('Received request body:', req.body);

    const { friendId } = req.body;
    const userId = req.params.user_id; 


    const updateQuery = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
    db.query(updateQuery, [friendId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        
    });
});

router.get('/allusers/:userId', (req, res) => {
    const { userId } = req.params;

    const sqlGetAllUsers = 'SELECT id, username FROM users';
    
    const sqlGetFriends = `
        SELECT friend_id FROM friends 
        WHERE user_id = ? 
        UNION
        SELECT user_id FROM friends 
        WHERE friend_id = ?
    `;

    db.query(sqlGetFriends, [userId, userId], (err, friends) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'DB error' });
        }

        const friendIds = friends.map(friend => friend.friend_id || friend.user_id);

        db.query(sqlGetAllUsers, (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'DB error' });
            }

         

            const filteredUsers = users.filter(user => !friendIds.includes(user.id) && user.id !== userId);
           

            res.json(filteredUsers);
        });
    });
});

router.post('/invite/:user_id', (req, res) => {
    const userId = req.params.user_id; 
    const { friend_id, status } = req.body;

    console.log(`Received invite request: User ID: ${userId}, Friend ID: ${friend_id}, Status: ${status}`);

    const sqlInvite = 'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)';
    db.query(sqlInvite, [userId, friend_id, status], (err, result) => {
        if (err) {
            console.error('Error inserting invite:', err);
            return res.status(500).json({ error: 'DB error' });
        }
        console.log('Invite successfully inserted into the database:', result);
        res.json({ message: 'Invite sent successfully', result });
    });
});




module.exports = router;
