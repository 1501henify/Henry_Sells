import fetch from "node-fetch"; // Required for Telegram API calls

export default async function handler(req, res) {
  try {
    // ✅ Allow only POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // ✅ Parse the body from frontend
    const body = await req.json?.() || req.body;

    const { platform, message, mediaUrls } = body || {};

    if (!platform || !message) {
      return res.status(400).json({ error: "Missing platform or message" });
    }

    // ✅ Environment variables (loaded from Vercel dashboard)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // 🧩 TELEGRAM PATH
    if (platform === "telegram") {
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res
          .status(500)
          .json({ error: "Telegram credentials not configured in environment." });
      }

      // --- Send message first ---
      const sendMessageURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(sendMessageURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });

      // --- Send any images/videos (if included) ---
      if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
        const sendMediaURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;
        const mediaPayload = mediaUrls.map((url) => ({
          type: url.match(/\.(mp4|mov|avi|mkv)$/i) ? "video" : "photo",
          media: url,
        }));

        await fetch(sendMediaURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            media: mediaPayload,
          }),
        });
      }

      return res.status(200).json({ success: true, sentTo: "Telegram" });
    }

    // 🧩 WHATSAPP PATH
    if (platform === "whatsapp") {
      // Instead of API calls (since WhatsApp doesn’t allow server-side messages),
      // we just redirect the buyer to your WhatsApp chat link.
      return res.status(200).json({
        success: true,
        redirectUrl: `https://wa.me/2348160813334?text=${encodeURIComponent(message)}`,
      });
    }

    // 🧩 Unsupported platform
    return res.status(400).json({ error: "Unsupported platform" });
  } catch (err) {
    console.error("❌ handle.js error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}