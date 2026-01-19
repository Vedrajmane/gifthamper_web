export interface Address {
  id?: string;
  userId?: string;
  fullName: string;
  phoneNumber: string;
  phoneVerified?: boolean;
  houseNumber: string;
  buildingName?: string;
  street: string;
  landmark?: string;
  area: string; // Mumbai area from mumbai-areas.ts
  pincode: string;
  addressType?: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface DeliveryStatus {
  orderId: string;
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  estimatedDelivery?: Date;
  currentLocation?: string;
  updates: DeliveryUpdate[];
}

export interface DeliveryUpdate {
  timestamp: Date;
  status: string;
  message: string;
  location?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: Address;
  deliveryStatus: DeliveryStatus;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  createdAt: Date;
  deliveryInstructions?: string;
  giftMessage?: string;
  deliveryDate?: Date;
  deliverySlot?: 'Morning' | 'Afternoon' | 'Evening' | 'Midnight';
}

import { CartItem } from './product';
