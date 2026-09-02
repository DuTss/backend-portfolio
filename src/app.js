require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./db');

const app = express();

// --- Sécurité ---
//app.use(helmet());

// --- CORS GLOBAL (LA SEULE VERSION QUI MARCHE SUR VERCEL) ---
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// --- Middlewares globaux ---
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Erreur de connexion DB:", err);
    res.status(500).json({ error: "Erreur serveur / Base de données" });
  }
});
// --- Rate-limit contact ---
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Trop de tentatives, réessayez plus tard.' }
});

// --- Routes ---
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend OK' });
});

app.use('/api/image', require('../api/routes/image.routes'));
app.use('/api/auth', require('../api/routes/auth.routes'));
app.use('/api/contact', contactLimiter, require('../api/routes/contact.routes'));
app.use('/api/projects', require('../api/routes/projects.routes'));
app.use('/api/services', require('../api/routes/services.routes'));
app.use('/api/technologies', require('../api/routes/technology.routes'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
//app.use("/uploads", express.static("uploads")
  //,{
  // setHeaders: (res, filePath) => {
  //   // Permet à Angular de lire l'image depuis une autre origine
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  //   // Sécurité supplémentaire pour CORB/COEP
  //   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  //}
//);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// --- Erreurs globales ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
