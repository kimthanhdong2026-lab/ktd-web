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
import type { Brand, BrandPage, Category, Product } from './ktd-data'
import { DEFAULT_LOCALE, type Locale } from './i18n/config'

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
  name_en: string | null
  sub_vi: string | null
  sub_en: string | null
  series: string | null
  origin_vi: string | null
  origin_en: string | null
  desc_vi: string
  desc_en: string | null
  desc_full_vi: string[] | null
  desc_full_en: string[] | null
  applications_vi: string[] | null
  applications_en: string[] | null
  specs_vi: { label: string; value: string }[] | null
  specs_en: { label: string; value: string }[] | null
  images: string[] | null
  doc_pdf: string | null
  doc_url: string | null
  catalog: { name: string; size: string; pages: number } | null
  keywords: string[] | null
  featured: boolean
  tag: string | null
  brands?: { name: string }
  categories?: { name_vi: string; name_en: string | null }
}

/**
 * Chọn bản theo ngôn ngữ, thiếu thì lùi về tiếng Việt.
 *
 * Lùi về tiếng Việt chứ không để trống: bản tiếng Anh còn đang điền dần, và
 * khách đọc được tiếng Việt vẫn hơn nhìn ô rỗng.
 */
const pick = <T>(en: T | null | undefined, vi: T, lang: Locale): T =>
  lang === 'en' && en !== null && en !== undefined && (!Array.isArray(en) || en.length > 0)
    ? en
    : vi

