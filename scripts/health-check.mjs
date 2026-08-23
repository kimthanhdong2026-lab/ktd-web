// Kiểm tra sức khoẻ hệ thống — chạy tay khi cần yên tâm.
//
// Bản tự động chạy hai ngày một lần ở .github/workflows/health-check.yml.
// Script này để kiểm ngay tại chỗ, ví dụ trước khi nghỉ dài ngày.
//
// Chạy: node scripts/health-check.mjs [địa-chỉ-website]
import { readFileSync } from 'node:fs'

const SITE = process.argv[2] ?? 'https://ktd-web.vercel.app'

const env = {}
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/)
    if (m) env[m[1]] = m[2].trim()
  }
} catch {}

let loi = 0
const bao = (ten, ok, chiTiet = '') => {
  console.log(`  ${ok ? 'OK  ' : 'LỖI '} ${ten}${chiTiet ? '  — ' + chiTiet : ''}`)
  if (!ok) loi++
}

const doThoi = async (fn) => {
  const t = Date.now()
  const r = await fn()
  return { ...r, ms: Date.now() - t }
}

console.log(`\nKiểm tra ${SITE}\n`)

// --------------------------------------------------- cơ sở dữ liệu còn thức
if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const r = await doThoi(async () => {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?select=part&limit=1`,
        {
          headers: {
            apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          signal: AbortSignal.timeout(30000),
        }
      )
      return { ok: res.ok, code: res.status }
    } catch (e) {
      return { ok: false, code: e.name === 'TimeoutError' ? 'quá hạn' : e.message.slice(0, 50) }
    }
  })
  bao(
    'Cơ sở dữ liệu Supabase',
    r.ok,
    r.ok ? `${r.ms} ms` : `${r.code} — dự án có thể đã bị tạm dừng, vào supabase.com bấm Restore`
  )
} else {
  console.log('  BỎ QUA Cơ sở dữ liệu — thiếu khoá trong .env.local')
}

// ------------------------------------------------------ website và cả chuỗi
for (const [ten, path] of [
  ['Trang chủ tiếng Việt', '/'],
  ['Trang chủ tiếng Anh', '/en'],
  ['Trang Sản phẩm', '/san-pham'],
  // Đường dẫn động, luôn chạm tới cơ sở dữ liệu — chính cái giữ cho dự án thức
  ['Truy vấn thật qua website', `/api/search?q=secumax${Date.now()}`],
]) {
  const r = await doThoi(async () => {
    try {
      const res = await fetch(`${SITE}${path}`, { signal: AbortSignal.timeout(45000) })
      return { ok: res.ok, code: res.status }
    } catch (e) {
      return { ok: false, code: e.name === 'TimeoutError' ? 'quá hạn' : e.message.slice(0, 50) }
    }
  })
  bao(ten, r.ok, r.ok ? `${r.ms} ms` : String(r.code))
}

console.log(
  loi
    ? `\n${loi} mục có vấn đề.\n`
    : '\nTất cả bình thường. Cơ sở dữ liệu đã được đánh thức bằng chính lần kiểm này.\n'
)
process.exitCode = loi ? 1 : 0
