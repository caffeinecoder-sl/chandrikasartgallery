# SEO & Performance Optimization Guide

## Implemented Features

### 1. ✅ Metadata & SEO
- **Default metadata** in `lib/seo.ts` with OpenGraph and Twitter cards
- **Root layout** configured with meta tags
- **robots.txt** with sitemap reference and crawl directives
- **Dynamic sitemap.xml** (`app/sitemap.ts`) generated from database
- **JSON-LD schemas** for Organization, BlogPost, Product, BreadcrumbList
- **Canonical URLs** included in all page metadata

### 2. ✅ Structured Data
- Organization schema with contact info
- BlogPost schema with author, dates, images
- Product schema with pricing and availability
- BreadcrumbList schema for navigation hierarchy

### 3. ✅ Static Assets
- `public/robots.txt` - Search engine crawl directives
- `public/uploads/` - User-uploaded image storage

## Performance Improvements to Implement

### Next.js Image Optimization
Replace `<img>` tags with Next.js `<Image>` component:

```tsx
import Image from 'next/image';

// Before
<img src="/uploads/image.jpg" alt="description" />

// After
<Image 
  src="/uploads/image.jpg" 
  alt="description" 
  width={1200} 
  height={800}
  priority={false}
  quality={75}
/>
```

Benefits:
- Automatic format conversion (WebP)
- Lazy loading by default
- Responsive images
- Built-in optimization

### Font Optimization
Currently using `next/font`:
- ✅ Google Fonts (Inter) pre-loaded
- ✅ CSS-in-JS optimized
- ✅ Zero layout shift (font-display: swap)

### Caching Strategy
Add to `next.config.js`:
```js
headers: [
  {
    source: '/uploads/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable'
      }
    ]
  }
]
```

### Database Query Optimization
- ✅ Mongoose indexes on slug, email, status, category
- ✅ Lean queries in sitemap for better performance
- ✅ Select only needed fields

### API Response Compression
- ✅ Next.js handles gzip automatically
- Consider compression for large JSON responses

## SEO Checklist

- [x] Meta titles and descriptions
- [x] OpenGraph tags for social sharing
- [x] Twitter card tags
- [x] Canonical URLs
- [x] robots.txt with sitemap
- [x] Dynamic sitemap.xml
- [x] JSON-LD structured data
- [ ] Image alt text (verify in all pages)
- [ ] Mobile responsiveness (already good with Tailwind)
- [ ] Page speed (use Lighthouse)
- [ ] Core Web Vitals (measure with PageSpeed Insights)

## Environment Variables Needed

```env
NEXTAUTH_URL=https://yourdomain.com  # For sitemap generation
```

## Testing

1. **Google Search Console**
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`
   - Test robots.txt: `https://yourdomain.com/robots.txt`

2. **Rich Results Test**
   - Test JSON-LD schemas at https://search.google.com/test/rich-results

3. **PageSpeed Insights**
   - https://pagespeed.web.dev

4. **Lighthouse**
   - Chrome DevTools → Lighthouse tab

## Next Steps

1. Convert all `<img>` tags to Next.js `<Image>`
2. Add image dimensions to Image components
3. Implement route caching headers
4. Monitor Core Web Vitals
5. Set up Google Analytics
6. Configure Search Console
