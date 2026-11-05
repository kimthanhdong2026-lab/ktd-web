'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { themHang } from '@/app/admin/actions'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4">
      {pending ? 'Đang tạo…' : 'Tạo hãng mới'}
    </button>
  )
}

/** Thêm một hãng: tạo xong đưa vào trang sửa; hãng mới ở trạng thái ẨN cho tới khi admin bật. */
export function FormThemHang() {
  const [state, action] = useFormState(themHang, {})
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-ink-300 bg-white p-4">
      <label className="block min-w-[220px] flex-1">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Tên hãng</span>
        <input name="name" required className="o-nhap" placeholder="Ví dụ: Karnasch" />
      </label>
      <label className="block min-w-[160px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Xuất xứ</span>
        <input name="origin" className="o-nhap" placeholder="Ví dụ: Đức" />
      </label>
      <NutGui />
      {state.loi && <p className="w-full text-[13px] text-red-700">{state.loi}</p>}
      <p className="w-full text-[12px] text-ink-500">Hãng mới được tạo ở trạng thái ẩn. Điền nội dung, tải logo và banner xong rồi bật "Hiện trên web".</p>
    </form>
  )
}
