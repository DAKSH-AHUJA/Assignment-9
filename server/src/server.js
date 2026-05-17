import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkLogRoutes from "./routes/checkLogRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import passRoutes from "./routes/passRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const clientDist = path.join(process.cwd(), "..", "client-dist");
app.use(express.static(clientDist));

app.get("/", (req, res) => res.json({ message: "Visitor Pass API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/checklogs", checkLogRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"), (error) => {
    if (error) res.status(404).json({ message: "Visitor Pass API running" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
