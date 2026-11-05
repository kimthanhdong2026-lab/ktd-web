'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dangXuat } from '@/app/admin/actions'
import { cx } from '@/lib/utils'

const MUC = [
  { href: '/admin/trang-chu', ten: 'Trang chủ' },
  { href: '/admin/san-pham', ten: 'Sản phẩm' },
  { href: '/admin/danh-muc', ten: 'Danh mục' },
  { href: '/admin/thuong-hieu', ten: 'Thương hiệu' },
  { href: '/admin/tai-khoan', ten: 'Tài khoản' },
]

/** Thanh trên cùng của trang quản trị: tên mục, "Xem web", đăng xuất. */
export function ThanhAdmin({ email }: { email: string }) {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 z-[60] border-b border-ktd-700 bg-ktd-800 text-white">
      <div className="mx-auto flex h-12 max-w-[1600px] items-center gap-5 px-4">
        <Link href="/admin/trang-chu" className="flex items-center gap-2.5">
          <span className="flex h-7 items-center rounded bg-white px-1.5">
            <Image src="/assets/ktd-logo.webp" alt="KTD" width={60} height={24} className="h-5 w-auto" />
          </span>
          <span className="font-display text-[14px] font-semibold tracking-wide">QUẢN TRỊ</span>
        </Link>
        <nav className="flex items-center gap-1 text-[14px]">
          {MUC.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={cx(
                'rounded px-3 py-1.5 font-medium transition-colors',
                pathname.startsWith(m.href) ? 'bg-white/15 text-white' : 'text-ktd-100 hover:bg-white/10 hover:text-white'
              )}
            >
              {m.ten}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[13px] text-ktd-100">
          <a href="/" target="_blank" rel="noopener" className="rounded border border-white/30 px-3 py-1 hover:bg-white/10">
            Xem web ↗
          </a>
          <span className="hidden sm:inline">{email}</span>
          <form action={dangXuat}>
            <button type="submit" className="rounded px-2 py-1 hover:bg-white/10">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
