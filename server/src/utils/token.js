const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "visitor_pass_demo_secret";

const makeToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "7d"
  });
};

module.exports = { makeToken };
