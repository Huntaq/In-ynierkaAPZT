const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'C:/Users/Julas/Desktop/Xamp/htdocs/uploads';
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); 
  },
});

const upload = multer({ storage });

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

    const currentProfilePicturePath = results[0]?.profilePicture;

    if (currentProfilePicturePath) {
      const oldPicturePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/uploads', path.basename(currentProfilePicturePath));

      fs.unlink(oldPicturePath, (err) => {
        if (err) {
          console.error('Error deleting old picture:', err);
          return res.status(500).send('Error deleting old file');
        }
        console.log('Old photo got deleted.');
      });
    }

    const newProfilePicturePath = `/uploads/${req.file.filename}`;
    const updateQuery = 'UPDATE users SET profilePicture = ? WHERE id = ?';
    db.query(updateQuery, [newProfilePicturePath, userId], (err) => {
      if (err) {
        console.error('Error updating photo:', err);
        return res.status(500).send('error saving photo');
      }
      res.status(200).send({ url: newProfilePicturePath });
    });
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

    const currentProfilePicturePath = results[0]?.profilePicture;

    if (currentProfilePicturePath) {
      fs.unlink(path.join(__dirname, 'C:/Users/Julas/Desktop/Xamp/htdocs/uploads', path.basename(currentProfilePicturePath)), (err) => {
        if (err) {
          console.error('Błąd podczas usuwania zdjęcia profilowego:', err);
          return res.status(500).send('Błąd podczas usuwania pliku');
        }
        console.log('Zdjęcie profilowe zostało usunięte.');

        const updateQuery = 'UPDATE users SET profilePicture = NULL WHERE id = ?';
        db.query(updateQuery, [userId], (err) => {
          if (err) {
            console.error('Błąd podczas aktualizacji bazy danych:', err);
            return res.status(500).send('Błąd podczas aktualizacji ścieżki w bazie');
          }
          res.status(200).send('Zdjęcie profilowe zostało usunięte.');
        });
      });
    } else {
      res.status(400).send('Brak zdjęcia profilowego do usunięcia.');
    }
  });
});



module.exports = router;
