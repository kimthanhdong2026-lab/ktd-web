'use client'

import { useEffect, useState } from 'react'
import { COMPANY_PHONE } from '@/lib/constants'

interface FloatingCTAProps {
  cartCount?: number
  onRfqClick?: () => void
  onSearchClick?: () => void
}

export function FloatingCTA({ cartCount = 0, onRfqClick, onSearchClick }: FloatingCTAProps) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > window.innerHeight * 1.5)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col gap-3">
      {/* RFQ Button */}
      <button
        onClick={onRfqClick}
        title="Báo giá"
        className="relative w-14 h-14 rounded-full bg-ktd-red text-white flex items-center justify-center text-2xl hover:shadow-lg transition-shadow"
      >
        📋
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Zalo */}
      <a
        href="https://zalo.me/0914897227"
        target="_blank"
        rel="noopener"
        title="Zalo"
        className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl hover:shadow-lg transition-shadow font-bold"
      >
        Z
      </a>

      {/* Hotline */}
      <a
        href={`tel:${COMPANY_PHONE}`}
        title="Gọi hotline"
        className="w-14 h-14 rounded-full bg-ktd-blue text-white flex items-center justify-center text-2xl hover:shadow-lg transition-shadow"
      >
        ☎
      </a>

      {/* Search */}
      <button
        onClick={onSearchClick}
        title="Tìm kiếm"
        className="w-14 h-14 rounded-full bg-white text-ktd-dark border border-ktd-light/80 flex items-center justify-center text-2xl hover:shadow-lg transition-shadow"
      >
        🔍
      </button>

      {/* Scroll to Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          title="Về đầu trang"
          className="w-14 h-14 rounded-full bg-ktd-dark text-white flex items-center justify-center text-2xl hover:shadow-lg transition-all animate-fadeup"
        >
          ↑
        </button>
      )}
    </div>
  )
}
