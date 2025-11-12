// ⚡ UNIVERSAL ADVANCED LAZY LOADER (Optimized + Realistic Spin)
(function () {
  // --- Immediately hide body content to avoid flash
  document.documentElement.style.overflow = "hidden";
  document.body.style.opacity = "0";

  // --- Create loader overlay
  const loaderOverlay = document.createElement("div");
  Object.assign(loaderOverlay.style, {
    position: "fixed",
    inset: "0",
    background: "radial-gradient(circle at center, #111 0%, #000 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "99999999999",
    transition: "opacity 0.6s ease, visibility 0.6s ease",
  });

  // --- Create spinner (with subtle easing + glow)
  const spinner = document.createElement("div");
  Object.assign(spinner.style, {
    width: "80px",
    height: "80px",
    border: "6px solid rgba(255,255,255,0.1)",
    borderTop: "6px solid #fbb040",
    borderRadius: "50%",
    animation: "smoothSpin 1.2s cubic-bezier(0.55, 0.1, 0.45, 0.9) infinite",
    boxShadow: "0 0 25px rgba(251,176,64,0.4)",
    transform: "translateZ(0)",
  });

  // --- Create percentage text
  const percentage = document.createElement("div");
  Object.assign(percentage.style, {
    color: "#fbb040",
    fontFamily: '"Poppins", sans-serif',
    fontWeight: "600",
    marginTop: "16px",
    fontSize: "1.2rem",
    letterSpacing: "1px",
    textShadow: "0 0 10px rgba(251,176,64,0.4)",
  });
  percentage.textContent = "0%";

  loaderOverlay.append(spinner, percentage);
  document.body.prepend(loaderOverlay); // prepend prevents flash

  // --- Add smoother animation keyframes
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes smoothSpin {
      0% { transform: rotate(0deg) scale(1) }
      50% { transform: rotate(180deg) scale(1.05) }
      100% { transform: rotate(360deg) scale(1) }
    }
    @media (max-width: 600px) {
      div[style*="border-top: 6px solid"] {
        width: 55px !important;
        height: 55px !important;
        border-width: 4px !important;
      }
      div[style*="font-size: 1.2rem"] {
        font-size: 1rem !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // --- Percentage animation logic
  let loadProgress = 0;
  const progressInterval = setInterval(() => {
    if (loadProgress < 98) {
      loadProgress += Math.floor(Math.random() * 3) + 1;
      if (loadProgress > 98) loadProgress = 98;
      percentage.textContent = `${loadProgress}%`;
    }
  }, 60);

  // --- Hide loader
  const hideLoader = () => {
    clearInterval(progressInterval);
    percentage.textContent = "100%";

    // Reveal page smoothly
    loaderOverlay.style.opacity = "0";
    loaderOverlay.style.visibility = "hidden";
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "1";
    document.documentElement.style.overflow = "";

    setTimeout(() => loaderOverlay.remove(), 700);
  };

  // --- Control duration
  const start = Date.now();
  window.addEventListener("load", () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, 2500 - elapsed);
    setTimeout(hideLoader, remaining);
  });

  // --- Failsafe backup
  setTimeout(hideLoader, 4000);
})();