const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

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

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ message: 'Błąd zapytania do bazy danych' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) {
        console.error('Błąd porównania hasła:', err);
        return res.status(500).json({ message: 'Błąd porównania hasła' });
      }

      if (result) {
        req.session.userId = user.id;  // Zapisywanie userId w sesji

        db.query('SELECT * FROM posts WHERE user_id = ?', [user.id], (err, posts) => {
          if (err) {
            console.error('Błąd pobierania postów:', err);
            return res.status(500).json({ message: 'Błąd pobierania postów' });
          }

          res.json({
            message: 'Login successful',
            user: {
              username: user.username,
              age: user.age,
              gender: user.gender,
              is_banned: user.is_banned,
              email: user.email,
              profilePicture: user.profilePicture,
              posts: posts 
            },
          });
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
});

app.get('/api/posts', (req, res) => {
  const user_id = req.session.userId;

  if (!user_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query('SELECT * FROM posts WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania postów:', err);
      return res.status(500).json({ message: 'Błąd podczas pobierania postów z bazy danych' });
    }

    res.json(results);
  });
});

app.post('/api/posts', (req, res) => {
  const { route_id, content } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const post_date = new Date();

  db.query('INSERT INTO posts (user_id, route_id, post_date, content) VALUES (?, ?, ?, ?)', 
    [user_id, route_id, post_date, content], (err, result) => {
      if (err) {
        console.error('Błąd podczas dodawania postu:', err);
        return res.status(500).json({ message: 'Błąd podczas dodawania postu do bazy danych' });
      }

      res.json({ message: 'Post został dodany' });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
