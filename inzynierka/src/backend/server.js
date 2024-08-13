// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const moment = require('moment');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '34.116.229.68',
  user: 'root',
  password: 'QN|9YDTy[Tex3,04',
  database: 'inzynierka'
});
app.post('/api/register', async (req, res) => {
  const { name, password, email, age, gender } = req.body;
  console.log('Received data:', { name, password, email, age, gender });
  if (!name || !password || !email || !age || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Przygotowanie danych do zapisania
    const userData = {
      name,
      password: hashedPassword,
      email,
      age,
      gender,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss') // Ustawienie bieżącej daty i godziny
    };

     // Zapis do bazy danych
     const query = `
     INSERT INTO users (username, password_hash, email, age, gender, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
   `;

   const values = [
     userData.name,
     userData.password,
     userData.email,
     userData.age,
     userData.gender,
     userData.created_at
   ];

   db.query(query, values, (err, results) => {
     if (err) {
       console.error('Błąd zapytania:', err);
       return res.status(500).json({ error: 'Błąd zapytania do bazy danych' });
     }
     res.json({ message: 'User registered successfully!' });
     console.log('udalo sie');
   });
 } catch (error) {
   console.error('Error:', error);
   res.status(500).json({ error: 'Server error' });
 }
});
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login data:', { username, password });

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(400).json({ error: 'Invalid username or password' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


db.connect(err => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

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

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
