import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    notes: { type: String, default: "" },
    organization: { type: String, default: "Main Office" }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
