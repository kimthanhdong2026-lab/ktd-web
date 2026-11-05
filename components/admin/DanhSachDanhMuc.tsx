'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { batTatDanhMuc, sapXepDanhMuc } from '@/app/admin/actions'
import { urlAnh } from '@/lib/noi-dung/anh'
import { cx } from '@/lib/utils'

export interface NhomTomTat {
  slug: string
  name_vi: string
  name_en: string | null
  sub_vi: string
  image: string | null
  parent_slug: string | null
  visible: boolean
  featured: boolean
  sort_order: number
  soSanPham: number
}

/**
 * Danh mục hai cấp. Mỗi nhóm chính là một ô ở trang chủ và một mục trong bộ
 * lọc; nhóm nhỏ hiện trong bộ lọc và ở trang hãng. Cờ "Chân trang" = nằm
 * trong cột Danh mục ở chân trang và bộ lọc rút gọn.
 */
export function DanhSachDanhMuc({ nhoms, dangSua }: { nhoms: NhomTomTat[]; dangSua?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ds, setDs] = useState(nhoms)
  const [dangLuu, batDau] = useTransition()
  const [loi, setLoi] = useState<string | null>(null)
  const chinh = ds.filter((n) => !n.parent_slug).sort((a, b) => a.sort_order - b.sort_order)
  const conCua = (p: string) => ds.filter((n) => n.parent_slug === p).sort((a, b) => a.sort_order - b.sort_order)

  const chuyen = (nhanh: NhomTomTat[], i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= nhanh.length) return
    const m = [...nhanh]
    ;[m[i], m[j]] = [m[j], m[i]]
    const thuTu = new Map(m.map((n, k) => [n.slug, k + 1]))
    setDs(ds.map((n) => (thuTu.has(n.slug) ? { ...n, sort_order: thuTu.get(n.slug)! } : n)))
    batDau(async () => {
      const r = await sapXepDanhMuc(m.map((n) => n.slug))
      if (!r.ok) setLoi(r.loi)
      else router.refresh()
    })
  }
  const batTat = (slug: string, co: 'visible' | 'featured', v: boolean) => {
    setDs(ds.map((n) => (n.slug === slug ? { ...n, [co]: v } : n)))
    batDau(async () => {
      const r = await batTatDanhMuc(slug, co, v)
      if (!r.ok) setLoi(r.loi)
      else router.refresh()
    })
  }
  const nut = 'rounded border border-hairline px-2 py-0.5 text-[12px] text-ink-600 hover:bg-surface disabled:opacity-30'

  const Dong = ({ n, nhanh, i, con }: { n: NhomTomTat; nhanh: NhomTomTat[]; i: number; con?: boolean }) => (
    <tr className={cx(con ? 'bg-white' : 'bg-ktd-50/60', dangSua === n.slug && 'outline outline-2 -outline-offset-2 outline-ktd-600')}>
      <td className={cx('px-3 py-2', con && 'pl-10')}>
        {!con && (
          <span className="placeholder-hatch mr-3 inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded bg-white align-middle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urlAnh(n.image) ?? `/assets/categories/${n.slug}.webp`} alt="" className="h-full w-full object-cover" />
          </span>
        )}
        <span className={cx('align-middle', con ? 'text-ink-800' : 'font-semibold text-ink-900')}>{n.name_vi}</span>
        {!con && n.sub_vi && <span className="ml-2 align-middle text-[12px] text-ink-500">{n.sub_vi}</span>}
      </td>
      <td className="px-3 py-2 text-right text-ink-700">{n.soSanPham}</td>
      <td className="px-3 py-2">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={n.visible} disabled={dangLuu} onChange={(e) => batTat(n.slug, 'visible', e.target.checked)} className="h-4 w-4 accent-ktd-600" />
          <span className="text-[13px] text-ink-700">{n.visible ? 'Hiện' : 'Ẩn'}</span>
        </label>
      </td>
      <td className="px-3 py-2">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={n.featured} disabled={dangLuu} onChange={(e) => batTat(n.slug, 'featured', e.target.checked)} className="h-4 w-4 accent-ktd-600" />
          <span className="text-[13px] text-ink-700">{n.featured ? 'Có' : ''}</span>
        </label>
      </td>
      <td className="px-3 py-2">
        <span className="flex gap-1">
          <button type="button" className={nut} disabled={dangLuu || i === 0} onClick={() => chuyen(nhanh, i, -1)}>↑</button>
          <button type="button" className={nut} disabled={dangLuu || i === nhanh.length - 1} onClick={() => chuyen(nhanh, i, 1)}>↓</button>
        </span>
      </td>
      <td className="px-3 py-2 text-right">
        <Link href={`${pathname}?khoi=${encodeURIComponent(n.slug)}`} scroll={false} className="font-semibold text-ktd-600 hover:underline">Sửa →</Link>
      </td>
    </tr>
  )

  return (
    <div>
      {loi && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{loi}</p>}
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-hairline bg-white text-[14px]">
        <thead>
          <tr className="bg-surface text-left text-[12px] uppercase tracking-wider text-ink-500">
            <th className="px-3 py-2.5 font-semibold">Nhóm chính / nhóm nhỏ</th>
            <th className="px-3 py-2.5 text-right font-semibold">Sản phẩm</th>
            <th className="px-3 py-2.5 font-semibold">Hiện trên web</th>
            <th className="px-3 py-2.5 font-semibold" title="Nằm trong cột Danh mục ở chân trang và bộ lọc rút gọn">Chân trang</th>
            <th className="px-3 py-2.5 font-semibold">Thứ tự</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {chinh.map((c, i) => {
            const con = conCua(c.slug)
            return [
              <Dong key={c.slug} n={{ ...c, soSanPham: con.reduce((s, x) => s + x.soSanPham, c.soSanPham) }} nhanh={chinh} i={i} />,
              ...con.map((n, j) => <Dong key={n.slug} n={n} nhanh={con} i={j} con />),
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}
