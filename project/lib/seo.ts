import { Metadata } from 'next';

export const siteConfig = {
  name: 'Chandrika Maelge Art',
  description: 'Discover beautiful artworks, read artist insights, and shop unique creations',
  url: process.env.NEXTAUTH_URL || 'https://chandrikaMaelgeart.com',
  authors: [
    {
      name: 'Chandrika Maelge',
      url: 'https://chandrikaMaelgeart.com',
    },
  ],
  links: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
  creator: 'Chandrika Maelge',
  keywords: [
    'art',
    'painting',
    'sculpture',
    'gallery',
    'artist',
    'creative',
    'artwork',
    'handmade',
  ],
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    creator: '@chandrikaMaelge',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export function generatePageMetadata(
  title: string,
  description: string,
  image?: string,
  url?: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: url || siteConfig.url,
      type: 'website',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url || siteConfig.url,
    },
  };
}
