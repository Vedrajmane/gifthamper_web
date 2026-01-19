# Production Deployment Checklist

Complete guide for deploying WordLane to production.

---

## Phase 10: Testing & Optimization

### 1. Mobile Responsiveness ✓

**Test on:**

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Various screen sizes (320px - 1920px)

**Key Areas:**

- [ ] Header navigation
- [ ] Product cards
- [ ] Filter sidebar
- [ ] Checkout flow
- [ ] Admin panel

**Tools:**

- Chrome DevTools (Device Mode)
- BrowserStack / LambdaTest
- Real devices

---

### 2. Performance Optimization

#### Image Optimization

- [ ] Use Next.js Image component everywhere
- [ ] Compress images (TinyPNG, Squoosh)
- [ ] Use WebP format
- [ ] Implement lazy loading
- [ ] Add blur placeholders

#### Code Optimization

```bash
# Analyze bundle size
npm run build
npm run analyze
```

- [ ] Remove unused dependencies
- [ ] Code splitting for large components
- [ ] Lazy load heavy components
- [ ] Minimize JavaScript bundle

#### Caching Strategy

- [ ] Set up CDN (Cloudflare, Vercel)
- [ ] Configure browser caching
- [ ] Implement service workers
- [ ] Use SWR for data fetching

---

### 3. SEO Improvements

#### Meta Tags

Add to each page:

```tsx
export const metadata = {
  title: "Premium Gift Hampers | Martini by Nidhi",
  description: "Handcrafted gift hampers for all occasions in Mumbai",
  keywords: "gifts, hampers, Mumbai, baby shower, wedding",
  openGraph: {
    title: "Martini by Nidhi",
    description: "Premium gift hampers",
    images: ["/og-image.jpg"],
  },
};
```

#### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Martini by Nidhi",
  "description": "Premium gift hampers",
  "url": "https://martinibynidhi.com"
}
```

#### Checklist

- [ ] Add meta descriptions to all pages
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Implement structured data
- [ ] Optimize page titles
- [ ] Add alt text to all images
- [ ] Create Google Business Profile

---

### 4. Security Audit

#### Firebase Security

- [ ] Review Firestore security rules
- [ ] Restrict admin access
- [ ] Enable App Check
- [ ] Set up rate limiting

#### Environment Variables

- [ ] Never commit .env files
- [ ] Use different keys for dev/prod
- [ ] Rotate API keys regularly

#### HTTPS

- [ ] Force HTTPS redirect
- [ ] Set up SSL certificate
- [ ] Configure security headers

#### Input Validation

- [ ] Sanitize all user inputs
- [ ] Validate on both client and server
- [ ] Prevent SQL injection (if using SQL)
- [ ] XSS protection

---

### 5. Testing Checklist

#### Functional Testing

- [ ] User registration/login
- [ ] Product browsing
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Payment processing
- [ ] Order confirmation
- [ ] Admin product management
- [ ] Admin category management
- [ ] Personalization form
- [ ] Review submission
- [ ] Location selector
- [ ] Filters

#### Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

#### Performance Testing

- [ ] Lighthouse score > 90
- [ ] Page load < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Core Web Vitals pass

---

### 6. Pre-Launch Checklist

#### Content

- [ ] Add real product images (4 per product)
- [ ] Write product descriptions
- [ ] Set up categories
- [ ] Add delivery information
- [ ] Create privacy policy
- [ ] Create terms & conditions
- [ ] Add contact information

#### Analytics

- [ ] Set up Google Analytics
- [ ] Configure conversion tracking
- [ ] Set up Facebook Pixel (optional)
- [ ] Monitor error tracking (Sentry)

#### Email

- [ ] Set up transactional emails
- [ ] Order confirmation template
- [ ] Shipping notification
- [ ] Welcome email

#### Payment

- [ ] Complete Razorpay KYC
- [ ] Switch to live API keys
- [ ] Test with real payment
- [ ] Set up refund policy

---

### 7. Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Environment Variables on Vercel

Add all variables from `.env.local`:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- etc.

#### Custom Domain

1. Add domain in Vercel
2. Update DNS records
3. Enable HTTPS

---

### 8. Post-Launch Monitoring

#### Week 1

- [ ] Monitor error logs daily
- [ ] Check payment success rate
- [ ] Review user feedback
- [ ] Fix critical bugs

#### Ongoing

- [ ] Weekly analytics review
- [ ] Monthly performance audit
- [ ] Quarterly security review
- [ ] Regular backups

---

### 9. Performance Targets

**Lighthouse Scores:**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

**Core Web Vitals:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

### 10. Backup & Recovery

#### Firebase Backup

- [ ] Enable Firestore backups
- [ ] Export data regularly
- [ ] Test restore process

#### Code Backup

- [ ] Push to GitHub
- [ ] Tag releases
- [ ] Document deployment process

---

## Quick Launch Commands

```bash
# 1. Final build test
npm run build
npm run start

# 2. Run tests
npm run test

# 3. Check for updates
npm outdated

# 4. Deploy to Vercel
vercel --prod

# 5. Monitor logs
vercel logs
```

---

## Support & Maintenance

### Regular Tasks

- **Daily**: Monitor errors, check orders
- **Weekly**: Review analytics, update content
- **Monthly**: Security updates, performance review
- **Quarterly**: Feature updates, user surveys

### Emergency Contacts

- Hosting: Vercel Support
- Payment: Razorpay Support
- Database: Firebase Support

---

## Success Metrics

Track these KPIs:

- Conversion rate
- Average order value
- Cart abandonment rate
- Page load time
- Error rate
- Customer satisfaction

---

**Ready for Production!** 🚀
