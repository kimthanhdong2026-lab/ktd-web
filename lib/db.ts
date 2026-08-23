/**
 * Lớp đọc dữ liệu từ Supabase.
 *
 * Gọi thẳng PostgREST bằng fetch chứ không qua thư viện client: fetch của Next
 * tự vào bộ đệm dữ liệu và nhận tuỳ chọn revalidate, nên trang tĩnh vẫn tĩnh mà
 * không phải thêm phụ thuộc nào.
 *
 * Khoá anon nằm công khai trong mã nguồn gửi xuống trình duyệt — đó là thiết kế
 * của Supabase. An toàn vì RLS chỉ mở quyền SELECT.
 *
 * Hàm ở đây trả về đúng kiểu Product / Brand / Category mà các component đang
 * dùng, nên phần lớn giao diện không phải sửa gì.
 */
import type { Brand, Category, Product } from './ktd-data'

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const BUCKET = 'ktd'

/** Bao lâu thì Next hỏi lại Supabase. Dữ liệu sản phẩm đổi theo ngày, không theo giây. */
const REVALIDATE = 300

export const missingConfig = !URL_ || !KEY

/** Đường dẫn trong kho file thành URL công khai. Bảng chỉ lưu đường dẫn tương đối. */
export const fileUrl = (path?: string | null): string | undefined =>
  path ? `${URL_}/storage/v1/object/public/${BUCKET}/${path.replace(/^\/+/, '')}` : undefined

async function rest<T>(path: string, init?: RequestInit & { revalidate?: number }): Promise<T> {
  if (missingConfig) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const { revalidate, ...rest } = init ?? {}
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...rest,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, ...(rest.headers ?? {}) },
    next: { revalidate: revalidate ?? REVALIDATE },
  })
  if (!res.ok) throw new Error(`Supabase ${res.status} trên ${path}: ${await res.text()}`)
  return res.json() as Promise<T>
}

async function rpc<T>(fn: string, args: Record<string, unknown>, revalidate = REVALIDATE): Promise<T> {
  return rest<T>(`rpc/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    revalidate,
  })
}

// ---------------------------------------------------------------- ánh xạ dòng

interface ProductRow {
  part: string
  slug: string
  brand_slug: string
  category_slug: string
  brand_label?: string
  category_label?: string
  name_vi: string
  sub_vi: string | null
  series: string | null
  origin_vi: string | null
  desc_vi: string
  desc_full_vi: string[] | null
  applications_vi: string[] | null
  specs_vi: { label: string; value: string }[] | null
  images: string[] | null
  doc_pdf: string | null
  doc_url: string | null
  catalog: { name: string; size: string; pages: number } | null
  keywords: string[] | null
  featured: boolean
  tag: string | null
  brands?: { name: string }
  categories?: { name_vi: string }
}

function toProduct(r: ProductRow): Product {
  return {
    part: r.part,
    slug: r.slug,
    name: r.name_vi,
    brand: r.brand_slug,
    category: r.category_slug,
    brandLabel: r.brand_label ?? r.brands?.name ?? r.brand_slug,
    categoryLabel: r.category_label ?? r.categories?.name_vi ?? r.category_slug,
    sub: r.sub_vi ?? undefined,
    series: r.series ?? '',
    origin: r.origin_vi ?? '',
    desc: r.desc_vi,
    descFull: r.desc_full_vi?.length ? r.desc_full_vi : undefined,
    applications: r.applications_vi?.length ? r.applications_vi : undefined,
    specs: r.specs_vi?.length ? r.specs_vi.map((s) => [s.label, s.value] as [string, string]) : undefined,
    // Ảnh lưu đường dẫn tương đối, dựng URL ở đây để bảng không phụ thuộc tên miền
    images: r.images?.length ? r.images.map((p) => fileUrl(p)!) : undefined,
    docPdf: fileUrl(r.doc_pdf),
    docUrl: r.doc_url ?? undefined,
    pdf: r.catalog ?? undefined,
    kw: r.keywords ?? [],
    featured: r.featured || undefined,
    tag: (r.tag as Product['tag']) ?? undefined,
  }
}

const PRODUCT_COLS =
  'part,slug,brand_slug,category_slug,name_vi,sub_vi,series,origin_vi,desc_vi,' +
  'desc_full_vi,applications_vi,specs_vi,images,doc_pdf,doc_url,catalog,keywords,featured,tag,' +
  'brands(name),categories(name_vi)'

// ------------------------------------------------------------ hãng và danh mục

export async function getBrands(): Promise<Brand[]> {
  const rows = await rest<
    { slug: string; name: string; origin_vi: string; desc_vi: string; logo: string | null }[]
  >('brands?select=slug,name,origin_vi,desc_vi,logo&order=sort_order')
  return rows.map((b) => ({
    slug: b.slug,
    name: b.name,
    origin: b.origin_vi,
    desc: b.desc_vi,
    logo: fileUrl(b.logo),
  }))
}

export async function getCategories(): Promise<Category[]> {
  const rows = await rest<{ slug: string; name_vi: string; sub_vi: string; featured: boolean }[]>(
    'categories?select=slug,name_vi,sub_vi,featured&order=sort_order'
  )
  return rows.map((c) => ({ slug: c.slug, name: c.name_vi, sub: c.sub_vi, featured: c.featured }))
}

// -------------------------------------------------------------------- sản phẩm

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&slug=eq.${encodeURIComponent(slug)}&limit=1`
  )
  return rows[0] ? toProduct(rows[0]) : undefined
}

