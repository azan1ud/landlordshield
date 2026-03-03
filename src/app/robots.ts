import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/pricing', '/blog', '/privacy', '/terms', '/cookies', '/login', '/signup', '/landlord-compliance-checklist', '/gas-safety-certificate-tracker', '/epc-deadline-checker'],
      disallow: ['/dashboard', '/properties', '/calendar', '/reports', '/settings', '/api/', '/mtd', '/epc', '/renters-rights', '/knowledge'],
    },
    sitemap: 'https://landlordshield.vercel.app/sitemap.xml',
  };
}
