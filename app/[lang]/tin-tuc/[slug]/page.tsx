import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuoteButton } from '@/components/QuoteButton'
import { NEWS, newsFor } from '@/lib/ktd-data'
import { getFeaturedProducts } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, isLocale, type Locale } from '@/lib/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

interface PageProps {
  params: { slug: string; lang: string }
}

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const article = newsFor(lang).find((n) => n.slug === params.slug)
  if (!article) return { title: dict(lang).product.notFound }
  return {
    title: article.title,
    description: article.excerpt.slice(0, 155),
    alternates: { canonical: `/tin-tuc/${params.slug}` },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  const path = (p: string) => href(p, lang)
  const article = newsFor(lang).find((n) => n.slug === params.slug)
  if (!article) notFound()

  const related = await getFeaturedProducts(3, lang)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        articleSection: article.cat,
        inLanguage: 'vi-VN',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tin tức', item: `${SITE_URL}/tin-tuc` },
          { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/tin-tuc/${params.slug}` },
        ],
      },
    ],
  }

  return (
    <article className="mx-auto max-w-prose px-5 pb-16 pt-10 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-body-sm text-ink-500">
        <Link href={path("/")}>{t.nav.home}</Link> / <Link href={path("/tin-tuc")}>{t.nav.news}</Link>
      </nav>

      <p className="label-caps mb-3.5 text-ktd-600">{article.cat}</p>
      <h1 className="mb-4 font-display text-[30px] font-bold leading-tight text-ink-900 md:text-[38px]">
        {article.title}
      </h1>
      <p className="mb-8 text-sm text-[#9aa3ad]">{article.date}</p>

      <div className="placeholder-hatch relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-ink-100">
        <span className="relative font-mono text-[13px] text-[#9aa3ad]">{t.news.imagePlaceholder}</span>
      </div>

      <p className="mb-5 text-lg leading-[1.8] text-ink-700">{article.excerpt}</p>
      <p className="mb-5 text-[17px] leading-[1.8] text-ink-700">
        {t.news.bodyPlaceholder}
      </p>

      <section className="mt-10 border-t border-hairline pt-8">
        <h2 className="mb-5 font-display text-[22px] font-bold text-ink-900">{t.news.related}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <li key={p.part}>
              <Link
                href={path(`/san-pham/${p.slug}`)}
                className="block h-full rounded-[10px] border border-hairline p-4 transition hover:shadow-md"
              >
                <span className="mb-1.5 block font-display text-[15px] font-semibold leading-tight text-ink-900">
                  {p.name}
                </span>
                <span className="part-no block text-[13px] text-ink-500">{p.part}</span>
                <span className="mt-1 block text-[13px] text-ink-500">{p.brandLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <QuoteButton />
      </div>
    </article>
  )
}
