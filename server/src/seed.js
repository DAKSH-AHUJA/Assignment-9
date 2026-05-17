import dotenv from "dotenv";
import mongoose from "mongoose";
import Appointment from "./models/Appointment.js";
import CheckLog from "./models/CheckLog.js";
import Pass from "./models/Pass.js";
import User from "./models/User.js";
import Visitor from "./models/Visitor.js";
import { makeQrImage, makeQrText } from "./utils/passFiles.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await Promise.all([
  User.deleteMany(),
  Visitor.deleteMany(),
  Appointment.deleteMany(),
  Pass.deleteMany(),
  CheckLog.deleteMany()
]);

const users = await User.create([
  { name: "Admin User", email: "admin@demo.com", password: "123456", role: "admin", department: "IT" },
  { name: "Security Guard", email: "security@demo.com", password: "123456", role: "security", department: "Gate" },
  { name: "Host Employee", email: "employee@demo.com", password: "123456", role: "employee", department: "HR" },
  { name: "Visitor Demo", email: "visitor@demo.com", password: "123456", role: "visitor" }
]);

const visitors = await Visitor.create([
  { name: "Ravi Kumar", email: "ravi@example.com", phone: "9876543210", company: "TechSoft", purpose: "Interview", createdBy: users[2]._id },
  { name: "Sneha Sharma", email: "sneha@example.com", phone: "9876501234", company: "Print Media", purpose: "Meeting", createdBy: users[2]._id },
  { name: "Amit Verma", email: "amit@example.com", phone: "9000011111", company: "Courier", purpose: "Delivery", createdBy: users[1]._id }
]);

const appointments = await Appointment.create([
  { visitor: visitors[0]._id, host: users[2]._id, date: new Date(), purpose: "Interview", status: "approved" },
  { visitor: visitors[1]._id, host: users[2]._id, date: new Date(Date.now() + 86400000), purpose: "Meeting", status: "pending" }
]);

let pass = await Pass.create({
  visitor: visitors[0]._id,
  appointment: appointments[0]._id,
  issuedBy: users[1]._id,
  qrText: "creating",
  qrImage: "creating",
  validTo: new Date(Date.now() + 86400000)
});
pass.qrText = await makeQrText(pass._id);
pass.qrImage = await makeQrImage(pass.qrText);
await pass.save();

await CheckLog.create({
  pass: pass._id,
  visitor: visitors[0]._id,
  action: "check-in",
  scannedBy: users[1]._id,
  location: "Main Gate"
});

console.log("Demo data added");
console.log("Logins: admin@demo.com, security@demo.com, employee@demo.com, visitor@demo.com");
console.log("Password for all: 123456");
await mongoose.disconnect();
