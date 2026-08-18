import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { BRANDS, PRODUCTS, productSlug } from '@/lib/ktd-data'

export const metadata: Metadata = {
  title: 'Sản phẩm — Thiết bị công nghiệp chính hãng',
  description: `${BRANDS.length} thương hiệu chính hãng · ${PRODUCTS.length} mã hàng đại diện. Lọc theo thương hiệu, danh mục hoặc lĩnh vực; tải catalog PDF và nhận báo giá sớm nhất.`,
  alternates: { canonical: '/san-pham' },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

/** Spec D4 — ItemList + BreadcrumbList on the listing page. */
const listSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/san-pham` },
      ],
    },
    {
      '@type': 'ItemList',
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${SITE_URL}/san-pham/${productSlug(p)}`,
      })),
    },
  ],
}

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductBrowser />
      </Suspense>
    </>
  )
}

/** Spec B5.3 — skeleton while the client-filtered listing hydrates. */
function ListingSkeleton() {
  return (
    <div className="container-ktd pb-24 pt-6">
      <div className="mb-3 h-4 w-40 animate-pulse rounded bg-ink-100" />
      <div className="mb-6 h-10 w-2/3 animate-pulse rounded bg-ink-100" />
      <div className="mb-8 h-14 w-full animate-pulse rounded-[10px] bg-ink-100" />
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="hidden h-[420px] animate-pulse rounded bg-ink-100 lg:block" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[340px] animate-pulse rounded-[10px] bg-ink-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
