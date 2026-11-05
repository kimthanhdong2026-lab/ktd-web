import type { Metadata } from 'next'
import { TrangGioiThieu } from '@/components/about/TrangGioiThieu'
import { DEFAULT_LOCALE, dict, isLocale, type Locale } from '@/lib/i18n'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const t = dict(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE)
  return {
    title: t.about.metaTitle,
    description: t.about.metaDesc,
    alternates: {
      canonical: params.lang === 'en' ? '/en/gioi-thieu' : '/gioi-thieu',
      languages: { 'vi-VN': '/gioi-thieu', 'en-US': '/en/gioi-thieu' },
    },
  }
}

/** Trang Giới thiệu. Phần vẽ ở components/about/TrangGioiThieu.tsx — dùng chung với /admin/gioi-thieu. */
export default function AboutPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  return <TrangGioiThieu lang={lang} />
}
