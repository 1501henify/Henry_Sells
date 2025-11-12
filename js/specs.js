// ✅ PREVIEW OVERLAY OPEN / CLOSE
document.querySelectorAll(".preview-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const productId = productCard.dataset.product;
    const overlay = document.querySelector(
      `.preview-overlay[data-preview="${productId}"]`
    );

    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scroll behind overlay
  });
});

document.querySelectorAll(".preview-overlay").forEach((overlay) => {
  const closeBtn = overlay.querySelector(".close-preview");

  // ✅ CLOSE overlay when clicking close or background
  const closeOverlay = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    stopAllVideos(overlay);
  };

  closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
});

// ✅ CAROUSEL FUNCTIONALITY
document.querySelectorAll(".carousel").forEach((carousel) => {
  const items = carousel.querySelectorAll(".carousel-item");
  const videos = carousel.querySelectorAll("video");
  let index = 0;
  let playing = true; // Auto-slide state
  let autoSlide;

  // --- Helper: show a specific slide
  const showSlide = (newIndex) => {
    items[index].classList.remove("active");
    index = (newIndex + items.length) % items.length;
    items[index].classList.add("active");
  };

  // --- Helper: stop all videos in this carousel
  const stopAllCarouselVideos = () => {
    videos.forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  };

  // --- Auto-slide every 4s
  const startAutoSlide = () => {
    autoSlide = setInterval(() => {
      if (playing) {
        showSlide(index + 1);
      }
    }, 4000);
  };

  const stopAutoSlide = () => clearInterval(autoSlide);

  startAutoSlide();

  // --- Pause autoplay when any video plays
  videos.forEach((video) => {
    video.addEventListener("play", () => (playing = false));
    video.addEventListener("pause", () => (playing = true));
    video.addEventListener("ended", () => (playing = true));
  });

  // --- When overlay closes → stop everything
  const overlay = carousel.closest(".preview-overlay");
  overlay.addEventListener("transitionend", () => {
    if (!overlay.classList.contains("active")) {
      stopAutoSlide();
      stopAllCarouselVideos();
    }
  });
});

// ✅ GLOBAL video stop (for all overlays)
function stopAllVideos(container = document) {
  const allVideos = container.querySelectorAll("video");
  allVideos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
}
