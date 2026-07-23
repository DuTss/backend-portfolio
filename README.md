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

## 📬 Envoi d’email (Nodemailer)

Le backend inclut un système d’envoi d’email via **Nodemailer**, utilisé par le formulaire de contact du portfolio.

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
