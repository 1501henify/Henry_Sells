const current = document.getElementById("current");
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

// Store all links
const allLinks = Array.from(links.querySelectorAll("a")).map((a) => ({
  name: a.dataset.name,
  href: a.getAttribute("href"),
}));

// Get current page filename
function getCurrentPage() {
  const path = window.location.pathname;
  if (path === "/" || path.endsWith("index.html")) return "index.html";
  return path.split("/").pop();
}

const currentPageFile = getCurrentPage();
let activeLink =
  allLinks.find((link) => link.href.split("/").pop() === currentPageFile) ||
  allLinks[0];
current.textContent = activeLink.name;

// Build link list safely
function rebuildLinks(preserveState = false) {
  const wasShown = links.classList.contains("show");
  const wasHidden = links.classList.contains("hidden");

  const others = allLinks.filter((l) => l.name !== current.textContent);
  links.innerHTML = others
    .map(
      (l, i) =>
        `<a href="${l.href}" data-name="${l.name}">${l.name}${
          i < others.length - 1 ? "," : ""
        }</a>`
    )
    .join(" ");

  attachLinkEvents();

  // restore visibility state
  if (preserveState) {
    if (wasShown) links.classList.add("show");
    if (wasHidden) links.classList.add("hidden");
  }
}

// Attach link behavior
function attachLinkEvents() {
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      current.textContent = link.dataset.name;
      rebuildLinks(true);
      links.classList.remove("show");
      toggle.classList.remove("open");
      window.location.href = link.href;
    });
  });
}

// Toggle handler
toggle.addEventListener("click", () => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    links.classList.toggle("show");
    toggle.classList.toggle("open");
  } else {
    links.classList.toggle("hidden");
    toggle.classList.toggle("open");
  }
});

// Keep state consistent on resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    links.classList.remove("hidden");
  } else {
    links.classList.remove("show");
    links.classList.add("hidden");
  }
});

// Initial build
document.addEventListener("DOMContentLoaded", () => {
  rebuildLinks();
  if (window.innerWidth > 768) {
    links.classList.add("hidden");
  } else {
    links.classList.remove("hidden");
  }
});
