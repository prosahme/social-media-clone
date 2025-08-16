const jwt = require("jsonwebtoken");

module.exports = function (req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (e) {
      console.error("Token verification failed:", e.message);
      return null;
    }
  }

  return null;
};
