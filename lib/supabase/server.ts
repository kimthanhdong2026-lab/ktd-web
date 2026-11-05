/**
 * Supabase phía máy chủ, mang theo phiên đăng nhập của admin (cookie).
 *
 * Trang quản trị ghi vào cơ sở dữ liệu và kho file bằng chính phiên này, nên
 * RLS kiểm được "đã đăng nhập chưa" và máy chủ KHÔNG cần giữ khóa service role.
 * Chỉ dùng trong Server Component, Server Action và Route Handler.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

type Cookie = { name: string; value: string; options?: CookieOptions }

export function supabaseServer() {
  const kho = cookies()
  return createServerClient(URL_, KEY, {
    cookies: {
      getAll: () => kho.getAll(),
      setAll: (danhSach: Cookie[]) => {
        try {
          danhSach.forEach(({ name, value, options }) => kho.set(name, value, options))
        } catch {
          // Server Component không được đặt cookie; middleware đã làm tươi phiên
          // nên bỏ qua ở đây là an toàn.
        }
      },
    },
  })
}

/** Người đang đăng nhập, hoặc null. Hỏi thẳng Supabase chứ không tin cookie. */
export async function nguoiDung() {
  const { data } = await supabaseServer().auth.getUser()
  return data.user
}
