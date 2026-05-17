import mongoose from "mongoose";

const passSchema = new mongoose.Schema(
  {
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    qrText: { type: String, required: true },
    qrImage: { type: String, required: true },
    pdfPath: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "used", "expired", "cancelled"],
      default: "active"
    },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date, required: true },
    organization: { type: String, default: "Main Office" }
  },
  { timestamps: true }
);

export default mongoose.model("Pass", passSchema);
