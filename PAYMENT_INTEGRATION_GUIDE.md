# Payment Gateway Integration Guide - Razorpay

This guide will help you integrate Razorpay payment gateway into WordLane.

---

## Prerequisites

1. **Razorpay Account**: Sign up at https://razorpay.com/
2. **API Keys**: Get your Test and Live API keys from Razorpay Dashboard

---

## Step 1: Install Razorpay SDK

```bash
npm install razorpay
```

---

## Step 2: Add Environment Variables

Add to `.env.local`:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

---

## Step 3: Create Razorpay Service

**File:** `lib/payment/razorpay.service.ts`

```typescript
import Razorpay from "razorpay";

// Server-side only
export const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amount: number, currency: string = "INR") {
  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const crypto = require("crypto");
  const text = orderId + "|" + paymentId;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  return generated_signature === signature;
}
```

---

## Step 4: Create Checkout Page

**File:** `app/checkout/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth.context";
import { getCart, clearCart } from "@/lib/utils/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState(getCart());
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to continue");
      return;
    }

    setLoading(true);

    try {
      // Create order on server
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const { orderId } = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Martini by Nidhi",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          // Verify payment on server
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            clearCart();
            router.push("/order-success");
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#E11D48", // Rose-600
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>
                {item.name} x {item.quantity || 1}
              </span>
              <span>
                ₹{(item.price * (item.quantity || 1)).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="w-full bg-rose-600 text-white py-4 rounded-lg font-bold hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
```

---

## Step 5: Create API Routes

**File:** `app/api/payment/create-order/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/payment/razorpay.service";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const order = await createOrder(amount);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
```

**File:** `app/api/payment/verify/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payment/razorpay.service";

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json();
    const isValid = await verifyPayment(orderId, paymentId, signature);

    if (isValid) {
      // Save order to database
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
```

---

## Step 6: Add Razorpay Script

Add to `app/layout.tsx` in the `<head>`:

```tsx
<Script src="https://checkout.razorpay.com/v1/checkout.js" />
```

---

## Step 7: Create Order Success Page

**File:** `app/order-success/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-12 text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. You will receive an order confirmation
          email shortly.
        </p>
        <Link
          href="/"
          className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
```

---

## Testing

### Test Mode

1. Use test API keys
2. Test card: `4111 1111 1111 1111`
3. Any future expiry date
4. Any CVV

### Go Live

1. Complete KYC on Razorpay
2. Switch to live API keys
3. Test with real small amount
4. Enable production mode

---

## Security Checklist

- ✅ Never expose secret key in client code
- ✅ Always verify payment on server
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Log all transactions
- ✅ Handle payment failures gracefully

---

## Next Steps

1. Set up Razorpay account
2. Get API keys
3. Install dependencies
4. Create the files above
5. Test in test mode
6. Complete KYC for live mode
