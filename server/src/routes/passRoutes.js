const express = require("express");
const Pass = require("../models/Pass.js");
const Visitor = require("../models/Visitor.js");
const { protect, allowRoles } = require("../middleware/auth.js");
const { makeBadgePdfBuffer, makeQrBuffer, makeQrImage, makeQrText } = require("../utils/passFiles.js");
const { sendEmail } = require("../utils/notify.js");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const passes = await Pass.find()
    .populate("visitor")
    .populate("appointment")
    .populate("issuedBy", "name role")
    .sort("-createdAt");

  const orphanPasses = passes.filter((pass) => !pass.visitor).map((pass) => pass._id);
  if (orphanPasses.length) await Pass.deleteMany({ _id: { $in: orphanPasses } });

  const fixedPasses = await Promise.all(passes.map(async (pass) => {
    if (!pass.visitor) return null;
    const item = pass.toObject();
    if (item.qrText) item.qrImage = `/api/passes/${item._id}/qr`;
    item.pdfPath = `/api/passes/${item._id}/pdf`;
    return item;
  }));

  res.json(fixedPasses.filter(Boolean));
});

router.get("/:id/qr", protect, async (req, res) => {
  const pass = await Pass.findById(req.params.id);
  if (!pass) return res.status(404).json({ message: "Pass not found" });

  const qrImage = await makeQrBuffer(pass.qrText);
  res.type("png").send(qrImage);
});

router.get("/:id/pdf", protect, async (req, res) => {
  const pass = await Pass.findById(req.params.id).populate("visitor");
  if (!pass) return res.status(404).json({ message: "Pass not found" });

  const pdf = await makeBadgePdfBuffer({ pass, visitor: pass.visitor });
  res.header("Content-Type", "application/pdf");
  res.attachment(`visitor-pass-${pass._id}.pdf`);
  res.send(pdf);
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
    pass.pdfPath = `/api/passes/${pass._id}/pdf`;
    await pass.save();

    await sendEmail(visitor.email, "Visitor pass issued", "Your visitor pass has been issued. Please show the QR code at the gate.");

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
