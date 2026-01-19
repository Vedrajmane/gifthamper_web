import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth.context';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Martini by Nidhi | Baby Shower, Corporate Gifts & Crystal Healing',
  description:
    'Turning ideas into reality since 2003. Mumbai-based gift designers specializing in baby shower hampers, corporate gifting, weddings, and custom celebrations.',
  keywords: [
    'baby shower gifts',
    'corporate gifts Mumbai',
    'wedding favors',
    'gift hampers',
    'custom gifting',
    'Mumbai gifts',
  ],
  authors: [{ name: 'Martini by Nidhi' }],
  openGraph: {
    title: 'Martini by Nidhi | Premium Gift Designer',
    description:
      'Mumbai\'s premier creators of memories. From bespoke baby shower hampers to complete wedding branding.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
