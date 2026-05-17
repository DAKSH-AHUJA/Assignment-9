
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
const mongoose = require("mongoose");

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const clientDist = path.join(process.cwd(), "..", "client-dist");
app.use(express.static(clientDist));

// Root route
app.get("/", (req, res) => res.json({ message: "Visitor Pass API running" }));

// API routes
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected (extra check)'))
  .catch(err => console.error('MongoDB error:', err));

  // TEMPORARY – remove after seeding
app.post("/api/seed", async (req, res) => {
  const User = require("./models/User.js");
  const bcrypt = require("bcryptjs");
  
  const demoUsers = [
    { name: "Admin", email: "admin@demo.com", password: await bcrypt.hash("123456", 10), role: "admin" },
    { name: "Security", email: "security@demo.com", password: await bcrypt.hash("123456", 10), role: "security" },
    { name: "Employee", email: "employee@demo.com", password: await bcrypt.hash("123456", 10), role: "employee" },
    { name: "Visitor", email: "visitor@demo.com", password: await bcrypt.hash("123456", 10), role: "visitor" }
  ];
  
  for (const user of demoUsers) {
    await User.findOneAndUpdate({ email: user.email }, user, { upsert: true });
  }
  res.json({ message: "Seeded demo users" });
});