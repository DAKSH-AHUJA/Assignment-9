const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Appointment = require("./models/Appointment.js");
const CheckLog = require("./models/CheckLog.js");
const Pass = require("./models/Pass.js");
const User = require("./models/User.js");
const Visitor = require("./models/Visitor.js");
const { makeQrImage, makeQrText } = require("./utils/passFiles.js");
const { ensureDemoUsers } = require("./utils/demoUsers.js");

dotenv.config();

async function seed() {
  const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(mongoUrl);

  await Promise.all([
    Visitor.deleteMany(),
    Appointment.deleteMany(),
    Pass.deleteMany(),
    CheckLog.deleteMany()
  ]);

  await ensureDemoUsers();

  const admin = await User.findOne({ email: "admin@demo.com" });
  const security = await User.findOne({ email: "security@demo.com" });
  const employee = await User.findOne({ email: "employee@demo.com" });

  const visitors = await Visitor.create([
    { name: "Ravi Kumar", email: "ravi@example.com", phone: "9876543210", company: "TechSoft", purpose: "Interview", createdBy: employee._id },
    { name: "Sneha Sharma", email: "sneha@example.com", phone: "9876501234", company: "Print Media", purpose: "Meeting", createdBy: employee._id },
    { name: "Amit Verma", email: "amit@example.com", phone: "9000011111", company: "Courier", purpose: "Delivery", createdBy: security._id }
  ]);

  const appointment = await Appointment.create({
    visitor: visitors[0]._id,
    host: employee._id,
    date: new Date(),
    purpose: "Interview",
    status: "approved"
  });

  const pass = await Pass.create({
    visitor: visitors[0]._id,
    appointment: appointment._id,
    issuedBy: admin._id,
    validTo: new Date(Date.now() + 86400000),
    qrText: "creating"
  });

  pass.qrText = await makeQrText(pass._id);
  pass.qrImage = await makeQrImage(pass.qrText);
  await pass.save();

  await CheckLog.create({
    pass: pass._id,
    visitor: visitors[0]._id,
    action: "check-in",
    scannedBy: security._id,
    location: "Main Gate"
  });

  console.log("Demo data added");
  console.log("Password for all demo users: 123456");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
});
