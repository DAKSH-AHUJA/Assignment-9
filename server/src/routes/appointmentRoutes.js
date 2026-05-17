import express from "express";
import Appointment from "../models/Appointment.js";
import Visitor from "../models/Visitor.js";
import { protect, allowRoles } from "../middleware/auth.js";
import { sendEmail, sendSMS } from "../utils/notify.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const appointments = await Appointment.find()
    .populate("visitor")
    .populate("host", "name email role")
    .sort("-createdAt");
  res.json(appointments);
});

router.post("/", protect, async (req, res) => {
  try {
    let visitor = req.body.visitorId ? await Visitor.findById(req.body.visitorId) : null;

    if (!visitor) {
      visitor = await Visitor.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        purpose: req.body.purpose,
        createdBy: req.user._id,
        organization: req.user.organization
      });
    }

    const appointment = await Appointment.create({
      visitor: visitor._id,
      host: req.body.hostId || req.user._id,
      date: req.body.date,
      purpose: req.body.purpose,
      notes: req.body.notes,
      organization: req.user.organization
    });

    await sendEmail(visitor.email, "Visitor appointment created", "Your appointment is pending approval.");
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/status", protect, allowRoles("admin", "employee"), async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).populate("visitor");

  if (!appointment) return res.status(404).json({ message: "Appointment not found" });

  await sendEmail(
    appointment.visitor.email,
    `Appointment ${appointment.status}`,
    `Your appointment is ${appointment.status}.`
  );
  await sendSMS(appointment.visitor.phone, `Appointment ${appointment.status}`);
  res.json(appointment);
});

export default router;
