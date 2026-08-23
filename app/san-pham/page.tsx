import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { MAX_SHOW, PAGE_SIZE } from '@/lib/browse'
import { ProductGroups } from '@/components/products/ProductGroups'
import { browseProducts, countProducts, getBrands, getCategories } from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  const [brands, n] = await Promise.all([getBrands(), countProducts()])
  return {
    title: 'Sản phẩm — Thiết bị công nghiệp chính hãng',
    description: `${brands.length} thương hiệu chính hãng · ${n} mã hàng. Lọc theo thương hiệu, danh mục hoặc lĩnh vực; tải catalog PDF và nhận báo giá sớm nhất.`,
    alternates: { canonical: '/san-pham' },
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

/** Nhận cả `?brand=a&brand=b` lẫn `?brand=a` — Next đưa về string hoặc string[]. */
const many = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

const one = (v: string | string[] | undefined): string =>
  v === undefined ? '' : Array.isArray(v) ? (v[0] ?? '') : v

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const query = one(searchParams.q)
  const selectedBrands = many(searchParams.brand)
  const selectedCategories = many(searchParams.category)
  const sort = one(searchParams.sort) || 'default'

  const show = Math.min(
    MAX_SHOW,
    Math.max(PAGE_SIZE, Number.parseInt(one(searchParams.show), 10) || PAGE_SIZE)
  )

  const [brands, categories, result] = await Promise.all([
    getBrands(),
    getCategories(),
    browseProducts({
      q: query,
      brands: selectedBrands,
      categories: selectedCategories,
      sort,
      limit: show,
    }),
  ])

  const nextShow = Math.min(show + PAGE_SIZE, MAX_SHOW)
  const sp = new URLSearchParams()
  if (query) sp.set('q', query)
  selectedBrands.forEach((b) => sp.append('brand', b))
  selectedCategories.forEach((c) => sp.append('category', c))
  if (sort !== 'default') sp.set('sort', sort)
  sp.set('show', String(nextShow))
  const nextHref = result.total > show && show < MAX_SHOW ? `/san-pham?${sp}` : null

  // Spec D4 — ItemList + BreadcrumbList. Chỉ liệt kê những gì đang hiện, vì
  // đây là mô tả của chính trang này chứ không phải của cả kho hàng.
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
        numberOfItems: result.total,
        itemListElement: result.items.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/san-pham/${p.slug}`,
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <ProductBrowser
        brands={brands}
        categories={categories}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        query={query}
        sort={sort}
        total={result.total}
        countByBrand={result.byBrand}
      >
        <ProductGroups
          items={result.items}
          brands={brands}
          categories={categories}
          countByBrand={result.byBrand}
          singleBrand={selectedBrands.length === 1}
          total={result.total}
          show={show}
          nextHref={nextHref}
        />
      </ProductBrowser>
    </>
  )
}
