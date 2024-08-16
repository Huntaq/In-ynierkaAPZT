const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const db = require('../config/db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../config/windy-marker-431819-c0-262ab0058e6d.json'),
});

const bucket = storage.bucket('img_inzynierka');

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Brak pliku');
  }

  const userId = req.body.userId;
  const blob = bucket.file(`${userId}-${Date.now()}-${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', async () => {
    try {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      const updateQuery = `UPDATE users SET profilePicture = ? WHERE id = ?`;
      await db.query(updateQuery, [publicUrl, userId]);

      res.status(200).send({ url: publicUrl });
    } catch (error) {
      console.error('Failed to make file public:', error);
      res.status(500).send('Błąd podczas ustawiania publicznego dostępu do pliku');
    }
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
