document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  const buySelectedBtn = document.querySelector(".buy-selected-btn");
  let selectedCards = new Set();
  let longPressTimer;

  // ==============================
  // PRODUCT MENU TOGGLE
  // ==============================
  document.querySelectorAll(".menu-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = icon.nextElementSibling;
      document.querySelectorAll(".menu-options").forEach((m) => {
        if (m !== menu) m.style.display = "none";
      });
      menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".menu-options").forEach((m) => (m.style.display = "none"));
  });

  // ==============================
  // CARD SELECTION
  // ==============================
  function toggleSelect(card) {
    card.classList.toggle("selected");
    if (card.classList.contains("selected")) selectedCards.add(card);
    else selectedCards.delete(card);
    buySelectedBtn.classList.toggle("show", selectedCards.size > 1);
  }

  // ==============================
  // LONG PRESS SELECT
  // ==============================
  cards.forEach((card) => {
    const buyBtn = card.querySelector(".buy-btn");
    const selectBtn = card.querySelector(".select-btn");

    card.addEventListener("mousedown", () => {
      longPressTimer = setTimeout(() => toggleSelect(card), 3000);
    });
    card.addEventListener("mouseup", () => clearTimeout(longPressTimer));
    card.addEventListener("mouseleave", () => clearTimeout(longPressTimer));
    card.addEventListener("touchstart", () => {
      longPressTimer = setTimeout(() => toggleSelect(card), 3000);
    });
    card.addEventListener("touchend", () => clearTimeout(longPressTimer));

    selectBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect(card);
      selectBtn.closest(".menu-options").style.display = "none";
    });

    buyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      promptChatPreference([card]);
    });
  });

  buySelectedBtn.addEventListener("click", () => {
    promptChatPreference([...selectedCards]);
  });

  // ==============================
  // PROMPT CHAT PLATFORM
  // ==============================
  function promptChatPreference(cards) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: #fff;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      max-width: 320px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      font-family: 'Poppins', sans-serif;
      position: relative;
    `;
    modal.innerHTML = `
      <h3 style="margin-bottom: 1rem; color:#333;">Choose Chat Platform</h3>
      <p style="margin-bottom: 1.5rem; color:#666;">Where would you like to continue chatting?</p>
      <button id="telegramBtn" style="background:#229ED9;color:#fff;border:none;padding:10px 20px;border-radius:8px;margin-right:10px;cursor:pointer;">Telegram</button>
      <button id="whatsappBtn" style="background:#25D366;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">WhatsApp</button>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    modal.querySelector("#telegramBtn").onclick = async () => {
      overlay.remove();
      await sendToTelegram(cards);
    };
    modal.querySelector("#whatsappBtn").onclick = () => {
      overlay.remove();
      sendToWhatsApp(cards);
    };
  }

  // ==============================
  // TELEGRAM SENDER (via ../api/handle.js.js)
  // ==============================
  async function sendToTelegram(cards) {
    const products = cards.map((card) => ({
      title: card.querySelector("h3")?.textContent?.trim() || "Unnamed",
      url: card.querySelector("img")?.src || card.querySelector("video")?.src,
    }));

    try {
      const response = await fetch("../api/handle.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "telegram",
          message: `🛒 New product interest from Henry Sells:\n\n${products
            .map((p, i) => `${i + 1}. ${p.title}\n${p.url}`)
            .join("\n\n")}`,
          mediaUrls: products.map((p) => p.url),
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Sent to Telegram successfully!");
      } else {
        alert("⚠️ Failed to send to Telegram. Please check your bot credentials.");
      }
    } catch (err) {
      console.error("Error sending to Telegram:", err);
      alert("❌ Network error while sending to Telegram. Please try again later.");
    }
  }

  // ==============================
  // WHATSAPP WITH SNAPSHOTS
  // ==============================
  async function sendToWhatsApp(cards) {
    if (!cards.length) return;

    const whatsappNumber = "2348160813334";
    const isSingle = cards.length === 1;

    let message = isSingle
      ? "👋 Good day! I’d like to buy this product:\n\n"
      : "👋 Good day! I’d like to buy these products:\n\n";

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const title = card.querySelector("h3")?.textContent?.trim() || "Unnamed Product";

      // Take snapshot of product card
      const canvas = await html2canvas(card, { backgroundColor: "#fff" });
      const dataURL = canvas.toDataURL("image/png");

      // Convert snapshot to temporary blob URL
      const blob = await (await fetch(dataURL)).blob();
      const blobUrl = URL.createObjectURL(blob);

      message += `${i + 1}. *${title}*\n${blobUrl}\n\n`;
    }

    message += "🛒 Sent from *Henry Sells* website.\n\nThank you!";
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    window.open(url, "_blank");
  }
});