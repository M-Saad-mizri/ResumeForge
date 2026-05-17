import { writeFileSync } from 'node:fs';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://getcv.lovable.app').replace(/\/$/, '');
const LAST_MOD = '2026-05-17';

const urls = [
  ['/', 'weekly', '1.0'],
  ['/builder', 'weekly', '0.9'],
  ['/resume-builder', 'weekly', '0.8'],
  ['/about', 'monthly', '0.7'],
  ['/contact', 'monthly', '0.7'],
  ['/privacy-policy', 'yearly', '0.6'],
  ['/terms-and-conditions', 'yearly', '0.6'],
  ['/disclaimer', 'yearly', '0.6'],
  ['/blog', 'weekly', '0.8'],
  ['/blog/how-to-create-an-ats-friendly-resume', 'monthly', '0.7'],
  ['/blog/best-resume-format-for-fresh-graduates', 'monthly', '0.7'],
  ['/blog/common-resume-mistakes-to-avoid', 'monthly', '0.7'],
  ['/blog/cv-vs-resume-what-is-the-difference', 'monthly', '0.7'],
  ['/blog/how-ai-can-help-you-write-a-better-resume', 'monthly', '0.7'],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(([path, changefreq, priority]) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join('\n')}
</urlset>
`;

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync('public/sitemap.xml', sitemap);
writeFileSync('public/robots.txt', robots);
