import type { Metadata } from 'next'
import { DEFAULT_LOCALE, dict, isLocale, type Locale } from '@/lib/i18n'
import { OfficeMap } from '@/components/contact/OfficeMap'
import {
  COMPANY_EMAIL,
  COMPANY_HOTLINE,
  COMPANY_HOTLINE_2,
  COMPANY_HOTLINE_TEL,
  COMPANY_NAME,
  COMPANY_NAME_UPPER,
  COMPANY_PHONE,
  COMPANY_PHONE_TEL,
  COMPANY_WEBSITE,
  OFFICES,
  WORKING_HOURS,
} from '@/lib/constants'

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

/** Spec D4 — mỗi địa điểm một khối LocalBusiness. */
const schema = {
  '@context': 'https://schema.org',
  '@graph': OFFICES.map((o) => ({
    '@type': 'LocalBusiness',
    name: `${COMPANY_NAME} — ${o.name}`,
    address: { '@type': 'PostalAddress', streetAddress: o.addr, addressCountry: 'VN' },
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
  })),
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  return (
    <div className="container-ktd pb-16 pt-10 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Cỡ chữ bằng khoảng 2/3 tiêu đề trang chuẩn (44px -> 29px), dùng
          màu xanh logo giống nhãn "Văn phòng"/"Kho hàng" bên dưới. */}
      <h1 className="mb-2 font-display text-[clamp(1.25rem,2.65vw,1.8125rem)] font-bold leading-tight text-ktd-600">
        {lang === 'en' ? t.company.legalName : COMPANY_NAME_UPPER}
      </h1>
      <div className="mb-10" />

      <OfficeMap lang={lang}>
        <div className="rounded-xl bg-surface p-6">
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-700">
            <li>
              ☎ {t.contact.phone}:{' '}
              <a href={`tel:${COMPANY_PHONE_TEL}`} className="font-bold">
                {COMPANY_PHONE}
              </a>
            </li>
            <li>
              💬 {t.contact.hotline1}:{' '}
              <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="font-bold">
                {COMPANY_HOTLINE}
              </a>
            </li>
            <li>
              💬 {t.contact.hotline2}: <b>{COMPANY_HOTLINE_2}</b>
            </li>
            <li>
              ✉ {t.contact.email}:{' '}
              <a href={`mailto:${COMPANY_EMAIL}`} className="font-bold">
                {COMPANY_EMAIL}
              </a>
            </li>
            <li>
              🌐 {t.contact.website}: <b>{COMPANY_WEBSITE}</b>
            </li>
            <li className="pt-1 text-ink-500">
              {t.contact.hours}
              {t.contact.workingHours.map((h) => (
                <span key={h} className="mt-0.5 block">
                  {h}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </OfficeMap>
    </div>
  )
}
