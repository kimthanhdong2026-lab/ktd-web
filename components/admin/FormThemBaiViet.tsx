'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { themBaiViet } from '@/app/admin/tin-tuc/actions'
import { NEWS_CATEGORIES } from '@/lib/ktd-data'
import { homNayVN } from '@/lib/utils'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4">
      {pending ? 'Đang tạo…' : 'Viết bài mới'}
    </button>
  )
}

export function FormThemBaiViet() {
  const [state, action] = useFormState(themBaiViet, {})
  const homNay = homNayVN()
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-ink-300 bg-white p-4">
      <label className="block min-w-[300px] flex-1">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Tiêu đề bài</span>
        <input name="title" required className="o-nhap" />
      </label>
      <label className="block min-w-[200px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Chuyên mục</span>
        <select name="cat" className="o-nhap" defaultValue="tin-tuc">
          <option value="kien-thuc">{NEWS_CATEGORIES[0]}</option>
          <option value="tin-tuc">{NEWS_CATEGORIES[1]}</option>
        </select>
      </label>
      <label className="block min-w-[160px]">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Ngày đăng</span>
        <input name="ngay" type="date" defaultValue={homNay} className="o-nhap" />
      </label>
      <NutGui />
      {state.loi && <p className="w-full text-[13px] text-red-700">{state.loi}</p>}
      <p className="w-full text-[12px] text-ink-500">Bài mới ở trạng thái ẩn. Viết nội dung, thêm ảnh xong rồi bật "Hiện trên web".</p>
    </form>
  )
}
