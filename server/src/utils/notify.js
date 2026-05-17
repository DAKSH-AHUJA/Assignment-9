import nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log("Email demo:", { to, subject, text });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text
  });
}

export async function sendSMS(phone, text) {
  console.log("SMS demo:", { phone, text, apiKeyPresent: Boolean(process.env.SMS_API_KEY) });
}
