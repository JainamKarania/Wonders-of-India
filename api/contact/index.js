import { db } from "../../db/client.js";
import { contactMessages } from "../../db/schema.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { name, email, phone, subject, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required.",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  try {
    await db.insert(contactMessages).values({
      name,
      email,
      phone: phone ?? null,
      subject: subject ?? null,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
}