// ==========================================
// SiamMarket - Application Engine & State Manager
// ==========================================

// Global App State
const state = {
  products: [],
  categories: INITIAL_CATEGORIES,
  cart: [],
  wishlist: [],
  orders: [],
  appliedCoupon: null,
  activeCategory: "all",
  searchQuery: "",
  priceMin: 0,
  priceMax: 40000,
  ratingMin: 0,
  onlyFreeShipping: false,
  onlyFlashSale: false,
  sortBy: "popular",
  theme: "light",
  qrCountdownSeconds: 600,
  qrTimerInterval: null
};

// Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: "siammarket_products_v1",
  CART: "siammarket_cart_v1",
  WISHLIST: "siammarket_wishlist_v1",
  ORDERS: "siammarket_orders_v1",
  THEME: "siammarket_theme_v1"
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  initTheme();
  initEventListeners();
  initFlashSaleTimer();
  renderAll();
});

// ==========================================
// DATA PERSISTENCE & STORAGE
// ==========================================

function loadFromStorage() {
  // Load Products (merge with default if empty)
  const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (savedProducts) {
    try {
      state.products = JSON.parse(savedProducts);
    } catch (e) {
      state.products = [...INITIAL_PRODUCTS];
    }
  } else {
    state.products = [...INITIAL_PRODUCTS];
    saveToStorage(STORAGE_KEYS.PRODUCTS, state.products);
  }

  // Load Cart
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  if (savedCart) {
    try { state.cart = JSON.parse(savedCart); } catch (e) { state.cart = []; }
  }

  // Load Wishlist
  const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  if (savedWishlist) {
    try { state.wishlist = JSON.parse(savedWishlist); } catch (e) { state.wishlist = []; }
  }

  // Load Orders
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (savedOrders) {
    try { state.orders = JSON.parse(savedOrders); } catch (e) { state.orders = []; }
  }

  // Load Theme
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    state.theme = savedTheme;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

// ==========================================
// THEME MANAGER
// ==========================================

function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  saveToStorage(STORAGE_KEYS.THEME, state.theme);
  updateThemeIcon();
  showToast(`เปลี่ยนเป็นโหมด ${state.theme === "dark" ? "Dark Mode 🌙" : "Light Mode ☀️"} เรียบร้อย`, "info");
}

function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    if (state.theme === "dark") {
      icon.className = "fa-solid fa-sun";
      icon.style.color = "#f59e0b";
    } else {
      icon.className = "fa-solid fa-moon";
      icon.style.color = "";
    }
  }
}