function toProduct(r: ProductRow, lang: Locale = DEFAULT_LOCALE): Product {
  const specs = pick(r.specs_en, r.specs_vi ?? [], lang)
  return {
    part: r.part,
    slug: r.slug,
    name: pick(r.name_en, r.name_vi, lang),
    brand: r.brand_slug,
    category: r.category_slug,
    brandLabel: r.brand_label ?? r.brands?.name ?? r.brand_slug,
    categoryLabel:
      r.category_label ??
      pick(r.categories?.name_en, r.categories?.name_vi ?? r.category_slug, lang),
    sub: pick(r.sub_en, r.sub_vi, lang) ?? undefined,
    series: r.series ?? '',
    origin: pick(r.origin_en, r.origin_vi, lang) ?? '',
    desc: pick(r.desc_en, r.desc_vi, lang),
    descFull: pick(r.desc_full_en, r.desc_full_vi ?? [], lang).length
      ? pick(r.desc_full_en, r.desc_full_vi ?? [], lang)
      : undefined,
    applications: pick(r.applications_en, r.applications_vi ?? [], lang).length
      ? pick(r.applications_en, r.applications_vi ?? [], lang)
      : undefined,
    specs: specs.length ? specs.map((s) => [s.label, s.value] as [string, string]) : undefined,
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
  'part,slug,brand_slug,category_slug,name_vi,name_en,sub_vi,sub_en,series,' +
  'origin_vi,origin_en,desc_vi,desc_en,desc_full_vi,desc_full_en,' +
  'applications_vi,applications_en,specs_vi,specs_en,' +
  'images,doc_pdf,doc_url,catalog,keywords,featured,tag,' +
  'brands(name),categories(name_vi,name_en)'

// ------------------------------------------------------------ hãng và danh mục

export async function getBrands(lang: Locale = DEFAULT_LOCALE): Promise<Brand[]> {
  const rows = await rest<
    {
      slug: string
      name: string
      origin_vi: string
      origin_en: string | null
      desc_vi: string
      desc_en: string | null
      logo: string | null
    }[]
  >(
    'brands?select=slug,name,origin_vi,origin_en,desc_vi,desc_en,logo' +
      '&visible=eq.true&order=sort_order'
  )
  return rows.map((b) => ({
    slug: b.slug,
    name: b.name,
    origin: pick(b.origin_en, b.origin_vi, lang),
    desc: pick(b.desc_en, b.desc_vi, lang),
    logo: fileUrl(b.logo),
  }))
}

/** Các cột dựng nên một trang thương hiệu. */
const BRAND_PAGE_COLS =
  'slug,name,origin_vi,origin_en,desc_vi,desc_en,logo,banner,' +
  'intro_vi,intro_en,dong_sp_vi,dong_sp_en,noi_bat_vi,noi_bat_en,ung_dung_vi,ung_dung_en'

interface BrandPageRow {
  slug: string
  name: string
  origin_vi: string
  origin_en: string | null
  desc_vi: string
  desc_en: string | null
  logo: string | null
  banner: string | null
  intro_vi: string | null
  intro_en: string | null
  dong_sp_vi: string[]
  dong_sp_en: string[] | null
  noi_bat_vi: string[]
  noi_bat_en: string[] | null
  ung_dung_vi: string[]
  ung_dung_en: string[] | null
}

const toBrandPage = (b: BrandPageRow, lang: Locale): BrandPage => ({
  slug: b.slug,
  name: b.name,
  origin: pick(b.origin_en, b.origin_vi, lang),
  desc: pick(b.desc_en, b.desc_vi, lang),
  logo: fileUrl(b.logo),
  banner: fileUrl(b.banner),
  intro: pick(b.intro_en, b.intro_vi ?? '', lang),
  dongSp: pick(b.dong_sp_en, b.dong_sp_vi, lang),
  noiBat: pick(b.noi_bat_en, b.noi_bat_vi, lang),
  ungDung: pick(b.ung_dung_en, b.ung_dung_vi, lang),
})

export async function getBrandPage(
  slug: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<BrandPage | undefined> {
  const rows = await rest<BrandPageRow[]>(
    `brands?select=${BRAND_PAGE_COLS}&slug=eq.${encodeURIComponent(slug)}` +
      '&visible=eq.true&limit=1'
  )
  return rows[0] ? toBrandPage(rows[0], lang) : undefined
}

export async function getBrandPages(lang: Locale = DEFAULT_LOCALE): Promise<BrandPage[]> {
  const rows = await rest<BrandPageRow[]>(
    `brands?select=${BRAND_PAGE_COLS}&visible=eq.true&order=sort_order`
  )
  return rows.map((b) => toBrandPage(b, lang))
}

/**
 * Các nhóm nhỏ mà một hãng thực sự có hàng, kèm số lượng.
 *
 * Đây là yêu cầu Mr Nam nêu rõ: trang Karnasch chỉ liệt kê 6 nhóm Karnasch có,
 * không bày cả 41 nhóm. Quan hệ hãng ↔ nhóm không ai khai báo — nó rơi ra từ
 * việc gắn sản phẩm, nên tính ngay tại đây.
 */
/**
 * Số sản phẩm theo từng nhóm, giới hạn trong một tập thương hiệu.
 *
 * Dùng cho bộ lọc trang Sản phẩm: Mr Nam yêu cầu khi khách chọn một hãng thì
 * danh sách nhóm thu lại còn đúng những nhóm hãng đó có hàng, chứ không bày cả
 * 41 nhóm trong đó 39 nhóm bấm vào ra trang rỗng.
 *
 * Cố ý KHÔNG lọc theo nhóm đang chọn: nếu lọc thì mọi nhóm khác về 0 và biến
 * mất khỏi bộ lọc, khách không đổi được lựa chọn nữa.
 *
 * Mảng rỗng = không lọc hãng, trả về số đếm của toàn bộ kho.
 */
export async function getCategoryCounts(
  brandSlugs: string[] = []
): Promise<Record<string, number>> {
  const loc = brandSlugs.length
    ? `&brand_slug=in.(${brandSlugs.map(encodeURIComponent).join(',')})`
    : ''
  const rows = await rest<{ category_slug: string }[]>(
    `products_hien_thi?select=category_slug${loc}`
  )
  const dem: Record<string, number> = {}
  for (const r of rows) dem[r.category_slug] = (dem[r.category_slug] ?? 0) + 1
  return dem
}

export async function getBrandCategories(
  brandSlug: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<{ slug: string; name: string; parent: string | null; count: number }[]> {
  const rows = await rest<{ category_slug: string }[]>(
    `products_hien_thi?select=category_slug&brand_slug=eq.${encodeURIComponent(brandSlug)}`
  )
  const dem = new Map<string, number>()
  for (const r of rows) dem.set(r.category_slug, (dem.get(r.category_slug) ?? 0) + 1)
  if (!dem.size) return []

  const cats = await getCategories(lang)
  return cats
    .filter((c) => dem.has(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name, parent: c.parent ?? null, count: dem.get(c.slug)! }))
}

export async function getCategories(lang: Locale = DEFAULT_LOCALE): Promise<Category[]> {
  type Hang = {
    slug: string
    name_vi: string
    name_en: string | null
    sub_vi: string
    sub_en: string | null
    featured: boolean
    parent_slug?: string | null
  }[]

  // Chỉ lấy danh mục đang hiện: nhóm bị ẩn thì không được xuất hiện ở bộ lọc,
  // ở ô danh mục trang chủ, hay ở cột Danh mục chân trang.
  const rows = await rest<Hang>(
    'categories?select=slug,name_vi,name_en,sub_vi,sub_en,featured,parent_slug' +
      '&visible=eq.true&order=sort_order'
  )

  return rows.map((c) => ({
    slug: c.slug,
    name: pick(c.name_en, c.name_vi, lang),
    sub: pick(c.sub_en, c.sub_vi, lang),
    featured: c.featured,
    parent: c.parent_slug ?? null,
  }))
}

// -------------------------------------------------------------------- sản phẩm

export async function getProductBySlug(slug: string, lang: Locale = DEFAULT_LOCALE): Promise<Product | undefined> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&slug=eq.${encodeURIComponent(slug)}&limit=1`
  )
  return rows[0] ? toProduct(rows[0], lang) : undefined
}

export async function getProductByPart(part: string, lang: Locale = DEFAULT_LOCALE): Promise<Product | undefined> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&part=eq.${encodeURIComponent(part)}&limit=1`
  )
  return rows[0] ? toProduct(rows[0], lang) : undefined
}

export async function getFeaturedProducts(limit = 4, lang: Locale = DEFAULT_LOCALE): Promise<Product[]> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&featured=is.true&order=priority.nullslast,name_vi&limit=${limit}`
  )
  return rows.map((r) => toProduct(r, lang))
}

/** Sản phẩm cùng hãng, dùng cho dải "sản phẩm liên quan" ở trang chi tiết. */
export async function getRelatedProducts(brand: string, exceptPart: string, limit = 4, lang: Locale = DEFAULT_LOCALE): Promise<Product[]> {
  const rows = await rest<ProductRow[]>(
    `products?select=${PRODUCT_COLS}&brand_slug=eq.${encodeURIComponent(brand)}` +
      `&part=neq.${encodeURIComponent(exceptPart)}&order=priority.nullslast,name_vi&limit=${limit}`
  )
  return rows.map((r) => toProduct(r, lang))
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
  lang?: Locale
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
  const lang = a.lang ?? DEFAULT_LOCALE
  return {
    items: (raw.items ?? []).map((r) => toProduct(r, lang)),
    total: raw.total ?? 0,
    byBrand: raw.by_brand ?? {},
    byCategory: raw.by_category ?? {},
  }
}

/** Tìm chịu được gõ sai, dùng cho ô tìm kiếm nổi — xem 0003_search.sql. */
export async function searchFuzzy(q: string, limit = 8, lang: Locale = DEFAULT_LOCALE): Promise<Product[]> {
  if (!q.trim()) return []
  const rows = await rpc<ProductRow[]>('search_products_fuzzy', { q, max_rows: limit }, 60)
  if (!rows.length) return []
  // RPC trả về setof products nên không kèm tên hãng; tra thêm một lượt cho nhãn
  const [brands, cats] = await Promise.all([getBrands(lang), getCategories(lang)])
  const bn = new Map(brands.map((b) => [b.slug, b.name]))
  const cn = new Map(cats.map((c) => [c.slug, c.name]))
  return rows.map((r) =>
    toProduct(
      { ...r, brand_label: bn.get(r.brand_slug), category_label: cn.get(r.category_slug) },
      lang
    )
  )
}
