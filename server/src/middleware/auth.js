const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const jwtSecret = process.env.JWT_SECRET || "visitor_pass_demo_secret";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token && req.query.token) token = req.query.token;
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} not allowed` });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
