const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig');

const app = express();
const port = 5000;
const baseURL = 'http://192.168.56.1';
const port1 = 80
const crypto = require('crypto');
const nodemailer = require('nodemailer');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



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

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns session details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Database error
 */


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
        req.session.userId = user.id; 

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
            email_notifications: user.email_notifications,
            push_notifications: user.push_notifications,
            posts: [], 
          },
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
});

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get user posts
 *     description: Retrieves all posts for the logged-in user.
 *     responses:
 *       200:
 *         description: Successfully retrieved posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   route_id:
 *                     type: integer
 *                   content:
 *                     type: string
 *       401:
 *         description: Unauthorized. User is not logged in.
 *       500:
 *         description: Error fetching posts.
 */

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

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Add a new post
 *     description: Adds a new post for the logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route_id:
 *                 type: integer
 *               content:
 *                 type: string
 *             required:
 *               - route_id
 *               - content
 *     responses:
 *       200:
 *         description: Successfully added post.
 *       401:
 *         description: Unauthorized. User is not logged in.
 *       500:
 *         description: Error adding post.
 */
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
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [F, M]
 *               emailNotification:
 *                 type: boolean
 *               pushNotification:
 *                 type: boolean
 *             required:
 *               - username
 *               - password
 *               - email
 *               - age
 *               - gender
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error or missing fields.
 *       409:
 *         description: Conflict. Username or email already exists.
 *       500:
 *         description: Database error.
 */

app.post('/api/register', (req, res) => {
  const { username, password, email, age, gender, emailNotification, pushNotification } = req.body;

  // Validate gender
  if (!['F', 'M'].includes(gender)) {
    return res.status(400).json({ message: 'Invalid gender value' });
  }

  // Validate age
  const ageInt = parseInt(age, 10);
  if (!username || !password || !email || isNaN(ageInt) || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a lowercase letter, an uppercase letter, a number, and a special character' });
  }

  // Check for existing username or email
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

      db.query(
        'INSERT INTO users (username, password_hash, email, age, gender, email_notifications, push_notifications) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, hash, email, ageInt, gender, emailNotification ? 1 : 0, pushNotification ? 1 : 0],
        (err, result) => {
          if (err) {
            console.error('Error adding user to database:', err);
            return res.status(500).json({ message: 'Error adding user to database' });
          }

          res.json({ message: 'User registered successfully' });
        }
      );
    });
  });
});

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Fetch all events
 *     description: Retrieves all events from the database and adds full image URLs to the results.
 *     responses:
 *       200:
 *         description: Successfully retrieved events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the event.
 *                   name:
 *                     type: string
 *                     description: The name of the event.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the event.
 *                   image:
 *                     type: string
 *                     nullable: true
 *                     description: The full URL of the event image.
 *       500:
 *         description: Error fetching events from database.
 */

app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events';
  const baseURL = req.protocol + '://' + req.get('host'); // Pobieramy pełny URL (z protokołem i hostem)
  const port1 = process.env.PORT || 3000; // Użyj portu aplikacji

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Error fetching events from database' });
    }

    // Dodaj pełny URL do obrazów
    const eventsWithFullImagePath = results.map((event) => {
      const fullImagePath = event.image ? `${baseURL}:${port1}/uploads/${event.image}` : null; // Ścieżka do obrazu w folderze 'uploads'
      console.log(`Generated image path for event ID ${event.id}: ${fullImagePath}`);
      return {
        ...event,
        image: fullImagePath,
      };
    });

    res.json(eventsWithFullImagePath);
  });
});




/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Get friends
 *     description: Retrieves a list of accepted friends for the logged-in user.
 *     responses:
 *       200:
 *         description: Successfully retrieved friends.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friends retrieved successfully
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       friends_id:
 *                         type: integer
 *                       friends_user_id:
 *                         type: integer
 *                       friends_friend_id:
 *                         type: integer
 *                       friends_status:
 *                         type: string
 *                       friends_created_at:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                       is_Admin:
 *                         type: boolean
 *       401:
 *         description: Unauthorized. User is not logged in.
 *       500:
 *         description: Database error.
 */

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


