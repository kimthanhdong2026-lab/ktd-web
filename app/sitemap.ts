import type { MetadataRoute } from 'next'
import { NEWS } from '@/lib/ktd-data'
import { getAllProductSlugs } from '@/lib/db'
import { LOCALES, href } from '@/lib/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Mỗi trang liệt kê một lần cho mỗi ngôn ngữ; thiếu bản tiếng Anh thì Google
  // không biết nó tồn tại.
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((lang) => [
    { url: `${SITE_URL}${href('/', lang)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}${href('/san-pham', lang)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}${href('/gioi-thieu', lang)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}${href('/tin-tuc', lang)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${SITE_URL}${href('/lien-he', lang)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ])

  const slugs = await getAllProductSlugs()
  const products: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    slugs.map((slug) => ({
      url: `${SITE_URL}${href(`/san-pham/${slug}`, lang)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  const articles: MetadataRoute.Sitemap = LOCALES.flatMap((lang) =>
    NEWS.map((n) => ({
      url: `${SITE_URL}${href(`/tin-tuc/${n.slug}`, lang)}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }))
  )

  return [...staticPages, ...products, ...articles]
}
