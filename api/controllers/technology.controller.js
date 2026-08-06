const Technology = require("../models/Technology");

// GET all technologies
exports.getTechnologies = async (req, res) => {
  try {
    const techs = await Technology.find().sort({ name: 1 });
    res.json(techs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST create new technology
exports.addTechnology = async (req, res) => {
  try {
    const { name, category, color, iconName, websiteUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Le nom est obligatoire" });
    }

    const exists = await Technology.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Technologie déjà existante" });
    }

    const tech = await Technology.create({
      name,
      category: category || "other",
      color: color || "#000000",
      iconName: iconName || "",
      websiteUrl: websiteUrl || "",
      isActive: true
    });

    res.json(tech);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT update technology
exports.updateTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Technology.findByIdAndUpdate(id, req.body, { new: true });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE technology
exports.deleteTechnology = async (req, res) => {
  const id = req.params.id;

  try {
    await Technology.findByIdAndDelete(id);

    // Nettoyage des projets
    await Project.updateMany(
      { tech: id },
      { $pull: { tech: id } }
    );

    res.json({ message: "Technologie supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression technologie" });
  }
};
