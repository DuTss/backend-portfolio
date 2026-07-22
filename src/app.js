const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/portfolio')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.get('/api/status', (req, res) => {
  
  res.json({ message: 'Backend OK' });
});;

app.use('/api/auth', require('../api/routes/auth.routes'));
app.use('/api/projects', require('../api/routes/projects.routes'));
app.use('/api/services', require('../api/routes/services.routes'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));