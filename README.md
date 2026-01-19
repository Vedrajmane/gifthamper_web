# Martini by Nidhi - Next.js E-commerce Website

A modern, interactive e-commerce website for Martini by Nidhi, a Mumbai-based gift company with 21 years of experience. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🎁 Features

- **Beautiful UI**: Premium design with smooth animations using Framer Motion
- **Gift Categories**: 6+ categories including Baby Shower, Weddings, Corporate, Housewarming, and more
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **WhatsApp Ordering**: Customers can place orders directly via WhatsApp
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Performance Optimized**: Next.js Image optimization, lazy loading, and SSR
- **SEO Ready**: Comprehensive meta tags and structured data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Playfair Display & Lato (Google Fonts)
- **Commerce**: Shopify Headless (structure ready)
- **Ordering**: WhatsApp Business API

## 📦 Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your WhatsApp business phone number:

```
NEXT_PUBLIC_WHATSAPP_PHONE=919876543210
```

3. **Run development server**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
e:\wordlane\
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Home page with all sections
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation header
│   │   └── Footer.tsx      # Footer with links
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Categories.tsx  # Gift categories grid
│   │   └── FeaturedProducts.tsx  # Product listing
│   └── ui/
│       ├── ProductCard.tsx # Product card component
│       ├── CartSidebar.tsx # Shopping cart sidebar
│       ├── CategoryCard.tsx # Category card
│       └── WhatsAppButton.tsx # Floating WhatsApp button
├── lib/
│   ├── data/
│   │   ├── products.ts     # Product data
│   │   └── categories.ts   # Category data
│   ├── types/
│   │   └── product.ts      # TypeScript interfaces
│   └── utils/
│       ├── cart.ts         # Cart utilities
│       └── whatsapp.ts     # WhatsApp integration
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
├── next.config.ts          # Next.js configuration
└── package.json
```

## 🎨 Customization

### Update Products

Edit `lib/data/products.ts` to add/modify products:

```typescript
{
  id: '1',
  name: 'Product Name',
  description: 'Product description',
  price: 1999,
  category: 'Baby Shower',
  imageUrl: 'https://images.unsplash.com/...',
}
```

### Update Categories

Edit `lib/data/categories.ts` to modify categories.

### WhatsApp Configuration

Update your WhatsApp business number in `.env.local`:

```
NEXT_PUBLIC_WHATSAPP_PHONE=919876543210
```

Format: International format without the `+` sign.

## 📱 Features in Detail

### Shopping Cart

- Add products to cart
- Remove items from cart
- Persistent cart (localStorage)
- Real-time cart count badge
- Total calculation

### WhatsApp Ordering

When customers click "Order via WhatsApp", they're redirected to WhatsApp with a pre-filled message:

```
Hi Martini by Nidhi! I'd like to place an order:

• Premium Baby Shower Hamper - ₹3,499
• Corporate Gift Box - ₹1,800

Total: ₹5,299

Please confirm availability and delivery details.
```

### Categories

- Baby Shower (main focus)
- Weddings & Celebrations
- Corporate Gifting
- Housewarming Celebrations
- Naming & Tradition Ceremonies
- Gift Hampers & Bulk Orders

### Animations

- Framer Motion page transitions
- Scroll-triggered animations
- Hover effects on products and categories
- Smooth cart slide-in/out
- Magnetic button effects

## 🔮 Future Enhancements

### Shopify Integration

The app is structured to easily integrate with Shopify Headless:

1. Create a Shopify store
2. Generate Storefront API token
3. Add to `.env.local`:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
```

4. Replace local product data with Shopify API calls

### Additional Features

- Admin panel for product management
- Product search functionality
- Related products
- Customer reviews
- Order tracking
- Multiple payment options

## 📄 License

© 2024 Martini by Nidhi. All rights reserved.

## 🤝 Support

For questions and support, contact us:

- **Instagram**: [@martinibynidhi](https://www.instagram.com/martinibynidhi)
- **Email**: contact@martinibynidhi.com
- **Location**: Mumbai, Maharashtra

---

Built with ❤️ in Mumbai
