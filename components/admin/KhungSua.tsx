'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

export interface NhanKhoi {
  khoa: string
  so: number
  ten: string
}

/**
 * Khung bao quanh một khối trên màn hình quản trị: số thứ tự, tên khối và nút
 * "Sửa" — đúng vị trí khối đó trên web, nên nhìn là biết sửa cái gì.
 *
 * Bên trong là chính component của web, chỉ khóa chuột lại để admin không
 * vô tình bấm vào liên kết. Nút Sửa mở bảng sửa bên phải bằng ?khoi=…
 *
 * `phu`: khối thứ hai nằm trong cùng vùng (chân trang chứa cả "Thông tin
 * liên hệ"), hiện thêm một nút. `nhanNgoai`: đặt nhãn trên một dải riêng phía
 * trên khối thay vì đè lên góc — dùng cho thanh đầu trang, nơi góc trái là logo.
 */
export function KhungSua({
  khoa,
  so,
  ten,
  phu = [],
  dangSua,
  nhanNgoai = false,
  children,
}: NhanKhoi & { phu?: NhanKhoi[]; dangSua?: string; nhanNgoai?: boolean; children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const mo = (k: string) => router.push(`${pathname}?khoi=${encodeURIComponent(k)}`, { scroll: false })
  const cacNut = [{ khoa, so, ten }, ...phu]
  const chon = cacNut.some((n) => n.khoa === dangSua)

  return (
    <div
      className={cx(
        'group relative outline outline-2 -outline-offset-2 transition-colors',
        nhanNgoai && 'bg-surface pt-12',
        chon ? 'outline-ktd-600' : 'outline-dashed outline-ktd-600/40 hover:outline-ktd-600'
      )}
    >
      <div className="pointer-events-none select-none [&_header]:!static [&_header]:!top-auto">{children}</div>
      <div className={cx('absolute left-3 z-20 flex flex-wrap items-center gap-2', nhanNgoai ? 'top-2' : 'top-3')}>
        {cacNut.map((n) => (
          <button
            key={n.khoa}
            type="button"
            onClick={() => mo(n.khoa)}
            className={cx(
              'flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] font-semibold shadow-md transition-colors',
              n.khoa === dangSua
                ? 'border-ktd-600 bg-ktd-600 text-white'
                : 'border-ktd-600/40 bg-white text-ktd-600 hover:bg-ktd-50'
            )}
          >
            <span
              className={cx(
                'flex h-5 min-w-5 items-center justify-center rounded px-1 text-[12px] font-bold',
                n.khoa === dangSua ? 'bg-white text-ktd-600' : 'bg-ktd-600 text-white'
              )}
            >
              {n.so}
            </span>
            {n.ten}
            <span className="font-normal opacity-70">· Sửa</span>
          </button>
        ))}
      </div>
    </div>
  )
}
