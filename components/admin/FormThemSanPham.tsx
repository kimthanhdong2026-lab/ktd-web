'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { themSanPham } from '@/app/admin/actions'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4">
      {pending ? 'Đang tạo…' : 'Tạo sản phẩm'}
    </button>
  )
}

/** Thêm sản phẩm: mã, tên, hãng, nhóm. Tạo xong vào thẳng trang sửa; sản phẩm mới ở trạng thái ẨN. */
export function FormThemSanPham({
  hangs,
  nhoms,
}: {
  hangs: { slug: string; name: string }[]
  nhoms: { slug: string; name_vi: string; parent_slug: string | null }[]
}) {
  const [state, action] = useFormState(themSanPham, {})
  const chinh = nhoms.filter((n) => !n.parent_slug)
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-ink-300 bg-white p-4">
      <label className="block min-w-[140px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Mã hàng</span>
        <input name="part" required className="o-nhap" placeholder="Ví dụ: 43037.02" />
      </label>
      <label className="block min-w-[240px] flex-1">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Tên sản phẩm</span>
        <input name="name" required className="o-nhap" />
      </label>
      <label className="block min-w-[160px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Hãng</span>
        <select name="brand" required className="o-nhap" defaultValue="">
          <option value="" disabled>Chọn hãng</option>
          {hangs.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
        </select>
      </label>
      <label className="block min-w-[220px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Nhóm nhỏ</span>
        <select name="category" required className="o-nhap" defaultValue="">
          <option value="" disabled>Chọn nhóm</option>
          {chinh.map((c) => (
            <optgroup key={c.slug} label={c.name_vi}>
              {nhoms.filter((n) => n.parent_slug === c.slug).map((n) => <option key={n.slug} value={n.slug}>{n.name_vi}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <NutGui />
      {state.loi && <p className="w-full text-[13px] text-red-700">{state.loi}</p>}
      <p className="w-full text-[12px] text-ink-500">Sản phẩm mới được tạo ở trạng thái ẩn. Điền nội dung, tải ảnh xong rồi bật "Hiện trên web" ở nhóm 4.</p>
    </form>
  )
}
