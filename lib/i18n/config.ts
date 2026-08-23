/**
 * Cấu hình song ngữ.
 *
 * Tiếng Việt giữ nguyên đường dẫn gốc (`/san-pham`), tiếng Anh thêm tiền tố
 * (`/en/san-pham`). Trang đã chạy thật và thị trường chính là Việt Nam — đổi
 * đường dẫn tiếng Việt chỉ mang lại rủi ro mất thứ hạng tìm kiếm chứ không
 * được gì.
 */
export const LOCALES = ['vi', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'vi'

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v)

/**
 * Dựng đường dẫn theo ngôn ngữ. Tiếng Việt không có tiền tố.
 *   href('/san-pham', 'vi') -> /san-pham
 *   href('/san-pham', 'en') -> /en/san-pham
 */
export function href(path: string, lang: Locale): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (lang === DEFAULT_LOCALE) return p
  return p === '/' ? `/${lang}` : `/${lang}${p}`
}

/** Bỏ tiền tố ngôn ngữ khỏi đường dẫn hiện tại, để dựng link sang ngôn ngữ kia. */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue
    if (pathname === `/${l}`) return '/'
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1)
  }
  return pathname
}
