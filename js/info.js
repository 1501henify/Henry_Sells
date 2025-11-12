// Auto year update
document.getElementById("year").textContent = new Date().getFullYear();

// Popup functionality
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");

const popupData = {
  about: {
    title: "About Us",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac turpis eget sapien ullamcorper vulputate in sit amet nunc.",
  },
  help: {
    title: "Help & Support",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Cras sed nisl id justo tincidunt dignissim.",
  },
  contact: {
    title: "Contact Us",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac massa nec augue aliquet gravida sed vel magna.",
  },
};

// Open popup
document.querySelectorAll(".footer-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-popup");
    const { title, text } = popupData[key];
    popupTitle.textContent = title;
    popupText.textContent = text;
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
});

// Use delegated event listeners (ensures .close-btn works every time)
document.addEventListener("click", (e) => {
  // Close when clicking X
  if (e.target.classList.contains("close-btn")) {
    popup.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Close when clicking outside popup-content
  if (e.target === popup) {
    popup.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
