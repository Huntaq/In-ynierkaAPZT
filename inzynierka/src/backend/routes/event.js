const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage({
    keyFilename: path.join(__dirname, '../config/windy-marker-431819-c0-262ab0058e6d.json'),
  });

const bucket = storage.bucket('img_inzynierka');
router.get('/thropies', (req, res) => {
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
    const { title, description, startDate, endDate, type, distance } = req.body;
    const files = req.files;

    if (!title || !description || !startDate || !endDate || !type || !distance) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: file.mimetype,
                    acl: [{ entity: 'allUsers', role: 'READER' }],
                },
            });

            blobStream.on('error', (err) => {
                console.error('Error uploading file to Google Cloud Storage:', err);
                reject('Błąd przesyłania pliku');
            });

            blobStream.on('finish', async () => {
                await blob.makePublic();
                const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
                resolve(fileUrl);
            });

            blobStream.end(file.buffer);
        });
    };

    try {
        let imageUrl = null;
        let trophyImageUrl = null;

        if (files && files.image && files.image[0]) {
            imageUrl = await uploadFile(files.image[0]);
        }

        if (files && files.trophyImage && files.trophyImage[0]) {
            trophyImageUrl = await uploadFile(files.trophyImage[0]);
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

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd przesyłania pliku' });
    }
});


router.delete('/:eventId', async (req, res) => {
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


    const fileName = imageUrl.split('/').pop();
    const file = bucket.file(fileName);
    try {
      await file.delete();
    } catch (deleteError) {
    }

    if (trophyImageUrl) {
      const trophyFileName = trophyImageUrl.split('/').pop();
      const trophyFile = bucket.file(trophyFileName);
      try {
        await trophyFile.delete();
      } catch (deleteError) {
      }
    } else {
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
