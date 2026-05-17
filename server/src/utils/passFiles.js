import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export async function makeQrText(passId) {
  return `VISITOR_PASS:${passId}`;
}

export async function makeQrImage(qrText) {
  return QRCode.toDataURL(qrText);
}

export function makeBadgePdf({ pass, visitor }) {
  const fileName = `badge-${pass._id}.pdf`;
  const folder = path.join(process.cwd(), "uploads");
  const fullPath = path.join(folder, fileName);

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const doc = new PDFDocument({ size: "A6", margin: 24 });
  doc.pipe(fs.createWriteStream(fullPath));
  doc.fontSize(18).text("Visitor Pass", { align: "center" });
  doc.moveDown();
  doc.fontSize(11).text(`Name: ${visitor.name}`);
  doc.text(`Company: ${visitor.company || "N/A"}`);
  doc.text(`Purpose: ${visitor.purpose}`);
  doc.text(`Valid Till: ${new Date(pass.validTo).toLocaleString()}`);
  doc.moveDown();
  const qrBuffer = Buffer.from(pass.qrImage.split(",")[1], "base64");
  doc.image(qrBuffer, { width: 120, align: "center" });
  doc.end();

  return `/uploads/${fileName}`;
}
