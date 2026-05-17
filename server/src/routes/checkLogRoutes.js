const express = require("express");
const CheckLog = require("../models/CheckLog.js");
const Pass = require("../models/Pass.js");
const { protect, allowRoles } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const logs = await CheckLog.find()
    .populate("visitor")
    .populate("pass")
    .populate("scannedBy", "name")
    .sort("-createdAt");
  res.json(logs);
});

router.post("/scan", protect, allowRoles("admin", "security"), async (req, res) => {
  const pass = await Pass.findOne({ qrText: req.body.qrText }).populate("visitor");
  if (!pass) return res.status(404).json({ message: "Pass not found" });
  if (pass.status !== "active") return res.status(400).json({ message: "Pass is not active" });
  if (new Date(pass.validTo) < new Date()) return res.status(400).json({ message: "Pass expired" });

  const log = await CheckLog.create({
    pass: pass._id,
    visitor: pass.visitor._id,
    action: req.body.action,
    location: req.body.location || "Main Gate",
    scannedBy: req.user._id
  });

  if (req.body.action === "check-out") {
    pass.status = "used";
    await pass.save();
  }

  res.status(201).json({
    valid: true,
    message: "Pass is valid",
    log,
    pass: {
      visitorName: pass.visitor.name,
      visitorEmail: pass.visitor.email,
      action: log.action,
      location: log.location,
      scannedAt: log.createdAt
    }
  });
});

module.exports = router;
