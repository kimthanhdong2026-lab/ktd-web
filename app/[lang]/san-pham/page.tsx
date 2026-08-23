import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { MAX_SHOW, PAGE_SIZE } from '@/lib/browse'
import { ProductGroups } from '@/components/products/ProductGroups'
import { browseProducts, countProducts, getBrands, getCategories } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, isLocale, type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  const [brands, n] = await Promise.all([getBrands(lang), countProducts()])
  return {
    title: t.products.metaTitle,
    description: t.products.metaDesc(brands.length, n),
    alternates: {
      canonical: href('/san-pham', lang),
      languages: { 'vi-VN': '/san-pham', 'en-US': '/en/san-pham' },
    },
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

/** Nhận cả `?brand=a&brand=b` lẫn `?brand=a` — Next đưa về string hoặc string[]. */
const many = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

const one = (v: string | string[] | undefined): string =>
  v === undefined ? '' : Array.isArray(v) ? (v[0] ?? '') : v

interface PageProps {
  params: { lang: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const query = one(searchParams.q)
  const selectedBrands = many(searchParams.brand)
  const selectedCategories = many(searchParams.category)
  const sort = one(searchParams.sort) || 'default'

  const show = Math.min(
    MAX_SHOW,
    Math.max(PAGE_SIZE, Number.parseInt(one(searchParams.show), 10) || PAGE_SIZE)
  )

  const [brands, categories, result] = await Promise.all([
    getBrands(lang),
    getCategories(lang),
    browseProducts({
      q: query,
      brands: selectedBrands,
      categories: selectedCategories,
      sort,
      limit: show,
      lang,
    }),
  ])

  const nextShow = Math.min(show + PAGE_SIZE, MAX_SHOW)
  const sp = new URLSearchParams()
  if (query) sp.set('q', query)
  selectedBrands.forEach((b) => sp.append('brand', b))
  selectedCategories.forEach((c) => sp.append('category', c))
  if (sort !== 'default') sp.set('sort', sort)
  sp.set('show', String(nextShow))
  const nextHref = result.total > show && show < MAX_SHOW ? href(`/san-pham?${sp}`, lang) : null

  // Spec D4 — ItemList + BreadcrumbList. Chỉ liệt kê những gì đang hiện, vì
  // đây là mô tả của chính trang này chứ không phải của cả kho hàng.
  const listSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: dict(lang).nav.home, item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: dict(lang).nav.products,
            item: `${SITE_URL}${href('/san-pham', lang)}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        numberOfItems: result.total,
        itemListElement: result.items.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}${href(`/san-pham/${p.slug}`, lang)}`,
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
          lang={lang}
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
