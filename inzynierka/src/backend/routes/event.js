const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const path = require('path');
const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

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



router.get('/thropies', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }  
  const sqlQuery = 'SELECT id, title, image,TrophyImage, user_ids FROM events';
    
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Błąd zapytania:', err);
        return res.status(500).json({ error: 'Błąd bazy danych' });
      }
  
      res.json(results);
    });
  });


  router.post('/', upload.fields([{ name: 'image' }, { name: 'trophyImage' }]), async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
    const { title, description, startDate, endDate, type, distance } = req.body;
    const files = req.files;

    if (!title || !description || !startDate || !endDate || !type || !distance) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
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
                console.error('Error inserting event into database:', err);
                return res.status(500).json({ message: 'Błąd serwera' });
            }
            res.status(201).json({ message: 'Wydarzenie zostało pomyślnie utworzone', eventId: result.insertId });
        });

    
});


router.delete('/:eventId', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const eventId = req.params.eventId;

  const sqlSelectEvent = 'SELECT image, TrophyImage FROM events WHERE id = ?';
  db.query(sqlSelectEvent, [eventId], async (err, results) => {
    if (err) {
      console.error('Error fetching event from database:', err);
      return res.status(500).json({ message: 'Błąd podczas pobierania szczegółów wydarzenia' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Wydarzenie nie zostało znalezione' });
    }

    const event = results[0];
    const imageUrl = event.image;
    const trophyImageUrl = event.TrophyImage;

    const fs = require('fs');
    
    if (imageUrl) {
      const filePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/', imageUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        }
      });
    }

    if (trophyImageUrl) {
      const trophyFilePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/', trophyImageUrl);
      fs.unlink(trophyFilePath, (err) => {
        if (err) {
          console.error('Error deleting trophy image file:', err);
        }
      });
    }

    const deleteEventQuery = 'DELETE FROM events WHERE id = ?';
    db.query(deleteEventQuery, [eventId], (err) => {
      if (err) {
        console.error('Error deleting event from database:', err);
        return res.status(500).json({ message: 'Błąd podczas usuwania wydarzenia' });
      }
      res.status(200).json({ message: 'Wydarzenie zostało pomyślnie usunięte' });
    });
  });
});

  

  router.get('/', async (req, res) => {
    
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }

    const sqlSelectEvents = 'SELECT * FROM events';

    db.query(sqlSelectEvents, (err, results) => {
      if (err) {
        console.error('Error fetching events from database:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
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
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    const sql = 'UPDATE events SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'Event status updated' });
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
        console.error('Query error:', err);
        return res.status(500).json({ error: 'DB error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const userIds = results[0].user_ids ? results[0].user_ids.split(',') : [];
  
      if (userIds.includes(userId.toString())) {
        return res.status(200).json({ message: 'User ID already added to event' });
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
          console.error('Query error:', err);
          return res.status(500).json({ error: 'DB error' });
        }
        res.status(200).json({ message: 'User ID added to event' });
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
        console.error('Query error:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(results[0]);
    });
  });

module.exports = router;
