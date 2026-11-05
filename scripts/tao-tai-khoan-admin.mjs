// Tạo tài khoản admin đầu tiên cho trang quản trị, bằng khóa service role
// trong .env.local. Chạy MỘT lần; admin tự đổi mật khẩu ở /admin/tai-khoan.
//
//   node scripts/tao-tai-khoan-admin.mjs <email>            in mật khẩu ngẫu nhiên
//   node scripts/tao-tai-khoan-admin.mjs <email> --doi      đặt lại mật khẩu nếu quên
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && m[2]) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY
const email = process.argv[2]
const doi = process.argv.includes('--doi')
if (!URL_ || !SERVICE || !email) {
  console.error('Cần NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY trong .env.local và email ở tham số.')
  process.exit(1)
}
const h = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' }

// Mật khẩu 14 ký tự, bỏ các ký tự dễ nhìn nhầm (0/O, 1/l/I).
const BANG = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
const matKhau = Array.from(randomBytes(14), (b) => BANG[b % BANG.length]).join('')

const ds = await (await fetch(`${URL_}/auth/v1/admin/users?per_page=200`, { headers: h })).json()
const co = (ds.users ?? []).find((u) => u.email?.toLowerCase() === email.toLowerCase())

if (co && !doi) {
  console.log(`Tài khoản ${email} đã có (tạo ${co.created_at.slice(0, 10)}). Muốn đặt lại mật khẩu: thêm --doi`)
  process.exit(0)
}
const r = co
  ? await fetch(`${URL_}/auth/v1/admin/users/${co.id}`, { method: 'PUT', headers: h, body: JSON.stringify({ password: matKhau }) })
  : await fetch(`${URL_}/auth/v1/admin/users`, {
      method: 'POST', headers: h,
      body: JSON.stringify({ email, password: matKhau, email_confirm: true, user_metadata: { vai_tro: 'admin' } }),
    })
if (!r.ok) {
  console.error('LỖI', r.status, await r.text())
  process.exit(1)
}
console.log(`${co ? 'Đã đặt lại mật khẩu' : 'Đã tạo tài khoản'} ${email}`)
console.log(`Mật khẩu: ${matKhau}`)
console.log('Đăng nhập tại /admin/dang-nhap rồi đổi mật khẩu ở /admin/tai-khoan.')
