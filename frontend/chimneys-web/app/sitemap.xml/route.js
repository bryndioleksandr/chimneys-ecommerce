import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://chimneys-shop.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // Статичні сторінки
  const staticPages = [
    {
      url: '',
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: '/category',
      changefreq: 'weekly', 
      priority: '0.8'
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: '/contacts',
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/pay-delivery',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/exchange-return',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/constructor-dym',
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      url: '/account',
      changefreq: 'monthly',
      priority: '0.4'
    },
    {
      url: '/cart',
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      url: '/favorites',
      changefreq: 'weekly',
      priority: '0.5'
    }
  ];

  // Тут можна додати динамічні сторінки з бази даних
  // const products = await fetchProducts();
  // const categories = await fetchCategories();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
