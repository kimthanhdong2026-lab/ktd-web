import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

/** Spec D4 — index everything except the search and quote endpoints. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/tim-kiem', '/bao-gia'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
