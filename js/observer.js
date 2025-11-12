document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll(".product-video"));
  let currentIndex = 0;
  let playing = false;
  let userScrolling = false;
  let scrollTimeout;

  // --- Detect user scroll activity (to avoid hijacking scroll)
  window.addEventListener("scroll", () => {
    userScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      userScrolling = false;
    }, 800); // user idle after 0.8s
  });

  // --- Auto-pause videos when tab/page is not active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach((v) => v.pause());
      playing = false;
    } else {
      // Resume the currently visible one (if any)
      const visible = videos.find((v) => {
        const rect = v.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
        );
      });
      if (visible) {
        visible.play().catch(() => {});
        playing = true;
      }
    }
  });

  // --- IntersectionObserver: detect visible videos
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.target.dataset.product - b.target.dataset.product);

      if (visibleEntries.length && !playing) {
        const firstVisible = visibleEntries[0].target;
        currentIndex = videos.indexOf(firstVisible);
        playVideoInOrder(currentIndex);
      }
    },
    { threshold: 0.6 }
  );

  // --- Initialize video properties
  videos.forEach((video, i) => {
    video.dataset.product = i + 1;
    observer.observe(video);
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.pause();
  });

  // --- Main autoplay sequence
  function playVideoInOrder(index) {
    if (index >= videos.length) {
      playing = false;
      return;
    }

    const video = videos[index];
    playing = true;

    // Pause others
    videos.forEach((v, i) => {
      if (i !== index) v.pause();
    });

    // Prevent scroll hijack — only auto-scroll if user isn't moving
    const footer = document.querySelector("footer");
    const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;
    const windowBottom = window.scrollY + window.innerHeight;
    const nearFooter = windowBottom >= footerTop - 100;

    if (!userScrolling && !nearFooter) {
      video.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Play video
    video.play().catch(() => {});

    // When video finishes → move to next if still visible
    video.onended = () => {
      playing = false;

      const rect = video.getBoundingClientRect();
      const fullyVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (fullyVisible && !userScrolling) {
        playVideoInOrder(index + 1);
      }
    };
  }
});