// ==========================================
// TOAST NOTIFICATION UTILITY
// ==========================================

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconClass = "fa-solid fa-circle-check";
  if (type === "danger") iconClass = "fa-solid fa-circle-exclamation";
  if (type === "info") iconClass = "fa-solid fa-circle-info";

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(120%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// EVENT LISTENERS INITIALIZATION
// ==========================================

function initEventListeners() {
  // Theme Toggle
  document.getElementById("themeToggleBtn")?.addEventListener("click", toggleTheme);

  // Search Input & Button
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchInput?.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  searchBtn?.addEventListener("click", () => {
    state.searchQuery = searchInput.value.trim().toLowerCase();
    renderProducts();
    document.getElementById("marketplaceSection")?.scrollIntoView({ behavior: "smooth" });
  });

  // Price Filters
  const minInput = document.getElementById("minPriceInput");
  const maxInput = document.getElementById("maxPriceInput");
  const priceSlider = document.getElementById("priceRangeSlider");

  priceSlider?.addEventListener("input", (e) => {
    state.priceMax = Number(e.target.value);
    if (maxInput) maxInput.value = state.priceMax;
    renderProducts();
  });

  minInput?.addEventListener("change", (e) => {
    state.priceMin = Math.max(0, Number(e.target.value) || 0);
    renderProducts();
  });

  maxInput?.addEventListener("change", (e) => {
    state.priceMax = Math.max(state.priceMin, Number(e.target.value) || 40000);
    if (priceSlider) priceSlider.value = state.priceMax;
    renderProducts();
  });

  // Rating Filters
  document.querySelectorAll('input[name="ratingFilter"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.ratingMin = Number(e.target.value);
      renderProducts();
    });
  });

  // Feature Badges Filters
  document.getElementById("filterFreeShipping")?.addEventListener("change", (e) => {
    state.onlyFreeShipping = e.target.checked;
    renderProducts();
  });

  document.getElementById("filterFlashSale")?.addEventListener("change", (e) => {
    state.onlyFlashSale = e.target.checked;
    renderProducts();
  });

  // Reset Filters
  document.getElementById("resetFilterBtn")?.addEventListener("click", resetFilters);

  // Sorting
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Drawer Triggers
  document.getElementById("openCartBtn")?.addEventListener("click", () => openDrawer("cart"));
  document.getElementById("closeCartDrawerBtn")?.addEventListener("click", () => closeDrawer("cart"));
  document.getElementById("cartDrawerOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "cartDrawerOverlay") closeDrawer("cart");
  });

  document.getElementById("openWishlistBtn")?.addEventListener("click", () => openDrawer("wishlist"));
  document.getElementById("closeWishlistDrawerBtn")?.addEventListener("click", () => closeDrawer("wishlist"));
  document.getElementById("wishlistDrawerOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "wishlistDrawerOverlay") closeDrawer("wishlist");
  });

  document.getElementById("openOrdersBtn")?.addEventListener("click", () => openDrawer("orders"));
  document.getElementById("topOrderBtn")?.addEventListener("click", () => openDrawer("orders"));
  document.getElementById("closeOrdersDrawerBtn")?.addEventListener("click", () => closeDrawer("orders"));
  document.getElementById("ordersDrawerOverlay")?.addEventListener("click", (e) => {
    if (e.target.id === "ordersDrawerOverlay") closeDrawer("orders");
  });

  // Seller Hub Modal Triggers
  const openSellerModal = () => openModal("sellerModal");
  document.getElementById("openSellerModalBtn")?.addEventListener("click", openSellerModal);
  document.getElementById("topSellerBtn")?.addEventListener("click", openSellerModal);
  document.getElementById("heroSellerCtaBtn")?.addEventListener("click", openSellerModal);
  document.getElementById("sidebarSellerBtn")?.addEventListener("click", openSellerModal);
  document.getElementById("closeSellerModalBtn")?.addEventListener("click", () => closeModal("sellerModal"));

  // Seller Hub Image Presets
  document.querySelectorAll(".preset-img-choice").forEach(choice => {
    choice.addEventListener("click", () => {
      document.querySelectorAll(".preset-img-choice").forEach(c => c.classList.remove("selected"));
      choice.classList.add("selected");
      const urlInput = document.getElementById("sellerImageUrl");
      if (urlInput) urlInput.value = choice.getAttribute("data-src");
    });
  });

  // Seller Hub Form Submit
  document.getElementById("sellerForm")?.addEventListener("submit", handleAddSellerProduct);

  // Coupon Applicator
  document.getElementById("applyCouponBtn")?.addEventListener("click", applyCouponFromInput);
  document.querySelectorAll(".coupon-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      const code = tag.getAttribute("data-code");
      const couponInput = document.getElementById("couponInput");
      if (couponInput) couponInput.value = code;
      applyCoupon(code);
    });
  });

  // Quick View Modal Close
  document.getElementById("closeQuickViewBtn")?.addEventListener("click", () => closeModal("quickViewModal"));

  // Checkout Triggers
  document.getElementById("proceedCheckoutBtn")?.addEventListener("click", () => {
    if (state.cart.length === 0) {
      showToast("ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อนสั่งซื้อ", "danger");
      return;
    }
    closeDrawer("cart");
    openCheckoutModal();
  });

  document.getElementById("closeCheckoutBtn")?.addEventListener("click", () => closeModal("checkoutModal"));

  // Payment Method Tabs in Checkout
  document.querySelectorAll(".payment-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".payment-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const method = tab.getAttribute("data-method");
      switchPaymentMethod(method);
    });
  });

  // Checkout Form Submit
  document.getElementById("checkoutForm")?.addEventListener("submit", handleCheckoutSubmit);

  // Success Modal Buttons
  document.getElementById("successContinueShoppingBtn")?.addEventListener("click", () => {
    closeModal("orderSuccessModal");
  });

  document.getElementById("successViewOrdersBtn")?.addEventListener("click", () => {
    closeModal("orderSuccessModal");
    openDrawer("orders");
  });

  // Footer Category Quick Links
  document.querySelectorAll("[data-category-link]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const catId = link.getAttribute("data-category-link");
      setCategory(catId);
      document.getElementById("marketplaceSection")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Help Button
  document.getElementById("helpBtn")?.addEventListener("click", () => {
    showToast("ศูนย์ช่วยเหลือ: ติดต่อฝ่ายบริการลูกค้าที่ LINE @siammarket ได้ตลอด 24 ชม.", "info");
  });
}

