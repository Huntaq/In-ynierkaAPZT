// server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const profilePictureRoutes = require('./routes/profilePicture');
require('dotenv').config();


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes.router); // Używamy routera z auth.js
app.use('/api/users', userRoutes);
app.use('/api/profilePicture', profilePictureRoutes);

// Przykład użycia middleware do zabezpieczenia trasy
app.get('/api/protected', authRoutes.authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
