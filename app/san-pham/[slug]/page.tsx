import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductTabs } from '@/components/products/ProductTabs'
import { CatalogButton } from '@/components/products/CatalogButton'
import { QuoteButton } from '@/components/QuoteButton'
import {
  PRODUCTS,
  brandName,
  categoryName,
  getProductBySlug,
  productSlug,
} from '@/lib/ktd-data'
import { COMPANY_HOTLINE, COMPANY_HOTLINE_TEL, ZALO_URL } from '@/lib/constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: productSlug(p) }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: 'Không tìm thấy sản phẩm' }

  return {
    title: `${product.name} ${product.part} — ${brandName(product.brand)}`,
    description: `${product.desc} Mã ${product.part}, thương hiệu ${brandName(product.brand)}. Tải catalog PDF, nhận báo giá sớm nhất.`,
    alternates: { canonical: `/san-pham/${params.slug}` },
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const brand = brandName(product.brand)
  const category = categoryName(product.category)
  const related = PRODUCTS.filter(
    (p) => p.brand === product.brand && p.part !== product.part
  ).slice(0, 4)

  // Spec D4: Product schema without `offers` — KTĐ does not publish prices.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        sku: product.part,
        description: product.desc,
        brand: { '@type': 'Brand', name: brand },
        category,
        countryOfOrigin: product.origin,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/san-pham` },
          { '@type': 'ListItem', position: 3, name: brand, item: `${SITE_URL}/san-pham?brand=${product.brand}` },
          { '@type': 'ListItem', position: 4, name: product.name, item: `${SITE_URL}/san-pham/${params.slug}` },
        ],
      },
    ],
  }

  return (
    <div className="container-ktd pb-16 pt-6 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-7 text-body-sm text-ink-500">
        <Link href="/">Trang chủ</Link> / <Link href="/san-pham">Sản phẩm</Link> /{' '}
        <Link href={`/san-pham?brand=${product.brand}`}>{brand}</Link> /{' '}
        <span className="text-ink-900">{product.name}</span>
      </nav>

      <div className="mb-16 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <ProductGallery part={product.part} images={product.images} />

        <div>
          <p className="label-caps mb-3 text-ink-500">
            {category}
            {product.sub ? ` › ${product.sub}` : ''}
          </p>

          <h1 className="mb-6 font-display text-h1 text-ink-900">{product.name}</h1>

          <dl className="mb-6 flex flex-col gap-3 border-y border-[#eef1f4] py-5">
            <div className="flex items-center gap-4">
              <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">Mã hàng</dt>
              <dd className="part-no text-lg font-medium text-ktd-600">{product.part}</dd>
            </div>
            <div className="flex items-center gap-4">
              <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">Thương hiệu</dt>
              <dd className="font-display text-[15px] font-semibold text-ink-900">{brand}</dd>
            </div>
            <div className="flex items-center gap-4">
              <dt className="w-[110px] flex-shrink-0 text-sm text-ink-500">Xuất xứ</dt>
              <dd className="text-[15px] text-ink-900">{product.origin}</dd>
            </div>
          </dl>

          <p className="mb-7 text-body-lg text-ink-700">{product.desc}</p>

          <QuoteButton addPart={product.part} className="mb-3 w-full">
            + THÊM VÀO YÊU CẦU BÁO GIÁ
          </QuoteButton>

          <CatalogButton product={product} />
        </div>
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 font-display text-[22px] font-bold text-ink-900 md:text-[26px]">
            Sản phẩm cùng dòng
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <ProductCard key={p.part} product={p} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-8 rounded-lg bg-ktd-600 px-6 py-7 md:px-8 lg:grid-cols-[1fr_1px_1fr] lg:items-center">
        <div className="flex flex-col items-start gap-2.5">
          <h2 className="font-display text-xl font-bold text-white">Cần tư vấn kỹ thuật?</h2>
          <p className="text-sm leading-relaxed text-ktd-100">
            Kỹ sư giàu kinh nghiệm sẵn sàng hỗ trợ chọn đúng thông số.
          </p>
          <div className="mt-1 flex flex-wrap gap-2.5">
            <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="btn bg-white text-ktd-600 hover:bg-ktd-50">
              ☎ Hotline {COMPANY_HOTLINE}
            </a>
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/35 bg-white/15 text-white hover:bg-white/25"
            >
              💬 Zalo
            </a>
          </div>
        </div>

        <div className="hidden h-full w-px bg-white/25 lg:block" aria-hidden="true" />

        <div className="flex flex-col items-start gap-2.5">
          <h2 className="font-display text-xl font-bold text-white">Yêu cầu báo giá sỉ / lẻ</h2>
          <p className="text-sm leading-relaxed text-ktd-100">
            Nhận báo giá sớm nhất.
          </p>
          <QuoteButton addPart={product.part} className="mt-1">
            Gửi yêu cầu báo giá
          </QuoteButton>
        </div>
      </section>
    </div>
  )
}
