const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');


const app = express();
const port = 5000;
const baseURL = 'http://192.168.56.1';
const port1 = 80


app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());




const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inzynierka'
});

app.use(session({
  secret: '213314', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profilePictures/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.session.userId; 
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}${ext}`); 
  }
});


const upload = multer({ storage: storage });


app.post('/api/uploadProfilePicture', upload.single('profilePicture'), (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const profilePicturePath = `/uploads/profilePictures/${req.file.filename}`;

  
  db.query(
    'UPDATE users SET profilePicture = ? WHERE id = ?',
    [profilePicturePath, userId],
    (err, result) => {
      if (err) {
        console.error('Error updating profile picture in database:', err);
        return res.status(500).json({ message: 'Error updating profile picture' });
      }

      res.json({
        message: 'Profile picture updated successfully',
        profilePicture: profilePicturePath
      });
    }
  );
});










app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Check if the user is banned
    if (user.is_banned) {
      return res.status(403).json({
        message: 'Your account is banned. Please contact support for assistance.',
      });
    }

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (result) {
        req.session.userId = user.id; // Set the user ID in the session

        res.json({
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            age: user.age,
            gender: user.gender,
            is_banned: user.is_banned,
            email: user.email,
            profilePicture: user.profilePicture
              ? `${baseURL}:${port1}${user.profilePicture}`
              : null,
            posts: [], // Placeholder for user's posts
          },
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
});


app.get('/api/posts', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ message: 'Error fetching posts from database' });
    }

    res.json(results);
  });
});


app.post('/api/posts', (req, res) => {
  const { route_id, content } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query('INSERT INTO posts (user_id, route_id, content) VALUES (?, ?, ?)', 
    [userId, route_id, content], (err, result) => {
      if (err) {
        console.error('Error adding post:', err);
        return res.status(500).json({ message: 'Error adding post to the database' });
      }

      res.json({ message: 'Post added successfully' });
  });
});

app.post('/api/register', (req, res) => {
  const { username, password, email, age, gender } = req.body;

  
  if (!['F', 'M'].includes(gender)) {
    return res.status(400).json({ message: 'Invalid gender value' });
  }

  
  const ageInt = parseInt(age, 10);
  if (!username || !password || !email || isNaN(ageInt) || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a lowercase letter, an uppercase letter, a number, and a special character' });
  }


  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      
      const existingUser = results[0];
      let conflictMessage = '';
      if (existingUser.username === username && existingUser.email === email) {
        conflictMessage = 'Both username and email are already taken';
      } else if (existingUser.username === username) {
        conflictMessage = 'Username is already taken';
      } else if (existingUser.email === email) {
        conflictMessage = 'Email is already taken';
      }

      return res.status(409).json({ message: conflictMessage });
    }


    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Password hashing error:', err);
        return res.status(500).json({ message: 'Error hashing password' });
      }

      
      db.query('INSERT INTO users (username, password_hash, email, age, gender) VALUES (?, ?, ?, ?, ?)', 
        [username, hash, email, ageInt, gender], (err, result) => {
          if (err) {
            console.error('Error adding user to database:', err);
            return res.status(500).json({ message: 'Error adding user to database' });
          }

          res.json({ message: 'User registered successfully' });
      });
    });
  });
});


app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Error fetching events from database' });
    }

   
    res.json(results);
  });
});

app.get('/api/friends', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID in session' });
  }

  
  const query1 = `
    SELECT 
      friends.id AS friends_id, 
      friends.user_id AS friends_user_id, 
      friends.friend_id AS friends_friend_id, 
      friends.status AS friends_status,
      friends.created_at AS friends_created_at,
      users.id AS user_id,
      users.username,
      users.profilePicture,
      users.is_Admin 
    FROM friends 
    JOIN users ON friends.friend_id = users.id
    WHERE friends.user_id = ? AND friends.status = 'accepted';
  `;

  
  const query2 = `
    SELECT 
      friends.id AS friends_id, 
      friends.user_id AS friends_user_id, 
      friends.friend_id AS friends_friend_id, 
      friends.status AS friends_status,
      friends.created_at AS friends_created_at,
      users.id AS user_id,
      users.username,
      users.profilePicture,
      users.is_Admin 
    FROM friends 
    JOIN users ON friends.user_id = users.id
    WHERE friends.friend_id = ? AND friends.status = 'accepted';
  `;

  
  db.query(query1, [userId], (err, results1) => {
    if (err) {
      console.error('Error querying the database (query1):', err);
      return res.status(500).json({ message: 'Error querying the database' });
    }

    
    db.query(query2, [userId], (err, results2) => {
      if (err) {
        console.error('Error querying the database (query2):', err);
        return res.status(500).json({ message: 'Error querying the database' });
      }

      
      const allFriends = [...results1, ...results2];

      return res.status(200).json({ message: 'Friends retrieved successfully', results: allFriends });
    });
  });
});

app.get('/api/friends_pending', (req, res) => {
  const userId = req.session.userId;
  console.log("User ID from session:", userId);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID in session' });
  }

  const query = `
    SELECT 
      friends.id AS friends_id, 
      friends.user_id AS friends_user_id, 
      friends.friend_id AS friends_friend_id, 
      friends.status AS friends_status,
      friends.created_at AS friends_created_at,
      users.id AS user_id,
      users.username,
      users.profilePicture,
      users.is_Admin 
    FROM friends 
    JOIN users ON friends.user_id = users.id
    WHERE friends.friend_id = ? AND friends.status = 'pending';
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Error querying the database' });
    }

    return res.status(200).json({ message: 'Friends Pending retrieved successfully', results });
  });
});

