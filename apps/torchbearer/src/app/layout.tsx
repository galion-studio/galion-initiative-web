import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

// Warm, readable font for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Warm, friendly font for headings
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Torchbearer - GALION Ecosystem AI',
    template: '%s | Torchbearer',
  },
  description:
    'Caring AI support for the GALION community. Get guidance, wisdom, and compassionate assistance.',
  keywords: [
    'AI guidance',
    'caring AI',
    'wisdom',
    'life guidance',
    'philosophy',
    'spirituality',
    'consciousness',
    'reality',
    'humanity',
    'project 42',
  ],
  authors: [{ name: 'Project 42' }],
  creator: 'Project 42',
  publisher: 'Project 42',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
