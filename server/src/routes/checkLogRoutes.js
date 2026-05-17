import express from "express";
import CheckLog from "../models/CheckLog.js";
import Pass from "../models/Pass.js";
import { protect, allowRoles } from "../middleware/auth.js";

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

  res.status(201).json(log);
});

export default router;