// ==========================================
// RENDER ALL COMPONENTS
// ==========================================

function renderAll() {
  renderCategories();
  renderFlashSale();
  renderProducts();
  renderCart();
  renderWishlist();
  renderOrders();
  updateBadges();
}

// ==========================================
// CATEGORIES
// ==========================================

function renderCategories() {
  const container = document.getElementById("categoriesContainer");
  if (!container) return;

  container.innerHTML = state.categories.map(cat => {
    const isActive = state.activeCategory === cat.id;
    return `
      <button class="category-pill-btn ${isActive ? 'active' : ''}" onclick="setCategory('${cat.id}')">
        <i class="${cat.icon}"></i>
        <span>${cat.name}</span>
      </button>
    `;
  }).join("");
}

function setCategory(categoryId) {
  state.activeCategory = categoryId;
  renderCategories();
  renderProducts();
}

// ==========================================
// FLASH SALE
// ==========================================

function initFlashSaleTimer() {
  // 4 hours 30 mins mock timer ticking down
  let totalSeconds = 4 * 3600 + 28 * 60 + 50;

  const hoursEl = document.getElementById("timerHours");
  const minEl = document.getElementById("timerMinutes");
  const secEl = document.getElementById("timerSeconds");

  setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 12 * 3600; // loop
    }
    totalSeconds--;

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hoursEl) hoursEl.textContent = String(hrs).padStart(2, "0");
    if (minEl) minEl.textContent = String(mins).padStart(2, "0");
    if (secEl) secEl.textContent = String(secs).padStart(2, "0");
  }, 1000);
}

