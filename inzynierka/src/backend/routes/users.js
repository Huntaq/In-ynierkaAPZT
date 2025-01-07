const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();

//pobieranie danych zalogowanego usera / weryfikacja dostępu

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get basic user info and verify him
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: user id to fetch
 *         schema:
 *           type: string
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *       - name: sessionkey
 *         in: header
 *         required: true
 *         description: Session key 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID.
 *                   username:
 *                     type: string
 *                     description: UserName
 *                   is_banned:
 *                     type: boolean
 *                     description: Checks if the user is banned
 *                   profilePicture:
 *                     type: string
 *                     description: user's profile picture
 *                   session_key:
 *                     type: string
 *                     description: session key
 *       400:
 *         description: Id is required
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or no access
 *       404:
 *         description: User not found
 *       500:
 *         description: DB error
 */

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const token = req.headers['authorization']?.split(' ')[1];
  const sessionKey = req.headers['sessionkey'];

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }


    const sqlUser = 'SELECT id, username, is_banned, profilePicture, session_key FROM users WHERE id = ?';

    db.query(sqlUser, [id], (err, results) => {
      if (err) {
        console.error('query error', err);
        return res.status(500).json({ error: 'DB error' });
      }

      if (results.length > 0) {
        const user = results[0];

        if (user.session_key === sessionKey) {
          res.json(results);
        } else {
          res.status(403).json({ error: 'No access' });
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  });
});

/**
 * @swagger
 * /api/users/{id}/admin:
 *   get:
 *     summary: Get all users (Admin Access)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *       - name: sessionkey
 *         in: header
 *         required: true
 *         description: Session key
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID
 *                   username:
 *                     type: string
 *                     description: Username of the user
 *                   email:
 *                     type: string
 *                     description: Email of the user
 *                   age:
 *                     type: integer
 *                     description: Age of the user
 *                   gender:
 *                     type: string
 *                     description: Gender of the user
 *                   is_banned:
 *                     type: boolean
 *                     description: Whether the user is banned
 *                   email_notifications:
 *                     type: boolean
 *                     description: Whether the user has email notifications enabled
 *                   push_notifications:
 *                     type: boolean
 *                     description: Whether the user has push notifications enabled
 *       400:
 *         description: ID is required
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or no access
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */

//pobieranie danych o wszystkich userach dla admina
router.get('/:id/admin', (req, res) => {
  const id = req.params.id; 
  const token = req.headers['authorization']?.split(' ')[1];
  const sessionKey = req.headers['sessionkey']; 

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

  const sqlUser = 'SELECT id, session_key FROM users WHERE id = ?';

  db.query(sqlUser, [id], (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
     if (results.length > 0) {
      const user = results[0];

      if (user.session_key === sessionKey) {
        const sqlAllUsers = 'SELECT id, username, email, age, gender, is_banned, email_notifications, push_notifications FROM users';
        db.query(sqlAllUsers, (err, users) => {
          if (err) {
            console.error('query error', err);
            return res.status(500).json({ error: 'DB error' });
          }
          res.json(users);
        });
      } else {
        res.status(403).json({ error: 'No access' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
  });
});

/**
 * @swagger
 * /api/users/{id}/profile:
 *   get:
 *     summary: Get detailed user profile info
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *       - name: sessionkey
 *         in: header
 *         required: true
 *         description: Session key 
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID
 *                 age:
 *                   type: integer
 *                   description: Age of the user
 *                 gender:
 *                   type: string
 *                   description: Gender of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 email_notifications:
 *                   type: boolean
 *                   description: Whether the user has email notifications enabled
 *                 push_notifications:
 *                   type: boolean
 *                   description: Whether the user has push notifications enabled
 *                 is_banned:
 *                   type: boolean
 *                   description: Whether the user is banned
 *                 profilePicture:
 *                   type: string
 *                   description: URL of the user's profile picture
 *       400:
 *         description: ID is required
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or no access
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */

//pobieranie dokładniejszych danych profilu uzytkownika
router.get('/:id/profile', (req, res) => {
  const id = req.params.id;
  const token = req.headers['authorization']?.split(' ')[1];
  const sessionKey = req.headers['sessionkey'];

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }


  const sqlUser = 'SELECT id,age,gender,email, username,email_notifications,push_notifications, is_banned, profilePicture, session_key FROM users WHERE id = ?';

  db.query(sqlUser, [id], (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }

    if (results.length > 0) {
      const user = results[0];

      if (user.session_key === sessionKey) {
        res.json(results); 
      } else {
        res.status(403).json({ error: 'no access' });
      }
    } else {
      res.status(404).json({ error: 'user not found' });
    }
  });
  });
});

