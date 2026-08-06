const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // max 3 messages / minute
  message: { error: 'Trop de tentatives, réessayez plus tard.' }
});

require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

mongoose.connect('mongodb://localhost:27017/portfolio')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend OK' });
});

// 🔥 IMPORT ROUTE IMAGE
const imageRoutes = require('../api/routes/image.routes');

// 🔥 CONNEXION ROUTE IMAGE
app.use('/api/image', imageRoutes);

app.use('/api/auth', require('../api/routes/auth.routes'));
app.use('/api/contact', contactLimiter);
app.use('/api/contact', require('../api/routes/contact.routes'));
app.use('/api/projects', require('../api/routes/projects.routes'));
app.use('/api/services', require('../api/routes/services.routes'));
app.use("/api/technologies", require("../api/routes/technology.routes"));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
