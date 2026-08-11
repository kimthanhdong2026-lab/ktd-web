'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  duration?: number
  onDismiss?: () => void
}

export function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!message) return

    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  if (!isVisible || !message) return null

  return (
    <div className="fixed right-5 bottom-6 z-50 animate-toastin">
      <div className="bg-ktd-dark text-white rounded-lg px-5 py-3 text-sm font-medium flex items-center gap-3 shadow-lg max-w-xs">
        <span className="text-green-400 text-base">✓</span>
        {message}
      </div>
    </div>
  )
}
