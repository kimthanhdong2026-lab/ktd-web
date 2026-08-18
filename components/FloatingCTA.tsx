'use client'

import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import { IconArrowUp, IconChat, IconPhone, IconQuote, IconSearch } from './Icons'
import { COMPANY_HOTLINE_TEL, ZALO_URL } from '@/lib/constants'
import { cx } from '@/lib/utils'

/**
 * Bộ nút nổi (spec B6).
 *
 *   PC          : Báo giá · Chat Zalo · Tìm kiếm          (3 nút)
 *   Điện thoại  : Báo giá · Chat Zalo · Gọi ngay · Tìm kiếm (4 nút)
 *
 * Riêng nút Về đầu trang cố ý nhỏ và nhạt hơn hẳn, không kèm nhãn: nó là tiện
 * ích phụ, không nên tranh sự chú ý với bốn nút chuyển đổi ở trên.
 *
 * Nút gọi chỉ có trên điện thoại vì `tel:` chỉ hữu ích ở đó; trên PC số hotline
 * đã nằm sẵn ở header và footer.
 *
 * Nhãn chữ hiện thường trực bên trái icon, không phải đợi rê chuột — icon dù rõ
 * đến mấy vẫn có thể bị đoán mò, và trên điện thoại thì không có thao tác rê.
 */

const TILE =
  'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white shadow-md transition-transform duration-200 group-hover:scale-105 md:h-[52px] md:w-[52px]'

const LABEL =
  'rounded-xl border border-black/5 bg-white px-3 py-1.5 text-[13px] font-semibold text-ink-900 shadow-md'

const ICON = 'h-[22px] w-[22px]'

function Item({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cx('group flex items-center justify-end gap-2', className)}>
      <span className={LABEL}>{label}</span>
      {children}
    </div>
  )
}

export function FloatingCTA() {
  const { openRfq, openSearch, cartCount } = useStore()
  const [showTop, setShowTop] = useState(false)

  // Chỉ hiện sau khi đã cuộn sâu, lúc đó việc quay lại đầu trang mới có nghĩa.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 1.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 md:bottom-5 md:right-5">
      <Item label="Báo giá">
        <button
          type="button"
          onClick={() => openRfq()}
          aria-label="Yêu cầu báo giá"
          className={cx(TILE, 'relative text-ktd-600')}
        >
          <IconQuote className={ICON} />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-quote px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </Item>

      <Item label="Chat Zalo">
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          className={cx(TILE, 'text-zalo')}
        >
          <IconChat className={ICON} />
        </a>
      </Item>

      {/* Chỉ điện thoại */}
      <Item label="Gọi ngay" className="md:hidden">
        <a
          href={`tel:${COMPANY_HOTLINE_TEL}`}
          aria-label="Gọi hotline"
          className={cx(TILE, 'text-ktd-600')}
        >
          <IconPhone className={ICON} />
        </a>
      </Item>

      <Item label="Tìm kiếm">
        <button
          type="button"
          onClick={() => openSearch('')}
          aria-label="Mở ô tìm kiếm"
          className={cx(TILE, 'text-ink-900')}
        >
          <IconSearch className={ICON} />
        </button>
      </Item>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Về đầu trang"
          title="Về đầu trang"
          className="mr-1.5 mt-0.5 flex h-9 w-9 animate-fadeup items-center justify-center rounded-xl border border-black/5 bg-white/85 text-ink-500 shadow-sm backdrop-blur transition-colors duration-200 hover:text-ktd-600"
        >
          <IconArrowUp className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
