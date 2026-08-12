'use client'

import { useState } from 'react'
import { GALLERY_VIEWS } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'

/** Spec C3 — at most 5 images: thumbnail rail + large view. */
export function ProductGallery({ part }: { part: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid gap-4 sm:grid-cols-[76px_1fr] lg:sticky lg:top-[100px]">
      <div className="order-2 flex gap-2.5 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
        {GALLERY_VIEWS.map((view, i) => (
          <button
            key={view}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Xem ảnh: ${view}`}
            aria-pressed={active === i}
            className={cx(
              'placeholder-hatch relative flex aspect-square w-[68px] flex-none items-center justify-center overflow-hidden rounded-md border-2 bg-ink-100 sm:w-auto',
              active === i ? 'border-ktd-600' : 'border-hairline'
            )}
          >
            <span className="relative px-1 text-center font-mono text-[8px] leading-tight text-[#9aa3ad]">
              {view}
            </span>
          </button>
        ))}
      </div>

      <div className="placeholder-hatch relative order-1 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-ink-100 sm:order-2">
        <div className="relative text-center">
          <span className="inline-block rounded-md border border-ink-300 bg-white px-3.5 py-1.5 font-mono text-[13px] text-ink-500">
            {part}
          </span>
          <span className="mt-3 block font-mono text-[11px] text-[#9aa3ad]">
            {GALLERY_VIEWS[active]}
          </span>
        </div>
      </div>
    </div>
  )
}
