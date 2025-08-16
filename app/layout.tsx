import './globals.css';
import type { Metadata, Viewport } from 'next';
import { siteUrl } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'troll — Take the Pill. Make a Meme.',
    template: '%s — troll',
  },
  description:
    'troll is a troll+pill meme generator. Flat yellow, thick outline, instant exports. Take the pill, make them cope.',
  openGraph: {
    type: 'website',
    title: 'troll',
    description: 'Generate. Share. Multiply.',
    images: ['/og-pill-yellow.png'],
    url: '/',
  },
  icons: {
    icon: '/images/Troll.png',
    shortcut: '/images/Troll.png',
    apple: '/images/Troll.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD400',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/images/Troll.png" />
        <link rel="shortcut icon" href="/images/Troll.png" />
        <link rel="apple-touch-icon" href="/images/Troll.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}