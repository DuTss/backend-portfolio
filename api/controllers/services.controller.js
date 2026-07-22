const Service = require('../models/Service');

exports.getAll = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

exports.getOne = async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.json(service);
};

exports.create = async (req, res) => {
  const service = await Service.create({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
  });

  const all = await Service.find();

  res.json(all);
};


exports.update = async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { returnDocument: 'after' }
  );

  const all = await Service.find();
  res.json(all);
};

exports.delete = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  const all = await Service.find();
  res.json(all);
  //res.json({ success: true });
};
