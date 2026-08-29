const Project = require('../models/Project');
const fs      = require("fs");
const path    = require("path");
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
  console.log("===> LA ROUTE PROJECTS EST BIEN ATTEINTE ! <===")
  console.log("Nom de la DB active :", mongoose.connection.name); // <--- AJOUTE CECI
  // Liste toutes les collections existantes sur MongoDB Atlas
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections existantes :", collections.map(c => c.name));
  const projects = await Project.find().populate("tech");
  console.log("Nombre de projets :", projects.length);
  res.json(projects);
};

exports.getOne = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("tech");
  res.json(project);
};

exports.create = async (req, res) => {
  console.log("REQ BODY:", req.body); 
  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    tech: req.body.tech
  });

  const all = await Project.find();

  res.json(all);
};


exports.update = async (req, res) => {
  // 1. Récupérer l'ancien projet
  const old = await Project.findById(req.params.id);

  // 2. Si une nouvelle image est envoyée → supprimer l'ancienne
  if (req.body.image && req.body.image !== old.image) {
    const oldPath = path.join(__dirname, "../../..", old.image);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // 3. Mettre à jour le projet (ta logique actuelle)
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      tech: Array.isArray(req.body.tech)
        ? req.body.tech
        : req.body.tech.split(',').map(t => t.trim())
    },
    { returnDocument: 'after' }
  );

  // 4. Retourner tous les projets
  const all = await Project.find();
  res.json(all);
};

exports.delete = async (req, res) => {
  try {
    // 1. Récupérer le projet
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    // 2. Supprimer l'image associée si elle existe
    if (project.image) {
      const imagePath = path.join(__dirname, "../../..", project.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 3. Supprimer le projet
    await Project.findByIdAndDelete(req.params.id);

    // 4. Retourner tous les projets restants
    const all = await Project.find();
    res.json(all);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur suppression projet" });
  }
};
