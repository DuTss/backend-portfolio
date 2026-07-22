📘 README — Backend Node.js / Express / MongoDB
🚀 Présentation
Ce backend constitue l’API de mon portfolio professionnel.
Il est développé avec :

Node.js

Express

MongoDB + Mongoose

JWT pour l’authentification

Architecture MVC

Routes RESTful

Validation simple

Séparation claire des responsabilités

Il fournit toutes les fonctionnalités nécessaires au frontend Angular 21 :

Authentification (login / register)

CRUD Projets

CRUD Services

🛠️ Technologies utilisées
Backend
Node.js

Express

Mongoose

JSON Web Tokens (JWT)

bcrypt pour le hash des mots de passe

dotenv pour les variables d’environnement

CORS pour la communication avec le frontend

Base de données
MongoDB (Atlas ou local)

📂 Structure du projet
Code
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
🔐 Authentification JWT
Le backend inclut un système complet d’authentification :

Register
Création d’un utilisateur

Hash du mot de passe avec bcrypt

Vérification des doublons

Login
Vérification email + mot de passe

Génération d’un token JWT

Envoi du token au frontend

Middleware d’authentification
Vérifie la présence du token

Vérifie la validité du token

Protège les routes admin

🧩 Modèles Mongoose
User
js
email: String,
password: String
Project
js
title: String,
description: String,
image: String,
tech: [String],
createdAt: Date
Service
js
title: String,
description: String,
icon: String
🔧 Routes API
Auth
Code
POST /api/auth/register
POST /api/auth/login
Projects
Code
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
Services
Code
GET    /api/services
GET    /api/services/:id
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
📦 Installation
1. Cloner le projet
bash
git clone <url-du-repo>
cd backend
2. Installer les dépendances
bash
npm install
3. Configurer les variables d’environnement
Créer un fichier .env :

Code
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=ton_secret
4. Lancer le serveur
bash
npm start
Le backend démarre sur :

Code
http://localhost:3000
🗄️ Base de données
Le backend utilise MongoDB.
Tu peux utiliser :

MongoDB Atlas (cloud)

MongoDB local

La connexion est gérée dans config/db.js.

🔐 Sécurité
Hash des mots de passe (bcrypt)

Tokens JWT signés avec JWT_SECRET

Middleware de protection des routes admin

CORS configuré pour le frontend Angular

🧪 Tests (optionnel)
Tu peux ajouter Jest ou Vitest côté backend si tu veux.
Actuellement, le backend ne contient pas de tests automatisés.

📚 Ressources utiles
Express : https://expressjs.com

MongoDB : https://www.mongodb.com

Mongoose : https://mongoosejs.com

JWT : https://jwt.io

bcrypt : https://github.com/kelektiv/node.bcrypt.js (github.com in Bing)