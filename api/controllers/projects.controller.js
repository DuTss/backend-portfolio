const Project = require('../models/Project');

exports.getAll = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

exports.getOne = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
};

exports.create = async (req, res) => {
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

  const all = await Project.find();
  res.json(all);
};

exports.delete = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  const all = await Project.find();
  res.json(all);
  //res.json({ success: true });
};
