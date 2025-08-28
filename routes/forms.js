import express from "express";
import nodemailer from "nodemailer";
import { getMailer } from "../email/transport.js";

const router = express.Router();

// tiny helper
const nl2br = (s = "") => String(s).replace(/\n/g, "<br>");

router.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  try {
    const mailer = getMailer();
    const info = await mailer.sendMail({
      from: `"${name || "Website"}" <no-reply@yourdomain.test>`,
      to: process.env.CONTACT_TO || "owner@example.com",
      subject: `Contact form${name ? ` — ${name}` : ""}`,
      replyTo: email,
      html: `
        <h2>New Contact</h2>
        <p><b>Name:</b> ${name || "-"}</p>
        <p><b>Email:</b> ${email || "-"}</p>
        <p><b>Phone:</b> ${phone || "-"}</p>
        <p><b>Message:</b><br>${nl2br(message)}</p>
      `
    });

    const preview = mailer._isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    res.json({ ok: true, preview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

router.post("/quote", async (req, res) => {
  const { name, email, details } = req.body || {};
  try {
    const mailer = getMailer();
    const info = await mailer.sendMail({
      from: `"${name || "Website"}" <no-reply@yourdomain.test>`,
      to: process.env.QUOTE_TO || process.env.CONTACT_TO || "owner@example.com",
      subject: `Quote request — ${name || "Unknown"}`,
      replyTo: email,
      html: `<p>${nl2br(details)}</p>`
    });

    const preview = mailer._isEthereal ? nodemailer.getTestMessageUrl(info) : null;
    res.json({ ok: true, preview });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to send message" });
  }
});

export default router;
