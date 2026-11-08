/* PRODUCT LIST */

const products = [
  {
    name: "Cafe Americano",
    price: 45,
    category: "coffee",
    image: "assets/caffeamericano.jpg"
  },
  {
    name: "Oreo Caramel",
    price: 55,
    category: "coffee",
    image: "assets/oreocaramel.jpg"
  },
  {
    name: "Salted Caramel",
    price: 55,
    category: "coffee",
    image: "assets/saltedcaramel.jpg"
  },
  {
    name: "Spanish Latte",
    price: 55,
    category: "coffee",
    image: "assets/spanishlattte.jfif.jpg"
  },
  {
    name: "Hazelnut Latte",
    price: 55,
    category: "coffee",
    image: "assets/hazelnutlatte.jpg"
  },
  {
    name: "Dark Mocha Macchiato",
    price: 55,
    category: "coffee",
    image: "assets/darkmocha.png"
  },
  {
    name: "Strawberry Latte",
    price: 55,
    category: "noncoffee",
    image: "assets/strawberrylatte.png"
  },
  {
    name: "Butter Scotch Latte",
    price: 45,
    category: "coffee",
    image: "assets/butterscotch.png"
  },
  {
    name: "Green Apple Matcha",
    price: 55,
    category: "noncoffee",
    image: "assets/greenapplemacha.png"
  },
  {
    name: "Chocolate Milk",
    price: 55,
    category: "noncoffee",
    image: "assets/chocolatemilk.png"
  },
  {
    name: "Fruit Soda - Strawberry",
    price: 45,
    category: "soda",
    image: "assets/fruitsodastrawberry.png"
  },
  {
    name: "Fruit Soda - Green Apple",
    price: 45,
    category: "soda",
    image: "assets/fruit-soda-apple.png"
  },
  {
    name: "Fruit Soda - Blueberry",
    price: 45,
    category: "soda",
    image: "assets/fruit-soda-blueberry.png"
  },
  {
    name: "Fruit Soda - Blue Lemonade",
    price: 45,
    category: "soda",
    image: "assets/lemonade.png"
  }
];


/* VARIABLES */

let cart = [];
let activeFilter = "all";
let homeSlideIndex = 0;

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const subtotalElement = document.getElementById("subtotal");
const discountElement = document.getElementById("discount");
const totalElement = document.getElementById("total");
const cartCountElement = document.getElementById("cartCount");

const orderForm = document.getElementById("orderForm");
const receiptElement = document.getElementById("receipt");

const searchInput = document.getElementById("productSearch");
const noResults = document.getElementById("noResults");

const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

const featuredTrack = document.getElementById("featuredTrack");
const homeDots = document.getElementById("homeDots");


/* PRICE FORMAT */

function peso(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  }).format(amount);
}


/* PAGE NAVIGATION */

function showPage(pageName) {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");

  const targetPage = document.getElementById(pageName);

  if (!targetPage) return;

  pages.forEach(page => {
    page.classList.remove("active");
  });

  targetPage.classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.go === pageName
    );
  });

  if (mainNav) {
    mainNav.classList.remove("open");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  revealVisibleItems();

  if (pageName === "home") {
    updateHomeSlider();
  }
}


/* NAVIGATION BUTTONS */

document.addEventListener("click", function(event) {
  const navigationButton = event.target.closest("[data-go]");

  if (!navigationButton) return;

  event.preventDefault();

  showPage(navigationButton.dataset.go);
});


/* MOBILE MENU */

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function() {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}


/* IMAGE FALLBACK */

function addImageFallback(container) {
  if (!container) return;

  container.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function() {
      img.style.display = "none";
    }, { once: true });
  });
}


/* CATEGORY LABEL */

function categoryLabel(category) {
  const labels = {
    coffee: "Coffee",
    noncoffee: "Non-Coffee",
    soda: "Fruit Soda"
  };

  return labels[category] || "Drink";
}


/* DISPLAY PRODUCTS */

