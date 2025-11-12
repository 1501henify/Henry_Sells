document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".categories div");
  const products = document.querySelectorAll(".product-card");
  const dealsSection = document.querySelector("#deals");

  // --- Create "Show All" button (hidden by default)
  const showAllBtn = document.createElement("button");
  showAllBtn.textContent = "Show All";
  showAllBtn.classList.add("show-all-btn");
  dealsSection.parentNode.insertBefore(showAllBtn, dealsSection);

  // --- Create "No Products" message
  const noProductMsg = document.createElement("p");
  noProductMsg.textContent = "";
  dealsSection.parentNode.insertBefore(noProductMsg, dealsSection.nextSibling);

  // --- Apply base styles (mobile-first)
  const applyResponsiveStyles = () => {
    const width = window.innerWidth;

    // Base shared styles
    Object.assign(showAllBtn.style, {
      display: "none",
      background: "var(--acent-gold)",
      color: "var(--bg-clr)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      width: "fit-content",
      alignSelf: "center",
      textAlign: "center",
    });

    Object.assign(noProductMsg.style, {
      display: "none",
      textAlign: "center",
      color: "var(--text-clr)",
      fontFamily: '"Montserrat", sans-serif',
    });

    // Responsive adjustments
    if (width <= 480) {
      // Small phones
      Object.assign(showAllBtn.style, {
        margin: "14px auto",
        padding: "8px 16px",
        fontSize: "0.8rem",
        borderRadius: "6px",
      });
      Object.assign(noProductMsg.style, {
        marginTop: "14px",
        fontSize: "0.8rem",
      });
    } else if (width <= 768) {
      // Tablets
      Object.assign(showAllBtn.style, {
        margin: "18px auto",
        padding: "9px 18px",
        fontSize: "0.9rem",
        borderRadius: "8px",
      });
      Object.assign(noProductMsg.style, {
        marginTop: "18px",
        fontSize: "0.9rem",
      });
    } else {
      // Laptops / Desktops
      Object.assign(showAllBtn.style, {
        margin: "22px auto",
        padding: "10px 22px",
        fontSize: "1rem",
        borderRadius: "8px",
      });
      Object.assign(noProductMsg.style, {
        marginTop: "20px",
        fontSize: "1rem",
      });
    }
  };

  // Apply initial responsive styles
  applyResponsiveStyles();

  // Update on resize or orientation change
  window.addEventListener("resize", applyResponsiveStyles);
  window.addEventListener("orientationchange", applyResponsiveStyles);

  let activeCategory = null;

  // --- Filter Products
  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const categoryName = category
        .querySelector("p")
        .textContent.trim()
        .toLowerCase();
      const brandName = categoryName.split(" ")[0]; // e.g. "HP", "Dell"

      // --- If clicked same category again → reset filter
      if (activeCategory === brandName) {
        resetFilter();
        activeCategory = null;
        return;
      }

      activeCategory = brandName;

      // --- Highlight active category
      categories.forEach((cat) => cat.classList.remove("active-category"));
      category.classList.add("active-category");

      // --- Filter logic
      let found = false;
      products.forEach((product) => {
        const productName = product
          .querySelector(".product-info h3")
          .textContent.toLowerCase();
        if (productName.includes(brandName)) {
          product.style.display = "block";
          product.style.opacity = "1";
          product.style.transform = "scale(1)";
          found = true;
        } else {
          product.style.display = "none";
        }
      });

      // --- Show/hide "No products" message
      if (!found) {
        noProductMsg.textContent = `No ${brandName} products available.`;
        noProductMsg.style.display = "block";
      } else {
        noProductMsg.style.display = "none";
      }

      // --- Show "Show All" button
      showAllBtn.style.display = "block";

      // --- Smooth scroll to products section
      dealsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // --- Show All button functionality
  showAllBtn.addEventListener("click", resetFilter);

  // --- Reset filter function
  function resetFilter() {
    products.forEach((product) => {
      product.style.display = "block";
      product.style.opacity = "1";
      product.style.transform = "scale(1)";
    });
    noProductMsg.style.display = "none";
    showAllBtn.style.display = "none";
    categories.forEach((cat) => cat.classList.remove("active-category"));
    activeCategory = null;
  }
});
