const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

const demoUsers = [
  { name: "Admin User", email: "admin@demo.com", role: "admin", department: "IT" },
  { name: "Security Guard", email: "security@demo.com", role: "security", department: "Gate" },
  { name: "Host Employee", email: "employee@demo.com", role: "employee", department: "HR" },
  { name: "Visitor Demo", email: "visitor@demo.com", role: "visitor", department: "" }
];

async function ensureDemoUsers() {
  const password = await bcrypt.hash("123456", 10);

  for (const user of demoUsers) {
    // Daksh: this fixes demo login on Render even if the database was empty.
    await User.findOneAndUpdate(
      { email: user.email },
      { ...user, password, organization: "Main Office" },
      { upsert: true }
    );
  }
}

module.exports = { ensureDemoUsers };
