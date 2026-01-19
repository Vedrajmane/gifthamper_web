import { CartItem } from '../types/product';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210';

export function formatCartForWhatsApp(cart: CartItem[]): string {
  if (cart.length === 0) return '';

  let message = "Hi Martini by Nidhi! I'd like to place an order:%0A%0A";
  
  let total = 0;
  
  cart.forEach((item) => {
    message += `• ${item.name} - ₹${item.price}%0A`;
    total += item.price;
  });
  
  message += `%0A*Total: ₹${total}*%0A%0A`;
  message += 'Please confirm availability and delivery details.';
  
  return message;
}

export function getWhatsAppURL(cart: CartItem[]): string {
  const message = formatCartForWhatsApp(cart);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

export function openWhatsAppOrder(cart: CartItem[]): void {
  const url = getWhatsAppURL(cart);
  window.open(url, '_blank');
}
