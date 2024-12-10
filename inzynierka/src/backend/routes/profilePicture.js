const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const fs = require('fs');

const router = express.Router();

//folder do zdjęć
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

//wstawianie nowego / usuwanie starego zdjęcia profilowego
router.post('/', upload.single('file'), async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  if (!req.file) {
    return res.status(400).send('file missing');
  }

  const userId = req.body.userId;

  const getUserQuery = 'SELECT profilePicture FROM users WHERE id = ?';
  db.query(getUserQuery, [userId], async (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).send('server error');
    }

    const currentProfilePicturePath = results[0]?.profilePicture;

    if (currentProfilePicturePath) {
      const oldPicturePath = path.join('C:/Users/Julas/Desktop/Xamp/htdocs/uploads', path.basename(currentProfilePicturePath));

      fs.unlink(oldPicturePath, (err) => {
        if (err) {
          console.error('error deleting old photo', err);
          return res.status(500).send('error deleting old photo');
        }
        console.log('success photo deleted');
      });
    }

    const newProfilePicturePath = `/uploads/${req.file.filename}`;
    const updateQuery = 'UPDATE users SET profilePicture = ? WHERE id = ?';
    db.query(updateQuery, [newProfilePicturePath, userId], (err) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).send('server error');
      }
      res.status(200).send({ url: newProfilePicturePath });
    });
  });
});

//usuwanie zdjęcia profilowego
router.delete('/', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const userId = req.body.userId;

  const getUserQuery = 'SELECT profilePicture FROM users WHERE id = ?';
  db.query(getUserQuery, [userId], async (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).send('server error');
    }

    const currentProfilePicturePath = results[0]?.profilePicture;
    if (currentProfilePicturePath) {
      fs.unlink(path.join('C:/Users/Julas/Desktop/Xamp/htdocs/uploads', path.basename(currentProfilePicturePath)), (err) => {
        if (err) {
          console.error('error deleting', err);
          return res.status(500).send('error deleting');
        }

        const updateQuery = 'UPDATE users SET profilePicture = NULL WHERE id = ?';
        db.query(updateQuery, [userId], (err) => {
          if (err) {
            console.error('query error', err);
            return res.status(500).send('server error');
          }
          res.status(200).send('success');
        });
      });
    } else {
      res.status(400).send('error , photo missing');
    }
  });
});

module.exports = router;
