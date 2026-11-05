import { FormDoiMatKhau } from '@/components/admin/FormDoiMatKhau'
import { nguoiDung } from '@/lib/supabase/server'

export const metadata = { title: 'Tài khoản' }

export default async function TrangTaiKhoan() {
  const user = await nguoiDung()
  return (
    <main className="mx-auto max-w-[560px] px-4 py-10">
      <h1 className="mb-1 font-display text-[22px] font-bold text-ktd-600">Tài khoản</h1>
      <p className="mb-6 text-[14px] text-ink-600">Đang đăng nhập: <b>{user?.email}</b></p>
      <div className="rounded-2xl border border-hairline bg-white p-6">
        <h2 className="mb-4 font-display text-[16px] font-semibold text-ink-900">Đổi mật khẩu</h2>
        <FormDoiMatKhau />
      </div>
    </main>
  )
}
