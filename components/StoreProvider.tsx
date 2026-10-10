'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { RFQ_MAX_QTY as MAX_QTY, type RfqKind } from '@/lib/rfq'

export interface CartLine {
  part: string
  qty: number
  /** Tên và hãng chép vào giỏ lúc thêm, để giỏ không phải hỏi lại cơ sở dữ
      liệu — giỏ nằm ở trình duyệt và còn sống qua cả lần tải trang sau. */
  name?: string
  brand?: string
}

interface Store {
  /** RFQ basket — multiple part numbers quoted in one request (spec C7.2). */
  cart: CartLine[]
  cartCount: number
  addToCart: (part: string, name?: string, brand?: string) => void
  /** Cộng hoặc trừ số lượng, dùng cho hai nút − và +. */
  setQty: (part: string, delta: number) => void
  /** Đặt thẳng số lượng, dùng khi khách gõ tay vào ô. */
  setQtyTo: (part: string, qty: number) => void
  removeFromCart: (part: string) => void

  toast: string | null
  showToast: (message: string) => void
  dismissToast: () => void

  searchOpen: boolean
  searchQuery: string
  openSearch: (prefill?: string) => void
  closeSearch: () => void
  setSearchQuery: (q: string) => void
  recent: string[]
  pushRecent: (q: string) => void

  rfqOpen: boolean
  rfqNote: string
  /** 'quote' = yêu cầu báo giá; 'find' = nhờ tìm hàng chưa có trên website. */
  rfqKind: RfqKind
  openRfq: (note?: string, kind?: RfqKind) => void
  closeRfq: () => void
}

const StoreContext = createContext<Store | null>(null)

const RECENT_KEY = 'ktd:recent-searches'
const CART_KEY = 'ktd:rfq-cart'
const DEFAULT_RECENT = ['martego', 'pa lăng', 'mũi mài', 'Martor']

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recent, setRecent] = useState<string[]>(DEFAULT_RECENT)
  const [rfqOpen, setRfqOpen] = useState(false)
  const [rfqNote, setRfqNote] = useState('')
  const [rfqKind, setRfqKind] = useState<RfqKind>('quote')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore the basket so a half-built quote survives a page navigation or reload.
  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem(CART_KEY)
      if (savedCart) setCart(JSON.parse(savedCart))
      const savedRecent = localStorage.getItem(RECENT_KEY)
      if (savedRecent) setRecent(JSON.parse(savedRecent))
    } catch {
      // Corrupt or unavailable storage is not worth failing the page over.
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* ignore */
    }
  }, [cart])

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

  const addToCart = useCallback(
    (part: string, name?: string, brand?: string) => {
      setCart((prev) => {
        const i = prev.findIndex((c) => c.part === part)
        if (i < 0) return [...prev, { part, qty: 1, name, brand }]
        const next = prev.slice()
        next[i] = { ...next[i], qty: next[i].qty + 1, name: name ?? next[i].name }
        return next
      })
      showToast(`Đã thêm ${name ?? part} vào yêu cầu báo giá`)
    },
    [showToast]
  )

  // Chỉ đổi qty, giữ nguyên tên và hãng. Bản trước dựng lại dòng bằng
  // { part, qty } nên bấm + một lần là tên sản phẩm biến thành mã hàng.
  const setQty = useCallback((part: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) =>
        c.part === part ? { ...c, qty: Math.min(MAX_QTY, Math.max(1, c.qty + delta)) } : c
      )
    )
  }, [])

  const setQtyTo = useCallback((part: string, qty: number) => {
    if (!Number.isFinite(qty)) return
    setCart((prev) =>
      prev.map((c) =>
        c.part === part ? { ...c, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty))) } : c
      )
    )
  }, [])

  const removeFromCart = useCallback((part: string) => {
    setCart((prev) => prev.filter((c) => c.part !== part))
  }, [])

  const pushRecent = useCallback((q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) return
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 5)
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const openSearch = useCallback((prefill?: string) => {
    if (prefill !== undefined) setSearchQuery(prefill)
    setRfqOpen(false)
    setSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const openRfq = useCallback((note?: string, kind: RfqKind = 'quote') => {
    if (note !== undefined) setRfqNote(note)
    setRfqKind(kind)
    setSearchOpen(false)
    setRfqOpen(true)
  }, [])

  const closeRfq = useCallback(() => setRfqOpen(false), [])

  // Esc closes whichever layer is on top.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSearchOpen(false)
      setRfqOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll while a full-screen layer is open.
  useEffect(() => {
    const locked = searchOpen || rfqOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchOpen, rfqOpen])

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart])

  const value = useMemo<Store>(
    () => ({
      cart,
      cartCount,
      addToCart,
      setQty,
      setQtyTo,
      removeFromCart,
      toast,
      showToast,
      dismissToast,
      searchOpen,
      searchQuery,
      openSearch,
      closeSearch,
      setSearchQuery,
      recent,
      pushRecent,
      rfqOpen,
      rfqNote,
      rfqKind,
      openRfq,
      closeRfq,
    }),
    [
      cart, cartCount, addToCart, setQty, setQtyTo, removeFromCart,
      toast, showToast, dismissToast,
      searchOpen, searchQuery, openSearch, closeSearch, recent, pushRecent,
      rfqOpen, rfqNote, rfqKind, openRfq, closeRfq,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
