import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBrandPages } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, isLocale, type Locale } from '@/lib/i18n'
import { maQuocKy } from '@/lib/quoc-ky'

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
 * Logo nhiều tầng — có biểu tượng hoặc dòng chữ phụ xếp trên dưới tên hãng.
 *
 * Thẻ chia cỡ logo theo CHIỀU CAO (32px). Logo một dòng chữ thì vừa, nhưng
 * logo nhiều tầng bị chia 32px đó cho hai ba dòng nên tên hãng còn bé xíu.
 * Mục TH02 của "Sửa web 5" nêu bốn hãng này; cho chúng cao 60px.
 */
const LOGO_CAO = new Set(['hartner', 'tschorn', 'rocklinizer', 'lenzkes'])

export default async function BrandListPage({ params }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  const brands = await getBrandPages(lang)

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
                <Link
                  href={href(`/thuong-hieu/${b.slug}`, lang)}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md"
                >
                  {b.banner ? (
                    <Image
                      src={b.banner}
                      alt=""
                      width={1200}
                      height={900}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-ink-100" />
                  )}

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    {/* Logo GỐC trong public/, không phải bản chuẩn hoá trên kho
                        ảnh. Bản chuẩn hoá đóng mọi logo vào khung 320×128 cho
                        lưới logo trang chủ đều nhau; thẻ ở đây lại chia tỉ lệ
                        theo chiều cao, nên logo chữ dài như Karnasch bị thu
                        còn một vệt mờ. Bản gốc giữ đúng tỉ lệ thật, cao bằng
                        nhau, rộng thì chặn bằng max-w. */}
                    {b.logo ? (
                      <Image
                        src={`/assets/brands/${b.slug}.webp`}
                        alt={b.name}
                        width={320}
                        height={128}
                        className={`mb-3 w-auto self-start object-contain object-left ${
                          LOGO_CAO.has(b.slug) ? 'h-[60px] max-w-[210px]' : 'h-8 max-w-[170px]'
                        }`}
                      />
                    ) : (
                      <span className="mb-3 font-display text-[18px] font-bold text-ink-900">
                        {b.name}
                      </span>
                    )}

                    {/* Cờ nước ở đây cũng là ảnh thật, xem ghi chú trong
                        components/brands/NhanXuatXu.tsx. */}
                    <p className="mb-2 flex items-center gap-2 font-mono text-[13px] uppercase tracking-[.1em] text-ink-500">
                      {maQuocKy(b.origin) && (
                        <img
                          src={`/assets/co/${maQuocKy(b.origin)}.svg`}
                          alt=""
                          width={18}
                          height={13}
                          className="h-[13px] w-[18px] flex-none rounded-[2px] object-cover ring-1 ring-black/10"
                        />
                      )}
                      {t.brandPage.from(b.origin)}
                    </p>

                    {/* Cắt đoạn giới thiệu cho các thẻ cao bằng nhau. Bản đầy đủ
                        nằm ở trang riêng của hãng. */}
                    <p className="line-clamp-3 text-[16px] leading-relaxed text-ink-600">
                      {b.intro}
                    </p>

                    <span className="mt-auto pt-4 text-[16px] font-semibold text-ktd-600 group-hover:underline">
                      {t.brandPage.viewAll(b.name)} →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
