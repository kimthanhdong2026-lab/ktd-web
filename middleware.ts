import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/config'
import { capNhatPhien } from '@/lib/supabase/middleware'

/**
 * Ghép ngôn ngữ vào đường dẫn nội bộ mà không đổi đường dẫn khách nhìn thấy.
 *
 *   /san-pham      -> nội bộ /vi/san-pham   (khách vẫn thấy /san-pham)
 *   /en/san-pham   -> giữ nguyên
 *
 * Nhờ vậy toàn bộ đường dẫn tiếng Việt đang được Google lập chỉ mục không đổi
 * một chữ nào, mà mã nguồn chỉ cần một bản cho cả hai ngôn ngữ.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Trang quản trị: không có ngôn ngữ, phải đăng nhập. Chưa đăng nhập thì đưa
  // về trang đăng nhập; đã đăng nhập mà vào trang đăng nhập thì đưa vào trong.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const { response, user } = await capNhatPhien(request)
    const oTrangDangNhap = pathname === '/admin/dang-nhap'
    if (!user && !oTrangDangNhap) return NextResponse.redirect(new URL('/admin/dang-nhap', request.url))
    if (user && oTrangDangNhap) return NextResponse.redirect(new URL('/admin/trang-chu', request.url))
    return response
  }

  // Đã có tiền tố ngôn ngữ thì để nguyên
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Bỏ qua API, tài nguyên nội bộ của Next và mọi file tĩnh trong public/
  matcher: ['/((?!api|_next|assets|products|categories|hero|catalogs|sectors|.*\\..*).*)'],
}
