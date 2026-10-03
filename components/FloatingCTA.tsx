'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import { IconArrowUp, IconPhone, IconQuote, IconSearch } from './Icons'
import { COMPANY_HOTLINE_TEL, ZALO_URL } from '@/lib/constants'
import { cx } from '@/lib/utils'
import { useLang } from './LangProvider'

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
 * Chỉ hiện icon, không kèm nhãn chữ: nhãn chiếm chỗ và che nội dung trên màn
 * hình hẹp. Tên nút vẫn có ở aria-label cho trình đọc màn hình và ở title để
 * hiện tooltip khi rê chuột.
 */

/**
 * Không khung bao quanh, chỉ biểu tượng — đoạn 23 của "Sửa web 4".
 *
 * Bản cũ là ô vuông trắng bo góc kèm viền và đổ bóng. Bỏ hết, chỉ còn biểu
 * tượng, và phóng to lên cho bù phần khung đã mất.
 *
 * Giữ lại một bóng đổ nhẹ ĐẶT TRÊN CHÍNH BIỂU TƯỢNG (drop-shadow chứ không phải
 * box-shadow): nút nổi trôi trên nội dung trang, gặp đúng chỗ ảnh sáng thì
 * không còn khung trắng đỡ nữa, biểu tượng sẽ chìm.
 *
 * Vùng bấm vẫn giữ 44x44 theo chuẩn cảm ứng, chỉ là không vẽ gì ra.
 */
const TILE =
  'flex h-11 w-11 flex-shrink-0 items-center justify-center transition-transform duration-200 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,.35))] group-hover:scale-110 md:h-12 md:w-12'

const ICON = 'h-[30px] w-[30px] md:h-8 md:w-8'

function Item({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cx('group flex items-center justify-end', className)}>{children}</div>
}

export function FloatingCTA() {
  const { openRfq, openSearch, cartCount } = useStore()
  const { t } = useLang()
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
      <Item>
        <button
          type="button"
          onClick={() => openRfq()}
          aria-label={t.cta.quote}
          title={t.cta.quote}
          className={cx(TILE, 'relative text-ktd-600')}
        >
          <IconQuote className={ICON} />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-quote px-1 text-[13px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </Item>

      <Item>
        {/* Logo Zalo thật, lấy từ chính ảnh trong "Sửa web 4" — bản cũ dùng
            một bong bóng chat chung chung, khách không nhận ra là Zalo. */}
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.cta.chatZalo}
          title={t.cta.chatZalo}
          className={TILE}
        >
          <Image
            src="/assets/zalo-logo.png"
            alt=""
            width={125}
            height={128}
            className="h-[34px] w-auto md:h-9"
          />
        </a>
      </Item>

      {/* Chỉ điện thoại */}
      <Item className="md:hidden">
        <a
          href={`tel:${COMPANY_HOTLINE_TEL}`}
          aria-label={t.cta.call}
          title={t.cta.call}
          className={cx(TILE, 'text-ktd-600')}
        >
          <IconPhone className={ICON} />
        </a>
      </Item>

      <Item>
        <button
          type="button"
          onClick={() => openSearch('')}
          aria-label={t.cta.search}
          title={t.cta.search}
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
          className="mr-1 mt-0.5 flex h-9 w-9 animate-fadeup items-center justify-center text-ink-500 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,.3))] transition-colors duration-200 hover:text-ktd-600"
        >
          <IconArrowUp className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
