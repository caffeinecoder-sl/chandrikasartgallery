import { siteConfig } from './seo';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.links),
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: process.env.ADMIN_EMAIL || 'contact@chandiPunchiart.com',
    },
  };
}

export function generateBlogPostSchema(
  title: string,
  description: string,
  author: string,
  datePublished: Date,
  dateModified?: Date,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
  };
}

export function generateProductSchema(
  name: string,
  description: string,
  price: number,
  image?: string,
  availability: 'InStock' | 'OutOfStock' = 'InStock'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: image,
    offers: {
      '@type': 'Offer',
      availability: `https://schema.org/${availability}`,
      priceCurrency: 'USD',
      price: price.toString(),
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
