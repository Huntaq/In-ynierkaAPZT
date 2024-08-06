const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 5000;

const db = require('./db');

app.use(express.json());
app.use(cors()); 

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).send('Błąd bazy danych');
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
