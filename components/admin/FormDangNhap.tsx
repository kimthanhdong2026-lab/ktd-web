'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { dangNhap } from '@/app/admin/actions'

function NutGui() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? 'Đang đăng nhập…' : 'Đăng nhập'}
    </button>
  )
}

export function FormDangNhap() {
  const [state, action] = useFormState(dangNhap, {})
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Email</span>
        <input name="email" type="email" required autoComplete="username" className="o-nhap" />
      </label>
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Mật khẩu</span>
        <input name="matKhau" type="password" required autoComplete="current-password" className="o-nhap" />
      </label>
      {state.loi && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{state.loi}</p>}
      <NutGui />
    </form>
  )
}
