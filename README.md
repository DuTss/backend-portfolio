# 📘 Backend — Portfolio API (Node.js / Express / MongoDB)

Backend de l’API de mon portfolio professionnel.  
Développé avec **Node.js**, **Express**, **MongoDB** et **JWT** pour l’authentification.

---

## 🚀 Présentation

Ce backend constitue l’API de mon portfolio professionnel.  
Il fournit toutes les fonctionnalités nécessaires au frontend Angular :

- 🔐 Authentification (login / register)
- 📁 CRUD Projets
- 🧩 CRUD Services

Architecture :

- 🧱 Architecture MVC
- 🌐 Routes RESTful
- ✅ Validation simple
- 🧹 Séparation claire des responsabilités

---

## 🛠️ Technologies utilisées

### 🔧 Backend

- Node.js  
- Express  
- Mongoose  
- JSON Web Tokens (JWT)  
- bcrypt (hash des mots de passe)  
- dotenv (variables d’environnement)  
- CORS (communication avec le frontend)

---

## 📂 Structure du projet

```text
backend/
 ├── api/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   ├── routes/
 │   └── utils/
 ├── src/
 │   └── app.js
 ├── node_modules/
 ├── .env
 ├── .gitignore
 ├── package-lock.json
 ├── package.json
 └── README.md
```

---

## 🔐 Authentification JWT

Le backend inclut un système complet d’authentification :

### 🧾 Register
- Création d’un utilisateur  
- Hash du mot de passe avec **bcrypt**  
- Vérification des doublons (email)

### 🔑 Login
- Vérification email + mot de passe  
- Génération d’un token **JWT**  
- Envoi du token au frontend

### 🛡️ Middleware d’authentification
- Vérifie la présence du token  
- Vérifie la validité du token  
- Protège les routes admin / protégées  

---

## 🧱 Middleware globaux

Le backend utilise plusieurs middlewares essentiels pour assurer la communication avec le frontend Angular et sécuriser l’API :

- `express.json()` — parse le JSON envoyé par le frontend  
- `express.urlencoded({ extended: true })` — support des formulaires  
- `CORS` — autorise les requêtes provenant du frontend Angular  
- `morgan` *(optionnel)* — logs HTTP pour le debug  
- `rate-limit` *(optionnel)* — limite le nombre de requêtes pour éviter le spam  
- `helmet` *(optionnel)* — sécurise les headers HTTP  

---

## 🧩 Modèles Mongoose

### 👤 User
```js
email: String,
password: String
```

### 📁 Project
```js
title: String,
description: String,
image: String,
tech: [String],
createdAt: Date
```

### 🧩 Service
```js
title: String,
description: String,
icon: String
```

### 🧪 Technology
```js
name: String,
category: String,
color: String,
iconName: String,
websiteUrl: String,
isActive: Boolean
```

---

## 🔧 Routes API

### 🔐 Auth
```http
POST /api/auth/register
POST /api/auth/login
```

