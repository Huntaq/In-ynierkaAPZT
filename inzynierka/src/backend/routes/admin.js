const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const sql = 'SELECT COUNT(*) AS count FROM users';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        const count = result[0].count;
        res.json({ userCount: count });
    });
});
router.get('/this-week', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const sql = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
          AND created_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 1 WEEK)
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        const count = result[0].count;
        res.json({ userCountThisWeek: count });
    });
});

router.get('/active-events', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const sql = `
        SELECT COUNT(*) AS count
        FROM events
        WHERE startDate <= CURDATE() AND endDate >= CURDATE() and status = 'active'
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Błąd zapytania:', err);
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        const count = result[0].count;
        res.json({ activeEventsCount: count });
    });
});

module.exports = router;
