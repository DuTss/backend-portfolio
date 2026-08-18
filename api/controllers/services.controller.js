const Service = require('../models/Service');
const mongoose = require('mongoose');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function shortFromDescription(desc, max = 150) {
  if (!desc) return '';
  const trimmed = desc.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : max) + '…';
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let i = 0;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Service.findOne(query).lean();
    if (!exists) return slug;
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
}

exports.getAll = async (req, res) => {
  try {
    const services = await Service.find().lean();
    return res.status(200).json(services);
  } catch (err) {
    console.error('Service getAll error:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des services.' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    const service = await Service.findById(id).lean();
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });
    return res.status(200).json(service);
  } catch (err) {
    console.error('Service getOne error:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du service.' });
  }
};

exports.create = async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.title || !String(body.title).trim()) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    // Normalisation bullets
    let bullets = [];
    if (Array.isArray(body.bullets)) bullets = body.bullets.map(String).slice(0, 6);
    else if (typeof body.bullets === 'string' && body.bullets.trim()) {
      bullets = body.bullets.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean).slice(0, 6);
    }

    // Slug
    const baseSlug = body.slug ? slugify(body.slug) : slugify(body.title);
    const slug = baseSlug ? await ensureUniqueSlug(baseSlug) : undefined;

    const serviceData = {
      title: String(body.title).trim(),
      slug,
      description: body.description || '',
      shortDescription: body.shortDescription || shortFromDescription(body.description),
      bullets,
      price: body.price || '',
      duration: body.duration || '',
      icon: body.icon || '',
      image: body.image || '',
      tags: Array.isArray(body.tags) ? body.tags.map(String) : (body.tags ? [String(body.tags)] : []),
      visible: typeof body.visible === 'boolean' ? body.visible : true
    };

    await Service.create(serviceData);
    const all = await Service.find().lean();
    return res.status(201).json(all);
  } catch (err) {
    console.error('Service create error:', err);

    // Duplicate key (slug) handling
    if (err && (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000))) {
      return res.status(409).json({ message: 'Conflit : slug déjà utilisé', details: err.keyValue || null });
    }

    // Validation errors
    if (err && err.name === 'ValidationError') {
      const errors = Object.keys(err.errors || {}).reduce((acc, k) => {
        acc[k] = err.errors[k].message;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Erreur de validation', errors });
    }

    return res.status(500).json({ message: 'Erreur serveur lors de la création du service.', detail: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const body = req.body || {};
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Normalisation bullets
    let bullets;
    if (body.bullets !== undefined) {
      if (Array.isArray(body.bullets)) bullets = body.bullets.map(String).slice(0, 6);
      else if (typeof body.bullets === 'string' && body.bullets.trim()) {
        bullets = body.bullets.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean).slice(0, 6);
      } else bullets = [];
    }

    // Slug logic
    let slug;
    if (body.slug) {
      slug = slugify(body.slug);
      slug = await ensureUniqueSlug(slug, id);
    } else if (body.title) {
      const base = slugify(body.title);
      slug = await ensureUniqueSlug(base, id);
    }

    const updateData = {
      ...body,
      ...(bullets !== undefined ? { bullets } : {}),
      ...(slug ? { slug } : {}),
      shortDescription: body.shortDescription !== undefined ? body.shortDescription : undefined,
      tags: body.tags !== undefined ? (Array.isArray(body.tags) ? body.tags.map(String) : [String(body.tags)]) : undefined,
      visible: typeof body.visible === 'boolean' ? body.visible : undefined
    };

    // Remove undefined keys to avoid overwriting with undefined
    Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!service) return res.status(404).json({ message: 'Service non trouvé' });

    const all = await Service.find().lean();
    return res.status(200).json(all);
  } catch (err) {
    console.error('Service update error:', err);

    if (err && (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000))) {
      return res.status(409).json({ message: 'Conflit : slug déjà utilisé', details: err.keyValue || null });
    }

    if (err && err.name === 'ValidationError') {
      const errors = Object.keys(err.errors || {}).reduce((acc, k) => {
        acc[k] = err.errors[k].message;
        return acc;
      }, {});
      return res.status(400).json({ message: 'Erreur de validation', errors });
    }

    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du service.', detail: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    await Service.findByIdAndDelete(id);
    const all = await Service.find().lean();
    return res.status(200).json(all);
  } catch (err) {
    console.error('Service delete error:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du service.' });
  }
};
