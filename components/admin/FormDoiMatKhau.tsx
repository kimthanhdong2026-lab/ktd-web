'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { doiMatKhau } from '@/app/admin/actions'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? 'Đang lưu…' : 'Đổi mật khẩu'}
    </button>
  )
}

export function FormDoiMatKhau() {
  const [state, action] = useFormState(doiMatKhau, {})
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Mật khẩu mới (ít nhất 8 ký tự)</span>
        <input name="matKhau" type="password" required minLength={8} autoComplete="new-password" className="o-nhap" />
      </label>
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Gõ lại mật khẩu mới</span>
        <input name="matKhau2" type="password" required minLength={8} autoComplete="new-password" className="o-nhap" />
      </label>
      {state.loi && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{state.loi}</p>}
      {state.xong && <p className="rounded-md bg-green-50 px-3 py-2 text-[13px] text-green-700">Đã đổi mật khẩu.</p>}
      <div>
        <NutGui />
      </div>
    </form>
  )
}
