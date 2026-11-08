import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrangBaiViet } from '@/components/news/TrangBaiViet'
import { getFeaturedProducts } from '@/lib/db'
import { DEFAULT_LOCALE, dict, isLocale, type Locale } from '@/lib/i18n'
import { tuDien } from '@/lib/noi-dung'
import { layBai, layBaiViet } from '@/lib/tin-tuc'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kimthanhdong.com'

interface PageProps {
  params: { slug: string; lang: string }
}

export async function generateStaticParams() {
  return (await layBaiViet('vi')).map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const bai = await layBai(params.slug, lang)
  if (!bai) return { title: dict(lang).product.notFound }
  return {
    title: bai.title,
    description: bai.excerpt.slice(0, 155),
    alternates: { canonical: `/tin-tuc/${params.slug}` },
  }
}

/** Bài viết. Phần vẽ ở components/news/TrangBaiViet.tsx — dùng chung với /admin/tin-tuc/<slug>. */
export default async function ArticlePage({ params }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const bai = await layBai(params.slug, lang)
  if (!bai || !bai.visible) notFound()
  const [t, related] = await Promise.all([tuDien(lang), getFeaturedProducts(3, lang)])

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: bai.title,
        description: bai.excerpt,
        articleSection: bai.catLabel,
        datePublished: bai.ngay,
        inLanguage: lang === 'en' ? 'en-US' : 'vi-VN',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tin tức', item: `${SITE_URL}/tin-tuc` },
          { '@type': 'ListItem', position: 3, name: bai.title, item: `${SITE_URL}/tin-tuc/${params.slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <TrangBaiViet bai={bai} related={related} lang={lang} t={t} />
    </>
  )
}
