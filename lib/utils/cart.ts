import { CartItem } from '../types/product';

const CART_STORAGE_KEY = 'martini_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  cart.push({ ...item, quantity: 1 });
  saveCart(cart);
  return cart;
}

export function removeFromCart(index: number): CartItem[] {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.length;
}