function renderFlashSale() {
  const container = document.getElementById("flashSaleContainer");
  if (!container) return;

  const flashItems = state.products.filter(p => p.isFlashSale).slice(0, 5);

  container.innerHTML = flashItems.map(item => {
    const percentSold = Math.min(95, Math.round((item.soldCount / (item.soldCount + item.stock)) * 100)) || 65;
    return `
      <div class="flash-item-card" onclick="openQuickView('${item.id}')">
        <span class="flash-badge"><i class="fa-solid fa-bolt"></i> ลด ${item.discount}%</span>
        <div class="flash-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="flash-name">${item.name}</div>
        <div class="flash-price-wrap">
          <span class="flash-price">฿${formatNumber(item.price)}</span>
          <span class="flash-original-price">฿${formatNumber(item.originalPrice)}</span>
        </div>
        <div class="flash-progress">
          <div class="flash-progress-bar" style="width: ${percentSold}%;"></div>
          <span class="flash-progress-text">ขายแล้ว ${percentSold}%</span>
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// PRODUCTS LISTING & FILTERS
// ==========================================

function getFilteredProducts() {
  return state.products.filter(p => {
    // Category Filter
    if (state.activeCategory !== "all" && p.category !== state.activeCategory) {
      return false;
    }
    // Search Query
    if (state.searchQuery) {
      const matchName = p.name.toLowerCase().includes(state.searchQuery);
      const matchDesc = p.description ? p.description.toLowerCase().includes(state.searchQuery) : false;
      const matchSeller = p.seller?.name ? p.seller.name.toLowerCase().includes(state.searchQuery) : false;
      if (!matchName && !matchDesc && !matchSeller) return false;
    }
    // Price Filter
    if (p.price < state.priceMin || p.price > state.priceMax) {
      return false;
    }
    // Rating Filter
    if (p.rating < state.ratingMin) {
      return false;
    }
    // Free Shipping Filter
    if (state.onlyFreeShipping && !p.isFreeShipping) {
      return false;
    }
    // Flash Sale Filter
    if (state.onlyFlashSale && !p.isFlashSale) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (state.sortBy === "price-asc") return a.price - b.price;
    if (state.sortBy === "price-desc") return b.price - a.price;
    if (state.sortBy === "rating") return b.rating - a.rating;
    if (state.sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
    return (b.soldCount || 0) - (a.soldCount || 0); // popular
  });
}

function renderProducts() {
  const container = document.getElementById("productsGridContainer");
  const countEl = document.getElementById("productCountNum");
  const categoryLabelEl = document.getElementById("currentCategoryLabel");

  const filtered = getFilteredProducts();

  if (countEl) countEl.textContent = filtered.length;
  if (categoryLabelEl) {
    const currentCat = state.categories.find(c => c.id === state.activeCategory);
    categoryLabelEl.textContent = currentCat ? currentCat.name : "ทั้งหมด";
  }

  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div>
        <h3>ไม่พบสินค้าที่คุณค้นหา</h3>
        <p>ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองราคาและหมวดหมู่</p>
        <button class="btn-primary" onclick="resetFilters()">
          <i class="fa-solid fa-arrow-rotate-left"></i> ล้างตัวกรองทั้งหมด
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isWishlisted = state.wishlist.includes(p.id);
    return `
      <div class="product-card">
        <div class="product-card-top">
          <div class="product-badge-group">
            ${p.discount ? `<span class="badge badge-discount">-${p.discount}%</span>` : ""}
            ${p.isFreeShipping ? `<span class="badge badge-free-ship"><i class="fa-solid fa-truck-fast"></i> ส่งฟรี</span>` : ""}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}', event)" title="เพิ่มในรายการโปรด">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
          <div class="quick-view-overlay">
            <button class="quick-view-btn" onclick="openQuickView('${p.id}')">
              <i class="fa-solid fa-eye"></i> ดูสินค้าด่วน
            </button>
          </div>
        </div>
        <div class="product-body">
          <div class="seller-info">
            <i class="fa-solid fa-store"></i>
            <span>${p.seller?.name || "ร้านค้าแนะนำ"}</span>
            ${p.seller?.verified ? `<i class="fa-solid fa-circle-check verified" title="ร้านค้ายืนยันแล้ว"></i>` : ""}
          </div>
          <h4 class="product-title" onclick="openQuickView('${p.id}')">${p.name}</h4>
          <div class="product-meta">
            <div class="rating-badge">
              <i class="fa-solid fa-star"></i>
              <span>${p.rating}</span>
            </div>
            <span>•</span>
            <span>ขายแล้ว ${formatNumber(p.soldCount || 0)} ชิ้น</span>
          </div>
          <div class="product-price-row">
            <span class="current-price">฿${formatNumber(p.price)}</span>
            ${p.originalPrice ? `<span class="old-price">฿${formatNumber(p.originalPrice)}</span>` : ""}
          </div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> เพิ่มลงตะกร้า
            </button>
            <button class="btn-buy-instant" onclick="buyInstant('${p.id}')">
              ซื้อเลย
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function resetFilters() {
  state.activeCategory = "all";
  state.searchQuery = "";
  state.priceMin = 0;
  state.priceMax = 40000;
  state.ratingMin = 0;
  state.onlyFreeShipping = false;
  state.onlyFlashSale = false;
  state.sortBy = "popular";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  const minInput = document.getElementById("minPriceInput");
  if (minInput) minInput.value = 0;

  const maxInput = document.getElementById("maxPriceInput");
  if (maxInput) maxInput.value = 40000;

  const slider = document.getElementById("priceRangeSlider");
  if (slider) slider.value = 40000;

  const firstRating = document.querySelector('input[name="ratingFilter"][value="0"]');
  if (firstRating) firstRating.checked = true;

  const shipCb = document.getElementById("filterFreeShipping");
  if (shipCb) shipCb.checked = false;

  const flashCb = document.getElementById("filterFlashSale");
  if (flashCb) flashCb.checked = false;

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "popular";

  renderCategories();
  renderProducts();
  showToast("รีเซ็ตตัวกรองเรียบร้อยแล้ว", "info");
}

// ==========================================
// WISHLIST LOGIC
// ==========================================

function toggleWishlist(productId, event) {
  if (event) event.stopPropagation();

  const index = state.wishlist.indexOf(productId);
  const product = state.products.find(p => p.id === productId);

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`นำ "${product ? product.name.slice(0, 20) + '...' : 'สินค้า'}" ออกจากรายการโปรดแล้ว`, "info");
  } else {
    state.wishlist.push(productId);
    showToast(`เพิ่ม "${product ? product.name.slice(0, 20) + '...' : 'สินค้า'}" ในรายการโปรดแล้ว ❤️`, "success");
  }

  saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
  updateBadges();
  renderProducts();
  renderWishlist();
}

