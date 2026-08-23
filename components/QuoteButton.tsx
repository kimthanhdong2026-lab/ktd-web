'use client'

import { useStore } from './StoreProvider'
import { cx } from '@/lib/utils'

/** Opens the RFQ modal from anywhere inside a server-rendered page. */
export function QuoteButton({
  children = 'Yêu cầu báo giá',
  note,
  addPart,
  addName,
  addBrand,
  className,
}: {
  children?: React.ReactNode
  note?: string
  /** Drop this part into the basket before opening the form (PDP use). */
  addPart?: string
  addName?: string
  addBrand?: string
  className?: string
}) {
  const { openRfq, addToCart } = useStore()

  return (
    <button
      type="button"
      onClick={() => {
        if (addPart) addToCart(addPart, addName, addBrand)
        openRfq(note)
      }}
      className={cx('btn-quote', className)}
    >
      {children}
    </button>
  )
}
