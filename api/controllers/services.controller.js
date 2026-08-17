// controllers/serviceController.js
const Service = require('../models/Service');
const mongoose = require('mongoose');

function slugify(text) {
  return text.toString().toLowerCase()
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
  const services = await Service.find();
  res.json(services);
};

exports.getOne = async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.json(service);
};

exports.create = async (req, res) => {
  const body = req.body || {};

  // Normalisation bullets
  let bullets = [];
  if (Array.isArray(body.bullets)) bullets = body.bullets.map(String).slice(0, 6);
  else if (typeof body.bullets === 'string' && body.bullets.trim()) {
    // support "line1\nline2" or comma separated
    bullets = body.bullets.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean).slice(0, 6);
  }

  // Slug
  const baseSlug = body.slug ? slugify(body.slug) : (body.title ? slugify(body.title) : null);
  const slug = baseSlug ? await ensureUniqueSlug(baseSlug) : undefined;

  const serviceData = {
    title: body.title,
    slug,
    description: body.description,
    shortDescription: body.shortDescription || shortFromDescription(body.description),
    bullets,
    price: body.price || '',
    duration: body.duration || '',
    icon: body.icon || '',
    image: body.image || '',
    tags: Array.isArray(body.tags) ? body.tags.map(String) : (body.tags ? [String(body.tags)] : []),
    visible: typeof body.visible === 'boolean' ? body.visible : true
  };

  const service = await Service.create(serviceData);
  const all = await Service.find();
  res.json(all);
};

exports.update = async (req, res) => {
  const body = req.body || {};
  const id = req.params.id;

  // Normalisation bullets
  let bullets;
  if (body.bullets !== undefined) {
    if (Array.isArray(body.bullets)) bullets = body.bullets.map(String).slice(0, 6);
    else if (typeof body.bullets === 'string' && body.bullets.trim()) {
      bullets = body.bullets.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean).slice(0, 6);
    } else bullets = [];
  }

  // If title changed and slug not provided, regenerate slug
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
    shortDescription: body.shortDescription || undefined,
    tags: body.tags ? (Array.isArray(body.tags) ? body.tags.map(String) : [String(body.tags)]) : undefined,
    visible: typeof body.visible === 'boolean' ? body.visible : undefined
  };

  // Remove undefined keys to avoid overwriting with undefined
  Object.keys(updateData).forEach(k => updateData[k] === undefined && delete updateData[k]);

  const service = await Service.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  const all = await Service.find();
  res.json(all);
};

exports.delete = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  const all = await Service.find();
  res.json(all);
};