function renderWishlist() {
  const container = document.getElementById("wishlistItemsList");
  const countEl = document.getElementById("drawerWishlistCount");
  if (countEl) countEl.textContent = state.wishlist.length;

  if (!container) return;

  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <div class="empty-state-icon"><i class="fa-regular fa-heart"></i></div>
        <h3>ไม่มีรายการที่ถูกใจ</h3>
        <p>กดรูปหัวใจบนสินค้าที่คุณสนใจเพื่อบันทึกไว้ดูภายหลัง</p>
      </div>
    `;
    return;
  }

  const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

  container.innerHTML = wishlistProducts.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${p.name}</h4>
        <div class="cart-item-price">฿${formatNumber(p.price)}</div>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <button class="btn-primary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;" onclick="addToCart('${p.id}'); toggleWishlist('${p.id}');">
            <i class="fa-solid fa-cart-plus"></i> ย้ายลงตะกร้า
          </button>
          <button class="cart-item-delete" onclick="toggleWishlist('${p.id}')">
            <i class="fa-solid fa-trash-can"></i> ลบ
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// CART & COUPON LOGIC
// ==========================================

function addToCart(productId, qty = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      isFreeShipping: product.isFreeShipping,
      quantity: qty
    });
  }

  saveToStorage(STORAGE_KEYS.CART, state.cart);
  renderCart();
  updateBadges();
  showToast(`เพิ่ม "${product.name.slice(0, 22)}..." ลงในตะกร้าแล้ว`, "success");
}

function buyInstant(productId) {
  addToCart(productId, 1);
  openDrawer("cart");
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.id !== productId);
    showToast("นำสินค้าออกจากตะกร้าแล้ว", "info");
  }

  saveToStorage(STORAGE_KEYS.CART, state.cart);
  renderCart();
  updateBadges();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveToStorage(STORAGE_KEYS.CART, state.cart);
  renderCart();
  updateBadges();
  showToast("นำสินค้าออกจากตะกร้าแล้ว", "info");
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let shipping = 0;
  if (state.cart.length > 0) {
    const allFreeShip = state.cart.every(item => item.isFreeShipping);
    if (!allFreeShip && subtotal < 500) {
      shipping = 50;
    }
  }

  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.freeShipping) {
      shipping = 0;
    }
    if (state.appliedCoupon.discountPercent) {
      discount = Math.round(subtotal * (state.appliedCoupon.discountPercent / 100));
    }
    if (state.appliedCoupon.discountAmount) {
      discount = state.appliedCoupon.discountAmount;
    }
  }

  const grandTotal = Math.max(0, subtotal + shipping - discount);

  return { subtotal, shipping, discount, grandTotal };
}

function renderCart() {
  const container = document.getElementById("cartItemsList");
  const countEl = document.getElementById("drawerCartCount");
  const subtotalEl = document.getElementById("cartSubtotalText");
  const discountRowEl = document.getElementById("couponDiscountRow");
  const discountEl = document.getElementById("cartDiscountText");
  const shippingEl = document.getElementById("cartShippingText");
  const totalEl = document.getElementById("cartGrandTotalText");

  const totalItemsCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  if (countEl) countEl.textContent = totalItemsCount;

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <div class="empty-state-icon"><i class="fa-solid fa-cart-shopping"></i></div>
        <h3>ตะกร้าสินค้าว่างเปล่า</h3>
        <p>คุณยังไม่ได้เลือกสินค้าใดๆ ช้อปสินค้าโดนใจได้เลย</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "฿0";
    if (discountRowEl) discountRowEl.style.display = "none";
    if (shippingEl) shippingEl.textContent = "฿0";
    if (totalEl) totalEl.textContent = "฿0";
    return;
  }

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">฿${formatNumber(item.price)}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
          <button class="cart-item-delete" onclick="removeFromCart('${item.id}')" title="ลบ">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  const { subtotal, shipping, discount, grandTotal } = calculateCartTotals();

  if (subtotalEl) subtotalEl.textContent = `฿${formatNumber(subtotal)}`;
  
  if (discountRowEl && discountEl) {
    if (discount > 0) {
      discountRowEl.style.display = "flex";
      discountEl.textContent = `-฿${formatNumber(discount)}`;
    } else {
      discountRowEl.style.display = "none";
    }
  }

  if (shippingEl) {
    shippingEl.textContent = shipping === 0 ? "ส่งฟรี 🎉" : `฿${formatNumber(shipping)}`;
  }

  if (totalEl) totalEl.textContent = `฿${formatNumber(grandTotal)}`;
}

function applyCouponFromInput() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  applyCoupon(code);
}

function applyCoupon(code) {
  if (!code) {
    showToast("กรุณากรอกโค้ดส่วนลด", "danger");
    return;
  }

  const { subtotal } = calculateCartTotals();
  const coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    showToast(`โค้ด "${code}" ไม่ถูกต้องหรือหมดอายุแล้ว`, "danger");
    return;
  }

  if (subtotal < coupon.minSpend) {
    showToast(`โค้ดนี้ใช้ได้เมื่อมียอดสั่งซื้อขั้นต่ำ ฿${formatNumber(coupon.minSpend)} ขึ้นไป`, "danger");
    return;
  }

  state.appliedCoupon = coupon;
  renderCart();
  showToast(`ใช้โค้ดส่วนลด "${coupon.code}" สำเร็จ! ${coupon.desc}`, "success");
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================

function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById("quickViewModalBody");
  if (!modalBody) return;

  const isWishlisted = state.wishlist.includes(product.id);

  modalBody.innerHTML = `
    <div class="quick-view-grid">
      <div>
        <img src="${product.image}" alt="${product.name}" class="modal-product-img">
      </div>
      <div class="quick-view-details">
        <div class="seller-info" style="margin-bottom: 0.5rem;">
          <i class="fa-solid fa-store text-primary"></i>
          <b>${product.seller?.name || "ร้านค้า SiamMarket"}</b>
          ${product.seller?.verified ? `<i class="fa-solid fa-circle-check verified"></i>` : ""}
          <span style="margin-left: auto; color: var(--text-light);"><i class="fa-solid fa-location-dot"></i> ${product.seller?.location || "กรุงเทพฯ"}</span>
        </div>

        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.6rem; line-height: 1.35;">${product.name}</h2>
        
        <div class="product-meta" style="margin-bottom: 1rem;">
          <div class="rating-badge">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating}</span>
          </div>
          <span>(${product.reviewsCount || 100} รีวิว)</span>
          <span>•</span>
          <span>สต็อกคงเหลือ <b>${product.stock || 20} ชิ้น</b></span>
        </div>

        <div class="product-price-row" style="margin-bottom: 1rem;">
          <span class="current-price" style="font-size: 1.6rem;">฿${formatNumber(product.price)}</span>
          ${product.originalPrice ? `<span class="old-price" style="font-size: 1rem;">฿${formatNumber(product.originalPrice)}</span>` : ""}
          ${product.discount ? `<span class="badge badge-discount" style="font-size: 0.8rem;">ลด ${product.discount}%</span>` : ""}
        </div>

        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          ${product.description || "สินค้าคุณภาพ การันตีแท้ 100% พร้อมบริการจัดส่งด่วน"}
        </p>

        ${product.specs && product.specs.length ? `
          <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem;">คุณสมบัติเด่น:</div>
          <ul class="specs-list">
            ${product.specs.map(spec => `<li><i class="fa-solid fa-circle-check"></i> ${spec}</li>`).join("")}
          </ul>
        ` : ""}

        <div style="display: flex; gap: 0.75rem; margin-top: auto; padding-top: 1rem;">
          <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="addToCart('${product.id}'); closeModal('quickViewModal');">
            <i class="fa-solid fa-cart-plus"></i> เพิ่มลงตะกร้า
          </button>
          <button class="btn-buy-instant" style="padding: 0 1.25rem;" onclick="buyInstant('${product.id}'); closeModal('quickViewModal');">
            ซื้อเลย
          </button>
          <button class="icon-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${product.id}')" title="รายการโปรด" style="width: 45px; height: 45px;">
            <i class="${isWishlisted ? 'fa-solid text-danger' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  openModal("quickViewModal");
}

