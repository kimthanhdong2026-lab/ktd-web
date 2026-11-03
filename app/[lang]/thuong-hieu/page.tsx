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
 * Chiều cao (px) của từng logo trên thẻ, để 19 logo NHÌN to bằng nhau — góp ý
 * của KTD ngày 04/11/2026 (Beveltools, Buchem còn nhỏ).
 *
 * Bản trước chỉ có hai cỡ: 32px cho mọi logo và 60px cho bốn logo nhiều tầng
 * (TH02 của "Sửa web 5"). Cùng chiều cao nhưng logo vuông vức như Buchem trông
 * nhỏ hơn hẳn logo dài như Karnasch.
 *
 * Các số dưới đây ĐO ĐƯỢC từ file logo gốc (đã cắt sát viền): mỗi logo được
 * cho cùng một diện tích khung bao, rồi bù theo độ đậm nét — logo nét mảnh,
 * nhiều khoảng trắng bên trong (Hartner, Rocklin, Tschorn) được to thêm, tối
 * đa 25%. Rộng tối đa 220px, cao tối đa 60px để vừa thẻ.
 *
 * Thêm hãng mới mà chưa có số thì logo cao 34px.
 */
const LOGO_CAO: Record<string, number> = {
  martor: 32,
  karnasch: 21,
  hartner: 55,
  helical: 26,
  corehog: 33,
  ata: 48,
  morrisflex: 28,
  garryson: 39,
  'bevel-tools': 37,
  diprofil: 25,
  buchem: 42,
  rocklinizer: 58,
  tschorn: 56,
  lenzkes: 48,
  fiam: 43,
  sloky: 34,
  technomark: 33,
  tecna: 36,
  rtc: 58,
}

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
                    {/* Logo nằm trong một ô cao cố định 60px, căn giữa theo chiều
                        dọc: logo cao thấp khác nhau nhưng dòng "Thương hiệu đến
                        từ…" và đoạn chữ bên dưới của các thẻ cùng hàng vẫn
                        thẳng hàng với nhau. */}
                    {b.logo ? (
                      <div className="mb-3 flex h-[60px] items-center">
                        <Image
                          src={`/assets/brands/${b.slug}.webp`}
                          alt={b.name}
                          width={320}
                          height={128}
                          style={{ height: LOGO_CAO[b.slug] ?? 34 }}
                          className="w-auto max-w-[220px] object-contain object-left"
                        />
                      </div>
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

                    {/* Câu mô tả ngắn team viết cho từng hãng (sheet "MTN - Brand",
                        câu A2 vòng 2), vừa 3 dòng. Hãng nào chưa có câu ngắn thì
                        lấy đoạn giới thiệu dài, cắt ở dòng thứ 3. */}
                    <p className="line-clamp-3 text-[16px] leading-relaxed text-ink-600">
                      {b.desc || b.intro}
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
