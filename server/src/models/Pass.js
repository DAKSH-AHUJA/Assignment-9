const mongoose = require("mongoose");

const passSchema = new mongoose.Schema(
  {
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    qrText: { type: String, unique: true },
    qrImage: String,
    pdfPath: String,
    validTo: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active"
    },
    organization: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pass", passSchema);  