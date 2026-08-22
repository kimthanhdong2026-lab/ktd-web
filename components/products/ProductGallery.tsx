'use client'

import Image from 'next/image'
import { useState } from 'react'
import { GALLERY_VIEWS } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'

/**
 * Spec C3 — tối đa 5 ảnh: dải thumbnail bên trái, ảnh lớn bên phải.
 * Chưa có ảnh thật thì hiện ô placeholder trung tính kèm mã hàng, tuyệt đối
 * không phóng to logo công ty như website cũ.
 */
export function ProductGallery({ part, images }: { part: string; images?: string[] }) {
  const [active, setActive] = useState(0)
  const list = images?.slice(0, 5) ?? []
  const hasImages = list.length > 0
  const thumbs = hasImages ? list : (GALLERY_VIEWS as readonly string[])

  return (
    <div className="grid gap-4 sm:grid-cols-[76px_1fr] lg:sticky lg:top-[100px]">
      <div className="order-2 flex gap-2.5 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
        {thumbs.map((item, i) => (
          <button
            key={item}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            aria-pressed={active === i}
            className={cx(
              'relative flex aspect-square w-[68px] flex-none items-center justify-center overflow-hidden rounded-md border-2 sm:w-auto',
              hasImages ? 'bg-white' : 'placeholder-hatch bg-ink-100',
              active === i ? 'border-ktd-600' : 'border-hairline'
            )}
          >
            {hasImages ? (
              <Image src={item} alt="" fill sizes="76px" className="object-contain p-1" />
            ) : (
              <span className="relative px-1 text-center font-mono text-[8px] leading-tight text-[#9aa3ad]">
                {item}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className={cx(
          'relative order-1 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg sm:order-2',
          hasImages ? 'bg-white' : 'placeholder-hatch bg-ink-100'
        )}
      >
        {hasImages ? (
          <Image
            src={list[active]}
            alt={`${part} — ảnh ${active + 1}`}
            fill
            sizes="(max-width:1024px) 100vw, 620px"
            priority
            className="object-contain p-4"
          />
        ) : (
          <div className="relative text-center">
            <span className="inline-block rounded-md border border-ink-300 bg-white px-3.5 py-1.5 text-[13px] text-ink-500">
              Đang cập nhật ảnh
            </span>
            <span className="mt-3 block font-mono text-[11px] text-[#9aa3ad]">
              {GALLERY_VIEWS[active]}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
