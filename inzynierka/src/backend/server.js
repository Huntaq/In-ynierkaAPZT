const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const profilePictureRoutes = require('./routes/profilePicture');
const rankingRouter = require('./routes/ranking');
const notificationRouter = require('./routes/notifications');
const eventRouter = require('./routes/event');
require('dotenv').config();


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes.router);
app.use('/api/users', userRoutes);
app.use('/api/profilePicture', profilePictureRoutes);
app.use('/api/ranking', rankingRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/event', eventRouter);
app.get('/api/protected', authRoutes.authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
