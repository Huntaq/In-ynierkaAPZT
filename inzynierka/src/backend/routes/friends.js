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
        SELECT f.user_id, f.friend_id, f.status, u1.username AS user_username, u2.username AS friend_username 
        FROM friends f
        JOIN users u1 ON f.user_id = u1.id 
        JOIN users u2 ON f.friend_id = u2.id 
        WHERE f.user_id = ? OR f.friend_id = ?`;

    db.query(sqlFriends, [userId, userId], (err, friends) => {
        if (err) {
            console.error('query error', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json(friends);
    });
});

router.post('/accept/:user_id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { friendId } = req.body;
    const userId = req.params.user_id;
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    const updateQuery = 'UPDATE friends SET status = "accepted" WHERE user_id = ? AND friend_id = ?';
    db.query(updateQuery, [friendId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'server error' });
        }
        return res.status(200).json({ message: 'friend accepted' });
    });
});

router.get('/allusers/:userId', (req, res) => {
    const { userId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

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
            console.error('query error', err);
            return res.status(500).json({ error: 'DB error' });
        }

        const friendIds = friends.map(friend => friend.friend_id || friend.user_id);

        db.query(sqlGetAllUsers, (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'DB error' });
            }

            const filteredUsers = users.filter(user => !friendIds.includes(user.id) && user.id !== parseInt(userId));

            res.json(filteredUsers);
        });
    });
});

router.post('/invite/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const { friend_id, status } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    const sqlInvite = 'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)';
    db.query(sqlInvite, [userId, friend_id, status], (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).json({ error: 'DB error' });
        }
        res.json({ message: 'success', result });
    });
});

router.post('/remove/:user_id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = req.params.user_id;
    const { friendId } = req.body;
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    const deleteQuery = 'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)';

    db.query(deleteQuery, [userId, friendId, friendId, userId], (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).json({ error: 'DB error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'not found' });
        }

        res.json({ message: 'friend removed' });
    });
});

router.get('/get/:userId', async (req, res) => {
    const userId = req.params.userId;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    try {
        const query = `
        SELECT u.id, u.username, u.profilePicture, u.email, p.id AS post_id, p.content, p.post_date
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        WHERE u.id = ?`;

        db.query(query, [userId], (error, results) => {
            if (error) {
                console.error("query error", error);
                return res.status(500).json({ error: 'query error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'error' });
            }
            const userData = {
                id: results[0].id,
                username: results[0].username,
                profilePicture: results[0].profilePicture,
                email: results[0].email,
                posts: results.map(result => ({
                    id: result.post_id,
                    content: result.content,
                    created_at: result.post_date,
                })).filter(post => post.id !== null)
            };

            res.json(userData);
        });
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ error: 'server error' });
    }
});


module.exports = router;
