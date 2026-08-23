import { NextResponse } from 'next/server'
import { browseProducts, getBrands, getCategories, searchFuzzy } from '@/lib/db'
import { SLANG_MAP } from '@/lib/ktd-data'
import { levenshtein, normalizeVi } from '@/lib/utils'

/**
 * Nguồn gợi ý cho ô tìm kiếm nổi.
 *
 * Trước đây việc này chạy trong trình duyệt sau khi nhập toàn bộ kho hàng vào
 * mã nguồn. Giờ chạy ở máy chủ: Postgres lo phần tìm, route này lo phần dịch
 * tiếng lóng ngoài xưởng và dựng sẵn dòng hiển thị.
 */

export interface SearchRow {
  key: string
  label: string
  sub: string
  href: string
}

export interface SearchPayload {
  products: SearchRow[]
  brands: SearchRow[]
  categories: SearchRow[]
  any: boolean
}

const SLANG_KEYS = Object.keys(SLANG_MAP)

/** "pa lang" -> "pa lang tecna pa lăng cân bằng". Chịu được cả gõ sai vài ký tự. */
function expandSlang(q: string): string {
  let out = q
  for (const key of SLANG_KEYS) {
    if (q.includes(key) || levenshtein(q, key) <= 2) out += ' ' + SLANG_MAP[key]
  }
  return out
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('q') ?? ''
  const q = normalizeVi(raw)

  if (q.length < 2) {
    return NextResponse.json({ products: [], brands: [], categories: [], any: false })
  }

  const [products, brands, categories, all] = await Promise.all([
    searchFuzzy(expandSlang(q), 5),
    getBrands(),
    getCategories(),
    // Một lượt gọi lấy số sản phẩm theo hãng và theo nhóm cho cả kho, thay vì
    // hỏi riêng từng hãng.
    browseProducts({ limit: 1 }),
  ])

  const brandRows = brands
    .filter((b) => normalizeVi(b.name).includes(q) || q.includes(b.slug.replace(/-/g, '')))
    .slice(0, 3)
    .map((b) => ({
      key: `b-${b.slug}`,
      label: b.name,
      sub: `${b.desc} · ${all.byBrand[b.slug] ?? 0} sản phẩm`,
      href: `/san-pham?brand=${b.slug}`,
    }))

  const categoryRows = categories
    .filter((c) => normalizeVi(c.name).includes(q))
    .slice(0, 3)
    .map((c) => ({
      key: `c-${c.slug}`,
      label: `${c.name} · ${all.byCategory[c.slug] ?? 0} sản phẩm`,
      sub: c.sub,
      href: `/san-pham?category=${c.slug}`,
    }))

  const productRows = products.map((p) => ({
    key: `p-${p.part}`,
    label: p.name,
    sub: `${p.part} · ${p.brandLabel} · ${p.categoryLabel}`,
    href: `/san-pham/${p.slug}`,
  }))

  const payload: SearchPayload = {
    products: productRows,
    brands: brandRows,
    categories: categoryRows,
    any: productRows.length + brandRows.length + categoryRows.length > 0,
  }

  return NextResponse.json(payload, {
    // Gõ đi gõ lại cùng một từ thì lấy lại kết quả cũ, đỡ gọi cơ sở dữ liệu
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  })
}
