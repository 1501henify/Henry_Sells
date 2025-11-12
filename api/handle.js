// /api/handle.js
// ⚡ Secure Telegram bot backend for HenrySells
// -----------------------------------------------------------
// 1️⃣  Set these on Vercel → Project Settings → Environment Variables:
//      TELEGRAM_BOT_TOKEN = 1234567890:ABCDEF... (from @BotFather)
//      TELEGRAM_CHAT_ID   = your_personal_chat_id (get via @userinfobot)
// -----------------------------------------------------------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { products, buyerName, note } = req.body || {};

    if (!products || !Array.isArray(products) || !products.length) {
      return res.status(400).json({ success: false, message: "No products provided" });
    }

    // 🔐 Environment variables (hidden from frontend)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // 🧾 Build Telegram message
    let message = `🛍️ *New Order Alert!*\n\n`;
    message += `👤 Buyer: ${buyerName || "Unknown"}\n\n`;

    products.forEach((p, i) => {
      message += `${i + 1}. *${p.title || "Unnamed Product"}*\n`;
      if (p.url) message += `${p.url}\n`;
      if (p.price) message += `💰 Price: ${p.price}\n`;
      if (p.desc) message += `📝 ${p.desc}\n`;
      message += "\n";
    });

    if (note) message += `📦 Note: ${note}\n`;
    message += `\n💬 Sent from *HenrySells Website*`;

    // ✉️ Send to Telegram Bot API
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await telegramResponse.json();

    if (!result.ok) {
      console.error("Telegram API error:", result);
      throw new Error("Failed to send message to Telegram");
    }

    return res.status(200).json({ success: true, message: "Message sent to Telegram" });
  } catch (err) {
    console.error("❌ Error in /api/handle.js:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}