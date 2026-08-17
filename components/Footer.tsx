import Link from 'next/link'
import Image from 'next/image'
import {
  COMPANY_EMAIL,
  COMPANY_HOTLINE,
  COMPANY_HOTLINE_TEL,
  COMPANY_INTRO,
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_TEL,
  NAV_ITEMS,
  OFFICES,
} from '@/lib/constants'
import { CATEGORIES } from '@/lib/ktd-data'

const FOOTER_CATEGORIES = ['cat-got', 'an-toan', 'nang-ha', 'hoa-chat']

export function Footer() {
  const categories = CATEGORIES.filter((c) => FOOTER_CATEGORIES.includes(c.slug))

  return (
    <footer className="bg-ktd-900 px-0 pb-6 pt-12 text-ktd-100">
      <div className="container-ktd">
        <div className="grid gap-10 border-b border-[#123a56] pb-9 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-3.5">
              <div className="inline-block rounded-md bg-white px-3.5 py-2.5">
                <Image
                  src="/assets/ktd-logo.webp"
                  alt={COMPANY_NAME}
                  width={560}
                  height={177}
                  className="h-[34px] w-auto"
                />
              </div>
              <div className="flex gap-2.5">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#123a56] font-display text-[15px] font-bold text-ktd-100 transition-colors hover:bg-[#1c4d70]"
                >
                  f
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#123a56] text-sm text-ktd-100 transition-colors hover:bg-[#1c4d70]"
                >
                  ▶
                </a>
              </div>
            </div>
            <p className="max-w-[320px] text-sm leading-relaxed text-[#8fb3cf]">
              {COMPANY_INTRO}
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-display text-sm font-semibold text-white">Liên kết</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#8fb3cf] hover:text-white">
                    {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-sm font-semibold text-white">Danh mục</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/san-pham?category=${c.slug}`} className="text-[#8fb3cf] hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-sm font-semibold text-white">Liên hệ</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-[#8fb3cf]">
              <li>
                <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {COMPANY_HOTLINE}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_EMAIL}`} className="text-[#8fb3cf] hover:text-white">
                  ✉ {COMPANY_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${COMPANY_PHONE_TEL}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {COMPANY_PHONE}
                </a>
              </li>
              <li className="leading-relaxed">
                {OFFICES[0].name}: {OFFICES[0].addr}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-6">
          <p className="text-[13px] text-[#4f7ea3]">
            © {new Date().getFullYear()} {COMPANY_NAME}. Bản quyền được bảo lưu.
          </p>
          <p className="flex gap-4 text-[13px] text-[#4f7ea3]">
            <span>Vũng Tàu</span>
            <span aria-hidden="true">·</span>
            <span>TP.HCM</span>
            <span aria-hidden="true">·</span>
            <span>Hà Nội</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
