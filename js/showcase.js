document.addEventListener("DOMContentLoaded", () => {
  const showcase = document.querySelector(".showcase");
  if (!showcase) return;

  // 🎬 Your 4 video file sources
  const videoSources = [
    "../videos/show1.mp4",
    "../videos/show2.mp4",
    "../videos/show3.mp4",
    "../videos/show4.mp4",
  ];

  // Create video elements dynamically
  const videos = videoSources.map((src, index) => {
    const vid = document.createElement("video");
    vid.src = src;
    vid.muted = true;
    vid.loop = false;
    vid.playsInline = true;
    vid.preload = "auto";
    if (index === 0) vid.classList.add("active");
    showcase.appendChild(vid);
    return vid;
  });

  // Retrieve last active video index
  let currentIndex = parseInt(localStorage.getItem("showcaseIndex")) || 0;

  // Start from saved video
  function playVideo(index) {
    videos.forEach((v, i) => {
      v.classList.toggle("active", i === index);
      if (i === index) {
        v.currentTime = 0;
        v.play();
      } else {
        v.pause();
      }
    });
    localStorage.setItem("showcaseIndex", index);
  }

  // Cycle through videos every 5 seconds
  playVideo(currentIndex);
  setInterval(() => {
    currentIndex = (currentIndex + 1) % videos.length;
    playVideo(currentIndex);
  }, 5000);
});
