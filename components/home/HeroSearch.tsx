'use client'

import { useState } from 'react'
import { useStore } from '@/components/StoreProvider'
import { HERO_CHIPS } from '@/lib/constants'

/**
 * Spec C1 — the hero search box is a real input, not a fake button:
 * typing and pressing Enter carries the query straight into the overlay.
 */
export function HeroSearch() {
  const { openSearch } = useStore()
  const [q, setQ] = useState('')

  const submit = () => openSearch(q)

  return (
    <>
      <div className="mb-4 flex max-w-[640px] gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-white p-1.5 pl-4 shadow-[0_12px_40px_rgba(0,0,0,.28)] sm:pl-5">
          <span className="text-xl" aria-hidden="true">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            placeholder="Nhập mã hàng, tên sản phẩm hoặc thương hiệu…"
            aria-label="Tìm kiếm sản phẩm"
            className="min-w-0 flex-1 border-none bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-500"
          />
          <button
            type="button"
            onClick={submit}
            className="min-h-[44px] flex-shrink-0 rounded-md bg-ktd-600 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ktd-700 sm:px-7"
          >
            Tìm
          </button>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-2.5 text-[13px] text-[#8fb3cf]">
        <span>Tìm nhiều:</span>
        {HERO_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => openSearch(chip)}
            className="rounded-full border border-[rgba(199,223,239,.22)] bg-[rgba(199,223,239,.1)] px-3.5 py-1.5 text-[13px] text-ktd-100 transition-colors hover:bg-[rgba(199,223,239,.2)]"
          >
            {chip}
          </button>
        ))}
      </div>
    </>
  )
}
