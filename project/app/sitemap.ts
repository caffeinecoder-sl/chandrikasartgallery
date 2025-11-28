import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogPost, ArtProduct } from '@/lib/models';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://chandiPunchiart.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDatabase();

    // Get all published blog posts
    const blogPosts = await BlogPost.find({ status: 'published' })
      .select('slug updatedAt')
      .lean();

    // Get all available products
    const products = await ArtProduct.find({ status: 'available' })
      .select('_id updatedAt')
      .lean();

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/shop/${product._id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1,
      },
      {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/shop`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/subscribe`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/download-book`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
    ];

    return [...staticPages, ...blogEntries, ...productEntries];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return basic sitemap on error
    const BASE_URL = process.env.NEXTAUTH_URL || 'https://chandiPunchiart.com';
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1,
      },
      {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/shop`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  }
}
