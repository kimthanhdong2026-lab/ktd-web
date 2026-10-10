'use client'

import { useState } from 'react'
import { MAP_QUERIES, OFFICES, REGISTERED_OFFICE } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'
import { cx } from '@/lib/utils'
import { useLang } from '@/components/LangProvider'

/**
 * Spec C7.1 — office list on the left with the shared contact details beneath it,
 * map on the right following the selection.
 */
/** Ô đầu là trụ sở đăng ký kinh doanh, ba ô sau là địa điểm làm việc thật. */
const ADDR = [REGISTERED_OFFICE, ...OFFICES]

export function OfficeMap({
  children,
}: {
  children?: React.ReactNode
  /** Nhận để trang cha truyền xuống được; chữ lấy từ ngữ cảnh. */
  lang?: Locale
}) {
  const { t, lang } = useLang()
  const [active, setActive] = useState(1)
  // Nhãn địa điểm dịch theo ngôn ngữ; địa chỉ giữ nguyên vì là địa chỉ vật lý.
  const ADDRESSES = ADDR.map((o, i) => ({
    name: i === 0 ? t.contact.registeredOffice : t.contact.offices[i - 1],
    addr: t.company.addresses[i] ?? o.addr,
  }))
  const office = ADDRESSES[active]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <ul className="mb-8 flex flex-col gap-3.5">
          {ADDRESSES.map((o, i) => (
            <li key={o.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cx(
                  'w-full rounded-xl border px-5 py-5 text-left transition-colors md:px-6',
                  active === i
                    ? 'border-ktd-100 bg-ktd-50'
                    : 'border-hairline bg-white hover:border-ktd-100'
                )}
              >
                <span className="mb-1.5 block font-display text-base font-semibold text-ktd-600">
                  {o.name}
                </span>
                <span className="block text-sm leading-relaxed text-ink-700">{o.addr}</span>
              </button>
            </li>
          ))}
        </ul>
        {children}
      </div>

      <div className="lg:sticky lg:top-[100px]">
        {/* Bản đồ Google thật, đổi theo địa chỉ đang chọn — mục LH05 của
            "Sửa web 5". Dùng kiểu nhúng không cần khoá API: không tốn phí và
            không có hạn mức để vượt.

            key={active} buộc dựng lại iframe khi đổi địa chỉ; chỉ đổi src thì
            mỗi lần bấm lại thêm một bước vào lịch sử trình duyệt, khách bấm
            Back phải bấm mấy lần mới ra khỏi trang. */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline bg-ink-100">
          <iframe
            key={active}
            title={`${t.contact.mapTitle}: ${office.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERIES[active])}&z=16&hl=${lang}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
          <span className="text-ink-700">
            <b className="font-display text-ink-900">{office.name}</b> — {office.addr}
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERIES[active])}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ktd-600 hover:underline"
          >
            {t.contact.openMap} ↗
          </a>
        </p>
      </div>
    </div>
  )
}
