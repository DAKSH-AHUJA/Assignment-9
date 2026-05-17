const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    purpose: String,
    notes: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    organization: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);