import Image from 'next/image'
import { FormDangNhap } from '@/components/admin/FormDangNhap'

export const metadata = { title: 'Đăng nhập' }

export default function TrangDangNhap() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[400px] rounded-2xl border border-hairline bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/assets/ktd-logo.webp" alt="Kim Thành Đông" width={120} height={48} className="h-10 w-auto" />
          <div>
            <p className="font-display text-[17px] font-bold text-ktd-600">Trang quản trị</p>
            <p className="text-[13px] text-ink-500">Công ty TNHH Kim Thành Đông</p>
          </div>
        </div>
        <FormDangNhap />
      </div>
    </main>
  )
}
