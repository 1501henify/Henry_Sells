// /api/handle.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { platform, message, mediaUrls = [] } = req.body;

    if (platform === "telegram") {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return res.status(500).json({
          success: false,
          error: "Missing Telegram credentials",
        });
      }

      // Send text first
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      // Then send each media item (if any)
      for (const url of mediaUrls) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            photo: url,
            caption: "📸 Product image",
          }),
        });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ success: false, error: "Invalid platform" });
  } catch (err) {
    console.error("❌ Telegram Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}