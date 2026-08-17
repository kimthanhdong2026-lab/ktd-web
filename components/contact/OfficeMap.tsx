'use client'

import { useState } from 'react'
import { OFFICES } from '@/lib/constants'
import { cx } from '@/lib/utils'

/**
 * Spec C7.1 — office list on the left with the shared contact details beneath it,
 * map on the right following the selection.
 */
export function OfficeMap({ children }: { children?: React.ReactNode }) {
  const [active, setActive] = useState(0)
  const office = OFFICES[active]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
      <div>
        <ul className="mb-8 flex flex-col gap-3.5">
          {OFFICES.map((o, i) => (
            <li key={o.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cx(
                  'w-full rounded-xl border px-5 py-5 text-left transition-colors md:px-6',
                  active === i
                    ? 'border-ktd-100 bg-ktd-50'
                    : 'border-hairline bg-white hover:border-ktd-100'
                )}
              >
                <span className="mb-1.5 block font-display text-base font-semibold text-ktd-600">
                  {o.name}
                </span>
                <span className="block text-sm leading-relaxed text-ink-700">{o.addr}</span>
              </button>
            </li>
          ))}
        </ul>
        {children}
      </div>

      <div className="lg:sticky lg:top-[100px]">
        <div className="placeholder-hatch relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-ink-100">
          <div className="relative text-center">
            <div className="mb-2.5 text-[32px]" aria-hidden="true">📍</div>
            <p className="font-display text-lg font-semibold text-ink-900">{office.name}</p>
            <p className="mt-2 max-w-[280px] px-4 text-sm text-ink-500">{office.addr}</p>
            <p className="mt-2 font-mono text-xs text-ink-500">[ BẢN ĐỒ NHÚNG — SEAVIEW 4 ]</p>
          </div>
        </div>
      </div>
    </div>
  )
}
