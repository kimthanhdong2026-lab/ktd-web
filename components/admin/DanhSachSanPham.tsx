'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { anHienSanPham } from '@/app/admin/actions'
import { urlAnh } from '@/lib/noi-dung/anh'

export interface SanPhamTomTat {
  part: string
  slug: string
  name_vi: string
  brand_slug: string
  category_slug: string
  images: string[]
  visible: boolean
  en_status: string
  updated_at: string
}

export function DanhSachSanPham({
  ds,
  hangs,
  nhoms,
  q,
  hang,
  trang,
  tong,
  moiTrang,
}: {
  ds: SanPhamTomTat[]
  hangs: { slug: string; name: string }[]
  nhoms: Record<string, string>
  q: string
  hang: string
  trang: number
  tong: number
  moiTrang: number
}) {
  const router = useRouter()
  const [rows, setRows] = useState(ds)
  const [dangLuu, batDau] = useTransition()
  const tenHang = Object.fromEntries(hangs.map((h) => [h.slug, h.name]))
  const soTrang = Math.max(1, Math.ceil(tong / moiTrang))
  const link = (t: number) => `/admin/san-pham?q=${encodeURIComponent(q)}&hang=${encodeURIComponent(hang)}&trang=${t}`

  const anHien = (part: string, visible: boolean) => {
    setRows(rows.map((r) => (r.part === part ? { ...r, visible } : r)))
    batDau(async () => {
      await anHienSanPham(part, visible)
      router.refresh()
    })
  }

  return (
    <div>
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-hairline bg-white p-4">
        <label className="block min-w-[260px] flex-1">
          <span className="mb-1 block text-[13px] font-medium text-ink-700">Tìm theo mã hoặc tên</span>
          <input name="q" defaultValue={q} className="o-nhap" placeholder="Ví dụ: 43037 hoặc SNITTY" />
        </label>
        <label className="block min-w-[200px]">
          <span className="mb-1 block text-[13px] font-medium text-ink-700">Hãng</span>
          <select name="hang" defaultValue={hang} className="o-nhap">
            <option value="">Tất cả hãng</option>
            {hangs.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
          </select>
        </label>
        <button type="submit" className="btn-primary min-h-[40px] px-5">Tìm</button>
        {(q || hang) && <Link href="/admin/san-pham" className="text-[13px] text-ink-500 hover:underline">Xóa lọc</Link>}
      </form>

      <p className="mb-2 text-[13px] text-ink-600">
        {tong} sản phẩm{q || hang ? ' phù hợp' : ''} · trang {trang}/{soTrang}
      </p>
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-hairline bg-white text-[14px]">
        <thead>
          <tr className="bg-surface text-left text-[12px] uppercase tracking-wider text-ink-500">
            <th className="px-3 py-2.5 font-semibold">Ảnh</th>
            <th className="px-3 py-2.5 font-semibold">Mã hàng</th>
            <th className="px-3 py-2.5 font-semibold">Tên</th>
            <th className="px-3 py-2.5 font-semibold">Hãng</th>
            <th className="px-3 py-2.5 font-semibold">Nhóm nhỏ</th>
            <th className="px-3 py-2.5 font-semibold">EN</th>
            <th className="px-3 py-2.5 font-semibold">Hiện trên web</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.part} className={i % 2 ? 'bg-surface/50' : ''}>
              <td className="px-3 py-2">
                <span className="placeholder-hatch flex h-10 w-[54px] items-center justify-center overflow-hidden rounded bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r.images[0] && <img src={urlAnh(r.images[0])} alt="" className="h-full w-full object-contain" />}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-[13px] text-ink-900">{r.part}</td>
              <td className="px-3 py-2 font-medium text-ink-900">{r.name_vi}</td>
              <td className="px-3 py-2 text-ink-700">{tenHang[r.brand_slug] ?? r.brand_slug}</td>
              <td className="px-3 py-2 text-ink-700">{nhoms[r.category_slug] ?? r.category_slug}</td>
              <td className="px-3 py-2 text-[12px] text-ink-500">{r.en_status}</td>
              <td className="px-3 py-2">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={r.visible} disabled={dangLuu} onChange={(e) => anHien(r.part, e.target.checked)} className="h-4 w-4 accent-ktd-600" />
                  <span className="text-[13px] text-ink-700">{r.visible ? 'Hiện' : 'Ẩn'}</span>
                </label>
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={`/admin/san-pham/${r.slug}`} className="font-semibold text-ktd-600 hover:underline">Sửa →</Link>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={8} className="px-3 py-8 text-center text-ink-500">Không có sản phẩm nào.</td></tr>
          )}
        </tbody>
      </table>
      {soTrang > 1 && (
        <div className="mt-3 flex items-center gap-2 text-[13px]">
          {trang > 1 && <Link href={link(trang - 1)} className="rounded border border-hairline bg-white px-3 py-1 hover:bg-surface">← Trước</Link>}
          <span className="text-ink-500">Trang {trang}/{soTrang}</span>
          {trang < soTrang && <Link href={link(trang + 1)} className="rounded border border-hairline bg-white px-3 py-1 hover:bg-surface">Sau →</Link>}
        </div>
      )}
    </div>
  )
}