### 📁 Projects
```http
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### 🧩 Services
```http
GET    /api/services
GET    /api/services/:id
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
```

### 🧪 Technologies
```http
GET    /api/technologies
POST   /api/technologies
PUT    /api/technologies/:id
DELETE /api/technologies/:id
```

## 🧠 Organisation des controllers

Chaque controller gère une ressource spécifique :

- `auth.controller.js` — login, register  
- `project.controller.js` — CRUD projets + gestion de l’upload d’image  
- `service.controller.js` — CRUD services  
- `technology.controller.js` — CRUD technologies  
- `contact.controller.js` — envoi d’email via Nodemailer  

---

## 🖼️ Upload d’images (Multer)

- Upload des images
- Stockage dans uploads/projects
- Vérification du type de fichier
- Suppression automatique lors du delete

```js
    if (project.image) {
      const imagePath = path.join(__dirname, "../../..", project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
```

L’upload des images utilise Multer avec les paramètres suivants :

- 📦 Dossier de stockage : `uploads/projects`
- 🖼️ Types acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`
- 📏 Taille max recommandée : 5 Mo
- 🔧 Middleware utilisé : `upload.single("image")`
- 🔗 Route concernée : `POST /api/projects`

Une vérification du type MIME est effectuée pour éviter les fichiers non autorisés.


---

## 📬 Envoi d’email (Nodemailer)

Le backend inclut un système d’envoi d’email via **Nodemailer**, utilisé par le formulaire de contact du portfolio.

L’email envoyé par le backend utilise :

- Format : **HTML** pour une meilleure lisibilité  
- Expéditeur : `"Portfolio" <MAIL_USER>`  
- Destinataire : `MAIL_TO`  
- Sécurité : connexion SMTP sécurisée (SSL/TLS)  
- Gestion des erreurs : réponse JSON + log serveur  

En cas d’erreur SMTP, une réponse `500` est renvoyée au frontend.


### ✉️ Fonctionnalités
- Envoi d’un email vers l’adresse professionnelle
- Validation des données reçues
- Gestion des erreurs SMTP
- Protection anti‑spam côté frontend (honeypot + rate‑limit)

### ⚙️ Configuration

Ajouter les variables SMTP dans `.env` :

MAIL_HOST=smtp.gmail.com  
MAIL_PORT=465  
MAIL_SECURE=true  
MAIL_USER=ton_email@gmail.com  
MAIL_PASS=mot_de_passe_application  
MAIL_TO=emduthy@gmail.com  

> Pour Gmail, un **mot de passe d’application** est obligatoire.

### 🔧 Exemple d’implémentation

import nodemailer from 'nodemailer';

export const sendMail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message depuis le portfolio</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Email envoyé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l’envoi de l’email.' });
  }
};

### 🔗 Route API

POST /api/contact  

Payload attendu :

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Bonjour, j’aimerais discuter d’un projet."
}

### 🛡️ Sécurité email
- SMTP sécurisé (SSL/TLS)
- Validation des champs côté backend
- Honeypot côté frontend
- Limitation des envois (rate‑limit)

---

## ⚠️ Gestion des erreurs

Le backend renvoie des réponses JSON cohérentes pour toutes les routes :

- **200** — succès  
- **201** — ressource créée  
- **400** — données invalides  
- **401** — non autorisé (token manquant ou invalide)  
- **404** — ressource introuvable  
- **500** — erreur interne du serveur  

Toutes les opérations critiques sont encapsulées dans des `try/catch` pour éviter les crashs.


---

## 📦 Installation

### 1️⃣ Cloner le projet
```bash
git clone <url-du-repo>
cd backend
```

### 2️⃣ Installer les dépendances
```bash
npm install
```

---

## ⚙️ Configuration

Créer un fichier `.env` à la racine :

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=ton_secret
```

## ⚙️ Variables d’environnement supplémentaires

En plus des variables déjà présentes, il est recommandé d’ajouter :

FRONTEND_URL=http://localhost:4200  
NODE_ENV=development  

Optionnel :
UPLOAD_DIR=uploads/projects 

---

## ▶️ Lancer le serveur
```bash
npm start
```

Le backend démarre sur :

```
http://localhost:3000
```

---

## 🗄️ Base de données

Le backend utilise **MongoDB**.  
La connexion est gérée dans `config/db.js`.

Compatible avec :

- ☁️ MongoDB Atlas  
- 💻 MongoDB local  

---

## 🛡️ Sécurité

- Hash des mots de passe (**bcrypt**)  
- Tokens JWT signés avec `JWT_SECRET`  
- Middleware de protection des routes admin  
- CORS configuré pour le frontend Angular  

---

## 📚 Ressources utiles

- Express : https://expressjs.com  
- MongoDB : https://www.mongodb.com  
- Mongoose : https://mongoosejs.com  
- JWT : https://jwt.io  
- bcrypt : https://github.com/kelektiv/node.bcrypt.js
