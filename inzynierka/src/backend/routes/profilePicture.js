const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const db = require('../config/db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/windy-marker-431819-c0-262ab0058e6d.json'),
});

const bucket = storage.bucket('img_inzynierka');

router.post('/', upload.single('file'), async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  if (!req.file) {
    return res.status(400).send('Brak pliku');
  }

  const userId = req.body.userId;

  const getUserQuery = 'SELECT profilePicture FROM users WHERE id = ?';
  db.query(getUserQuery, [userId], async (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkownika:', err);
      return res.status(500).send('Błąd serwera');
    }

    const currentProfilePictureUrl = results[0]?.profilePicture;

    if (currentProfilePictureUrl) {
      const currentFileName = currentProfilePictureUrl.split('/').pop();

      const oldFile = bucket.file(currentFileName);
      try {
        await oldFile.delete();
        console.log('Stare zdjęcie profilowe zostało usunięte.');
      } catch (error) {
        console.error('Błąd podczas usuwania starego zdjęcia profilowego:', error);
        return res.status(500).send('Błąd podczas usuwania starego pliku');
      }
    }

    const blob = bucket.file(`${userId}-${Date.now()}-${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const updateQuery = `UPDATE users SET profilePicture = ? WHERE id = ?`;
        db.query(updateQuery, [publicUrl, userId]);

        res.status(200).send({ url: publicUrl });
      } catch (error) {
        console.error('Nie udało się ustawić pliku jako publicznego:', error);
        res.status(500).send('Błąd podczas ustawiania publicznego dostępu do pliku');
      }
    });

    blobStream.end(req.file.buffer);
  });
});

router.delete('/', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const userId = req.body.userId;

  const getUserQuery = 'SELECT profilePicture FROM users WHERE id = ?';
  db.query(getUserQuery, [userId], async (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkownika:', err);
      return res.status(500).send('Błąd serwera');
    }

    const currentProfilePictureUrl = results[0]?.profilePicture;

    if (currentProfilePictureUrl) {
      const currentFileName = currentProfilePictureUrl.split('/').pop();

      const file = bucket.file(currentFileName);
      try {
        await file.delete();
        console.log('Zdjęcie profilowe zostało usunięte.');

        const updateQuery = `UPDATE users SET profilePicture = NULL WHERE id = ?`;
        db.query(updateQuery, [userId]);

        res.status(200).send('Zdjęcie profilowe zostało usunięte.');
      } catch (error) {
        console.error('Błąd podczas usuwania zdjęcia profilowego:', error);
        res.status(500).send('Błąd podczas usuwania pliku');
      }
    } else {
      res.status(400).send('Brak zdjęcia profilowego do usunięcia.');
    }
  });
});



module.exports = router;
