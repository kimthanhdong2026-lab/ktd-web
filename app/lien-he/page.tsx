import type { Metadata } from 'next'
import { OfficeMap } from '@/components/contact/OfficeMap'
import {
  COMPANY_ADDRESS,
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

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Liên hệ Kim Thành Đông — văn phòng Seaview 4, kho hàng TP.HCM và Hà Nội. Hotline 0914 897 227, email sales@kimthanhdong.com.',
  alternates: { canonical: '/lien-he' },
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

export default function ContactPage() {
  return (
    <div className="container-ktd pb-16 pt-10 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="mb-2 font-display text-h1 text-ink-900">{COMPANY_NAME_UPPER}</h1>
      <p className="mb-10 text-body-lg text-ink-500">{COMPANY_ADDRESS}</p>

      <OfficeMap>
        <div className="rounded-xl bg-ktd-50 p-6">
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-700">
            <li>
              ☎ Điện thoại:{' '}
              <a href={`tel:${COMPANY_PHONE_TEL}`} className="font-bold">
                {COMPANY_PHONE}
              </a>
            </li>
            <li>
              💬 Hotline 1 (Zalo):{' '}
              <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="font-bold">
                {COMPANY_HOTLINE}
              </a>
            </li>
            <li>
              💬 Hotline 2 (Zalo &amp; WhatsApp): <b>{COMPANY_HOTLINE_2}</b>
            </li>
            <li>
              ✉ Email:{' '}
              <a href={`mailto:${COMPANY_EMAIL}`} className="font-bold">
                {COMPANY_EMAIL}
              </a>
            </li>
            <li>
              🌐 Website: <b>{COMPANY_WEBSITE}</b>
            </li>
            <li className="pt-1 text-ink-500">
              Giờ làm việc:
              {WORKING_HOURS.map((h) => (
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
