'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cx } from '@/lib/utils'

export interface Nhom {
  slug: string
  name: string
  parent: string | null
  count: number
}

/**
 * Bộ lọc nhóm sản phẩm trên trang thương hiệu.
 *
 * Chỉ liệt kê những nhóm mà CHÍNH HÃNG NÀY có hàng — trang Karnasch hiện 6
 * nhóm, không bày cả 41 nhóm của toàn site. Đây là yêu cầu Mr Nam nêu rõ.
 *
 * Chưa chọn gì thì "Tất cả" đang bật và trang hiện toàn bộ sản phẩm của hãng.
 *
 * Dùng Link chứ không dùng nút bấm kèm JavaScript: mỗi lựa chọn là một địa chỉ
 * thật, nên khách gửi link cho đồng nghiệp vẫn ra đúng cái họ đang xem, và máy
 * tìm kiếm đọc được.
 */
export function BrandGroupFilter({
  nhoms,
  dangChon,
  nhan,
  nhanTatCa,
}: {
  nhoms: Nhom[]
  dangChon?: string
  nhan: string
  nhanTatCa: string
}) {
  const pathname = usePathname()
  const params = useSearchParams()

  const diaChi = (slug?: string) => {
    const sp = new URLSearchParams(params.toString())
    if (slug) sp.set('nhom', slug)
    else sp.delete('nhom')
    const q = sp.toString()
    return q ? `${pathname}?${q}` : pathname
  }

  const o = (dang: boolean) =>
    cx(
      'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[15px] transition-colors',
      dang
        ? 'border-ktd-600 bg-ktd-600 font-semibold text-white'
        : 'border-hairline bg-white font-medium text-ink-700 hover:border-ktd-600 hover:text-ktd-600'
    )

  return (
    <div className="mb-7">
      <p className="label-caps mb-3 text-ink-900">▸ {nhan}</p>
      <div className="flex flex-wrap gap-2">
        <Link href={diaChi()} scroll={false} className={o(!dangChon)}>
          {nhanTatCa}
        </Link>
        {nhoms.map((n) => (
          <Link key={n.slug} href={diaChi(n.slug)} scroll={false} className={o(dangChon === n.slug)}>
            {n.name}
            <span className={cx('font-mono text-[13px]', dangChon === n.slug ? 'text-white/70' : 'text-ink-500')}>
              {n.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
