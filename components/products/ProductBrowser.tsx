'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { useStore } from '@/components/StoreProvider'
import { filterProducts } from '@/lib/search'
import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
  brandName,
  categoryName,
  countByBrand,
  countByCategory,
  type Product,
} from '@/lib/ktd-data'
import { cx } from '@/lib/utils'

const PAGE_SIZE = 12

type FilterKind = 'brand' | 'category'

const SORTS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'brand', label: 'Thương hiệu A–Z' },
  { value: 'name', label: 'Tên A–Z' },
  { value: 'new', label: 'Mới nhất' },
] as const

const PARAM: Record<FilterKind, string> = {
  brand: 'brand',
  category: 'category',
}

/**
 * Spec C2 — the heart of the site. Brand comes before Category everywhere.
 * Filters are additive, reflected in the query string (shareable links) and
 * applied without a page reload.
 */
export function ProductBrowser() {
  const router = useRouter()
  const params = useSearchParams()
  const { openRfq } = useStore()

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [sort, setSort] = useState<string>('default')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [sheetOpen, setSheetOpen] = useState(false)

  const selected = useMemo(
    () => ({
      brand: params.getAll('brand'),
      category: params.getAll('category'),
    }),
    [params]
  )

  const activeCount =
    selected.brand.length + selected.category.length

  const writeParams = useCallback(
    (next: Record<FilterKind, string[]>) => {
      const sp = new URLSearchParams()
      ;(Object.keys(next) as FilterKind[]).forEach((kind) => {
        next[kind].forEach((v) => sp.append(PARAM[kind], v))
      })
      if (query) sp.set('q', query)
      const qs = sp.toString()
      router.replace(qs ? `/san-pham?${qs}` : '/san-pham', { scroll: false })
      setLimit(PAGE_SIZE)
    },
    [router, query]
  )

  const toggle = useCallback(
    (kind: FilterKind, value: string) => {
      const current = selected[kind]
      const next = {
        ...selected,
        [kind]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      }
      writeParams(next)
    },
    [selected, writeParams]
  )

  const clearAll = useCallback(() => {
    setQuery('')
    router.replace('/san-pham', { scroll: false })
    setLimit(PAGE_SIZE)
  }, [router])

  const filtered = useMemo(() => {
    let list: Product[] = PRODUCTS
    if (selected.brand.length) list = list.filter((p) => selected.brand.includes(p.brand))
    if (selected.category.length) list = list.filter((p) => selected.category.includes(p.category))
    list = filterProducts(list, query)

    const sorted = list.slice()
    if (sort === 'brand') sorted.sort((a, b) => brandName(a.brand).localeCompare(brandName(b.brand), 'vi'))
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    else if (sort === 'new') sorted.sort((a, b) => Number(b.tag === 'Mới') - Number(a.tag === 'Mới'))
    return sorted
  }, [selected, query, sort])

  const shown = filtered.slice(0, limit)

  // One brand selected → drop the brand grouping and sub-group by category (spec C2 rule 3).
  const singleBrand = selected.brand.length === 1
  const groups = useMemo(() => {
    const source = singleBrand ? CATEGORIES : BRANDS
    return source
      .map((entry) => ({
        key: entry.slug,
        name: entry.name,
        items: shown.filter((p) => (singleBrand ? p.category : p.brand) === entry.slug),
      }))
      .filter((g) => g.items.length > 0)
  }, [shown, singleBrand])

  const chips = [
    ...selected.brand.map((v) => ({ kind: 'brand' as const, value: v, label: brandName(v) })),
    ...selected.category.map((v) => ({ kind: 'category' as const, value: v, label: categoryName(v) })),
  ]

  const filterPanel = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-base font-semibold text-ink-900">BỘ LỌC</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[13px] text-ink-500 underline hover:text-ktd-600"
        >
          Xóa hết
        </button>
      </div>

      <FilterGroup title="Thương hiệu">
        <div className="max-h-[340px] overflow-y-auto pr-1">
          {BRANDS.map((b) => (
            <FilterRow
              key={b.slug}
              label={b.name}
              count={countByBrand(b.slug)}
              checked={selected.brand.includes(b.slug)}
              onChange={() => toggle('brand', b.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Danh mục">
        <div className="max-h-[260px] overflow-y-auto pr-1">
          {CATEGORIES.map((c) => (
            <FilterRow
              key={c.slug}
              label={c.name}
              count={countByCategory(c.slug)}
              checked={selected.category.includes(c.slug)}
              onChange={() => toggle('category', c.slug)}
            />
          ))}
        </div>
      </FilterGroup>

    </>
  )

  return (
    <div className="container-ktd pb-16 pt-6 md:pb-24">
      <h1 className="mb-3 font-display text-h1 text-ink-900">Tìm đúng thiết bị bạn cần</h1>
      <p className="mb-6 max-w-[1280px] text-body-lg text-ink-500">
        {BRANDS.length} thương hiệu chính hãng · {PRODUCTS.length} mã hàng đại diện. Lọc theo thương
        hiệu, danh mục, hoặc tìm bằng tiếng Việt lẫn tiếng Anh.
      </p>

      <div className="mb-8 flex items-center gap-3 rounded-[10px] border border-[#e2e7ec] bg-ink-100 px-4 py-3.5 md:px-5">
        <span className="text-lg" aria-hidden="true">🔍</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(PAGE_SIZE)
          }}
          placeholder="Tìm mã hàng, tên sản phẩm, thương hiệu…"
          aria-label="Tìm trong danh mục sản phẩm"
          className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-ink-500"
        />
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:sticky lg:top-[100px] lg:block">{filterPanel}</aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base text-ink-900">
              <b className="font-display">{filtered.length}</b> sản phẩm phù hợp
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex min-h-[44px] items-center rounded-md border border-ink-300 px-3.5 text-sm font-semibold text-ink-700 lg:hidden"
              >
                ⚙ Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''}
              </button>
              <label className="flex items-center gap-2 text-sm text-ink-500">
                <span className="hidden sm:inline">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="min-h-[44px] cursor-pointer rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-900"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={`${c.kind}-${c.value}`}
                  type="button"
                  onClick={() => toggle(c.kind, c.value)}
                  className="flex items-center gap-2 rounded-md border border-ktd-100 bg-ktd-50 px-3 py-1.5 text-[13px] font-medium text-ktd-700"
                >
                  {c.label} <span aria-hidden="true">×</span>
                  <span className="sr-only">Bỏ lọc</span>
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-lg bg-ink-100 px-5 py-20 text-center">
              <div className="mb-4 text-[44px] opacity-50" aria-hidden="true">🔍</div>
              <p className="mb-2 font-display text-[22px] font-semibold text-ink-900">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="mb-6 text-[15px] text-ink-500">
                Thử bỏ bớt bộ lọc, hoặc để kỹ sư của chúng tôi tìm giúp bạn.
              </p>
              <button
                type="button"
                onClick={() => openRfq('Nhờ kỹ sư tư vấn sản phẩm phù hợp với nhu cầu của tôi.')}
                className="btn-quote"
              >
                Nhờ kỹ sư tìm giúp
              </button>
            </div>
          ) : (
            groups.map((g) => (
              <section key={g.key} className="mb-12">
                <div className="mb-6 flex items-baseline justify-between gap-4 border-b-2 border-ktd-50 pb-3">
                  <h2 className="font-display text-[22px] font-bold uppercase text-ktd-800 md:text-[26px]">
                    {g.name}
                  </h2>
                  <span className="flex-shrink-0 text-sm text-ink-500">
                    {g.items.length} sản phẩm
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
                  {g.items.map((p) => (
                    <ProductCard key={p.part} product={p} />
                  ))}
                </div>
                {!singleBrand && countByBrand(g.key) > g.items.length && (
                  <div className="mt-5">
                    <Link
                      href={`/san-pham?brand=${g.key}`}
                      className="text-sm font-semibold text-ktd-600 hover:text-ktd-700"
                    >
                      Xem tất cả sản phẩm {g.name} →
                    </Link>
                  </div>
                )}
              </section>
            ))
          )}

          {filtered.length > limit && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                className="btn-secondary px-10"
              >
                Tải thêm sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet (spec C2) */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-end bg-[rgba(0,38,63,.6)] lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc sản phẩm"
            className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white"
          >
            <div className="flex-1 overflow-y-auto p-5">{filterPanel}</div>
            <div className="border-t border-hairline p-4">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="btn-primary w-full"
              >
                Áp dụng ({filtered.length} sản phẩm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h2 className="label-caps mb-3 text-ink-900">▸ {title}</h2>
      {children}
    </div>
  )
}

function FilterRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-100',
        checked ? 'text-ktd-600' : 'text-ink-700'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-ktd-600"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-[#9aa3ad]">{count}</span>}
    </label>
  )
}
