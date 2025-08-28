// Generic SMTP transport (works with Ethereal and real SMTP)
import nodemailer from "nodemailer";

export function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true"; // true => 465
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP env vars missing (SMTP_HOST, SMTP_USER, SMTP_PASS)");
  }

  const transport = nodemailer.createTransport({
    host, port, secure,
    auth: { user, pass }
  });

  // Mark Ethereal so routes can return preview URLs
  transport._isEthereal = /ethereal/i.test(host);
  return transport;
}
