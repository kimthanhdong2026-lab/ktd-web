import type { Metadata } from 'next'
import { DEFAULT_LOCALE, dict, isLocale } from '@/lib/i18n'
import { NewsList } from '@/components/news/NewsList'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const t = dict(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE)
  return {
    title: t.news.heading,
    alternates: {
      canonical: params.lang === 'en' ? '/en/tin-tuc' : '/tin-tuc',
      languages: { 'vi-VN': '/tin-tuc', 'en-US': '/en/tin-tuc' },
    },
  }
}

export default function NewsPage({ params }: { params: { lang: string } }) {
  const t = dict(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE)
  return (
    <div className="container-ktd pb-16 pt-10 md:pb-24">
      <h1 className="mb-6 font-display text-h1 text-ink-900">{t.news.heading}</h1>
      <NewsList />
    </div>
  )
}
