import express from "express";
import Appointment from "../models/Appointment.js";
import CheckLog from "../models/CheckLog.js";
import Pass from "../models/Pass.js";
import User from "../models/User.js";
import Visitor from "../models/Visitor.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const [users, visitors, appointments, passes, logs, activePasses] = await Promise.all([
    User.countDocuments(),
    Visitor.countDocuments(),
    Appointment.countDocuments(),
    Pass.countDocuments(),
    CheckLog.countDocuments(),
    Pass.countDocuments({ status: "active" })
  ]);

  const recentLogs = await CheckLog.find()
    .populate("visitor")
    .populate("scannedBy", "name")
    .sort("-createdAt")
    .limit(8);

  res.json({ users, visitors, appointments, passes, logs, activePasses, recentLogs });
});

router.get("/export/logs.csv", protect, async (req, res) => {
  const logs = await CheckLog.find().populate("visitor").populate("scannedBy", "name").sort("-createdAt");
  const lines = ["visitor,action,location,scannedBy,date"];

  logs.forEach((log) => {
    lines.push([
      log.visitor?.name || "",
      log.action,
      log.location,
      log.scannedBy?.name || "",
      new Date(log.createdAt).toLocaleString()
    ].join(","));
  });

  res.header("Content-Type", "text/csv");
  res.attachment("visitor-check-logs.csv");
  res.send(lines.join("\n"));
});

export default router;
