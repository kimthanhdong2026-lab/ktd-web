'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { themDanhMuc } from '@/app/admin/actions'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4">
      {pending ? 'Đang tạo…' : 'Tạo nhóm'}
    </button>
  )
}

/** Thêm nhóm chính hoặc nhóm nhỏ. Nhóm mới ở trạng thái ẨN. */
export function FormThemDanhMuc({ chinh }: { chinh: { slug: string; name_vi: string }[] }) {
  const [state, action] = useFormState(themDanhMuc, {})
  const router = useRouter()
  useEffect(() => {
    if (state.xong) router.push(`/admin/danh-muc?khoi=${encodeURIComponent(state.xong)}`)
  }, [state.xong, router])
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-ink-300 bg-white p-4">
      <label className="block min-w-[240px] flex-1">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Tên nhóm</span>
        <input name="name" required className="o-nhap" />
      </label>
      <label className="block min-w-[240px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Nằm trong</span>
        <select name="parent" className="o-nhap" defaultValue="">
          <option value="">— Là nhóm chính (ô ở trang chủ) —</option>
          {chinh.map((c) => <option key={c.slug} value={c.slug}>{c.name_vi}</option>)}
        </select>
      </label>
      <NutGui />
      {state.loi && <p className="w-full text-[13px] text-red-700">{state.loi}</p>}
      <p className="w-full text-[12px] text-ink-500">Nhóm mới ở trạng thái ẩn. Nhóm chính thêm mới sẽ làm lưới ô trang chủ lệch (12 ô = 3 hàng đủ) — cân nhắc trước khi bật.</p>
    </form>
  )
}
