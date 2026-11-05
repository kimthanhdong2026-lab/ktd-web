import type { ReactNode } from 'react'
import { OfficeMap } from '@/components/contact/OfficeMap'
import { COMPANY_NAME_UPPER } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'
import { layChungO, lienHe, tuDien } from '@/lib/noi-dung'

export type KhungLienHe = (khoa: 'chung.lien-he', node: ReactNode) => ReactNode

/**
 * Trang Liên hệ. Số điện thoại, email, website, địa chỉ, giờ làm việc đều từ
 * khối "Thông tin liên hệ" (chung.lien-he) — cùng nguồn với đầu trang và chân
 * trang, nên sửa một chỗ là đổi cả ba.
 */
export async function TrangLienHe({ lang, moi = false, khung = (_, n) => n }: { lang: Locale; moi?: boolean; khung?: KhungLienHe }) {
  const [t, lh, website] = await Promise.all([tuDien(lang, moi), lienHe(lang, moi), layChungO('chung.lien-he', 'website', moi)])

  return (
    <div className="container-ktd pb-16 pt-10 md:pb-24">
      {/* Cỡ chữ bằng khoảng 2/3 tiêu đề trang chuẩn (44px -> 29px), dùng
          màu xanh logo giống nhãn "Văn phòng"/"Kho hàng" bên dưới. */}
      <h1 className="mb-2 font-display text-[clamp(1.25rem,2.65vw,1.8125rem)] font-bold leading-tight text-ktd-600">
        {lang === 'en' ? t.company.legalName : COMPANY_NAME_UPPER}
      </h1>
      <div className="mb-10" />

      {khung(
        'chung.lien-he',
        <OfficeMap lang={lang}>
          <div className="rounded-xl bg-surface p-6">
            <ul className="flex flex-col gap-2.5 text-[15px] text-ink-700">
              <li>
                ☎ {t.contact.phone}:{' '}
                <a href={`tel:${lh.dienThoaiTel}`} className="font-bold">{lh.dienThoai}</a>
              </li>
              <li>
                💬 {t.contact.hotline1}:{' '}
                <a href={`tel:${lh.hotlineTel}`} className="font-bold">{lh.hotline}</a>
              </li>
              <li>
                💬 {t.contact.hotline2}:{' '}
                <a href={`tel:${lh.hotline2Tel}`} className="font-bold">{lh.hotline2}</a>
              </li>
              <li>
                ✉ {t.contact.email}:{' '}
                <a href={`mailto:${lh.email}`} className="font-bold">{lh.email}</a>
              </li>
              <li>
                🌐 {t.contact.website}: <b>{website}</b>
              </li>
              <li className="pt-1 text-ink-500">
                {t.contact.hours}
                {t.contact.workingHours.map((h, i) => (
                  <span key={i} className="mt-0.5 block">{h}</span>
                ))}
              </li>
            </ul>
          </div>
        </OfficeMap>
      )}
    </div>
  )
}
