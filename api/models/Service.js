const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String }, // description longue (markdown/HTML)
  shortDescription: { type: String, maxlength: 160 }, // accroche pour la carte
  bullets: [{ type: String }], // 2-6 points clés
  price: { type: String }, // ex. "À partir de 900 €" ou "900–2500 €"
  duration: { type: String }, // ex. "2–4 semaines"
  icon: { type: String }, // nom d'icône ou URL
  image: { type: String }, // URL vignette/cover
  tags: [{ type: String }], // ex. ["React","SEO"]
  visible: { type: Boolean, default: true } // remplace "featured"
}, { timestamps: true });

// Génération simple du slug si absent
ServiceSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);
