const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Aucun header Authorization
    if (!authHeader) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // Format incorrect
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization invalide" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role; // optionnel si tu ajoutes un rôle

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }

    return res.status(401).json({ error: "Token invalide" });
  }
};