/**
 * @swagger
 * /api/friends_pending:
 *   get:
 *     summary: Get pending friend requests
 *     description: Retrieves a list of pending friend requests for the logged-in user.
 *     responses:
 *       200:
 *         description: Successfully retrieved pending friend requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friends Pending retrieved successfully
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       friends_id:
 *                         type: integer
 *                       friends_user_id:
 *                         type: integer
 *                       friends_friend_id:
 *                         type: integer
 *                       friends_status:
 *                         type: string
 *                       friends_created_at:
 *                         type: string
 *                         format: date-time
 *                       user_id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       profilePicture:
 *                         type: string
 *                         nullable: true
 *                       is_Admin:
 *                         type: boolean
 *       401:
 *         description: Unauthorized. User is not logged in.
 *       500:
 *         description: Database error.
 */

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
  const { id } = req.params; 

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID in session' });
  }

  
  console.log('Delete Request:', { userId, id });

  
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

    console.log('Relationship Found:', results);

    
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

  // Check if the friend already exists in the database
  const checkQuery = "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?";
  db.query(checkQuery, [user_id, friend_id], (err, result) => {
    if (err) {
      console.error('Error checking friend existence:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length > 0) {
      // If the friend already exists, return an error response
      return res.status(400).json({ message: 'User already added' });
    }

    // Add a new friend entry to the database with a 'pending' status
    const insertQuery = "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending')";
    db.query(insertQuery, [user_id, friend_id], (err, result) => {
      if (err) {
        console.error('Error adding friend to the database:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      return res.status(200).json({ message: 'Friend added successfully' });
    });
  });
});




app.get('/api/notifications', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  db.query('SELECT push_notifications FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking user preferences:', err);
      return res.status(500).json({ message: 'Error fetching user preferences' });
    }

    if (results.length === 0 || results[0].push_notifications === 0) {
      return res.status(403).json({ message: 'Push notifications are disabled' });
    }

    db.query('SELECT * FROM notifications_popup', (err, notifications) => {
      if (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ message: 'Error fetching notifications from the database' });
      }

      res.json(notifications);
    });
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
    routeCoordinates,
    content,
  } = req.body;

  if (
    !user_id ||
    !transport_mode_id ||
    typeof distance_km !== 'number' ||
    typeof CO2 !== 'number' ||
    typeof kcal !== 'number' ||
    !duration ||
    typeof money !== 'number' ||
    typeof is_private === 'undefined' ||
    !Array.isArray(routeCoordinates) ||
    !routeCoordinates.every(
      (coord) =>
        typeof coord === 'object' &&
        typeof coord.latitude === 'number' &&
        typeof coord.longitude === 'number'
    )
  ) {
    console.error('Validation failed. Received data:', req.body);
    return res.status(400).json({ message: 'All fields are required and must be of the correct type' });
  }

  db.query(
    'INSERT INTO user_routes (user_id, transport_mode_id, distance_km, CO2, kcal, duration, money, is_private, route_coordinates, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      user_id,
      transport_mode_id,
      distance_km,
      CO2,
      kcal,
      duration,
      money,
      is_private ? 1 : 0,
      JSON.stringify(routeCoordinates),
      content || null,
    ],
    (err, result) => {
      if (err) {
        console.error('Error adding route to the database:', err);
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

  const baseURL = process.env.BASE_URL || 'http://192.168.56.1';
  const port1 = process.env.PORT || 80;

  // SQL query to fetch user routes and friends' routes
  const query = `
    SELECT 
      ur.id,
      ur.user_id,
      ur.transport_mode_id,
      ur.distance_km,
      ur.date,
      ur.CO2,
      ur.kcal,
      ur.duration,
      ur.money,
      ur.is_private,
      ur.route_coordinates,
      ur.content,
      u.username,
      CONCAT('${baseURL}:${port1}', u.profilePicture) AS profilePicture
    FROM user_routes ur
    LEFT JOIN users u ON ur.user_id = u.id
    WHERE 
      (ur.user_id = ? OR 
       (ur.user_id IN (
          SELECT 
            CASE 
              WHEN f.user_id = ? THEN f.friend_id 
              ELSE f.user_id 
            END 
          FROM friends f
          WHERE 
            (f.user_id = ? OR f.friend_id = ?) 
            AND f.status = 'accepted'
        ) AND ur.is_private = 1)
      )
      AND ur.route_coordinates IS NOT NULL
    ORDER BY ur.date DESC
  `;

  // Execute query
  db.query(query, [userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching user and friend routes:', err);
      return res.status(500).json({ message: 'Error fetching routes from database' });
    }

    // Parse route_coordinates (convert JSON string to object)
    const parsedResults = results.map(route => ({
      ...route,
      route_coordinates: route.route_coordinates
        ? JSON.parse(route.route_coordinates)
        : [],
      profilePicture: route.profilePicture || `${baseURL}:${port1}/uploads/default_profile.png`, // Default profile picture
    }));

    res.json(parsedResults);
  });
});






