const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const mailUser = process.env.MAIL_USER || process.env.EMAIL_USER;
  const mailPass = process.env.MAIL_PASS || process.env.EMAIL_PASS;

  if (!mailUser || !mailPass) {
    console.log(`Demo email to ${to}: ${subject} - ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: mailUser, pass: mailPass }
  });

  try {
    await transporter.sendMail({ from: mailUser, to, subject, text });
  } catch (error) {
    console.log(`Email not sent to ${to}: ${error.message}`);
  }
};

const sendSMS = async (phone, message) => {
  console.log(`Demo SMS to ${phone}: ${message}`);
};

module.exports = { sendEmail, sendSMS };
