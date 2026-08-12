import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
  SLANG_MAP,
  brandName,
  categoryName,
  type Brand,
  type Category,
  type Product,
} from './ktd-data'
import { levenshtein, normalizeVi } from './utils'

export interface SearchResults {
  products: Product[]
  brands: Brand[]
  categories: Category[]
  any: boolean
}

export const EMPTY_RESULTS: SearchResults = { products: [], brands: [], categories: [], any: false }

/** Precomputed haystack per product so keystrokes stay cheap (spec: INP < 200ms). */
const HAYSTACK = new Map(
  PRODUCTS.map((p) => [
    p.part,
    normalizeVi(
      [p.part, p.name, brandName(p.brand), categoryName(p.category), ...(p.kw ?? [])].join(' ')
    ),
  ])
)

const SLANG_KEYS = Object.keys(SLANG_MAP)

/**
 * Scored search across part number, name, brand, category and shop-floor keywords.
 * Exact part-number matches always float to the top (spec C4, case 1).
 */
export function searchAll(raw: string, limit = 5): SearchResults {
  const q = normalizeVi(raw)
  if (q.length < 2) return EMPTY_RESULTS

  // Expand shop-floor slang into standard terms ("pa lang" → "tecna pa lăng cân bằng").
  let expanded = q
  for (const key of SLANG_KEYS) {
    if (q.includes(key) || levenshtein(q, key) <= 2) {
      expanded += ' ' + normalizeVi(SLANG_MAP[key])
    }
  }
  const tokens = expanded.split(/\s+/).filter((t) => t.length >= 2)

  const products = PRODUCTS.map((p) => {
    const hay = HAYSTACK.get(p.part) ?? ''
    const part = normalizeVi(p.part)
    let score = 0
    if (part === q) score += 20
    if (part.includes(q)) score += 8
    for (const t of tokens) {
      if (hay.includes(t)) score += 3
      else if (t.length >= 4 && hay.split(/\s+/).some((w) => levenshtein(w, t) <= 2)) score += 1
    }
    return { p, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p)

  const brands = BRANDS.filter(
    (b) => normalizeVi(b.name).includes(q) || q.includes(b.slug.replace(/-/g, ''))
  ).slice(0, 3)

  const categories = CATEGORIES.filter((c) => normalizeVi(c.name).includes(q)).slice(0, 3)

  return {
    products,
    brands,
    categories,
    any: products.length + brands.length + categories.length > 0,
  }
}

/** Plain substring filter used by the listing page's inline search box. */
export function filterProducts(products: Product[], raw: string): Product[] {
  const q = normalizeVi(raw)
  if (!q) return products
  return products.filter((p) => (HAYSTACK.get(p.part) ?? '').includes(q))
}
