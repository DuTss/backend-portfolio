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

### 🗄️ Base de données

- MongoDB (Atlas ou local)

---

## 📂 Structure du projet

```text
backend/
 ├── controllers/
 │     ├── auth.controller.js
 │     ├── projects.controller.js
 │     └── services.controller.js
 ├── models/
 │     ├── User.js
 │     ├── Project.js
 │     └── Service.js
 ├── routes/
 │     ├── auth.routes.js
 │     ├── projects.routes.js
 │     └── services.routes.js
 ├── middleware/
 │     └── auth.middleware.js
 ├── config/
 │     └── db.js
 ├── server.js
 └── .env
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
