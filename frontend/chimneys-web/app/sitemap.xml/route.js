import { NextResponse } from 'next/server';
// Імпортуй сюди функцію для отримання продуктів з БД, наприклад:
// import { getAllProducts } from '@/services/products';

export async function GET() {
  const baseUrl = 'https://dymohit.com.ua'; // Твій реальний домен
  const currentDate = new Date().toISOString();

  // 1. Статичні сторінки (ТІЛЬКИ ВАЖЛИВІ)
  const staticPages = [
    '', // Головна
    '/category',
    '/about',
    '/contacts',
    '/pay-delivery',
    '/exchange-return',
    '/constructor-dym',
  ];

  // 2. Динамічні сторінки (Приклад логіки)
  // const products = await getAllProducts();
  // const productUrls = products.map(p => `/product/${p.slug}`);

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Додаємо статичні
  staticPages.forEach(url => {
    sitemapXML += `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  // Додаємо динамічні (коли будуть готові)
  /*
  productUrls.forEach(url => {
    sitemapXML += `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>`;
  });
  */

  sitemapXML += `</urlset>`;

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
    }
  });
}
