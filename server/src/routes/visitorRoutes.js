import express from "express";
import multer from "multer";
import Visitor from "../models/Visitor.js";
import { protect, allowRoles } from "../middleware/auth.js";

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
  await Visitor.findByIdAndDelete(req.params.id);
  res.json({ message: "Visitor deleted" });
});

export default router;
