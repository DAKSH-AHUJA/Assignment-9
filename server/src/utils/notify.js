const nodemailer = require("nodemailer");

// Email (demo – prints to console if no SMTP config)
const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`📧 DEMO EMAIL to ${to}: ${subject} - ${text}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

// SMS demo (prints to console)
const sendSMS = async (phone, message) => {
  console.log(`📱 DEMO SMS to ${phone}: ${message}`);
};

module.exports = { sendEmail, sendSMS };