app.get('/api/comments/:postId', (req, res) => {
  const { postId } = req.params;
  const baseURL = process.env.BASE_URL || 'http://192.168.56.1';
  const port1 = process.env.PORT || 80;

  const query = `
    SELECT 
      comments.id AS comment_id, 
      comments.post_id, 
      comments.user_id, 
      comments.comment_date, 
      comments.comment_text,
      COALESCE(users.username, 'Unknown User') AS username,
      CONCAT('${baseURL}:${port1}', COALESCE(users.profilePicture, '/uploads/default_profile.png')) AS profilePicture
    FROM 
      comments
    LEFT JOIN 
      users
    ON 
      comments.user_id = users.id
    WHERE 
      comments.post_id = ?
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).json({ message: 'Error fetching comments from database' });
    }

    res.json(results);
  });
});




app.post('/api/comments_add/:postId', (req, res) => {
  const { postId } = req.params; // Get the post_id (route_id) from the URL
  const { user_id, comment_text } = req.body; // Get user_id and comment_text from the request body

  // Validate required fields
  if (!user_id || !comment_text) {
    return res.status(400).json({ message: 'Missing required fields: user_id or comment_text' });
  }

  const query = `
    INSERT INTO comments (post_id, user_id, comment_date, comment_text)
    VALUES (?, ?, NOW(), ?)
  `;

  db.query(query, [postId, user_id, comment_text], (err, result) => {
    if (err) {
      console.error('Error inserting comment:', err);
      return res.status(500).json({ message: 'Error adding comment to database' });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment_id: result.insertId, 
    });
  });
});






app.delete('/api/user_delete', (req, res) => { 
  const userId = req.session.userId; 
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' }); 
  }

  
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err); 
      return res.status(500).json({ message: 'Error deleting user' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' }); 
  });
});


app.post('/api/updateEmailNotifications', (req, res) => {
  const { userId, emailNotifications } = req.body;

  if (!userId || emailNotifications === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const query = `
      UPDATE users 
      SET email_notifications = ?
      WHERE id = ?
  `;

  db.query(
      query, 
      [emailNotifications ? 1 : 0, userId],
      (err, result) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ success: false, message: 'Database error' });
          }

          res.json({ success: true, message: 'Email notifications updated successfully' });
      }
  );
});

app.post('/api/updatePushNotifications', (req, res) => {
  const { userId, pushNotifications } = req.body;

  if (!userId || pushNotifications === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const query = `
      UPDATE users 
      SET push_notifications = ?
      WHERE id = ?
  `;

  db.query(
      query, 
      [pushNotifications ? 1 : 0, userId],
      (err, result) => {
          if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ success: false, message: 'Database error' });
          }

          res.json({ success: true, message: 'Push notifications updated successfully' });
      }
  );
});




app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minut

    db.query(
      'UPDATE users SET reset_otp = ?, reset_expiry = ? WHERE email = ?',
      [otp, expiry, email],
      (err) => {
        if (err) {
          console.error('Error saving OTP:', err);
          return res.status(500).json({ message: 'Error saving OTP' });
        }

       
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'jhenschelkontakt@gmail.com', 
            pass: 'nhwxdrknovsuzrtg',  
          },
        });

        const mailOptions = {
          from: 'jhenschelkontakt@gmail.com',
          to: email,
          subject: 'Your OTP for password reset',
          text: `Your OTP is ${otp}. This code is valid for 15 minutes.`,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ message: 'Error sending email' });
          }

          res.status(200).json({ message: 'OTP sent successfully' });
        });
      }
    );
  });
});
app.post('/api/reset_password', (req, res) => {
  const { resetEmail, otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Deklaracja zmiennej currentTime
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formatowanie bieżącego czasu

  console.log('Current Time:', currentTime); // Logowanie bieżącego czasu

  // Zapytanie do bazy danych
  db.query(
    'SELECT * FROM users WHERE email = ? AND reset_otp = ? AND reset_expiry > ?',
    [resetEmail, otp, currentTime],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      // Sprawdzenie, czy zapytanie zwróciło jakiekolwiek wyniki
      if (!results || results.length === 0) {
        console.log('No matching records found or OTP expired');
        console.log('Query parameters: ', { resetEmail, otp, currentTime }); // Logowanie parametrów zapytania
        return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
      }

      // Logowanie wyników
      console.log('Results from database:', results);

      // Haszowanie nowego hasła
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Error hashing password' });
        }

        // Aktualizacja hasła w bazie danych
        db.query(
          'UPDATE users SET password_hash = ?, reset_otp = NULL, reset_expiry = NULL WHERE email = ?',
          [hashedPassword, resetEmail],
          (err) => {
            if (err) {
              console.error('Error updating password:', err);
              return res.status(500).json({ message: 'Error updating password' });
            }

            console.log('Password reset successfully for:', resetEmail);
            res.status(200).json({ message: 'Password reset successfully' });
          }
        );
      });
    }
  );
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});