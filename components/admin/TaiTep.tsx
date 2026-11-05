'use client'

import { useState } from 'react'
import { xuLyAnh, xuLyLogo, type KhungAnh } from '@/app/admin/actions'
import { urlAnh } from '@/lib/noi-dung/anh'
import { taiLenKho, tenTam } from '@/lib/supabase/browser'

/**
 * Ô tải ảnh: trình duyệt đẩy file gốc lên kho (thư mục tam/), máy chủ thu về
 * khung, đổi webp, đặt vào thư mục đích rồi xóa file tạm. Nhờ đó không vướng
 * giới hạn 4,5 MB của Vercel; ảnh tới 50 MB vẫn được.
 */
export function TaiAnh({
  nhan,
  thuMuc,
  khung,
  giaTri,
  macDinh,
  onDoi,
  gon = false,
}: {
  nhan?: string
  thuMuc: string
  khung?: KhungAnh
  /** Đường dẫn hiện tại (trong kho hoặc /public). */
  giaTri: string
  /** Ảnh hiện khi giaTri trống. */
  macDinh?: string
  onDoi: (duong: string) => void
  gon?: boolean
}) {
  const [dangTai, setDangTai] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f?: File) => {
    if (!f) return
    setLoi(null)
    setDangTai('Đang tải lên…')
    const tam = await taiLenKho(f, tenTam(f))
    if (!tam.ok) { setDangTai(null); return setLoi(tam.loi) }
    setDangTai('Đang xử lý…')
    const r = await xuLyAnh(tam.duong, thuMuc, khung)
    setDangTai(null)
    if (r.ok) onDoi(r.duong)
    else setLoi(r.loi)
  }
  const src = urlAnh(giaTri) ?? macDinh
  return (
    <div>
      {nhan && <span className="mb-1 block text-[13px] font-medium text-ink-700">{nhan}</span>}
      <div className="flex items-center gap-3">
        <span className={`placeholder-hatch flex flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white ${gon ? 'h-12 w-16' : 'h-16 w-24'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : <span className="text-[11px] text-ink-500">Chưa có</span>}
        </span>
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ?? 'Chọn ảnh…'}
          <input type="file" accept="image/*" className="sr-only" disabled={!!dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
        {khung && !gon && <span className="text-[12px] text-ink-500">Tự thu về {khung.rong}×{khung.cao}</span>}
      </div>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}

/** Logo hãng: một ảnh ra hai bản (tỉ lệ gốc + đóng khung 320×128). */
export function TaiLogo({ slug, logo, logoGoc, onDoi }: { slug: string; logo: string; logoGoc: string; onDoi: (logo: string, goc: string) => void }) {
  const [dangTai, setDangTai] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f?: File) => {
    if (!f) return
    setLoi(null)
    setDangTai('Đang tải lên…')
    const tam = await taiLenKho(f, tenTam(f))
    if (!tam.ok) { setDangTai(null); return setLoi(tam.loi) }
    setDangTai('Đang xử lý…')
    const r = await xuLyLogo(tam.duong, slug)
    setDangTai(null)
    if (r.ok) onDoi(r.logo, r.logo_goc)
    else setLoi(r.loi)
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">Logo</span>
      <div className="flex items-center gap-3">
        <span className="flex h-16 w-32 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlAnh(logoGoc) ?? `/assets/brands/${slug}.webp`} alt="" className="max-h-12 w-auto max-w-[120px] object-contain" />
        </span>
        <span className="flex h-16 w-20 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white" title="Bản cho dải logo trang chủ (320×128)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={urlAnh(logo)} alt="" className="h-full w-full object-contain" />}
        </span>
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ?? 'Chọn logo…'}
          <input type="file" accept="image/*" className="sr-only" disabled={!!dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
      </div>
      <span className="mt-1 block text-[12px] text-ink-500">Một ảnh cho ra hai bản: tỉ lệ gốc cho trang hãng, và bản đóng khung cho dải logo trang chủ.</span>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}

/** Tải PDF (datasheet) thẳng lên kho, tới 50 MB. */
export function TaiPdf({ nhan, thuMuc, tenFile, giaTri, onDoi }: { nhan: string; thuMuc: string; tenFile: string; giaTri: string; onDoi: (duong: string) => void }) {
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f?: File) => {
    if (!f) return
    if (f.size > 50 * 1024 * 1024) return setLoi('File quá 50 MB.')
    setLoi(null)
    setDangTai(true)
    const r = await taiLenKho(f, `${thuMuc}/${tenFile}-${Date.now().toString(36)}.pdf`)
    setDangTai(false)
    if (r.ok) onDoi(r.duong)
    else setLoi(r.loi)
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{nhan}</span>
      <div className="flex flex-wrap items-center gap-3">
        {giaTri ? (
          <a href={urlAnh(giaTri)} target="_blank" rel="noopener" className="max-w-[260px] truncate text-[13px] font-semibold text-ktd-600 hover:underline">
            📄 {giaTri.split('/').pop()}
          </a>
        ) : (
          <span className="text-[13px] text-ink-500">Chưa có</span>
        )}
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ? 'Đang tải…' : 'Chọn PDF…'}
          <input type="file" accept="application/pdf" className="sr-only" disabled={dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
        {giaTri && (
          <button type="button" onClick={() => onDoi('')} className="text-[13px] text-ink-500 hover:text-red-700">Bỏ file</button>
        )}
      </div>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}
