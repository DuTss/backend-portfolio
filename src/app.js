require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { connectDB } = require('./db');
//const uploadRoutes = require('./api/routes/upload.routes');

const app = express();

// --- Sécurité ---
app.use(
  helmet({
    contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "blob:",
      "*.vercel-insights.com",
      "*.vercel.com",
      "*.vercel.app",
      "*.infird.com"
    ],
    scriptSrcElem: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "blob:",
      "*.vercel-insights.com",
      "*.vercel.com",
      "*.vercel.app",
      "*.infird.com"
    ],
    imgSrc: ["'self'", "data:", "blob:", "*"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: [  "'self'",  "https://backend-portfolio-delta-one.vercel.app",  "http://localhost:3000",  "*"],
    fontSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    workerSrc: ["'self'", "blob:"],
    scriptSrcAttr: ["'unsafe-inline'"],
    upgradeInsecureRequests: [],
  }
}
,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


// --- CORS ---
app.use(cors({
    origin: [
    "http://localhost:4200",
    process.env.FRONTEND_URL,
    /\.vercel\.app$/,
    /\.vercel\.com$/
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  // origin: process.env.FRONTEND_URL,
  credentials: true
}));

// --- Middlewares globaux ---
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- Rate-limit contact ---
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Trop de tentatives, réessayez plus tard.' }
});

// --- Connexion MongoDB ---
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connecté à MongoDB'))
//   .catch(err => console.error('Erreur de connexion à MongoDB', err));
await connectDB(); // IMPORTANT

// --- Status ---
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend OK' });
});

// --- Routes ---
app.use('/api/image', require('../api/routes/image.routes'));
app.use('/api/auth', require('../api/routes/auth.routes'));
app.use('/api/contact', contactLimiter, require('../api/routes/contact.routes'));
app.use('/api/projects', require('../api/routes/projects.routes'));
app.use('/api/services', require('../api/routes/services.routes'));
app.use('/api/technologies', require('../api/routes/technology.routes'));

//app.use(uploadRoutes);
app.use("/uploads", express.static("uploads"));

// --- Middleware 404 ---
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

// --- Middleware global d'erreurs ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// // --- Lancement ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// Pour le développement local uniquement
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Serveur local lancé sur http://localhost:${PORT}`);
//   });
// }
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});

// 5. EXPORT OBLIGATOIRE POUR VERCEL
module.exports = app;
