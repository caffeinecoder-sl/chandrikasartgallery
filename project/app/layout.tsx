import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { defaultMetadata } from '@/lib/seo';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-black`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
