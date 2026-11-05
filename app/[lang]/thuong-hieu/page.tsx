import type { Metadata } from 'next'
import { TheHang } from '@/components/brands/TheHang'
import { getBrandPages } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, isLocale, type Locale } from '@/lib/i18n'
import { tuDien } from '@/lib/noi-dung'

interface PageProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  return {
    title: t.brandPage.listHeading,
    description: t.brandPage.listSub,
    alternates: {
      canonical: href('/thuong-hieu', lang),
      languages: { 'vi-VN': '/thuong-hieu', 'en-US': '/en/thuong-hieu' },
    },
  }
}

/**
 * Trang danh sách Thương hiệu: 19 thẻ. Thẻ nằm ở components/brands/TheHang.tsx
 * — dùng chung với màn hình quản trị để admin xem trước đúng thẻ khách thấy.
 */
export default async function BrandListPage({ params }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const [t, brands] = await Promise.all([tuDien(lang), getBrandPages(lang)])

  return (
    <>
      <section className="bg-white px-5 py-10 md:py-12">
        <div className="container-ktd text-center">
          <h1 className="mx-auto max-w-[900px] font-display text-h2 leading-tight text-ktd-600">
            {t.brandPage.listHeading}
          </h1>
          <p className="mx-auto mt-4 max-w-[760px] text-[18px] font-medium leading-relaxed text-ink-700">
            {t.brandPage.listSub}
          </p>
        </div>
      </section>

      <section className="bg-surface py-14 md:py-20">
        <div className="container-ktd">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b) => (
              <li key={b.slug}>
                <TheHang b={b} t={t} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
