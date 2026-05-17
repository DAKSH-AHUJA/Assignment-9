import mongoose from "mongoose";

const checkLogSchema = new mongoose.Schema(
  {
    pass: { type: mongoose.Schema.Types.ObjectId, ref: "Pass", required: true },
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
    action: { type: String, enum: ["check-in", "check-out"], required: true },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: { type: String, default: "Main Gate" }
  },
  { timestamps: true }
);

export default mongoose.model("CheckLog", checkLogSchema);
