const Contact = require('../models/contact.model.js');
const nodemailer = require('nodemailer');

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    // Sauvegarde en DB
    await Contact.create({ name, email, message });

    // Envoi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.CONTACT_EMAIL,
      subject: `Nouveau message de ${name}`,
      html: `
        <h3>Nouveau message depuis le portfolio</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error('Erreur contact:', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

module.exports = sendContactMessage;
