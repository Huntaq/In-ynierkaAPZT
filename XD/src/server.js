const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Konfiguracja CORS
app.use(cors());
app.use(express.json());

// Utwórz połączenie z bazą danych MySQL
const db = mysql.createConnection({
  host: '34.116.229.68',
  user: 'root',
  password: 'QN|9YDTy[Tex3,04',
  database: 'inzynierka'
});

// Połącz się z bazą danych
db.connect(err => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

// Endpoint do pobierania danych użytkowników
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
      return;
    }
    res.json(results);
  });
});

// Uruchom serwer
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
