'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { anHienBaiViet } from '@/app/admin/tin-tuc/actions'
import type { BaiViet } from '@/lib/tin-tuc'

export function DanhSachBaiViet({ ds, coBang }: { ds: BaiViet[]; coBang: boolean }) {
  const router = useRouter()
  const [rows, setRows] = useState(ds)
  const [dangLuu, batDau] = useTransition()
  const anHien = (slug: string, visible: boolean) => {
    setRows(rows.map((r) => (r.slug === slug ? { ...r, visible } : r)))
    batDau(async () => {
      await anHienBaiViet(slug, visible)
      router.refresh()
    })
  }
  return (
    <div>
      {!coBang && (
        <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Bảng bài viết chưa được tạo trong cơ sở dữ liệu (file SQL 0023). Web đang hiện ba bài mẫu trong mã; chưa sửa hay thêm bài được.
        </p>
      )}
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-hairline bg-white text-[14px]">
        <thead>
          <tr className="bg-surface text-left text-[12px] uppercase tracking-wider text-ink-500">
            <th className="px-3 py-2.5 font-semibold">Ảnh</th>
            <th className="px-3 py-2.5 font-semibold">Tiêu đề</th>
            <th className="px-3 py-2.5 font-semibold">Chuyên mục</th>
            <th className="px-3 py-2.5 font-semibold">Ngày</th>
            <th className="px-3 py-2.5 font-semibold">Hiện trên web</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.slug} className={i % 2 ? 'bg-surface/50' : ''}>
              <td className="px-3 py-2">
                <span className="placeholder-hatch flex h-10 w-[70px] items-center justify-center overflow-hidden rounded bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r.image && <img src={r.image} alt="" className="h-full w-full object-cover" />}
                </span>
              </td>
              <td className="px-3 py-2 font-medium text-ink-900">{r.title}</td>
              <td className="px-3 py-2 text-ink-700">{r.catLabel}</td>
              <td className="px-3 py-2 text-ink-700">{r.date}</td>
              <td className="px-3 py-2">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={r.visible} disabled={dangLuu || !coBang} onChange={(e) => anHien(r.slug, e.target.checked)} className="h-4 w-4 accent-ktd-600" />
                  <span className="text-[13px] text-ink-700">{r.visible ? 'Hiện' : 'Ẩn'}</span>
                </label>
              </td>
              <td className="px-3 py-2 text-right">
                {coBang ? (
                  <Link href={`/admin/tin-tuc/${r.slug}`} className="whitespace-nowrap font-semibold text-ktd-600 hover:underline">Sửa →</Link>
                ) : (
                  <span className="text-ink-300">Sửa →</span>
                )}
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={6} className="px-3 py-8 text-center text-ink-500">Chưa có bài viết.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
