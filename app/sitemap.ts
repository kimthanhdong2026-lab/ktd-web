import type { MetadataRoute } from 'next'
import { NEWS } from '@/lib/ktd-data'
import { getAllProductSlugs } from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/san-pham`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/gioi-thieu`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/tin-tuc`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const products: MetadataRoute.Sitemap = (await getAllProductSlugs()).map((slug) => ({
    url: `${SITE_URL}/san-pham/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const articles: MetadataRoute.Sitemap = NEWS.map((n) => ({
    url: `${SITE_URL}/tin-tuc/${n.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  return [...staticPages, ...products, ...articles]
}
