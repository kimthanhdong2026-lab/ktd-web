'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export interface Nhom {
  slug: string
  name: string
  parent: string | null
  count: number
}

/**
 * Thanh tìm và lọc sản phẩm trên trang riêng của một thương hiệu.
 *
 * Mục TH08 của "Sửa web 5" thay dải nút nhóm của bản trước bằng đúng bố cục
 * này: ô tìm theo tên hoặc mã, ô chọn nhóm sản phẩm, nút Tìm kiếm; bên dưới là
 * số sản phẩm đang hiện và lối xoá tìm kiếm.
 *
 * Ô chọn chỉ liệt kê những NHÓM NHỎ mà chính hãng này có hàng — trang Karnasch
 * hiện 6 nhóm, không bày cả 41 nhóm của toàn site.
 *
 * Mỗi lựa chọn vẫn là một địa chỉ thật (?q=...&nhom=...), nên khách gửi link
 * cho đồng nghiệp vẫn ra đúng cái họ đang xem.
 */
export function BrandGroupFilter({
  nhoms,
  dangChon,
  tuKhoa,
  nhan,
}: {
  nhoms: Nhom[]
  dangChon?: string
  tuKhoa: string
  nhan: {
    placeholder: string
    nhom: string
    tatCa: string
    tim: string
    hienThi: string
    xoa: string
  }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState(tuKhoa)
  const [nhom, setNhom] = useState(dangChon ?? '')

  // Bấm Back/Forward thì ô nhập phải theo địa chỉ trang.
  useEffect(() => {
    setQ(tuKhoa)
    setNhom(dangChon ?? '')
  }, [tuKhoa, dangChon])

  const di = (tu: string, nh: string) => {
    const sp = new URLSearchParams()
    if (tu.trim()) sp.set('q', tu.trim())
    if (nh) sp.set('nhom', nh)
    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const dangLoc = !!tuKhoa || !!dangChon

  return (
    <div className="mb-7">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          di(q, nhom)
        }}
        className="flex flex-col gap-3 md:flex-row"
      >
        <label className="flex min-h-[48px] flex-1 items-center gap-3 rounded-md border border-ink-300 bg-white px-4 focus-within:border-ktd-600">
          <span aria-hidden="true" className="text-ink-500">
            🔍
          </span>
          <span className="sr-only">{nhan.placeholder}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={nhan.placeholder}
            className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-500"
          />
        </label>

        {/* Hãng chỉ có một nhóm thì ô chọn không có gì để chọn — bỏ đi. */}
        {nhoms.length > 1 && (
          <select
            value={nhom}
            aria-label={nhan.nhom}
            // Đổi nhóm là lọc ngay, không bắt khách bấm thêm nút Tìm kiếm.
            onChange={(e) => {
              setNhom(e.target.value)
              di(q, e.target.value)
            }}
            className="min-h-[48px] cursor-pointer rounded-md border border-ink-300 bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-ktd-600 md:w-[300px]"
          >
            <option value="">{nhan.tatCa}</option>
            {nhoms.map((n) => (
              <option key={n.slug} value={n.slug}>
                {n.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="btn-primary min-h-[48px] md:w-[150px]">
          {nhan.tim}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[15px]">
        <p className="text-ink-600" aria-live="polite">
          {nhan.hienThi}
        </p>
        {dangLoc && (
          <button
            type="button"
            onClick={() => {
              setQ('')
              setNhom('')
              di('', '')
            }}
            className="text-ink-700 underline hover:text-ktd-600"
          >
            {nhan.xoa}
          </button>
        )}
      </div>
    </div>
  )
}