function displayProducts() {
  if (!productGrid) return;

  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filteredProducts = products
    .map((product, index) => ({
      ...product,
      index
    }))
    .filter(product => {
      const matchesCategory =
        activeFilter === "all" ||
        product.category === activeFilter;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        <span class="product-category">
          ${categoryLabel(product.category)}
        </span>

      </div>

      <div class="product-info">

        <h3>${product.name}</h3>

        <div class="product-bottom">

          <span class="product-price">
            ${peso(product.price)}
          </span>

          <button
            class="add-button"
            type="button"
            data-add="${product.index}"
          >
            + Add to Order
          </button>

        </div>

      </div>

    </article>
  `).join("");

  if (noResults) {
    noResults.hidden = filteredProducts.length !== 0;
  }

  addImageFallback(productGrid);
}


/* PRODUCT ADD BUTTON */

if (productGrid) {
  productGrid.addEventListener("click", function(event) {
    const addButton = event.target.closest("[data-add]");

    if (!addButton) return;

    const productIndex = Number(addButton.dataset.add);

    addToCart(productIndex, addButton);
  });
}


/* SEARCH */

if (searchInput) {
  searchInput.addEventListener("input", displayProducts);
}


/* CATEGORY FILTER */

const filterButtons = document.getElementById("filterButtons");

if (filterButtons) {
  filterButtons.addEventListener("click", function(event) {
    const filterButton = event.target.closest("[data-filter]");

    if (!filterButton) return;

    activeFilter = filterButton.dataset.filter;

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button === filterButton
      );
    });

    displayProducts();
  });
}


/* ADD TO CART + IMAGE ANIMATION */

function addToCart(productIndex, addButton) {
  const product = products[productIndex];

  if (!product) return;

  const existingItem = cart.find(item => {
    return item.name === product.name;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  displayCart();

  /* BUTTON CONFIRMATION */

  if (addButton) {
    const originalText = addButton.textContent;

    addButton.textContent = "✓ ADDED TO CART";
    addButton.classList.add("added");

    setTimeout(function() {
      addButton.textContent = originalText;
      addButton.classList.remove("added");
    }, 1200);
  }

  /* PRODUCT IMAGE SHAKE */

  const productCard = addButton
    ? addButton.closest(".product-card")
    : null;

  const productImage = productCard
    ? productCard.querySelector(".product-image img")
    : null;

  if (productImage) {
    productImage.classList.remove("cart-shake");

    void productImage.offsetWidth;

    productImage.classList.add("cart-shake");

    const plus = document.createElement("span");

    plus.className = "cart-plus-effect";
    plus.textContent = "+1";

    productImage.appendChild(plus);

    setTimeout(function() {
      productImage.classList.remove("cart-shake");
      plus.remove();
    }, 900);
  }
}


/* CHANGE QUANTITY */

function changeQuantity(index, amount) {
  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  displayCart();
}


/* REMOVE ITEM */

function removeCartItem(index) {
  if (index < 0 || index >= cart.length) return;

  cart.splice(index, 1);

  displayCart();
}


/* SUBTOTAL */

function calculateSubtotal() {
  return cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);
}


/* DISCOUNT */

function calculateDiscount(subtotal) {
  if (subtotal >= 300) {
    return subtotal * 0.10;
  }

  return 0;
}


/* DISPLAY CART */

function displayCart() {
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-message">
        Your cart is empty.
      </p>
    `;
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">

        <div>

          <div class="cart-item-name">
            ${item.name}
          </div>

          <div class="cart-item-price">
            ${peso(item.price)} each
          </div>

          <div class="cart-controls">

            <button
              class="quantity-btn"
              type="button"
              data-action="decrease"
              data-index="${index}"
              aria-label="Decrease quantity"
            >−</button>

            <span class="quantity-number">
              ${item.quantity}
            </span>

            <button
              class="quantity-btn"
              type="button"
              data-action="increase"
              data-index="${index}"
              aria-label="Increase quantity"
            >+</button>

          </div>

        </div>

        <div>

          <div class="cart-item-price">
            ${peso(item.price * item.quantity)}
          </div>

          <button
            class="remove-btn"
            type="button"
            data-action="remove"
            data-index="${index}"
          >
            Remove
          </button>

        </div>

      </div>
    `).join("");
  }

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;

  const itemCount = cart.reduce(function(sum, item) {
    return sum + item.quantity;
  }, 0);

  if (subtotalElement) {
    subtotalElement.textContent = peso(subtotal);
  }

  if (discountElement) {
    discountElement.textContent = "-" + peso(discount);
  }

  if (totalElement) {
    totalElement.textContent = peso(total);
  }

  if (cartCountElement) {
    cartCountElement.textContent =
      itemCount + (itemCount === 1 ? " item" : " items");
  }
}


/* CART BUTTON ACTIONS */

if (cartItems) {
  cartItems.addEventListener("click", function(event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const index = Number(actionButton.dataset.index);
    const action = actionButton.dataset.action;

    if (action === "increase") {
      changeQuantity(index, 1);
    }

    if (action === "decrease") {
      changeQuantity(index, -1);
    }

    if (action === "remove") {
      removeCartItem(index);
    }
  });
}


/* CLEAR CART */

const clearCartButton = document.getElementById("clearCart");

if (clearCartButton) {
  clearCartButton.addEventListener("click", function() {
    if (cart.length === 0) return;

    cart = [];

    displayCart();

    if (receiptElement) {
      receiptElement.classList.remove("show");
      receiptElement.textContent = "";
    }
  });
}


/* PLACE ORDER */

if (orderForm) {
  orderForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Please add at least one drink to your order.");
      return;
    }

    if (!orderForm.reportValidity()) return;

    const customerInput = document.getElementById("customerName");
    const paymentInput = document.getElementById("paymentMethod");
    const amountPaidInput = document.getElementById("amountPaid");
    const requestInput = document.getElementById("specialRequest");

    const customer = customerInput.value.trim();
    const payment = paymentInput.value;
    const request = requestInput.value.trim();

    if (customer.length < 2) {
      alert("Please enter a valid customer name.");
      return;
    }

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;

    let cashReceived = 0;
    let change = 0;

    if (payment === "Cash") {
      cashReceived = Number(amountPaidInput.value);

      if (!amountPaidInput.value || cashReceived < total) {
        alert("Insufficient cash payment. Please enter the correct amount.");
        return;
      }

      change = cashReceived - total;
    }

    const orderLines = cart.map(function(item) {
      return (
        item.name +
        " x" + item.quantity +
        " - " + peso(item.price * item.quantity)
      );
    }).join("\n");

    const orderNumber = "KK-" + Date.now().toString().slice(-6);

    const date = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    let paymentDetails = "";

    if (payment === "Cash") {
      paymentDetails = `
Payment Method: Cash
Cash Received: ${peso(cashReceived)}
Change: ${peso(change)}
`;
    } else if (payment === "GCash") {
      paymentDetails = `
Payment Method: GCash
Payment Status: Awaiting Verification
`;
    } else {
      paymentDetails = `
Payment Method: Pay at Counter
Payment Status: Pending
`;
    }

    const receiptText = `
KOPPIKUBO COFFEE
"Mas masarap kapag may KAPEling ka."

ORDER RECEIPT

Order No.: ${orderNumber}
Date: ${date}

Customer: ${customer}

ORDER DETAILS
${orderLines}

Subtotal: ${peso(subtotal)}
Discount: -${peso(discount)}
TOTAL: ${peso(total)}

${paymentDetails}
Special Request: ${request || "None"}

Thank you for choosing KoppiKubo!
Have a wonderful day, KAPEling!
    `.trim();

    if (receiptElement) {
      receiptElement.textContent = receiptText;
      receiptElement.classList.add("show");
    }

    cart = [];

    displayCart();

    orderForm.reset();

    if (typeof updatePaymentDisplay === "function") {
      updatePaymentDisplay();
    }

    if (receiptElement) {
      receiptElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


/* FEATURED SLIDESHOW */

const featuredProducts = [0, 3, 6, 9, 12];

function displayFeatured() {
  if (!featuredTrack) return;

  featuredTrack.innerHTML = featuredProducts.map(function(index) {
    const product = products[index];

    return `
      <article class="featured-card">

        <div class="featured-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >
        </div>

        <div class="featured-info">
          <h3>${product.name}</h3>
          <p>${peso(product.price)}</p>
        </div>

      </article>
    `;
  }).join("");

  addImageFallback(featuredTrack);

  updateHomeSlider();
}


/* SLIDESHOW RESPONSIVE SETTINGS */

function getVisibleSlides() {
  if (window.innerWidth <= 520) return 1;

  if (window.innerWidth <= 800) return 2;

  return 3;
}


/* UPDATE SLIDESHOW */

function updateHomeSlider() {
  if (!featuredTrack || !homeDots) return;

  const cards = featuredTrack.querySelectorAll(".featured-card");

  if (cards.length === 0) return;

  const visibleSlides = getVisibleSlides();

  const maxIndex = Math.max(
    0,
    cards.length - visibleSlides
  );

  homeSlideIndex = Math.min(homeSlideIndex, maxIndex);

  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = 18;

  const moveDistance = (cardWidth + gap) * homeSlideIndex;

  featuredTrack.style.transform =
    "translateX(-" + moveDistance + "px)";

  homeDots.innerHTML = "";

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "slider-dot";

    if (i === homeSlideIndex) {
      dot.classList.add("active");
    }

    dot.setAttribute(
      "aria-label",
      "Go to featured slide " + (i + 1)
    );

    dot.addEventListener("click", function() {
      homeSlideIndex = i;
      updateHomeSlider();
    });

    homeDots.appendChild(dot);
  }
}


/* PREVIOUS SLIDE */

const homePrev = document.getElementById("homePrev");

if (homePrev) {
  homePrev.addEventListener("click", function() {
    const maxIndex = Math.max(
      0,
      featuredProducts.length - getVisibleSlides()
    );

    homeSlideIndex =
      homeSlideIndex <= 0
        ? maxIndex
        : homeSlideIndex - 1;

    updateHomeSlider();
  });
}


/* NEXT SLIDE */

const homeNext = document.getElementById("homeNext");

if (homeNext) {
  homeNext.addEventListener("click", function() {
    const maxIndex = Math.max(
      0,
      featuredProducts.length - getVisibleSlides()
    );

    homeSlideIndex =
      homeSlideIndex >= maxIndex
        ? 0
        : homeSlideIndex + 1;

    updateHomeSlider();
  });
}


/* WINDOW RESIZE */

window.addEventListener("resize", function() {
  updateHomeSlider();
});


/* SCROLL REVEAL */

function revealVisibleItems() {
  const revealItems = document.querySelectorAll(
    ".page.active .reveal"
  );

  revealItems.forEach(function(item) {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < window.innerHeight - 50) {
      item.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealVisibleItems);


/* BACK TO TOP */

const backTop = document.getElementById("backTop");

if (backTop) {
  window.addEventListener("scroll", function() {
    backTop.classList.toggle(
      "show",
      window.scrollY > 350
    );
  });

  backTop.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* INITIALIZE WEBSITE */

displayProducts();
displayCart();
displayFeatured();
revealVisibleItems();


/* BACKGROUND MUSIC */

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

if (music && musicButton) {
  musicButton.addEventListener("click", async function() {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "♫ PAUSE MUSIC";
      } catch (error) {
        alert("Music could not play. Please check your music file.");
      }
    } else {
      music.pause();
      musicButton.textContent = "♫ PLAY MUSIC";
    }
  });
}


/* CASH AND GCASH PAYMENT DISPLAY */

const paymentMethod = document.getElementById("paymentMethod");
const cashPayment = document.getElementById("cashPayment");
const gcashPayment = document.getElementById("gcashPayment");
const amountPaid = document.getElementById("amountPaid");
const changePreview = document.getElementById("changePreview");

function updatePaymentDisplay() {
  if (!paymentMethod) return;

  const method = paymentMethod.value;

  if (cashPayment) {
    cashPayment.hidden = method !== "Cash";
  }

  if (gcashPayment) {
    gcashPayment.hidden = method !== "GCash";
  }

  if (amountPaid) {
    amountPaid.required = method === "Cash";
  }

  if (changePreview) {
    changePreview.textContent =
      "Enter your payment amount to see your change.";
  }
}

if (paymentMethod) {
  paymentMethod.addEventListener("change", updatePaymentDisplay);
  updatePaymentDisplay();
}

if (amountPaid) {
  amountPaid.addEventListener("input", function() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = subtotal - discount;
    const paid = Number(amountPaid.value);

    if (!changePreview) return;

    if (amountPaid.value === "") {
      changePreview.textContent =
        "Enter your payment amount to see your change.";
    } else if (paid < total) {
      changePreview.textContent =
        "Insufficient payment. You still need " +
        peso(total - paid);
    } else {
      changePreview.textContent =
        "Your change: " + peso(paid - total);
    }
  });
}


/* ADD TO CART ANIMATION STYLES */

const cartAnimationStyles = document.createElement("style");

cartAnimationStyles.textContent = `
  .product-image {
    position: relative;
    overflow: hidden;
  }

  .add-button.added {
    background: #e8c18a;
    color: #21130d;
  }

  .cart-shake {
    animation: productShake 0.5s ease;
  }

  @keyframes productShake {
    0%, 100% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(-5px);
    }

    50% {
      transform: translateX(5px);
    }

    75% {
      transform: translateX(-3px);
    }
  }

  .cart-plus-effect {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
    background: #e8c18a;
    color: #21130d;
    padding: 10px 15px;
    border-radius: 30px;
    font-size: 18px;
    font-weight: bold;
    pointer-events: none;
    animation: floatPlus 0.9s ease forwards;
  }

  @keyframes floatPlus {
    0% {
      opacity: 0;
      transform: translateY(15px) scale(0.7);
    }

    30% {
      opacity: 1;
      transform: translateY(0) scale(1.1);
    }

    100% {
      opacity: 0;
      transform: translateY(-35px) scale(1);
    }
  }
`;

document.head.appendChild(cartAnimationStyles);