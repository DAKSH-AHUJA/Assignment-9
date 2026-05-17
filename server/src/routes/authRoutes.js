const express = require("express");
const User = require("../models/User.js");
const { makeToken } = require("../utils/token.js");
const { protect, allowRoles } = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, department, organization } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already used" });

    const user = await User.create({ name, email, password, role, department, organization });
    res.status(201).json({
      token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    res.json({
      token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.get("/users", protect, allowRoles("admin", "employee", "security"), async (req, res) => {
  const users = await User.find().select("-password").sort("name");
  res.json(users);
});

module.exports = router;