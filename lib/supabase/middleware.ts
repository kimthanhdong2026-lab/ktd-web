/**
 * Làm tươi phiên đăng nhập trong middleware và cho biết có ai đang đăng nhập.
 *
 * Supabase phát token ngắn hạn; middleware là chỗ duy nhất vừa đọc vừa ghi
 * được cookie trên mọi yêu cầu, nên việc gia hạn đặt ở đây (theo mẫu của
 * @supabase/ssr).
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type Cookie = { name: string; value: string; options?: CookieOptions }

export async function capNhatPhien(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (danhSach: Cookie[]) => {
          danhSach.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          danhSach.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )
  const { data } = await supabase.auth.getUser()
  return { response, user: data.user }
}
