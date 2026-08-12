'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import {
  COMPANY_EMAIL,
  COMPANY_HOTLINE,
  COMPANY_HOTLINE_TEL,
  NAV_ITEMS,
} from '@/lib/constants'
import { cx } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const { openSearch, openRfq, cartCount, showToast } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Drives the shadow only. Deliberately nothing that changes layout height:
  // toggling the header's height from a scroll handler fights Chrome's scroll
  // anchoring and oscillates around the threshold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* Utility bar: static, so it simply scrolls away and the main bar below
          takes over as the sticky row — spec B5.3, no JS and no layout thrash. */}
      <div className="hidden bg-ktd-800 text-[13px] text-ktd-100 md:block">
        <div className="container-ktd flex items-center justify-between gap-6 py-[5px]">
          <div className="flex items-center gap-6">
            <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="text-ktd-100 hover:text-white">
              ☎ {COMPANY_HOTLINE}
            </a>
            <a href={`mailto:${COMPANY_EMAIL}`} className="text-ktd-100 hover:text-white">
              ✉ {COMPANY_EMAIL}
            </a>
            <span className="hidden text-[#6b93b5] lg:inline">Giao hàng toàn quốc</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => showToast('Bản tiếng Anh đang được xây dựng — sẽ bàn giao ở giai đoạn P1.')}
              className="rounded-sm border border-[#2e5a80] px-2.5 py-[3px] text-xs font-semibold tracking-[0.05em] text-ktd-100 hover:bg-[#2e5a80]"
            >
              VI | EN
            </button>
            <div className="flex gap-3 font-semibold text-[#6b93b5]">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#6b93b5] hover:text-white">f</a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[#6b93b5] hover:text-white">▶</a>
            </div>
          </div>
        </div>
      </div>

      <header
        className={cx(
          'sticky top-0 z-50 border-y-[3px] border-quote bg-white transition-shadow duration-150',
          scrolled && 'shadow-header'
        )}
      >
        <div className="container-ktd flex items-center gap-4 py-1.5 lg:gap-7">
          <Link href="/" className="flex-shrink-0" aria-label="Kim Thành Đông — trang chủ">
            <Image
              src="/assets/ktd-logo.webp"
              alt="Kim Thành Đông"
              width={560}
              height={177}
              priority
              className="h-[34px] w-auto"
            />
          </Link>

          <nav className="ml-2 hidden gap-1 lg:flex" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
            <button
              type="button"
              onClick={() => openSearch('')}
              className="flex min-h-[44px] items-center gap-2 rounded-md border border-[#e2e7ec] bg-ink-100 px-3 text-[13px] text-ink-500 hover:border-ktd-600 hover:text-ktd-600 md:min-w-[200px] md:px-4"
              aria-label="Mở ô tìm kiếm sản phẩm"
            >
              <span aria-hidden="true">🔍</span>
              <span className="hidden md:inline">Tìm kiếm sản phẩm</span>
            </button>

            <button
              type="button"
              onClick={() => openRfq()}
              className="relative flex min-h-[44px] items-center gap-2 rounded-md bg-quote px-4 text-[13px] font-semibold text-white shadow-cta transition-colors hover:bg-quote-700 md:px-[18px]"
            >
              Báo giá
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-quote-700 px-[3px] text-[11px] font-bold text-white">
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
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    'py-3 text-sm font-semibold',
                    isActive(item.href) ? 'text-ktd-600' : 'text-ink-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="border-t border-hairline py-3 text-sm text-ink-500">
                ☎ {COMPANY_HOTLINE}
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
