'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import { COMPANY_HOTLINE, COMPANY_HOTLINE_TEL } from '@/lib/constants'
import { useLang } from './LangProvider'
import { LOCALES, href as localeHref, stripLocale } from '@/lib/i18n'
import { cx } from '@/lib/utils'

/**
 * Header một tầng. Bản trước có thêm dải utility nền xanh đậm ở trên, nhưng
 * nó đẩy chiều cao header lên gần gấp đôi mà nội dung lại trùng với footer —
 * nên đã gộp: chọn ngôn ngữ và mạng xã hội chuyển xuống thanh trắng này.
 */
export function Header() {
  const pathname = usePathname()
  const { lang, t, path } = useLang()

  const NAV = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/gioi-thieu' },
    { label: t.nav.products, href: '/san-pham' },
    { label: t.nav.news, href: '/tin-tuc' },
    { label: t.nav.contact, href: '/lien-he' },
  ]

  // Đường dẫn hiện tại ở ngôn ngữ còn lại, để nút chuyển giữ nguyên trang khách
  // đang đọc thay vì quăng họ về trang chủ.
  const other = LOCALES.find((l) => l !== lang)!
  const otherHref = localeHref(stripLocale(pathname), other)
  const { openSearch, openRfq, cartCount, showToast } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Chỉ điều khiển bóng đổ — không đụng tới chiều cao, tránh vòng lặp giữa
  // thay đổi layout và scroll anchoring của trình duyệt.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  const isActive = (h: string) => {
    const here = stripLocale(pathname)
    return h === '/' ? here === '/' : here.startsWith(h)
  }


  return (
    <header
      className={cx(
        // Vạch phân cách dùng xanh logo thay cho đỏ: đỏ để dành cho những
        // thông tin thật sự quan trọng, không dùng làm đường kẻ trang trí.
        'sticky top-0 z-50 border-b-2 border-ktd-600 bg-white transition-shadow duration-150',
        scrolled && 'shadow-header'
      )}
    >
      {/* py 5px + hàng nút 44px + viền 2px = 56px, gọn hơn ~10% so với 62px. */}
      <div className="container-ktd flex items-center gap-4 py-[5px] lg:gap-6">
        <Link href={path('/')} className="flex-shrink-0" aria-label="Kim Thành Đông">
          <Image
            src="/assets/ktd-logo.webp"
            alt="Kim Thành Đông"
            width={560}
            height={177}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <nav className="hidden gap-1 lg:flex" aria-label="Điều hướng chính">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={path(item.href)}
              className={cx(
                'rounded-md px-3 py-[7px] text-sm font-semibold transition-colors hover:bg-ktd-50',
                isActive(item.href) ? 'text-ktd-600' : 'text-ink-700'
              )}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Hotline: chỉ hiện khi còn đủ chỗ, để thanh không bị chật */}
          <a
            href={`tel:${COMPANY_HOTLINE_TEL}`}
            className="hidden items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ktd-600 xl:flex"
          >
            <span aria-hidden="true">☎</span>
            {COMPANY_HOTLINE}
          </a>

          {/* Chuyển sang trang tương ứng ở ngôn ngữ kia, không quăng về trang chủ */}
          <Link
            href={otherHref}
            hrefLang={other}
            aria-label={t.header.switchTo}
            className="hidden rounded-sm border border-ink-300 px-2 py-1 text-xs font-semibold tracking-[0.05em] hover:border-ktd-600 md:inline-block"
          >
            <span className={lang === 'vi' ? 'text-ktd-600' : 'text-ink-500'}>VI</span>
            <span className="mx-1 text-ink-300">|</span>
            <span className={lang === 'en' ? 'text-ktd-600' : 'text-ink-500'}>EN</span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="font-display text-[15px] font-bold text-ink-500 hover:text-ktd-600"
            >
              f
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-sm text-ink-500 hover:text-ktd-600"
            >
              ▶
            </a>
          </div>

          <button
            type="button"
            onClick={() => openSearch('')}
            className="flex min-h-[44px] items-center gap-2 rounded-md border border-[#e2e7ec] bg-ink-100 px-3 text-[13px] text-ink-500 hover:border-ktd-600 hover:text-ktd-600 md:min-w-[190px] md:px-4"
            aria-label="Mở ô tìm kiếm sản phẩm"
          >
            <span aria-hidden="true">🔍</span>
            <span className="hidden md:inline">{t.header.searchPlaceholder}</span>
          </button>

          <button
            type="button"
            onClick={() => openRfq()}
            className="relative flex min-h-[44px] items-center gap-2 rounded-md bg-ktd-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-ktd-700 md:px-[18px]"
          >
            {t.header.quote}
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-ktd-800 px-[3px] text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink-700 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-label="Mở menu"
          >
            <span className="text-xl" aria-hidden="true">{mobileNavOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="border-t border-hairline bg-white lg:hidden" aria-label="Điều hướng chính">
          <div className="container-ktd flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={path(item.href)}
                className={cx(
                  'py-3 text-sm font-semibold',
                  isActive(item.href) ? 'text-ktd-600' : 'text-ink-700'
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center justify-between border-t border-hairline py-3">
              <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="text-sm font-semibold text-ink-700">
                ☎ {COMPANY_HOTLINE}
              </a>
              <div className="flex items-center gap-4">
                <Link
                  href={otherHref}
                  hrefLang={other}
                  aria-label={t.header.switchTo}
                  className="rounded-sm border border-ink-300 px-2 py-1 text-xs font-semibold tracking-[0.05em]"
                >
                  <span className={lang === 'vi' ? 'text-ktd-600' : 'text-ink-500'}>VI</span>
                  <span className="mx-1 text-ink-300">|</span>
                  <span className={lang === 'en' ? 'text-ktd-600' : 'text-ink-500'}>EN</span>
                </Link>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="font-display text-[15px] font-bold text-ink-500"
                >
                  f
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-sm text-ink-500"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
