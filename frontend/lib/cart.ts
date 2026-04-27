export type CartItem = {
  listing_id: number;
  title: string;
  price: number;
  quantity: number;
  maxQty: number;
  seller: string;
  image_url: string | null;
};

const KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.listing_id === item.listing_id);
  if (idx >= 0) {
    cart[idx].quantity = Math.min(cart[idx].quantity + item.quantity, item.maxQty);
  } else {
    cart.push(item);
  }
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function removeFromCart(listing_id: number): void {
  localStorage.setItem(KEY, JSON.stringify(getCart().filter((i) => i.listing_id !== listing_id)));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function updateQty(listing_id: number, quantity: number): void {
  const cart = getCart().map((i) =>
    i.listing_id === listing_id
      ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQty)) }
      : i
  );
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearCart(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("cartUpdated"));
}
