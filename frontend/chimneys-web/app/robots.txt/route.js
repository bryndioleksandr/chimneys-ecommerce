import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://dymohit.com.ua'; // Твій домен

  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Забороняємо технічні папки
Disallow: /admin/
Disallow: /api/

# Забороняємо особисті дані
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /favorites
Disallow: /login
Disallow: /register
Disallow: /reset-password

# Забороняємо пошук
Disallow: /search
Disallow: /*?sort=
Disallow: /*?filter=

# ВАЖЛИВО: Ми НЕ блокуємо /_next/ та /static/, 
# бо Google має бачити стилі сайту!
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
