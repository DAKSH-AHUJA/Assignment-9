const express = require("express");
const Pass = require("../models/Pass.js");
const Visitor = require("../models/Visitor.js");
const { protect, allowRoles } = require("../middleware/auth.js");
const { makeBadgePdf, makeQrImage, makeQrText } = require("../utils/passFiles.js");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const passes = await Pass.find()
    .populate("visitor")
    .populate("appointment")
    .populate("issuedBy", "name role")
    .sort("-createdAt");
  res.json(passes);
});

router.post("/", protect, allowRoles("admin", "security"), async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.body.visitorId);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    let pass = await Pass.create({
      visitor: visitor._id,
      appointment: req.body.appointmentId || null,
      issuedBy: req.user._id,
      qrText: "creating",
      qrImage: "creating",
      validTo: req.body.validTo,
      organization: req.user.organization
    });

    pass.qrText = await makeQrText(pass._id);
    pass.qrImage = await makeQrImage(pass.qrText);
    pass.pdfPath = makeBadgePdf({ pass, visitor });
    await pass.save();

    res.status(201).json(pass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/verify/:qrText", protect, allowRoles("admin", "security"), async (req, res) => {
  const pass = await Pass.findOne({ qrText: req.params.qrText }).populate("visitor");
  if (!pass) return res.status(404).json({ message: "Invalid pass" });

  const expired = new Date(pass.validTo) < new Date();
  res.json({ valid: pass.status === "active" && !expired, expired, pass });
});

module.exports = router;