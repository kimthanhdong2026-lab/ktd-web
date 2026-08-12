'use client'

import { useStore } from './StoreProvider'

export function Toast() {
  const { toast, dismissToast } = useStore()
  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-5 z-[90] flex max-w-[340px] animate-toastin items-center gap-3 rounded-[10px] bg-ink-900 px-5 py-3.5 text-sm font-medium text-white shadow-lg"
    >
      <span className="text-base text-[#4ade80]" aria-hidden="true">
        ✓
      </span>
      <span className="flex-1">{toast}</span>
      <button
        type="button"
        onClick={dismissToast}
        aria-label="Đóng thông báo"
        className="text-ink-300 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
