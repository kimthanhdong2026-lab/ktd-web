'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from './StoreProvider'
import type { SearchPayload } from '@/app/api/search/route'
import { useLang } from './LangProvider'

type Row = { key: string; label: string; sub?: string; go: () => void }

const EMPTY: SearchPayload = { products: [], brands: [], categories: [], any: false }

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

  const { lang, t } = useLang()
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const [results, setResults] = useState<SearchPayload>(EMPTY)
  const isEmptyQuery = searchQuery.trim().length < 2

  // Việc tìm chạy ở máy chủ nên phải đợi ngừng gõ mới gọi. Mỗi lần gõ lại huỷ
  // yêu cầu cũ, tránh cảnh kết quả của từ trước về sau và ghi đè kết quả đúng.
  useEffect(() => {
    if (isEmptyQuery) {
      setResults(EMPTY)
      return
    }
    const bo = new AbortController()
    const hen = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}`, { signal: bo.signal })
        .then((r) => (r.ok ? r.json() : EMPTY))
        .then(setResults)
        .catch(() => {})
    }, 180)
    return () => {
      clearTimeout(hen)
      bo.abort()
    }
  }, [searchQuery, isEmptyQuery, lang])

  const rows: Row[] = useMemo(() => {
    // Máy chủ đã dựng sẵn nhãn và đường dẫn, ở đây chỉ gắn thêm hành vi bấm
    return [...results.products, ...results.brands, ...results.categories].map((r) => ({
      key: r.key,
      label: r.label,
      sub: r.sub,
      go: () => {
        pushRecent(searchQuery)
        router.push(r.href)
        closeSearch()
      },
    }))
  }, [results, router, closeSearch, pushRecent, searchQuery])

  useEffect(() => {
    setActive(0)
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  if (!searchOpen) return null

  const askEngineer = () => {
    openRfq(t.search.askNote(searchQuery))
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
        aria-label={t.search.dialogLabel}
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
            className="flex-shrink-0 rounded-md bg-ink-100 px-3 py-2 text-[13px] font-semibold text-ink-500 hover:bg-ink-300"
          >
            Esc ✕
          </button>
        </div>

        <div className="overflow-y-auto py-2">
          {isEmptyQuery && (
            <div className="px-6 py-4">
              <p className="label-caps mb-3 text-ink-500">{t.search.recent}</p>
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
                <span>{t.search.products}</span>
                <span>{t.search.results(results.products.length)}</span>
              </div>
              {results.products.map((p) => {
                index += 1
                const i = index
                return (
                  <button key={p.key} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-ink-100 text-[9px] text-ink-500">
                      ▪
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[15px] font-semibold text-ink-900">
                        {p.label}
                      </span>
                      <span className="part-no mt-0.5 block text-[13px] text-ink-500">{p.sub}</span>
                    </span>
                    <span className="text-lg text-ink-500" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {results.brands.length > 0 && (
            <div className="border-t border-ink-100 py-2">
              <div className="label-caps px-6 py-2 text-ink-500">{t.search.brands}</div>
              {results.brands.map((b) => {
                index += 1
                const i = index
                return (
                  <button key={b.key} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="w-24 flex-shrink-0 font-display text-sm font-bold text-ktd-600">
                      {b.label}
                    </span>
                    <span className="line-clamp-2 flex-1 text-sm text-ink-500">{b.sub}</span>
                    <span className="text-lg text-ink-500" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="border-t border-ink-100 py-2">
              <div className="label-caps px-6 py-2 text-ink-500">{t.search.categories}</div>
              {results.categories.map((c) => {
                index += 1
                const i = index
                return (
                  <button key={c.key} type="button" onClick={rows[i].go} className={rowClass(i)}>
                    <span className="text-lg" aria-hidden="true">📁</span>
                    <span className="flex-1 text-[15px] text-ink-900">{c.label}</span>
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
              <span className="text-[13px] text-ink-500">{t.search.noResultsTitle}</span>
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
