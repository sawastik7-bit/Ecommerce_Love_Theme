// Ethereal Boutique - Page-specific init functions.
// Each function re-runs the interactive logic for its page after content is
// rendered (either on initial load or after SPA-style route navigation).

import CartState from "./cart.js";
import { getProduct } from "./products.js";

// ---- Shop page ----
export function initShop() {
  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    if (btn.dataset.ehBound) return;
    btn.dataset.ehBound = "1";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = getProduct(btn.dataset.addToCart);
      if (!product || product.soldOut) return;
      CartState.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: "M",
        color: product.color,
        quantity: 1,
      });
      CartState.updateCartBadges();
    });
  });
}

// ---- Product detail page ----
export function initProduct() {
  const product = getProduct("aura-silk-slip-dress");
  if (!product) return;

  let selectedColor = "Blush";
  let selectedSize = "S";
  let quantity = 1;

  const colorLabel = document.querySelector("[data-color-label]");
  const qtyValue = document.querySelector("[data-qty-value]");

  // Color swatches
  document.querySelectorAll("[data-color-swatches] [data-color]").forEach((swatch) => {
    if (swatch.dataset.ehBound) return;
    swatch.dataset.ehBound = "1";
    swatch.addEventListener("click", () => {
      document.querySelectorAll("[data-color-swatches] [data-color]").forEach((s) => {
        s.classList.remove("border-primary");
        s.classList.add("border-transparent");
      });
      swatch.classList.remove("border-transparent");
      swatch.classList.add("border-primary");
      selectedColor = swatch.dataset.color;
      if (colorLabel) colorLabel.textContent = "Color: " + selectedColor;
    });
  });

  // Size options
  document.querySelectorAll("[data-size-options] [data-size]").forEach((opt) => {
    if (opt.dataset.ehBound) return;
    opt.dataset.ehBound = "1";
    opt.addEventListener("click", () => {
      document.querySelectorAll("[data-size-options] [data-size]").forEach((o) => {
        o.classList.remove("border-primary", "bg-primary", "text-on-primary", "soft-shadow");
        o.classList.add("border-outline-variant", "text-on-surface");
      });
      opt.classList.remove("border-outline-variant", "text-on-surface");
      opt.classList.add("border-primary", "bg-primary", "text-on-primary", "soft-shadow");
      selectedSize = opt.dataset.size;
    });
  });

  // Quantity controls
  const qtyMinus = document.querySelector("[data-qty-minus]");
  const qtyPlus = document.querySelector("[data-qty-plus]");
  if (qtyMinus && !qtyMinus.dataset.ehBound) {
    qtyMinus.dataset.ehBound = "1";
    qtyMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity -= 1;
        if (qtyValue) qtyValue.textContent = quantity;
      }
    });
  }
  if (qtyPlus && !qtyPlus.dataset.ehBound) {
    qtyPlus.dataset.ehBound = "1";
    qtyPlus.addEventListener("click", () => {
      quantity += 1;
      if (qtyValue) qtyValue.textContent = quantity;
    });
  }

  // Add to cart
  const addBtn = document.querySelector("[data-add-to-cart]");
  if (addBtn && !addBtn.dataset.ehBound) {
    addBtn.dataset.ehBound = "1";
    addBtn.addEventListener("click", () => {
      CartState.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
      CartState.updateCartBadges();
    });
  }
}

// ---- Cart page ----
export function initCart() {
  const itemsEl = document.querySelector("[data-cart-items]");
  const emptyEl = document.querySelector("[data-cart-empty]");
  const countEl = document.querySelector("[data-cart-count]");
  const subtotalEl = document.querySelector("[data-summary-subtotal]");
  const totalEl = document.querySelector("[data-summary-total]");
  if (!itemsEl) return;

  function fmt(n) {
    return "$" + n.toFixed(2);
  }

  function render() {
    const items = CartState.getItems();
    if (countEl)
      countEl.textContent =
        items.length + (items.length === 1 ? " item" : " items") + " securely reserved for you.";
    if (subtotalEl) subtotalEl.textContent = fmt(CartState.getTotal());
    if (totalEl) totalEl.textContent = fmt(CartState.getTotal());

    if (items.length === 0) {
      itemsEl.classList.add("hidden");
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }
    itemsEl.classList.remove("hidden");
    if (emptyEl) emptyEl.classList.add("hidden");

    itemsEl.innerHTML = items
      .map(
        (item, idx) => `
      <article class="bg-white rounded-DEFAULT p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center soft-shadow relative" data-item="${idx}">
        <div class="w-full sm:w-32 h-40 bg-primary-fixed rounded-xl overflow-hidden flex-shrink-0 shadow-polaroid">
          <img alt="${item.name}" class="w-full h-full object-cover mix-blend-multiply" src="${item.image}"/>
        </div>
        <div class="flex-grow flex flex-col gap-2">
          <div class="flex justify-between items-start w-full">
            <div>
              <h3 class="font-headline-sm text-body-lg text-on-surface font-medium">${item.name}</h3>
              <p class="font-body-md text-sm text-on-surface-variant mt-1">Color: ${item.color} | Size: ${item.size}</p>
            </div>
            <button aria-label="Remove item" class="text-outline hover:text-error transition-colors p-2 -mr-2 -mt-2" data-remove>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">close</span>
            </button>
          </div>
          <div class="flex justify-between items-end mt-4 w-full">
            <div class="flex items-center border border-outline-variant rounded-full bg-surface">
              <button aria-label="Decrease quantity" class="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors" data-dec>
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="font-body-md text-body-md w-8 text-center text-on-surface" data-qty>${item.quantity}</span>
              <button aria-label="Increase quantity" class="px-3 py-1 text-on-surface-variant hover:text-primary transition-colors" data-inc>
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <span class="font-headline-sm text-body-lg text-on-surface">${fmt(item.price * item.quantity)}</span>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    itemsEl.querySelectorAll("[data-item]").forEach((article) => {
      const item = items[Number(article.dataset.item)];
      article.querySelector("[data-inc]").addEventListener("click", () => {
        CartState.updateQuantity(item.id, item.size, item.color, item.quantity + 1);
        render();
      });
      article.querySelector("[data-dec]").addEventListener("click", () => {
        CartState.updateQuantity(item.id, item.size, item.color, item.quantity - 1);
        render();
      });
      article.querySelector("[data-remove]").addEventListener("click", () => {
        CartState.removeItem(item.id, item.size, item.color);
        render();
      });
    });
  }

  render();
  CartState.subscribe(render);
}

// ---- Dispatcher: map a page name to its init function ----
export function initPage(pageName) {
  switch (pageName) {
    case "shop":
      return initShop();
    case "product":
      return initProduct();
    case "cart":
      return initCart();
    default:
      return null;
  }
}
