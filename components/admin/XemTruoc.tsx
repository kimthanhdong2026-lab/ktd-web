'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Bề rộng màn hình mà bản xem trước mô phỏng. */
const RONG_MAN = 1440

/**
 * Hộp xem trước trang web trong màn hình quản trị.
 *
 * Khi bảng sửa mở, chỗ còn lại chỉ rộng khoảng 800px. Để nguyên thì các khối
 * vẫn xếp theo kiểu màn rộng (bố cục đổi theo bề rộng CỬA SỔ, không theo hộp)
 * và tràn mép. Nên thu cả trang về đúng tỉ lệ — vẫn là bố cục khách thấy trên
 * màn rộng, chỉ nhỏ đi — bằng CSS zoom theo bề rộng hộp.
 */
export function XemTruoc({ thuNho, children }: { thuNho: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!thuNho || !el) {
      setZoom(1)
      return
    }
    const do_ = () => setZoom(Math.min(1, el.clientWidth / RONG_MAN))
    do_()
    const ro = new ResizeObserver(do_)
    ro.observe(el)
    return () => ro.disconnect()
  }, [thuNho])

  return (
    <div ref={ref}>
      <div style={{ zoom }}>{children}</div>
    </div>
  )
}
