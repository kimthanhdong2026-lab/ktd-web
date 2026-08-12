'use client'

import { useEffect, useRef, useState } from 'react'

const DESKTOP = {
  src: '/hero/ktd-hero-1920x1080.mp4',
  poster: '/hero/ktd-hero-poster-1920x1080.webp',
}

const MOBILE = {
  src: '/hero/ktd-hero-mobile-1080x1350.mp4',
  poster: '/hero/ktd-hero-poster-mobile-1080x1350.webp',
}

type Mode = 'pending' | 'desktop' | 'mobile' | 'poster-only'

/**
 * Video nền Hero — loop 15 giây, không tiếng.
 *
 * Chọn bản phát theo thiết bị: desktop dùng bản 16:9 (8.8MB), điện thoại dùng
 * bản dọc 4:5 (5.9MB) để không bị cắt mất hai bên khi phủ kín màn hình.
 *
 * Không tải video khi:
 *  - người dùng bật prefers-reduced-motion
 *  - trình duyệt báo Save-Data (đang tiết kiệm dung lượng)
 * Khi đó chỉ hiện poster tĩnh (~48KB), Hero vẫn đủ đẹp.
 *
 * Poster luôn được vẽ ngay dưới video nên không bao giờ lộ khung đen trong
 * lúc video còn đang tải.
 */
export function HeroVideo() {
  const [mode, setMode] = useState<Mode>('pending')
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const saveData = Boolean((navigator as any).connection?.saveData)

    if (reduced || saveData) {
      setMode('poster-only')
      return
    }
    setMode(window.matchMedia('(min-width: 768px)').matches ? 'desktop' : 'mobile')
  }, [])

  // Safari bỏ qua thuộc tính autoplay khi thẻ được gắn động sau khi hydrate.
  useEffect(() => {
    if (mode === 'desktop' || mode === 'mobile') {
      ref.current?.play().catch(() => {
        /* Trình duyệt chặn autoplay: giữ poster, không coi là lỗi. */
      })
    }
  }, [mode])

  if (mode === 'pending') return null

  const asset = mode === 'mobile' ? MOBILE : DESKTOP

  return (
    <>
      {/* Poster nằm dưới cùng: hiển thị ngay, che mọi khoảng trống khi video
          chưa sẵn sàng, và là thứ duy nhất hiện ở chế độ tiết kiệm dữ liệu. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${asset.poster})` }}
      />

      {mode !== 'poster-only' && (
        <video
          ref={ref}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={asset.poster}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-600 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={asset.src} type="video/mp4" />
        </video>
      )}
    </>
  )
}
