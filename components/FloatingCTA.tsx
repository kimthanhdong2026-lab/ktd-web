'use client'

import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import { COMPANY_HOTLINE_TEL, ZALO_URL } from '@/lib/constants'

/**
 * Spec B6 — the floating stack, present on every page.
 * Desktop shows all four buttons plus back-to-top; mobile keeps only
 * Báo giá + Zalo so the stack never covers content.
 */
export function FloatingCTA() {
  const { openRfq, openSearch, cartCount } = useStore()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 1.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const base =
    'flex h-[52px] w-[52px] items-center justify-center rounded-full text-[22px] transition-transform duration-150 hover:scale-105 md:h-14 md:w-14'

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:bottom-5 md:right-5">
      <button
        type="button"
        onClick={() => openRfq()}
        title="Yêu cầu báo giá"
        aria-label="Yêu cầu báo giá"
        className={`${base} relative bg-quote text-white shadow-cta`}
      >
        <span aria-hidden="true">📋</span>
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-quote-700 px-1 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>

      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo"
        aria-label="Chat Zalo"
        className={`${base} bg-zalo font-bold text-white shadow-[0_6px_20px_rgba(0,104,255,.3)]`}
      >
        Z
      </a>

      <a
        href={`tel:${COMPANY_HOTLINE_TEL}`}
        title="Gọi hotline"
        aria-label="Gọi hotline"
        className={`${base} hidden bg-ktd-600 text-white shadow-[0_6px_20px_rgba(0,107,178,.3)] md:flex`}
      >
        <span aria-hidden="true">☎</span>
      </a>

      <button
        type="button"
        onClick={() => openSearch('')}
        title="Tìm kiếm"
        aria-label="Mở ô tìm kiếm"
        className={`${base} hidden border border-ink-300 bg-white text-ink-700 shadow-md md:flex`}
      >
        <span aria-hidden="true">🔍</span>
      </button>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Về đầu trang"
          aria-label="Về đầu trang"
          className={`${base} hidden animate-fadeup bg-ktd-900 text-white shadow-lg md:flex`}
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </div>
  )
}
