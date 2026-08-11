'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Product, Brand, Category } from '@/lib/types'
import { normalizeText, levenshteinDistance } from '@/lib/utils'
import { SLANG_MAP } from '@/lib/constants'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  products: (Product & { brandName: string; categoryName: string })[]
  brands: Brand[]
  categories: Category[]
}

interface SearchResult {
  type: 'product' | 'brand' | 'category'
  id: string | number
  label: string
  sublabel?: string
  link?: string
  onClick?: () => void
}

export function SearchOverlay({ isOpen, onClose, products, brands, categories }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const RECENT_SEARCHES = ['martor', 'pa lăng', 'mũi mài', 'Martor']

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const normalized = normalizeText(searchQuery)
    const expanded = expandWithSlang(normalized)
    const tokens = expanded.split(/\s+/).filter(Boolean)

    // Search products
    const productResults = products
      .map((p) => {
        let score = 0

        // Exact part match
        if (p.part_number.toLowerCase() === normalized) score += 20

        // Part substring
        if (p.part_number.toLowerCase().includes(normalized)) score += 8

        // Name/description token matching
        const productText = `${normalizeText(p.name_vi)} ${normalizeText(p.short_desc_vi || '')} ${normalizeText(p.brandName)}`

        tokens.forEach((token) => {
          if (token.length >= 4) {
            const dist = levenshteinDistance(token, normalizeText(p.part_number))
            if (dist <= 2) score += 1
          }
          if (productText.includes(token)) score += 3
        })

        return { product: p, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => ({
        type: 'product' as const,
        id: r.product.id,
        label: r.product.name_vi,
        sublabel: r.product.part_number,
        link: `/san-pham/${r.product.slug}`,
      }))

    // Search brands
    const brandResults = brands
      .filter((b) => normalizeText(b.name_vi).includes(normalized) || b.slug.includes(normalized))
      .slice(0, 3)
      .map((b) => ({
        type: 'brand' as const,
        id: b.id,
        label: b.name_vi,
        sublabel: `${b.origin || 'Quốc tế'} - ${products.filter((p) => p.brand_id === b.id).length} sản phẩm`,
        link: `/san-pham?brand=${b.slug}`,
      }))

    // Search categories
    const categoryResults = categories
      .filter((c) => normalizeText(c.name_vi).includes(normalized))
      .slice(0, 3)
      .map((c) => ({
        type: 'category' as const,
        id: c.id,
        label: c.name_vi,
        link: `/san-pham?category=${c.slug}`,
      }))

    setResults([...productResults, ...brandResults, ...categoryResults])
  }

  const expandWithSlang = (text: string): string => {
    let expanded = text
    Object.entries(SLANG_MAP).forEach(([slang, canonical]) => {
      if (expanded.includes(normalizeText(slang))) {
        expanded += ' ' + canonical
      }
    })
    return expanded
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-100 bg-ktd-dark/70 backdrop-blur-sm flex justify-center pt-12 pb-8 px-4 animate-fadeup overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-ktd-light/80">
          <span className="text-2xl">🔍</span>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Tìm mã hàng, tên sản phẩm, thương hiệu, hoặc gõ như thợ máy…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              performSearch(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
            }}
            className="flex-1 outline-none text-lg text-ktd-dark placeholder:text-ktd-dark/40"
          />
          <button
            onClick={onClose}
            className="bg-ktd-light border border-ktd-light/80 text-ktd-dark/60 rounded px-3 py-2 text-xs font-semibold hover:bg-ktd-light/80"
          >
            Esc ✕
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {!query && (
            <div className="px-6 py-4">
              <div className="text-xs font-semibold uppercase text-ktd-dark/60 mb-3">TÌM KIẾM GẦN ĐÂY</div>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setQuery(search)
                      performSearch(search)
                    }}
                    className="bg-ktd-light border border-ktd-light/80 text-ktd-dark rounded-full px-4 py-2 text-sm hover:border-ktd-blue transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-6 py-8 text-center">
              <div className="text-lg text-ktd-dark/60 mb-3">Không tìm thấy kết quả cho "<b>{query}</b>"</div>
              <button
                onClick={() => {
                  /* TODO: open engineer form */
                  alert('Chức năng này sẽ được bàn giao ở giai đoạn tiếp theo')
                }}
                className="bg-ktd-red text-white rounded px-6 py-2 text-sm font-semibold hover:bg-red-700"
              >
                Nhờ kỹ sư tìm giúp →
              </button>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="py-2">
              {/* Products */}
              {results.some((r) => r.type === 'product') && (
                <>
                  <div className="px-6 py-2 text-xs font-semibold uppercase text-ktd-dark/60 flex justify-between">
                    <span>SẢN PHẨM</span>
                    <span>{results.filter((r) => r.type === 'product').length}</span>
                  </div>
                  {results
                    .filter((r) => r.type === 'product')
                    .map((result) => (
                      <Link key={result.id} href={result.link || '#'}>
                        <div className="px-6 py-2.5 hover:bg-ktd-light flex items-center gap-3 cursor-pointer">
                          <div className="w-11 h-11 rounded bg-ktd-light flex items-center justify-center text-xs text-ktd-dark/30 flex-shrink-0">
                            ▪
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-ktd-dark text-sm">{result.label}</div>
                            <div className="text-xs text-ktd-dark/60 font-mono">{result.sublabel}</div>
                          </div>
                          <span className="text-ktd-dark/40 text-lg flex-shrink-0">→</span>
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Brands */}
              {results.some((r) => r.type === 'brand') && (
                <>
                  <div className="px-6 py-2 text-xs font-semibold uppercase text-ktd-dark/60 border-t border-ktd-light">
                    THƯƠNG HIỆU
                  </div>
                  {results
                    .filter((r) => r.type === 'brand')
                    .map((result) => (
                      <Link key={result.id} href={result.link || '#'}>
                        <div className="px-6 py-2.5 hover:bg-ktd-light flex items-center gap-3 cursor-pointer">
                          <div className="font-semibold text-ktd-blue text-sm w-11 flex-shrink-0">{result.label}</div>
                          <div className="flex-1 text-sm text-ktd-dark/60">{result.sublabel}</div>
                          <span className="text-ktd-dark/40 text-lg flex-shrink-0">→</span>
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Categories */}
              {results.some((r) => r.type === 'category') && (
                <>
                  <div className="px-6 py-2 text-xs font-semibold uppercase text-ktd-dark/60 border-t border-ktd-light">
                    DANH MỤC
                  </div>
                  {results
                    .filter((r) => r.type === 'category')
                    .map((result) => (
                      <Link key={result.id} href={result.link || '#'}>
                        <div className="px-6 py-2.5 hover:bg-ktd-light flex items-center gap-3 cursor-pointer">
                          <span className="text-lg">📁</span>
                          <div className="flex-1 text-sm text-ktd-dark">{result.label}</div>
                          <span className="text-ktd-dark/40 text-lg flex-shrink-0">→</span>
                        </div>
                      </Link>
                    ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        {results.length > 0 && query && (
          <div className="px-6 py-3 border-t border-ktd-light/80 flex justify-between items-center text-xs text-ktd-dark/60 bg-ktd-light/30">
            <span>Không thấy thứ bạn cần?</span>
            <button
              onClick={() => alert('Chức năng này sẽ được bàn giao ở giai đoạn tiếp theo')}
              className="text-ktd-blue font-semibold hover:underline"
            >
              Nhờ kỹ sư tìm giúp →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
