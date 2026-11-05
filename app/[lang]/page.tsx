import { TrangChu } from '@/components/home/TrangChu'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n'

/**
 * Trang chủ. Các khối nằm trong components/home/TrangChu.tsx — cùng một mã
 * với màn hình quản trị /admin/trang-chu, nên admin sửa gì thì thấy đúng như
 * khách sẽ thấy.
 */
export default function HomePage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  return <TrangChu lang={lang} />
}
