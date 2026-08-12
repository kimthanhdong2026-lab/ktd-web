import type { Metadata } from 'next'
import Link from 'next/link'
import { OfficeMap } from '@/components/contact/OfficeMap'
import { QuoteButton } from '@/components/QuoteButton'
import {
  COMPANY_EMAIL,
  COMPANY_HOTLINE,
  COMPANY_HOTLINE_2,
  COMPANY_HOTLINE_TEL,
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_WEBSITE,
  OFFICES,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Liên hệ Kim Thành Đông — trụ sở Vũng Tàu, kho TP.HCM và Hà Nội. Hotline 0914 897 227, email sales@kimthanhdong.com.',
  alternates: { canonical: '/lien-he' },
}

/** Spec D4 — one LocalBusiness block per office. */
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

      <nav aria-label="Breadcrumb" className="mb-5 text-body-sm text-ink-500">
        <Link href="/">Trang chủ</Link> / <span className="text-ink-900">Liên hệ</span>
      </nav>

      <h1 className="mb-10 font-display text-h1 text-ink-900">Liên hệ Kim Thành Đông</h1>

      <OfficeMap />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-ktd-50 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Thông tin chung</h2>
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-700">
            <li>
              ☎ Điện thoại: <b>{COMPANY_PHONE}</b>
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
            <li className="text-ink-500">Giờ làm việc: 8:00 – 17:00, Thứ 2 – Thứ 7.</li>
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-ktd-600 p-6 text-white">
          <h2 className="mb-3 font-display text-xl font-bold">Cần báo giá nhanh?</h2>
          <p className="mb-5 text-ktd-100">
            Gửi danh sách mã hàng — kỹ sư phản hồi trong 15–30 phút giờ hành chính.
          </p>
          <div>
            <QuoteButton>Yêu cầu báo giá</QuoteButton>
          </div>
        </div>
      </div>
    </div>
  )
}
