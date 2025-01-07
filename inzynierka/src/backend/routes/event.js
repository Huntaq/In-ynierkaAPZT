const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const path = require('path');
const router = express.Router();

//sciezka do przechowywania zdjec 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '../../public/uploads';
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/event/thropies/{id}:
 *   get:
 *     summary: Get unique trophies earned by a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
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
 *         description: List of trophies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the trophy
 *                   title:
 *                     type: string
 *                     description: Title of the trophy
 *                   description:
 *                     type: string
 *                     description: Description of the trophy
 *                   image:
 *                     type: string
 *                     description: Image URL for the trophy
 *                   TrophyImage:
 *                     type: string
 *                     description: Specific image for the trophy
 *                   user_ids:
 *                     type: string
 *                     description: List of user IDs that have earned the trophy
 *       401:
 *         description: Token is required
 *       500:
 *         description: Database error
 */

//wyświetla unikalne id zdobyte przez usera
router.get('/thropies/:id', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const id = req.params.id;
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }  
    const sqlQuery = 'SELECT id, title, description, image, TrophyImage, user_ids FROM events WHERE FIND_IN_SET(?, user_ids) > 0';
    
    db.query(sqlQuery,[id], (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(results);
    });
  });

  /**
 * @swagger
 * /api/event:
 *   post:
 *     summary: Create a new event (admin only)
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *       - name: image
 *         in: formData
 *         type: file
 *         description: Event image to be uploaded
 *       - name: trophyImage
 *         in: formData
 *         type: file
 *         description: Trophy image to be uploaded
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the event
 *               description:
 *                 type: string
 *                 description: Description of the event
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Event start date and time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Event end date and time
 *               type:
 *                 type: string
 *                 description: Type/category of the event
 *               distance:
 *                 type: integer
 *                 description: Distance related to the event
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - type
 *               - distance
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 eventId:
 *                   type: integer
 *                   description: The ID of the newly created event
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Token is required
 *       500:
 *         description: Server error or database error
 */

  //tworzenie eventu z panelu admina
  router.post('/', upload.fields([{ name: 'image' }, { name: 'trophyImage' }]), async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const { title, description, startDate, endDate, type, distance } = req.body;
    const files = req.files;

    if (!title || !description || !startDate || !endDate || !type || !distance) {
        return res.status(400).json({ message: 'all fields are required' });
    }

        let imageUrl = null;
        let trophyImageUrl = null;

        if (files && files.image && files.image[0]) {
          imageUrl = `../../public/uploads/${files.image[0].originalname}`;
        }
      
        if (files && files.trophyImage && files.trophyImage[0]) {
          trophyImageUrl = `../../public/uploads/${files.trophyImage[0].originalname}`;
        }

        const sqlInsertEvent = `
            INSERT INTO events (title, description, startDate, endDate, type, distance, image, TrophyImage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sqlInsertEvent, [title, description, startDate, endDate, type, distance, imageUrl, trophyImageUrl], (err, result) => {
            if (err) {
                console.error('error', err);
                return res.status(500).json({ message: 'server error' });
            }
            res.status(201).json({ message: 'event created', eventId: result.insertId });
        });

    
});

/**
 * @swagger
 * /api/event/{eventId}:
 *   delete:
 *     summary: Delete event 
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID of the event to delete
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
 *         description: Event and its data successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Invalid or missing eventId
 *       401:
 *         description: Token is required
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server or database error
 */

//usuwa event i wszystkie jego dane 
router.delete('/:eventId', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const eventId = req.params.eventId;

  const sqlSelectEvent = 'SELECT image, TrophyImage FROM events WHERE id = ?';
  db.query(sqlSelectEvent, [eventId], async (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ message: 'query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'event not found' });
    }

    const event = results[0];
    const imageUrl = event.image;
    const trophyImageUrl = event.TrophyImage;

    const fs = require('fs');
    
    if (imageUrl) {
      const filePath = path.join('./', imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('error deleting image', err);
        }
      });
    }

    if (trophyImageUrl) {
      const trophyFilePath = path.join('./', trophyImageUrl);
      fs.unlink(trophyFilePath, (err) => {
        if (err) {
          console.error('error deleting image', err);
        }
      });
    }

    const deleteEventQuery = 'DELETE FROM events WHERE id = ?';
    db.query(deleteEventQuery, [eventId], (err) => {
      if (err) {
        console.error('error deleting event', err);
        return res.status(500).json({ message: 'error deleting event' });
      }
      res.status(200).json({ message: 'event deleted' });
    });
  });
});

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Get all events
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Event ID
 *                   title:
 *                     type: string
 *                     description: Event title
 *                   description:
 *                     type: string
 *                     description: Event description
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     description: Event start date
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     description: Event end date
 *                   type:
 *                     type: string
 *                     description: Event type
 *                   distance:
 *                     type: integer
 *                     description: Event distance
 *                   image:
 *                     type: string
 *                     description: URL of the event image
 *                   TrophyImage:
 *                     type: string
 *                     description: URL of the trophy image
 *                   user_ids:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of user IDs
 *       401:
 *         description: Token is required
 *       500:
 *         description: database error
 */
  
//wyświetla dane eventów
  router.get('/', async (req, res) => {
    
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    const sqlSelectEvents = 'SELECT * FROM events';

    db.query(sqlSelectEvents, (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ message: 'server error' });
      }
      
      const processedResults = results.map(event => {
        return {
          ...event,
          user_ids: event.user_ids ? event.user_ids.split(',') : []
        };
      });
  
      res.status(200).json(processedResults);
    });
  });



router.patch('/:id/status', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    } 
  const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'error' });
    }
  
    const sql = 'UPDATE events SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'event updated' });
    });
  });

  router.post('/:eventId/complete', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const { userId } = req.body;
    const { eventId } = req.params;
  
    const sqlCheckUser = `
      SELECT user_ids FROM events WHERE id = ?
    `;
  
    db.query(sqlCheckUser, [eventId], (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'even not found' });
      }
  
      const userIds = results[0].user_ids ? results[0].user_ids.split(',') : [];
  
      if (userIds.includes(userId.toString())) {
        return res.status(200).json({ message: 'user already added' });
      }
  
      userIds.push(userId);
      const updatedUserIds = userIds.join(',');
  
      const sqlUpdateEvent = `
        UPDATE events
        SET user_ids = ?
        WHERE id = ?
      `;
  
      db.query(sqlUpdateEvent, [updatedUserIds, eventId], (err) => {
        if (err) {
          console.error('query error', err);
          return res.status(500).json({ error: 'DB error' });
        }
        res.status(200).json({ message: 'user added' });
      });
    });
  });


  router.get('/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const eventId = req.params.id;
    const sql = 'SELECT * FROM events WHERE id = ?';
  
    db.query(sql, [eventId], (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'error' });
      }
      res.json(results[0]);
    });
  });

module.exports = router;
