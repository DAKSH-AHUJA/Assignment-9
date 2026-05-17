const express = require("express");
const multer = require("multer");
const Appointment = require("../models/Appointment.js");
const CheckLog = require("../models/CheckLog.js");
const Pass = require("../models/Pass.js");
const Visitor = require("../models/Visitor.js");
const { protect, allowRoles } = require("../middleware/auth.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", protect, async (req, res) => {
  const search = req.query.search || "";
  const visitors = await Visitor.find({
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ]
  }).sort("-createdAt");
  res.json(visitors);
});

router.post("/", protect, upload.single("photo"), async (req, res) => {
  try {
    const visitor = await Visitor.create({
      ...req.body,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      createdBy: req.user._id,
      organization: req.user.organization
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, allowRoles("admin"), async (req, res) => {
  const passes = await Pass.find({ visitor: req.params.id }).select("_id");
  const passIds = passes.map((pass) => pass._id);

  await CheckLog.deleteMany({ $or: [{ visitor: req.params.id }, { pass: { $in: passIds } }] });
  await Pass.deleteMany({ visitor: req.params.id });
  await Appointment.deleteMany({ visitor: req.params.id });
  await Visitor.findByIdAndDelete(req.params.id);
  res.json({ message: "Visitor and related passes deleted" });
});

module.exports = router;
