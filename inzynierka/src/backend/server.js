const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); 
const profilePictureRoutes = require('./routes/profilePicture');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profilePicture', profilePictureRoutes);

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