export async function getProductByPart(part: string): Promise<Product | undefined> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&part=eq.${encodeURIComponent(part)}&limit=1`
  )
  return rows[0] ? toProduct(rows[0]) : undefined
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&featured=is.true&order=priority.nullslast,name_vi&limit=${limit}`
  )
  return rows.map(toProduct)
}

/** Sản phẩm cùng hãng, dùng cho dải "sản phẩm liên quan" ở trang chi tiết. */
export async function getRelatedProducts(brand: string, exceptPart: string, limit = 4): Promise<Product[]> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&brand_slug=eq.${encodeURIComponent(brand)}` +
      `&part=neq.${encodeURIComponent(exceptPart)}&order=priority.nullslast,name_vi&limit=${limit}`
  )
  return rows.map(toProduct)
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await rest<{ slug: string }[]>('products?select=slug&order=slug')
  return rows.map((r) => r.slug)
}

export async function countProducts(): Promise<number> {
  const res = await fetch(`${URL_}/rest/v1/products?select=part`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'count=exact', Range: '0-0' },
    next: { revalidate: REVALIDATE },
  })
  return Number(res.headers.get('content-range')?.split('/')[1] ?? 0)
}

// -------------------------------------------------------------------- tìm kiếm

export interface BrowseResult {
  items: Product[]
  total: number
  byBrand: Record<string, number>
  byCategory: Record<string, number>
}

export interface BrowseArgs {
  q?: string
  brands?: string[]
  categories?: string[]
  sort?: string
  limit?: number
  offset?: number
}

/** Lọc, sắp xếp, cắt trang và đếm — một lượt gọi, xem 0005_browse.sql. */
export async function browseProducts(a: BrowseArgs = {}): Promise<BrowseResult> {
  const raw = await rpc<{
    total: number
    items: ProductRow[]
    by_brand: Record<string, number>
    by_category: Record<string, number>
  }>('search_products', {
    q: a.q ?? '',
    brand_in: a.brands?.length ? a.brands : null,
    cat_in: a.categories?.length ? a.categories : null,
    sort: a.sort ?? 'default',
    // Number.isFinite chứ không phải ??: NaN lọt qua ?? rồi thành null trong
    // JSON, mà `limit null` với Postgres nghĩa là KHÔNG giới hạn — trả về cả
    // kho hàng thay vì một trang.
    lim: Number.isFinite(a.limit) ? a.limit : 24,
    off: Number.isFinite(a.offset) ? a.offset : 0,
  })
  return {
    items: (raw.items ?? []).map(toProduct),
    total: raw.total ?? 0,
    byBrand: raw.by_brand ?? {},
    byCategory: raw.by_category ?? {},
  }
}

/** Tìm chịu được gõ sai, dùng cho ô tìm kiếm nổi — xem 0003_search.sql. */
export async function searchFuzzy(q: string, limit = 8): Promise<Product[]> {
  if (!q.trim()) return []
  const rows = await rpc<ProductRow[]>('search_products_fuzzy', { q, max_rows: limit }, 60)
  if (!rows.length) return []
  // RPC trả về setof products nên không kèm tên hãng; tra thêm một lượt cho nhãn
  const [brands, cats] = await Promise.all([getBrands(), getCategories()])
  const bn = new Map(brands.map((b) => [b.slug, b.name]))
  const cn = new Map(cats.map((c) => [c.slug, c.name]))
  return rows.map((r) =>
    toProduct({ ...r, brand_label: bn.get(r.brand_slug), category_label: cn.get(r.category_slug) })
  )
}
