const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const makeQrText = async (passId) => {
  return `pass_${passId}_${Date.now()}`;
};

const makeQrImage = async (qrText) => {
  return QRCode.toDataURL(qrText);
};

const makeQrBuffer = async (qrText) => {
  return QRCode.toBuffer(qrText);
};

const makeBadgePdf = ({ pass, visitor }) => {
  const pdfDir = path.join(process.cwd(), "uploads", "pdfs");
  if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
  const pdfPath = path.join(pdfDir, `${pass._id}.pdf`);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(20).text("Visitor Pass", { align: "center" });
  doc.fontSize(14).text(`Name: ${visitor.name}`);
  doc.text(`Email: ${visitor.email}`);
  doc.text(`Valid till: ${new Date(pass.validTo).toLocaleString()}`);
  doc.end();
  return `/uploads/pdfs/${pass._id}.pdf`;
};

module.exports = { makeBadgePdf, makeQrBuffer, makeQrImage, makeQrText };
