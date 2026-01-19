export interface Offer {
  id: string;
  provider: string;
  logo: string;
  description: string;
  discount: string;
  minTransaction?: number;
  code?: string;
  link?: string;
  bgColor: string;
  textColor: string;
}

export const offers: Offer[] = [
  {
    id: 'paytm',
    provider: 'Paytm',
    logo: '💳',
    description: 'Get Cashback up to Rs.300 on a minimum transaction of Rs.799',
    discount: 'Up to ₹300',
    minTransaction: 799,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'amazon',
    provider: 'Amazon Pay',
    logo: '🛒',
    description: 'Get up to Rs.200 cashback on Amazon Pay Balance orders (minimum order value Rs.1500)',
    discount: 'Up to ₹200',
    minTransaction: 1500,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
  {
    id: 'freecharge',
    provider: 'Freecharge',
    logo: '⚡',
    description: 'Flat 15% off up to Rs.200 on a minimum transaction of Rs.999',
    discount: '15% off',
    minTransaction: 999,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
  },
  {
    id: 'mobikwik',
    provider: 'MobiKwik',
    logo: '💰',
    description: 'Get up to Rs.300 cashback on transactions using MobiKwik UPI (Wallet/Wallet)',
    discount: 'Up to ₹300',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'phonepe',
    provider: 'PhonePe',
    logo: '📱',
    description: 'Get cashback up to Rs.250 on minimum order of Rs.1000',
    discount: 'Up to ₹250',
    minTransaction: 1000,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
];