// ==========================================
// CHECKOUT & PAYMENT FLOW
// ==========================================

function openCheckoutModal() {
  const { grandTotal } = calculateCartTotals();
  
  const qrTotalText = document.getElementById("qrTotalText");
  const finalTotalText = document.getElementById("checkoutFinalTotal");
  
  if (qrTotalText) qrTotalText.textContent = `฿${formatNumber(grandTotal)}`;
  if (finalTotalText) finalTotalText.textContent = `฿${formatNumber(grandTotal)}`;

  startQRCountdown();
  openModal("checkoutModal");
}

function startQRCountdown() {
  if (state.qrTimerInterval) clearInterval(state.qrTimerInterval);
  state.qrCountdownSeconds = 600; // 10 mins

  const countdownEl = document.getElementById("qrCountdown");

  state.qrTimerInterval = setInterval(() => {
    state.qrCountdownSeconds--;
    if (state.qrCountdownSeconds <= 0) {
      clearInterval(state.qrTimerInterval);
      if (countdownEl) countdownEl.textContent = "00:00 (หมดอายุ)";
      return;
    }

    const m = Math.floor(state.qrCountdownSeconds / 60);
    const s = state.qrCountdownSeconds % 60;
    if (countdownEl) countdownEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, 1000);
}

function switchPaymentMethod(method) {
  const promptPayBox = document.getElementById("paymentContentPromptPay");
  const cardBox = document.getElementById("paymentContentCard");
  const codBox = document.getElementById("paymentContentCOD");

  if (promptPayBox) promptPayBox.style.display = method === "promptpay" ? "block" : "none";
  if (cardBox) cardBox.style.display = method === "creditcard" ? "block" : "none";
  if (codBox) codBox.style.display = method === "cod" ? "block" : "none";
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("custName")?.value.trim();
  const phone = document.getElementById("custPhone")?.value.trim();
  const address = document.getElementById("custAddress")?.value.trim();

  if (!name || !phone || !address) {
    showToast("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน", "danger");
    return;
  }

  const { subtotal, shipping, discount, grandTotal } = calculateCartTotals();
  const orderId = "ORD-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
  const trackingCode = "TH-EXP-" + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    trackingCode: trackingCode,
    date: new Date().toLocaleString("th-TH"),
    status: "กำลังเตรียมพัสดุ",
    items: [...state.cart],
    subtotal,
    shipping,
    discount,
    grandTotal,
    customer: { name, phone, address }
  };

  // Add to orders
  state.orders.unshift(newOrder);
  saveToStorage(STORAGE_KEYS.ORDERS, state.orders);

  // Clear cart
  state.cart = [];
  state.appliedCoupon = null;
  saveToStorage(STORAGE_KEYS.CART, state.cart);

  // Stop QR Timer
  if (state.qrTimerInterval) clearInterval(state.qrTimerInterval);

  closeModal("checkoutModal");
  renderCart();
  renderOrders();
  updateBadges();

  // Show Order Success Modal
  const successBadge = document.getElementById("successOrderCodeBadge");
  const successName = document.getElementById("successCustName");
  const successTrack = document.getElementById("successTrackingCode");

  if (successBadge) successBadge.textContent = orderId;
  if (successName) successName.textContent = name;
  if (successTrack) successTrack.textContent = trackingCode;

  openModal("orderSuccessModal");
  showToast("สั่งซื้อสินค้าสำเร็จแล้ว! ระบบกำลังดำเนินการจัดส่ง", "success");
}

