import type { Metadata } from 'next'
import { TrangLienHe } from '@/components/contact/TrangLienHe'
import { COMPANY_NAME } from '@/lib/constants'
import { DEFAULT_LOCALE, dict, isLocale, type Locale } from '@/lib/i18n'
import { lienHe, tuDien } from '@/lib/noi-dung'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const t = dict(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE)
  return {
    title: t.contact.metaTitle,
    description: t.contact.metaDesc,
    alternates: {
      canonical: params.lang === 'en' ? '/en/lien-he' : '/lien-he',
      languages: { 'vi-VN': '/lien-he', 'en-US': '/en/lien-he' },
    },
  }
}

/** Trang Liên hệ. Phần vẽ ở components/contact/TrangLienHe.tsx — dùng chung với /admin/lien-he. */
export default async function ContactPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const [t, lh] = await Promise.all([tuDien(lang), lienHe(lang)])

  // Spec D4 — mỗi địa điểm làm việc một khối LocalBusiness. Địa chỉ 0 là ĐKKD.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': t.contact.offices.map((ten, i) => ({
      '@type': 'LocalBusiness',
      name: `${COMPANY_NAME} — ${ten}`,
      address: { '@type': 'PostalAddress', streetAddress: t.company.addresses[i + 1] ?? '', addressCountry: 'VN' },
      telephone: lh.dienThoai,
      email: lh.email,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <TrangLienHe lang={lang} />
    </>
  )
}
