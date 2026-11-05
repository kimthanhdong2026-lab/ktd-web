import type { Metadata } from 'next'
import '../globals.css'
import { ThanhAdmin } from '@/components/admin/ThanhAdmin'
import { fontClass } from '@/lib/fonts'
import { nguoiDung, supabaseServer } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { default: 'Quản trị — Kim Thành Đông', template: '%s · Quản trị KTD' },
  robots: { index: false, follow: false },
}

/** Trang quản trị luôn dựng lúc gọi: nội dung phải là bản mới nhất. */
export const dynamic = 'force-dynamic'

/** Số yêu cầu báo giá chưa xử lý — hiện trên thanh quản trị. Chưa chạy 0024 thì 0. */
async function soBaoGiaMoi(): Promise<number> {
  try {
    const { count } = await supabaseServer().from('yeu_cau_bao_gia').select('ma', { count: 'exact', head: true }).eq('trang_thai', 'moi')
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await nguoiDung()
  const soMoi = user ? await soBaoGiaMoi() : 0
  return (
    <html lang="vi" className={fontClass}>
      <body className="min-h-screen bg-surface text-ink-900">
        {user && <ThanhAdmin email={user.email ?? ''} soBaoGiaMoi={soMoi} />}
        {children}
      </body>
    </html>
  )
}
