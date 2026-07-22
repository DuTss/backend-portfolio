const jwt = require('jsonwebtoken');

exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
};

exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};
