document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-input");
  const searchBtn = document.querySelector("#search-btn");
  const products = document.querySelectorAll(".product-card");
  const dealsSection = document.querySelector("#deals");

  if (!searchInput || !searchBtn || !dealsSection) return;

  // --- Create "No Match" message
  const noMatchMsg = document.createElement("p");
  Object.assign(noMatchMsg.style, {
    display: "none",
    textAlign: "center",
    marginTop: "20px",
    color: "var(--text-clr)",
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "0.95rem",
    transition: "opacity 0.3s ease",
  });
  dealsSection.parentNode.insertBefore(noMatchMsg, dealsSection.nextSibling);

  let searchTimeout;
  let lastQuery = "";
  let hasScrolledDown = false;

  // --- Helper: fuzzy match
  function fuzzyMatch(text, search) {
    if (!search) return true;
    text = text.toLowerCase();
    search = search.toLowerCase();
    if (text.includes(search)) return true;

    // tolerate up to 2 mismatches
    let mismatches = 0;
    let j = 0;
    for (let i = 0; i < text.length && j < search.length; i++) {
      if (text[i] === search[j]) j++;
      else mismatches++;
      if (mismatches > 2) return false;
    }
    return j >= search.length - 1;
  }

  // --- Controlled scroll behavior
  function scrollDownToDeals() {
    if (window.innerWidth > 768) {
      dealsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (!hasScrolledDown) {
      hasScrolledDown = true;
      setTimeout(() => {
        dealsSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }

  function scrollBackUp() {
    if (window.innerWidth <= 768 && hasScrolledDown) {
      hasScrolledDown = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- Pause all product videos
  function pauseAllVideos() {
    document.querySelectorAll(".product-video").forEach((v) => v.pause());
  }

  // --- Resume visible product videos
  function resumeVisibleVideos() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const video = card.querySelector(".product-video");
      if (!video) return;
      const isVisible = window.getComputedStyle(card).display !== "none";
      if (isVisible) video.play().catch(() => {});
      else video.pause();
    });
  }

  // --- Perform search
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (query === lastQuery) return;
    lastQuery = query;

    let found = false;
    products.forEach((product) => {
      const name = product
        .querySelector(".product-info h3")
        .textContent.toLowerCase();
      const desc =
        product.querySelector(".product-info p")?.textContent.toLowerCase() ||
        "";

      if (fuzzyMatch(name, query) || fuzzyMatch(desc, query)) {
        product.style.display = "block";
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    // --- Handle video playback visibility
    resumeVisibleVideos();

    if (query && !found) {
      noMatchMsg.textContent = `No results found for "${query}".`;
      noMatchMsg.style.display = "block";
      pauseAllVideos();
    } else {
      noMatchMsg.style.display = "none";
    }

    // --- Scroll behavior
    if (query) {
      scrollDownToDeals();
    } else {
      scrollBackUp();
      resetSearch();
    }
  }

  // --- Reset search
  function resetSearch() {
    products.forEach((product) => (product.style.display = "block"));
    noMatchMsg.style.display = "none";
    resumeVisibleVideos();
  }

  // --- Input handler (debounced)
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch();

      // Scroll only when user types something new
      const value = searchInput.value.trim();
      if (value.length > 0) {
        scrollDownToDeals();
      } else {
        scrollBackUp();
      }
    }, 200);
  });

  // --- Button click
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
  });

  // --- Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  // --- Keyboard open / close tracking
  let keyboardOpen = false;
  searchInput.addEventListener("focus", () => (keyboardOpen = true));
  searchInput.addEventListener("blur", () => (keyboardOpen = false));

  // --- Orientation fix
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768 && keyboardOpen) {
      window.scrollTo({ top: 0 });
    }
  });
});
