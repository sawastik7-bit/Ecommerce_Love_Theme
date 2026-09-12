// Ethereal Boutique - Shared in-memory Cart State Module
// Simple in-memory cart state (no localStorage) shared across pages.

const CartState = (() => {
  let items = [];
  let subscribers = [];

  const notify = () => {
    subscribers.forEach((cb) => cb(items));
    updateCartBadges();
  };

  const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback);
    };
  };

  const getItems = () => items;

  const getCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = (product) => {
    const existingIndex = items.findIndex(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += product.quantity || 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size || "M",
        color: product.color || "Blush",
        quantity: product.quantity || 1,
      });
    }
    notify();
  };

  const updateQuantity = (id, size, color, quantity) => {
    const index = items.findIndex(
      (item) => item.id === id && item.size === size && item.color === color
    );
    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      notify();
    }
  };

  const removeItem = (id, size, color) => {
    items = items.filter(
      (item) => !(item.id === id && item.size === size && item.color === color)
    );
    notify();
  };

  const clear = () => {
    items = [];
    notify();
  };

  const updateCartBadges = () => {
    const count = getCount();
    document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
      if (count > 0) {
        badge.textContent = count > 99 ? "99+" : count;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    });
  };

  return {
    getItems,
    getCount,
    getTotal,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    subscribe,
    updateCartBadges,
  };
})();

export default CartState;
