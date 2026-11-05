import type { Metadata } from 'next'
import '../globals.css'
import { ThanhAdmin } from '@/components/admin/ThanhAdmin'
import { fontClass } from '@/lib/fonts'
import { nguoiDung } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { default: 'Quản trị — Kim Thành Đông', template: '%s · Quản trị KTD' },
  robots: { index: false, follow: false },
}

/** Trang quản trị luôn dựng lúc gọi: nội dung phải là bản mới nhất. */
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await nguoiDung()
  return (
    <html lang="vi" className={fontClass}>
      <body className="min-h-screen bg-surface text-ink-900">
        {user && <ThanhAdmin email={user.email ?? ''} />}
        {children}
      </body>
    </html>
  )
}