/**
 * @swagger
 * /api/users/{id}/routes_with_usernames:
 *   get:
 *     summary: Get global user statistics for rankings
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Global user statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user
 *                   CO2:
 *                     type: number
 *                     format: float
 *                     description: CO2 savings by the user
 *                   kcal:
 *                     type: number
 *                     format: float
 *                     description: Calories burned by the user
 *                   money:
 *                     type: number
 *                     format: float
 *                     description: Money saved by the user
 *                   username:
 *                     type: string
 *                     description: Username of the user
 *                   profilePicture:
 *                     type: string
 *                     description: URL of the user's profile picture
 *       400:
 *         description: ID is required
 *       401:
 *         description: Token is required
 *       500:
 *         description: Database error
 */

//pobieranie globanych statystyk userów do rankingu
router.get('/:id/routes_with_usernames', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'Id is required' });
  }

  const sql = `
    SELECT ur.user_id, ur.CO2, ur.kcal, ur.money, u.username  , u.profilePicture
    FROM user_routes ur
    JOIN users u ON ur.user_id = u.id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('query error', err);
      return res.status(500).json({ error: 'DB error' });
    }
    
    res.json(results);
  });
});

/**
 * @swagger
 * /api/users/{id}/routes:
 *   get:
 *     summary: Get user routes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the 
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User routes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Route ID
 *                   user_id:
 *                     type: integer
 *                     description: ID of the user 
 *                   route_name:
 *                     type: string
 *                     description: Name of the route
 *                   distance:
 *                     type: number
 *                     format: float
 *                     description: Distance of the route in kilometers
 *                   duration:
 *                     type: number
 *                     format: float
 *                     description: Duration of the route in minutes
 *                   CO2:
 *                     type: number
 *                     format: float
 *                     description: CO2 savings for the route
 *                   kcal:
 *                     type: number
 *                     format: float
 *                     description: Calories burned during the route
 *                   money:
 *                     type: number
 *                     format: float
 *                     description: Money saved by taking this route
 *       400:
 *         description: ID is required
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Database error
 */

//pobieranie tras usera
router.get('/:id/routes', (req, res) => {
  const userId = req.params.id;
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  if (!userId) {
    return res.status(400).json({ error: 'Id is required' });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

  const sql = 'SELECT * FROM user_routes WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Błąd zapytania:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(results);
  });
});
});

/**
 * @swagger
 * /api/users/{id}/notifications:
 *   put:
 *     summary: Update notification preferences
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user 
 *         schema:
 *           type: integer
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: AuthToken
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_notifications:
 *                 type: boolean
 *                 description: Whether email notifications are enabled
 *               push_notifications:
 *                 type: boolean
 *                 description: Whether push notifications are enabled
 *             required:
 *               - email_notifications
 *               - push_notifications
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *       400:
 *         description: Invalid input or ID is required
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Database error
 */

//zmienianie preferencji do otrzymywanych powiadomien w profilu
router.put('/:id/notifications', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  const { email_notifications, push_notifications } = req.body;
  const userId = req.params.id;

  try {
    
    const updateQuery = 'UPDATE users SET email_notifications = ?, push_notifications = ? WHERE id = ?';
    db.query(updateQuery, [email_notifications, push_notifications, userId], (err, result) => {
      if (err) {
        console.error('Błąd podczas aktualizacji ustawień:', err);
        return res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji ustawień.' });
      }
      
      if (result.affectedRows > 0) {
      } else {
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd podczas aktualizacji ustawień.' });
  }
});

module.exports = router;
