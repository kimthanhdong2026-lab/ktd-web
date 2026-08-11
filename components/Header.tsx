'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COMPANY_PHONE, COMPANY_EMAIL } from '@/lib/constants'

interface HeaderProps {
  onSearchClick?: () => void
  onRfqClick?: () => void
  cartCount?: number
}

export function Header({ onSearchClick, onRfqClick, cartCount = 0 }: HeaderProps) {
  const [showUtility, setShowUtility] = useState(true)
  const [headerShadow, setHeaderShadow] = useState('none')

  useEffect(() => {
    const handleScroll = () => {
      setHeaderShadow(window.scrollY > 0 ? '0 2px 8px rgba(0,38,63,0.1)' : 'none')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-60 bg-white">
      {/* Utility Bar */}
      {showUtility && (
        <div className="bg-ktd-navy text-ktd-light-blue text-xs">
          <div className="max-w-7xl mx-auto px-8 py-1.5 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <a href={`tel:${COMPANY_PHONE}`} className="text-ktd-light-blue hover:opacity-80 flex items-center gap-1">
                ☎ {COMPANY_PHONE}
              </a>
              <a href={`mailto:${COMPANY_EMAIL}`} className="text-ktd-light-blue hover:opacity-80 flex items-center gap-1">
                ✉ {COMPANY_EMAIL}
              </a>
              <span className="text-ktd-navy/60">Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => alert('Bản tiếng Anh đang được xây dựng — sẽ bàn giao ở giai đoạn P1.')}
                className="border border-ktd-navy/30 text-ktd-light-blue rounded px-2 py-1 text-xs font-semibold hover:border-ktd-light-blue"
              >
                EN
              </button>
              <div className="flex gap-3 text-ktd-navy/60 font-semibold">
                <a href="#" className="hover:text-ktd-light-blue">f</a>
                <a href="#" className="hover:text-ktd-light-blue">▶</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div style={{ boxShadow: headerShadow }} className="border-t-4 border-b-4 border-ktd-red transition-shadow">
        <div className="max-w-7xl mx-auto px-8 py-1.5 flex items-center gap-7">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-12 h-9">
              <div className="bg-white rounded px-2 py-1 text-center">
                <span className="text-ktd-dark font-bold text-sm">KTĐ</span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-1">
            {[
              { label: 'TRANG CHỦ', href: '/' },
              { label: 'GIỚI THIỆU', href: '/gioi-thieu' },
              { label: 'SẢN PHẨM', href: '/san-pham' },
              { label: 'TIN TỨC', href: '/tin-tuc' },
              { label: 'LIÊN HỆ', href: '/lien-he' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-semibold text-ktd-dark rounded hover:bg-ktd-light transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 bg-ktd-light border border-ktd-light/50 rounded-lg px-4 py-2 text-sm text-ktd-dark hover:border-ktd-dark transition-colors"
            >
              <span className="text-base">🔍</span>
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
            <button
              onClick={onRfqClick}
              className="relative flex items-center gap-2 bg-ktd-red text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Báo giá
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
