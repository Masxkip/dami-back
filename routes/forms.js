import express from "express";
import nodemailer from "nodemailer";
import { getMailer } from "../email/transport.js";

const router = express.Router();

// tiny helper
const nl2br = (s = "") => String(s).replace(/\n/g, "<br>");
const titleCase = s => String(s)
  .replace(/[_-]+/g, " ")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\b\w/g, c => c.toUpperCase());

router.post("/contact", async (req, res) => {
  const { fullName, name, email, phone, message } = req.body || {};
  const senderName = (name || fullName || "Website").toString().slice(0, 100);

  if (!email || !message) {
    return res.status(400).json({ ok: false, error: "Email and message are required." });
  }

  try {
    const mailer = getMailer();
    const info = await mailer.sendMail({
    from: { name: senderName, address: FROM_ADDR },   // 👈 uses your IONOS mailbox
    to: process.env.CONTACT_TO || process.env.SMTP_USER || "owner@example.com",
    subject: `Contact form — ${senderName}`,
    replyTo: email,                                    // 👈 
    html: `
      <h2>New Contact</h2>
      <p><b>Name:</b> ${senderName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"}</p>
      <p><b>Message:</b><br>${nl2br(message)}</p>
    `,
  });


    const preview = mailer._isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    res.json({ ok: true, preview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

router.post("/quote", async (req, res) => {
  // Accept everything the frontend sends and format it nicely
  const body = req.body || {};
  const senderName = (body.name || body.fullName || "Website").toString().slice(0, 100);
  const email = body.email || "";

  // Build a simple field list from the payload
  const rows = Object.entries(body).map(([k, v]) => {
    if (v == null || v === "") return null;
    return `<p><b>${titleCase(k)}:</b> ${nl2br(v)}</p>`;
  }).filter(Boolean).join("\n");

  try {
    const mailer = getMailer();
    const info = await mailer.sendMail({
    from: { name: senderName, address: FROM_ADDR },   // 👈 uses your IONOS mailbox
    to: process.env.QUOTE_TO || process.env.CONTACT_TO || process.env.SMTP_USER || "owner@example.com",
    subject: `Quote request — ${senderName}`,
    replyTo: email || undefined,
    html: `<h2>New Quote Request</h2>${rows || "<p>(No fields submitted)</p>"}`,
  });

    const preview = mailer._isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    res.json({ ok: true, preview });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

export default router;
