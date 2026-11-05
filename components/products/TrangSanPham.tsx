import Link from 'next/link'
import type { ReactNode } from 'react'
import { IconCheck } from '@/components/Icons'
import { ProductCard } from '@/components/ProductCard'
import { CatalogButton } from '@/components/products/CatalogButton'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductTabs } from '@/components/products/ProductTabs'
import { QuoteButton } from '@/components/QuoteButton'
import { PHONES, ZALO_URL } from '@/lib/constants'
import { href, type Dictionary, type Locale } from '@/lib/i18n'
import type { Product } from '@/lib/ktd-data'

/** Bọc một phần của trang: web để nguyên, màn hình quản trị bọc khung "Sửa". */
export type KhungSanPham = (khoa: 'sp.anh' | 'sp.dau' | 'sp.tab', node: ReactNode) => ReactNode

/**
 * Trang chi tiết sản phẩm. Dùng ở hai nơi — web thật và màn hình quản trị
 * /admin/san-pham/<slug> — nên admin sửa gì thấy đúng như khách thấy.
 */
export function TrangSanPham({
  product,
  related,
  lang,
  t,
  khung = (_, node) => node,
}: {
  product: Product
  related: Product[]
  lang: Locale
  t: Dictionary
  khung?: KhungSanPham
}) {
  const path = (p: string) => href(p, lang)
  const brand = product.brandLabel
  const category = product.categoryLabel

  return (
    <div className="container-ktd pb-16 pt-6 md:pb-24">
      <nav aria-label="Breadcrumb" className="mb-7 text-body-sm text-ink-500">
        <Link href={path('/')}>{t.nav.home}</Link> / <Link href={path('/san-pham')}>{t.nav.products}</Link> /{' '}
        <Link href={path(`/san-pham?brand=${product.brand}`)}>{brand}</Link> /{' '}
        <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="mb-16 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {khung('sp.anh', <ProductGallery part={product.part} images={product.images} />)}

        {khung(
          'sp.dau',
          <div>
            <p className="label-caps mb-3 text-ink-500">
              {category}
              {product.sub ? ` › ${product.sub}` : ''}
            </p>

            <h1 className="mb-6 font-display text-h1 text-ink-900">{product.name}</h1>

            <dl className="mb-6 flex flex-col gap-3 border-y border-[#eef1f4] py-5">
              <div className="flex items-center gap-4">
                <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">{t.product.partNo}</dt>
                <dd className="part-no text-lg font-semibold text-ink-900">{product.part}</dd>
              </div>
              <div className="flex items-center gap-4">
                <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">{t.product.brand}</dt>
                <dd className="font-display text-[15px] font-semibold text-ink-900">{brand}</dd>
              </div>
              <div className="flex items-center gap-4">
                <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">{t.product.origin}</dt>
                <dd className="text-[15px] text-ink-900">{product.origin}</dd>
              </div>
            </dl>

            <p className="mb-7 text-body-lg text-ink-700">{product.desc}</p>

            {/* Điểm nổi bật — team chốt 05/11/2026 cho lô 1. Cùng kiểu gạch đầu
                dòng với khối "Điểm nổi bật" ở trang thương hiệu. */}
            {product.highlights && (
              <section className="mb-7">
                <h2 className="mb-3 font-display text-[16px] font-bold text-ktd-600">{t.product.highlights}</h2>
                <ul className="space-y-2">
                  {product.highlights.map((m, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-700">
                      <IconCheck className="mt-[5px] h-[15px] w-[15px] flex-none text-ktd-600" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <QuoteButton addPart={product.part} addName={product.name} addBrand={product.brandLabel} className="mb-3 w-full">
              {t.product.addToQuote}
            </QuoteButton>

            <CatalogButton product={product} lang={lang} />
          </div>
        )}
      </div>

      {khung('sp.tab', <ProductTabs product={product} lang={lang} />)}

      {related.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 font-display text-[22px] font-bold text-ink-900 md:text-[26px]">{t.product.related}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <ProductCard key={p.part} product={p} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-8 rounded-lg bg-ktd-600 px-6 py-7 md:px-8 lg:grid-cols-[1fr_1px_1fr] lg:items-center">
        <div className="flex flex-col items-start gap-2.5">
          <h2 className="font-display text-xl font-bold text-white">{t.product.needAdvice}</h2>
          <p className="text-sm leading-relaxed text-ktd-100">{t.product.adviceBody}</p>
          <div className="mt-1 flex flex-wrap gap-2.5">
            <a href={`tel:${PHONES.hotline.tel}`} className="btn bg-white text-ktd-600 hover:bg-ktd-50">
              ☎ Hotline {PHONES.hotline[lang]}
            </a>
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="btn border border-white/35 bg-white/15 text-white hover:bg-white/25">
              💬 Zalo
            </a>
          </div>
        </div>

        <div className="hidden h-full w-px bg-white/25 lg:block" aria-hidden="true" />

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="font-display text-xl font-bold text-white">{t.product.requestQuote}</h2>
          <p className="text-sm leading-relaxed text-ktd-100">{t.product.quoteBody}</p>
          <QuoteButton addPart={product.part} addName={product.name} addBrand={product.brandLabel} className="mt-1">
            {t.product.sendQuote}
          </QuoteButton>
        </div>
      </section>
    </div>
  )
}
