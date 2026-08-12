'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from './StoreProvider'
import { searchAll } from '@/lib/search'
import { brandName, categoryName, countByBrand, countByCategory, productSlug } from '@/lib/ktd-data'

type Row = { key: string; label: string; sub?: string; go: () => void }

/**
 * Spec C4 — "a small Google": grouped suggestions, full keyboard control
 * (↑ ↓ Enter Esc), recent searches when empty, and an escape hatch to a
 * human engineer when nothing matches.
 */
export function SearchOverlay() {
  const router = useRouter()
  const {
    searchOpen,
    searchQuery,
    setSearchQuery,
    closeSearch,
    openRfq,
    recent,
    pushRecent,
  } = useStore()

  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchAll(searchQuery), [searchQuery])
  const isEmptyQuery = searchQuery.trim().length < 2

  const rows: Row[] = useMemo(() => {
    const out: Row[] = []
    for (const p of results.products) {
      out.push({
        key: `p-${p.part}`,
        label: p.name,
        sub: `${p.part} · ${brandName(p.brand)} · ${categoryName(p.category)}`,
        go: () => {
          pushRecent(searchQuery)
          router.push(`/san-pham/${productSlug(p)}`)
          closeSearch()
        },
      })
    }
    for (const b of results.brands) {
      out.push({
        key: `b-${b.slug}`,
        label: b.name,
        sub: `${b.desc} · ${countByBrand(b.slug)} sản phẩm`,
        go: () => {
          pushRecent(searchQuery)
          router.push(`/san-pham?brand=${b.slug}`)
          closeSearch()
        },
      })
    }
    for (const c of results.categories) {
      out.push({
        key: `c-${c.slug}`,
        label: `${c.name} · ${countByCategory(c.slug)} sản phẩm`,
        go: () => {
          pushRecent(searchQuery)
          router.push(`/san-pham?category=${c.slug}`)
          closeSearch()
        },
      })
    }
    return out
  }, [results, router, closeSearch, pushRecent, searchQuery])

  useEffect(() => {
    setActive(0)
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  if (!searchOpen) return null

  const askEngineer = () => {
    openRfq(`Tôi đang tìm: "${searchQuery}". Nhờ kỹ sư tư vấn giúp.`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (rows.length ? (i + 1) % rows.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (rows[active]) rows[active].go()
    }
  }

  let index = -1
  const rowClass = (i: number) =>
    `flex w-full items-center gap-3.5 px-6 py-2.5 text-left ${
      i === active ? 'bg-ktd-50' : 'hover:bg-ink-100'
    }`

  return (
    <div
      onClick={closeSearch}
      className="fixed inset-0 z-[100] flex animate-fadeup justify-center bg-[rgba(0,38,63,.72)] px-4 pt-[10vh] backdrop-blur-[4px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm sản phẩm"
        className="flex max-h-[76vh] w-full max-w-[720px] flex-col self-start overflow-hidden rounded-2xl bg-white shadow-overlay"
      >
        <div className="flex items-center gap-4 border-b border-[#eef1f4] px-5 py-5 md:px-6">
          <span className="text-xl" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tìm mã hàng, tên sản phẩm, thương hiệu, hoặc gõ như thợ máy…"
            aria-label="Từ khóa tìm kiếm"
            className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-ink-500 md:text-[19px]"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="flex-shrink-0 rounded-md bg-ink-100 px-3 py-2 text-xs font-semibold text-ink-500 hover:bg-ink-300"
          >
            Esc ✕
          </button>
        </div>

        <div className="overflow-y-auto py-2">
          {isEmptyQuery && (
            <div className="px-6 py-4">
              <p className="label-caps mb-3 text-ink-500">Tìm kiếm gần đây</p>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSearchQuery(r)}
                    className="rounded-full border border-[#e2e7ec] bg-ink-100 px-3.5 py-1.5 text-sm text-ink-700 hover:border-ktd-600 hover:text-ktd-600"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.products.length > 0 && (
            <div className="py-2">
              <div className="label-caps flex justify-between px-6 py-2 text-ink-500">
                <span>Sản phẩm</span>
                <span>{results.products.length} kết quả</span>
              </div>
              {results.products.map((p) => {
                index += 1
                const i = index
                return (
                  <button key={p.part} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-ink-100 font-mono text-[9px] text-ink-500">
                      ▪
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[15px] font-semibold text-ink-900">
                        {p.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[13px] text-ink-500">
                        {p.part} · {brandName(p.brand)} · {categoryName(p.category)}
                      </span>
                    </span>
                    <span className="text-lg text-ink-500" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {results.brands.length > 0 && (
            <div className="border-t border-ink-100 py-2">
              <div className="label-caps px-6 py-2 text-ink-500">Thương hiệu</div>
              {results.brands.map((b) => {
                index += 1
                const i = index
                return (
                  <button key={b.slug} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="w-16 font-display text-sm font-bold text-ktd-600">{b.name}</span>
                    <span className="flex-1 text-sm text-ink-500">
                      {b.desc} · {countByBrand(b.slug)} sản phẩm
                    </span>
                    <span className="text-lg text-ink-500" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="border-t border-ink-100 py-2">
              <div className="label-caps px-6 py-2 text-ink-500">Danh mục</div>
              {results.categories.map((c) => {
                index += 1
                const i = index
                return (
                  <button key={c.slug} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="text-lg" aria-hidden="true">📁</span>
                    <span className="flex-1 text-[15px] text-ink-900">
                      {c.name} · {countByCategory(c.slug)} sản phẩm
                    </span>
                    <span className="text-lg text-ink-500" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {!isEmptyQuery && !results.any && (
            <div className="px-6 py-10 text-center">
              <p className="mb-4 text-[15px] text-ink-500">
                Không tìm thấy kết quả cho “<b className="text-ink-900">{searchQuery}</b>”.
              </p>
              <button type="button" onClick={askEngineer} className="btn-quote">
                Nhờ kỹ sư tìm giúp →
              </button>
            </div>
          )}

          {results.any && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 px-6 py-4">
              <span className="text-[13px] text-ink-500">Không thấy thứ bạn cần?</span>
              <button
                type="button"
                onClick={askEngineer}
                className="text-sm font-semibold text-ktd-600 hover:text-ktd-700"
              >
                Nhờ kỹ sư tìm giúp →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
