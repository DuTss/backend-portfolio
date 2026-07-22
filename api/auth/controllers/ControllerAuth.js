const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../utils/token');

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: "Cet email est déjà utilisé" });
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });

  res.json({ message: "Compte créé avec succès" });
};


// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/api/auth/refresh"
  });

  res.json({ accessToken });
};


// GET USER
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};


// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};


// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Ancien mot de passe incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hash });

    res.json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};


// REFRESH TOKEN
exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'Refresh token manquant' });

  try {
    const decoded = jwt.verify(token, 'REFRESH_SECRET');
    const newAccessToken = generateAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Refresh token invalide' });
  }
};


// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: 'Déconnexion réussie' });
};
