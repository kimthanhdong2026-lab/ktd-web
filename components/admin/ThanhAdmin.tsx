'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dangXuat } from '@/app/admin/actions'
import { cx } from '@/lib/utils'

const MUC = [
  { href: '/admin/bao-gia', ten: 'Báo giá' },
  { href: '/admin/trang-chu', ten: 'Trang chủ' },
  { href: '/admin/gioi-thieu', ten: 'Giới thiệu' },
  { href: '/admin/lien-he', ten: 'Liên hệ' },
  { href: '/admin/san-pham', ten: 'Sản phẩm' },
  { href: '/admin/danh-muc', ten: 'Danh mục' },
  { href: '/admin/nhap-excel', ten: 'Nhập Excel' },
  { href: '/admin/tin-tuc', ten: 'Tin tức' },
  { href: '/admin/thuong-hieu', ten: 'Thương hiệu' },
  { href: '/admin/tai-khoan', ten: 'Tài khoản' },
]

/** Thanh trên cùng của trang quản trị: tên mục, "Xem web", đăng xuất. */
export function ThanhAdmin({ email, soBaoGiaMoi = 0 }: { email: string; soBaoGiaMoi?: number }) {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 z-[60] border-b border-ktd-700 bg-ktd-800 text-white">
      <div className="mx-auto flex h-12 max-w-[1600px] items-center gap-4 px-4">
        <Link href="/admin/trang-chu" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-7 items-center rounded bg-white px-1.5">
            <Image src="/assets/ktd-logo.webp" alt="KTD" width={60} height={24} className="h-5 w-auto" />
          </span>
          <span className="whitespace-nowrap font-display text-[14px] font-semibold tracking-wide">QUẢN TRỊ</span>
        </Link>
        <nav className="flex items-center gap-0.5 text-[14px]">
          {MUC.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={cx(
                'whitespace-nowrap rounded px-2.5 py-1.5 font-medium transition-colors',
                pathname.startsWith(m.href) ? 'bg-white/15 text-white' : 'text-ktd-100 hover:bg-white/10 hover:text-white'
              )}
            >
              {m.ten}
              {m.href === '/admin/bao-gia' && soBaoGiaMoi > 0 && (
                <span className="ml-1.5 inline-flex min-w-[20px] items-center justify-center rounded-full bg-quote px-1.5 text-[11px] font-bold leading-[18px] text-white">{soBaoGiaMoi}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3 text-[13px] text-ktd-100">
          <a href="/" target="_blank" rel="noopener" className="whitespace-nowrap rounded border border-white/30 px-3 py-1 hover:bg-white/10">
            Xem web ↗
          </a>
          <span className="hidden 2xl:inline" title={email}>{email}</span>
          <form action={dangXuat}>
            <button type="submit" className="whitespace-nowrap rounded px-2 py-1 hover:bg-white/10">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
