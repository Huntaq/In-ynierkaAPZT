const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const path = require('path');
const router = express.Router();

//sciezka do przechowywania zdjec 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'C:/Users/Julas/Desktop/Xamp/htdocs/uploads';
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

//wyświetla unikalne id zdobyte przez usera
router.get('/thropies/:id', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const id = req.params.id;
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }  
    const sqlQuery = 'SELECT id, title, image, TrophyImage, user_ids FROM events WHERE FIND_IN_SET(?, user_ids) > 0';
    
    db.query(sqlQuery,[id], (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(results);
    });
  });

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
          imageUrl = `uploads/${files.image[0].originalname}`;
        }
      
        if (files && files.trophyImage && files.trophyImage[0]) {
          trophyImageUrl = `uploads/${files.trophyImage[0].originalname}`;
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
      const filePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/', imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('error deleting image', err);
        }
      });
    }

    if (trophyImageUrl) {
      const trophyFilePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/', trophyImageUrl);
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
