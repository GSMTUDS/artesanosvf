const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // lo guardamos para usar después
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};