// ==========================================
// ORDER HISTORY DRAWER
// ==========================================

function renderOrders() {
  const container = document.getElementById("ordersListContainer");
  const badge = document.getElementById("orderCountBadge");

  if (badge) {
    if (state.orders.length > 0) {
      badge.style.display = "flex";
      badge.textContent = state.orders.length;
    } else {
      badge.style.display = "none";
    }
  }

  if (!container) return;

  if (state.orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <div class="empty-state-icon"><i class="fa-solid fa-receipt"></i></div>
        <h3>ยังไม่มีประวัติคำสั่งซื้อ</h3>
        <p>เมื่อคุณสั่งซื้อสินค้า ข้อมูลและรหัสติดตามพัสดุจะแสดงที่นี่</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.orders.map(order => `
    <div style="background: var(--bg-card-subtle); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <b style="color: var(--primary); font-size: 0.95rem;">${order.id}</b>
        <span class="badge" style="background: #ecfdf5; color: #10b981;">${order.status}</span>
      </div>
      <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.6rem;">
        <span>วันที่สั่งซื้อ: ${order.date}</span>
      </div>
      <div style="border-top: 1px dashed var(--border-color); border-bottom: 1px dashed var(--border-color); padding: 0.5rem 0; margin-bottom: 0.6rem;">
        ${order.items.map(i => `
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
            <span>${i.name.slice(0, 24)}... × ${i.quantity}</span>
            <b>฿${formatNumber(i.price * i.quantity)}</b>
          </div>
        `).join("")}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700;">
        <span>ยอดชำระสุทธิ:</span>
        <span style="color: var(--primary);">฿${formatNumber(order.grandTotal)}</span>
      </div>
      <div style="margin-top: 0.6rem; font-size: 0.8rem; background: var(--bg-card); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
        <span>รหัสพัสดุ:</span>
        <b style="color: #0ea5e9;">${order.trackingCode}</b>
      </div>
    </div>
  `).join("");
}

// ==========================================
// SELLER HUB - ADD PRODUCT
// ==========================================

function handleAddSellerProduct(e) {
  e.preventDefault();

  const name = document.getElementById("sellerProductName")?.value.trim();
  const category = document.getElementById("sellerCategory")?.value;
  const shopName = document.getElementById("sellerShopName")?.value.trim() || "ร้านค้าของฉัน";
  const price = Number(document.getElementById("sellerPrice")?.value);
  const originalPrice = Number(document.getElementById("sellerOriginalPrice")?.value) || 0;
  const stock = Number(document.getElementById("sellerStock")?.value) || 50;
  const isFreeShipping = document.getElementById("sellerFreeShipping")?.checked;
  const imageUrl = document.getElementById("sellerImageUrl")?.value.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  const desc = document.getElementById("sellerDesc")?.value.trim() || "สินค้าคุณภาพจากร้านค้าผู้ขาย SiamMarket";

  if (!name || !price) {
    showToast("กรุณากรอกชื่อสินค้าและราคาให้ถูกต้อง", "danger");
    return;
  }

  let discount = 0;
  if (originalPrice > price) {
    discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const newProduct = {
    id: "seller_p_" + Date.now(),
    name: name,
    category: category,
    price: price,
    originalPrice: originalPrice > price ? originalPrice : null,
    discount: discount > 0 ? discount : null,
    image: imageUrl,
    rating: 5.0,
    reviewsCount: 1,
    soldCount: 0,
    stock: stock,
    isFlashSale: false,
    isFreeShipping: isFreeShipping,
    seller: {
      name: shopName,
      verified: true,
      rating: 5.0,
      location: "ประเทศไทย"
    },
    description: desc,
    specs: ["สินค้าใหม่ 100%", "รับประกันคุณภาพโดยผู้ขาย", "จัดส่งรวดเร็ว"],
    featured: true
  };

  // Add to top of products array
  state.products.unshift(newProduct);
  saveToStorage(STORAGE_KEYS.PRODUCTS, state.products);

  // Reset form and close modal
  document.getElementById("sellerForm")?.reset();
  closeModal("sellerModal");

  // Re-render
  renderProducts();
  showToast(`ลงขายสินค้า "${newProduct.name.slice(0, 20)}..." สำเร็จแล้ว! สินค้าพร้อมให้ผู้ซื้อสั่งซื้อ`, "success");

  // Scroll to products
  document.getElementById("marketplaceSection")?.scrollIntoView({ behavior: "smooth" });
}

// ==========================================
// MODAL & DRAWER HELPERS
// ==========================================

function openDrawer(name) {
  if (name === "cart") document.getElementById("cartDrawerOverlay")?.classList.add("open");
  if (name === "wishlist") document.getElementById("wishlistDrawerOverlay")?.classList.add("open");
  if (name === "orders") document.getElementById("ordersDrawerOverlay")?.classList.add("open");
}

function closeDrawer(name) {
  if (name === "cart") document.getElementById("cartDrawerOverlay")?.classList.remove("open");
  if (name === "wishlist") document.getElementById("wishlistDrawerOverlay")?.classList.remove("open");
  if (name === "orders") document.getElementById("ordersDrawerOverlay")?.classList.remove("open");
}

function openModal(modalId) {
  document.getElementById(modalId)?.classList.add("open");
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove("open");
}

function updateBadges() {
  const totalCartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartBadge = document.getElementById("cartCountBadge");
  if (cartBadge) cartBadge.textContent = totalCartCount;

  const wishlistBadge = document.getElementById("wishlistCountBadge");
  if (wishlistBadge) wishlistBadge.textContent = state.wishlist.length;
}

// Number Formatter (1234 -> 1,234)
function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString("th-TH");
}

// Global window exposure for inline events
window.setCategory = setCategory;
window.openQuickView = openQuickView;
window.addToCart = addToCart;
window.buyInstant = buyInstant;
window.toggleWishlist = toggleWishlist;
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.resetFilters = resetFilters;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.openModal = openModal;
window.closeModal = closeModal;
