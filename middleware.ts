import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/config'

/**
 * Ghép ngôn ngữ vào đường dẫn nội bộ mà không đổi đường dẫn khách nhìn thấy.
 *
 *   /san-pham      -> nội bộ /vi/san-pham   (khách vẫn thấy /san-pham)
 *   /en/san-pham   -> giữ nguyên
 *
 * Nhờ vậy toàn bộ đường dẫn tiếng Việt đang được Google lập chỉ mục không đổi
 * một chữ nào, mà mã nguồn chỉ cần một bản cho cả hai ngôn ngữ.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
