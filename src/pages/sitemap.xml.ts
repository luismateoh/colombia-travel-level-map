import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  // Generate sitemap with current date
  const currentDate = new Date().toISOString();
  const baseUrl = site?.href || "https://colombia-travel-map.vercel.app";

  // Define pages
  const pages = [
    {
      url: '',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      url: 'map/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    }
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};