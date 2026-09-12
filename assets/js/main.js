// Ethereal Boutique - Shared Main Module + SPA-style in-memory router
// Handles Tailwind config, shared partials (nav/footer), navigation interactions,
// in-memory cart badge sync, and client-side routing so the in-memory CartState
// survives navigation (no localStorage, no full page reloads).

import { tailwindConfig } from "./tailwind-config.js";
import CartState from "./cart.js";
import { initPage } from "./pages.js";

// Apply Tailwind config immediately (Play CDN reads tailwind.config global)
if (typeof window !== "undefined" && window.tailwind) {
  window.tailwind.config = tailwindConfig;
}

// ---- Utilities ----
const pageNameFromPath = (path) => {
  const file = path.split("?")[0].split("/").pop() || "index.html";
  const name = file.replace(/\.html$/, "");
  // Special-case the 404 page shown for unknown files
  if (!name || name === "404") return "404";
  return name;
};

// ---- Partial loader ----
async function loadPartial(selector, url) {
  const container = document.querySelector(selector);
  if (!container) return;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    container.innerHTML = await response.text();
    container.removeAttribute("data-include");
  } catch (error) {
    console.error(`Error loading partial ${url}:`, error);
  }
}

// ---- Shared re-init (runs on initial load AND after navigation) ----
function highlightActiveNav() {
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
  const activeClass = ["text-primary", "dark:text-primary-fixed-dim", "border-b", "border-primary", "dark:border-primary-fixed-dim", "pb-1"];
  const inactiveClass = ["text-on-surface-variant", "dark:text-surface-variant"];
  document.querySelectorAll("[data-nav-links] a, [data-mobile-menu] a").forEach((link) => {
    const href = (link.getAttribute("href") || "").replace(/\.html$/, "");
    activeClass.forEach((c) => link.classList.remove(c));
    inactiveClass.forEach((c) => link.classList.remove(c));
    if (href === currentPage || (href === "index" && currentPage === "index")) {
      activeClass.forEach((c) => link.classList.add(c));
    } else {
      inactiveClass.forEach((c) => link.classList.add(c));
    }
  });
}

function initScallopColors() {
  // Scallop dividers are colored via inline --color-bg (or CSS default).
  // Preserve any explicit inline value; fall back to the page background
  // only when the divider has no color of its own.
  document.querySelectorAll(".scallop-up:not([style]), .scallop-down:not([style])").forEach((el) => {
    el.style.setProperty("--color-bg", "#fff7fb");
  });
}

function initMobileMenu() {
  const menuBtn = document.querySelector("[data-mobile-menu-btn]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (!menuBtn || !mobileMenu) return;
  if (menuBtn.dataset.ehBound) return;
  menuBtn.dataset.ehBound = "1";
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

function initCartBadge() {
  CartState.updateCartBadges();
}

function initSmoothScroll() {
  // hash anchor smooth scroll (delegated, so it works after content swaps)
  document.removeEventListener("click", smoothScrollHandler);
  document.addEventListener("click", smoothScrollHandler);
}

function smoothScrollHandler(e) {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const targetId = anchor.getAttribute("href");
  if (!targetId || targetId === "#") return;
  const target = document.querySelector(targetId);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ---- Router ----
async function fetchPageBody(path) {
  const url = path.split("?")[0];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const main = doc.querySelector("main");
  const title = doc.querySelector("title")?.textContent || "";
  // Return the main's INNER content (not its outerHTML): the persistent layout
  // <main> already exists in the DOM and provides padding/spacing, so inserting
  // a second nested <main> would double that spacing and push the hero down
  // (the "gap" seen only on back/forward navigation).
  return { html: main ? main.innerHTML : "", title };
}

async function navigate(path, { replace = false } = {}) {
  const pageName = pageNameFromPath(path);
  let body;
  try {
    body = await fetchPageBody(path);
  } catch {
    // Fall back to the 404 page if the target doesn't exist
    path = "404.html";
    body = await fetchPageBody("404.html");
  }

  const targetMain = document.querySelector("main");
  if (targetMain && body.html) {
    targetMain.innerHTML = body.html;
  }
  if (body.title) document.title = body.title;

  if (replace) {
    history.replaceState({}, "", path);
  } else {
    history.pushState({}, "", path);
  }

  // Re-run shared + page-specific logic for the new page
  initScallopColors();
  initMobileMenu();
  highlightActiveNav();
  initCartBadge();
  initPage(pageName);

  window.scrollTo({ top: 0, behavior: "auto" });
}

function initNavActions() {
  const cartBtn = document.querySelector("[data-cart-btn]");
  if (cartBtn && !cartBtn.dataset.ehBound) {
    cartBtn.dataset.ehBound = "1";
    cartBtn.addEventListener("click", () => navigate("cart.html"));
  }
  const accountBtn = document.querySelector("[data-account-btn]");
  if (accountBtn && !accountBtn.dataset.ehBound) {
    accountBtn.dataset.ehBound = "1";
    accountBtn.addEventListener("click", () => navigate("account.html"));
  }
}

// Delegate all internal link navigation through the router
function handleLinkClick(e) {
  const anchor = e.target.closest("a[href]");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return;
  if (anchor.target && anchor.target === "_blank") return;
  const isInternalHtml = /\.html$/.test(href) && !href.startsWith("http") && !href.startsWith("mailto") && !href.startsWith("tel");
  if (!isInternalHtml) return;
  e.preventDefault();
  navigate(href);
}

window.addEventListener("popstate", () => {
  const pageName = pageNameFromPath(window.location.pathname);
  const path = window.location.pathname + (window.location.search || "");
  fetchPageBody(path)
    .then((body) => {
      const targetMain = document.querySelector("main");
      if (targetMain && body.html) targetMain.innerHTML = body.html;
      if (body.title) document.title = body.title;
      initScallopColors();
      initMobileMenu();
      highlightActiveNav();
      initCartBadge();
      initPage(pageName);
      window.scrollTo(0, 0);
    })
    .catch(() => {});
});

// ---- Initialization ----
export async function initShared() {
  // Load shared partials once (they persist across SPA navigation)
  await Promise.all([
    loadPartial("[data-include='nav']", "assets/partials/nav.html"),
    loadPartial("[data-include='footer']", "assets/partials/footer.html"),
  ]);

  document.addEventListener("click", handleLinkClick);

  const pageName = pageNameFromPath(window.location.pathname);
  initScallopColors();
  initMobileMenu();
  initNavActions();
  highlightActiveNav();
  initCartBadge();
  initSmoothScroll();
  initPage(pageName);

  window.dispatchEvent(new CustomEvent("ethereal:shared-ready"));
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShared);
  } else {
    initShared();
  }
}
