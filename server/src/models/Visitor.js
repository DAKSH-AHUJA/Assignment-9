const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: String,
    purpose: String,
    photo: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    organization: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);