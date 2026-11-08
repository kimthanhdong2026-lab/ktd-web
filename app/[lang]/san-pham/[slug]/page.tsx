import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrangSanPham } from '@/components/products/TrangSanPham'
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from '@/lib/db'
import { DEFAULT_LOCALE, LOCALES, dict, href, isLocale, type Locale } from '@/lib/i18n'
import { tuDien } from '@/lib/noi-dung'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kimthanhdong.com'

interface PageProps {
  params: { slug: string; lang: string }
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  const product = await getProductBySlug(params.slug, lang)
  if (!product) return { title: t.product.notFound }

  return {
    title: `${product.name} ${product.part} — ${product.brandLabel}`,
    description: t.product.metaDesc(product.desc, product.part, product.brandLabel),
    alternates: {
      canonical: href(`/san-pham/${params.slug}`, lang),
      languages: {
        'vi-VN': `/san-pham/${params.slug}`,
        'en-US': `/en/san-pham/${params.slug}`,
      },
    },
  }
}

/**
 * Trang chi tiết sản phẩm. Phần vẽ ở components/products/TrangSanPham.tsx —
 * cùng một mã với màn hình quản trị /admin/san-pham/<slug>.
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const product = await getProductBySlug(params.slug, lang)
  if (!product) notFound()
  const [t, related] = await Promise.all([tuDien(lang), getRelatedProducts(product.brand, product.part, 4, lang)])

  // Spec D4: Product schema without `offers` — KTĐ does not publish prices.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        sku: product.part,
        description: product.desc,
        brand: { '@type': 'Brand', name: product.brandLabel },
        category: product.categoryLabel,
        countryOfOrigin: product.origin,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: `${SITE_URL}/san-pham` },
          { '@type': 'ListItem', position: 3, name: product.brandLabel, item: `${SITE_URL}/san-pham?brand=${product.brand}` },
          { '@type': 'ListItem', position: 4, name: product.name, item: `${SITE_URL}/san-pham/${params.slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <TrangSanPham product={product} related={related} lang={lang} t={t} />
    </>
  )
}
