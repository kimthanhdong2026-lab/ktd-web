'use client'

import { useStore } from './StoreProvider'
import { useLang } from './LangProvider'
import { cx } from '@/lib/utils'

/** Opens the RFQ modal from anywhere inside a server-rendered page. */
export function QuoteButton({
  children,
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
  const { t } = useLang()

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
