'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { anHienHang, sapXepHang } from '@/app/admin/actions'
import { urlAnh } from '@/lib/noi-dung/anh'

export interface HangTomTat {
  slug: string
  name: string
  origin_vi: string
  logo: string | null
  logo_goc: string | null
  visible: boolean
  soSanPham: number
}

/**
 * Danh sách hãng: thứ tự (↑ ↓), ẩn/hiện, vào sửa. Thứ tự ở đây là thứ tự trên
 * dải logo trang chủ, menu Thương hiệu và trang danh sách.
 */
export function DanhSachHang({ hangs }: { hangs: HangTomTat[] }) {
  const router = useRouter()
  const [ds, setDs] = useState(hangs)
  const [dangLuu, batDau] = useTransition()
  const [loi, setLoi] = useState<string | null>(null)

  const chuyen = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= ds.length) return
    const m = [...ds]
    ;[m[i], m[j]] = [m[j], m[i]]
    setDs(m)
    batDau(async () => {
      const r = await sapXepHang(m.map((h) => h.slug))
      if (!r.ok) setLoi(r.loi)
      else router.refresh()
    })
  }
  const anHien = (slug: string, visible: boolean) => {
    setDs(ds.map((h) => (h.slug === slug ? { ...h, visible } : h)))
    batDau(async () => {
      const r = await anHienHang(slug, visible)
      if (!r.ok) setLoi(r.loi)
      else router.refresh()
    })
  }
  const nut = 'rounded border border-hairline px-2 py-0.5 text-[12px] text-ink-600 hover:bg-surface disabled:opacity-30'

  return (
    <div>
      {loi && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{loi}</p>}
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-hairline bg-white text-[14px]">
        <thead>
          <tr className="bg-surface text-left text-[12px] uppercase tracking-wider text-ink-500">
            <th className="px-3 py-2.5 font-semibold">#</th>
            <th className="px-3 py-2.5 font-semibold">Logo</th>
            <th className="px-3 py-2.5 font-semibold">Hãng</th>
            <th className="px-3 py-2.5 font-semibold">Xuất xứ</th>
            <th className="px-3 py-2.5 text-right font-semibold">Sản phẩm</th>
            <th className="px-3 py-2.5 font-semibold">Hiện trên web</th>
            <th className="px-3 py-2.5 font-semibold">Thứ tự</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {ds.map((h, i) => (
            <tr key={h.slug} className={i % 2 ? 'bg-surface/50' : ''}>
              <td className="px-3 py-2 text-ink-500">{i + 1}</td>
              <td className="px-3 py-2">
                <span className="flex h-10 w-24 items-center justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={urlAnh(h.logo_goc) ?? `/assets/brands/${h.slug}.webp`} alt="" className="max-h-8 w-auto max-w-[90px] object-contain" />
                </span>
              </td>
              <td className="px-3 py-2 font-semibold text-ink-900">{h.name}</td>
              <td className="px-3 py-2 text-ink-700">{h.origin_vi}</td>
              <td className="px-3 py-2 text-right text-ink-700">{h.soSanPham}</td>
              <td className="px-3 py-2">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={h.visible} disabled={dangLuu} onChange={(e) => anHien(h.slug, e.target.checked)} className="h-4 w-4 accent-ktd-600" />
                  <span className="text-[13px] text-ink-700">{h.visible ? 'Đang hiện' : 'Đang ẩn'}</span>
                </label>
              </td>
              <td className="px-3 py-2">
                <span className="flex gap-1">
                  <button type="button" className={nut} disabled={dangLuu || i === 0} onClick={() => chuyen(i, -1)}>↑</button>
                  <button type="button" className={nut} disabled={dangLuu || i === ds.length - 1} onClick={() => chuyen(i, 1)}>↓</button>
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={`/admin/thuong-hieu/${h.slug}`} className="font-semibold text-ktd-600 hover:underline">
                  Sửa trang hãng →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
