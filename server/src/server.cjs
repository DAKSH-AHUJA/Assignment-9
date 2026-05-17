const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db.js");
const appointmentRoutes = require("./routes/appointmentRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const checkLogRoutes = require("./routes/checkLogRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const passRoutes = require("./routes/passRoutes.js");
const visitorRoutes = require("./routes/visitorRoutes.js");
const { ensureDemoUsers } = require("./utils/demoUsers.js");

dotenv.config();

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

connectDB().then(async () => {
  await ensureDemoUsers();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
