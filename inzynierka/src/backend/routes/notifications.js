const express = require('express');
const db = require('../config/db');
const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new popup notification
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the notification
 *               header:
 *                 type: string
 *                 description: The header of the notification
 *             required:
 *               - content
 *               - header
 *     responses:
 *       200:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Token is required
 *       500:
 *         description: Database error
 */

//tworzenie notyfikacji 
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

/**
 * @swagger
 * /api/popup:
 *   get:
 *     summary: Get all popup notifications
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of popup notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the notification
 *                   content:
 *                     type: string
 *                     description: Content of the notification
 *                   header:
 *                     type: string
 *                     description: Header of the notification
 *       401:
 *         description: Token is required
 *       500:
 *         description: Database error
 */

//wyświetlanie notyfikacji przy logowaniu
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

/**
 * @swagger
 * /api/notifications/popup/{id}:
 *   delete:
 *     summary: Delete a notification
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the popup to delete
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Token is required
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Database error
 */

//usuwanie notyfikacji
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