app.post('/api/friends_accept', (req, res) => {
  const userId = req.session.userId;
  const { friendId } = req.body; 

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID in session' });
  }

  if (!friendId) {
    return res.status(400).json({ message: 'Bad Request: Friend ID is required' });
  }

  const query = "UPDATE friends SET status = 'accepted' WHERE id = ? AND status = 'pending'";
  db.query(query, [friendId], (err, result) => {
    if (err) {
      console.error('Error updating status in the database:', err);
      return res.status(500).json({ message: 'Error updating status in the database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No pending friend request found with the given ID' });
    }

    return res.status(200).json({ message: 'Friend request accepted successfully' });
  });
});

app.delete('/api/friends/:id', (req, res) => {
  const userId = req.session.userId;
  const { id } = req.params; // Treat `id` as the `friend_id` to match against the `id` column in the database

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID in session' });
  }

  // Log the delete request details
  console.log('Delete Request:', { userId, id });

  // Query to check if the relationship exists by the `id` column
  const checkQuery = `
    SELECT * FROM friends
    WHERE id = ?
  `;

  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking friend relationship:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching friend found' });
    }

    // Log the results from the check
    console.log('Relationship Found:', results);

    // Proceed to delete the row using the `id` column
    const deleteQuery = `
      DELETE FROM friends
      WHERE id = ?
    `;

    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Error deleting friend from database:', err);
        return res.status(500).json({ message: 'Error deleting friend' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No matching friend found' });
      }

      // Log successful deletion
      console.log('Deletion Successful:', result);

      res.status(200).json({ message: 'Friend removed successfully' });
    });
  });
});


app.post('/api/search_friend', (req, res) => {
  const searchUsername = req.body.username; 
  const query = "SELECT id, username, profilePicture FROM users ";

  db.query(query, [`%${searchUsername}%`], (err, result) => {
    if (err) {
      console.error('Error fetching friend from database:', err);
      return res.status(500).json({ message: 'Error searching friend' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No matching friend found' });
    }

    return res.status(200).json({ friends: result });
  });
});


app.post('/api/friend_add', (req, res) => {
  const { user_id, friend_id } = req.body;

  
  const checkQuery = "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?";
  db.query(checkQuery, [user_id, friend_id], (err, result) => {
    if (err) {
      console.error('Błąd przy sprawdzaniu istnienia znajomego:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (result.length > 0) {
      
      return res.status(400).json({ message: 'Ten znajomy jest już dodany' });
    }

    
    const insertQuery = "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending')";
    db.query(insertQuery, [user_id, friend_id], (err, result) => {
      if (err) {
        console.error('Błąd przy dodawaniu znajomego do bazy danych:', err);
        return res.status(500).json({ message: 'Błąd serwera' });
      }
      return res.status(200).json({ message: 'Znajomy dodany pomyślnie' });
    });
  });
});



app.get('/api/notifications', (req, res) => {
  const userId = req.session.userId;

 

  
  db.query('SELECT * FROM notifications_popup', (err, results) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ message: 'Error fetching notifications from the database' });
    }

    res.json(results);
  });
});


app.post('/api/routes', (req, res) => {
  const {
    user_id,
    transport_mode_id,
    distance_km,
    CO2,
    kcal,
    duration,
    money,
    is_private,
    routeCoordinates, // Dodanie współrzędnych
  } = req.body;

  if (
    !user_id ||
    !transport_mode_id ||
    typeof distance_km === 'undefined' ||
    typeof CO2 === 'undefined' ||
    typeof kcal === 'undefined' ||
    !duration ||
    typeof money === 'undefined' ||
    typeof is_private === 'undefined' ||
    !Array.isArray(routeCoordinates) // Sprawdzanie, czy współrzędne to tablica
  ) {
    return res.status(400).json({ message: 'All fields, including route coordinates, are required' });
  }

  db.query(
    'INSERT INTO user_routes (user_id, transport_mode_id, distance_km, CO2, kcal, duration, money, is_private, route_coordinates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      user_id,
      transport_mode_id,
      distance_km,
      CO2,
      kcal,
      duration,
      money,
      is_private,
      JSON.stringify(routeCoordinates), // Zapis współrzędnych jako JSON
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding route:', err);
        return res.status(500).json({ message: 'Error adding route to the database' });
      }

      res.status(201).json({ message: 'Route added successfully', routeId: result.insertId });
    }
  );
});



app.get('/api/user_routes', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query('SELECT * FROM user_routes WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user routes:', err);
      return res.status(500).json({ message: 'Error fetching routes from database' });
    }

    res.json(results);
  });
});






app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});