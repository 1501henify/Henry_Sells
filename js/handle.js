document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  const buySelectedBtn = document.querySelector(".buy-selected-btn");
  let selectedCards = new Set();
  let longPressTimer;

  // --- Product menu toggle
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

  // --- Card selection logic
  function toggleSelect(card) {
    card.classList.toggle("selected");
    if (card.classList.contains("selected")) selectedCards.add(card);
    else selectedCards.delete(card);
    buySelectedBtn.classList.toggle("show", selectedCards.size > 1);
  }

  // --- Long press to select
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

  // --- Asks buyer where to continue chatting (Telegram or WhatsApp)
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
    `;
    modal.innerHTML = `
      <h3 style="margin-bottom: 1rem; color:#333;">Choose Chat Platform</h3>
      <p style="margin-bottom: 1.5rem; color:#666;">Where would you like to continue chatting?</p>
      <button id="telegramBtn" style="background:#229ED9;color:#fff;border:none;padding:10px 20px;border-radius:8px;margin-right:10px;cursor:pointer;">Telegram</button>
      <button id="whatsappBtn" style="background:#25D366;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">WhatsApp</button>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector("#telegramBtn").onclick = async () => {
      overlay.remove();
      await sendToTelegram(cards);
    };
    modal.querySelector("#whatsappBtn").onclick = () => {
      overlay.remove();
      sendToWhatsApp(cards);
    };
  }

  // --- Helper: capture video frame
  async function captureVideoFrame(video) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  // --- Helper: download a given base64 URL
  function downloadFile(dataURL, filename) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Download modal
  function createChoiceModal(onChoice) {
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
    `;
    modal.innerHTML = `
      <h3 style="margin-bottom: 1rem; color:#333;">Download before sending?</h3>
      <p style="margin-bottom: 1.5rem; color:#666;">Would you like to save product images/videos before sending?</p>
      <button id="yesBtn" style="background:#fbb040;color:#fff;border:none;padding:10px 20px;border-radius:8px;margin-right:10px;cursor:pointer;">Yes</button>
      <button id="noBtn" style="background:#333;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">No</button>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector("#yesBtn").onclick = () => {
      overlay.remove();
      onChoice(true);
    };
    modal.querySelector("#noBtn").onclick = () => {
      overlay.remove();
      onChoice(false);
    };
  }

  // --- Main: Send products to WhatsApp
  async function sendToWhatsApp(cards) {
    if (!cards.length) return;

    const whatsappNumber = "2348160813334";
    const isSingle = cards.length === 1;
    let message = isSingle
      ? "👋 Good day! I’d like to buy this product:\n\n"
      : "👋 Good day! I’d like to buy these products:\n\n";

    createChoiceModal(async (shouldDownload) => {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const title =
          card.querySelector("h3")?.textContent?.trim() || "Unnamed Product";
        const imgEl = card.querySelector("img");
        const videoEl = card.querySelector("video");
        let mediaData = "";

        if (shouldDownload) {
          if (imgEl) {
            const canvas = await html2canvas(card, { backgroundColor: "#fff" });
            const dataURL = canvas.toDataURL("image/png");
            downloadFile(dataURL, `${title.replace(/\s+/g, "_")}.png`);
          }
          if (videoEl) {
            const frame = await captureVideoFrame(videoEl);
            downloadFile(frame, `${title.replace(/\s+/g, "_")}_video.png`);
          }
          message += `${i + 1}. *${title}*\n(Saved locally)\n\n`;
        } else {
          if (imgEl) mediaData = imgEl.src;
          else if (videoEl) mediaData = videoEl.currentSrc || videoEl.src;

          message += `${i + 1}. *${title}*\n${mediaData}\n\n`;
        }
      }

      message += "🛒 Sent from *Henry Sells* website.\n\nThank you!";
      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
      window.open(url, "_blank");
    });
  }

  // --- Send products to Telegram backend
  async function sendToTelegram(cards) {
    const products = cards.map((card) => ({
      title: card.querySelector("h3")?.textContent?.trim() || "Unnamed",
      url: card.querySelector("img")?.src || card.querySelector("video")?.src,
    }));

    try {
      const response = await fetch("../api/handle.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Sent to Telegram successfully!");
      } else {
        alert("⚠️ Failed to send to Telegram.");
      }
    } catch (err) {
      console.error("Error sending to Telegram:", err);
      alert("❌ Network error while sending to Telegram.");
    }
  }
});