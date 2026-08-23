// Kiểm tra cơ sở dữ liệu Supabase sau khi chạy 4 file migration.
//
// Dùng fetch thẳng tới PostgREST nên không cần cài thêm thư viện nào.
// Chạy: node scripts/db-verify.mjs
//
// Đọc khoá từ .env.local. Cần NEXT_PUBLIC_SUPABASE_URL và
// NEXT_PUBLIC_SUPABASE_ANON_KEY; có thêm SUPABASE_SERVICE_ROLE_KEY thì kiểm
// được cả phần phân quyền.
import { readFileSync } from 'node:fs'

// ---------------------------------------------------------------- đọc .env
const env = {}
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && m[2]) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  console.error('Không đọc được .env.local')
  process.exit(1)
}

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY

if (!URL_ || !ANON) {
  console.error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local')
  process.exit(1)
}

// ---------------------------------------------------------------- tiện ích
const api = (path, { key = ANON, ...opts } = {}) =>
  fetch(`${URL_}/rest/v1/${path}`, {
    ...opts,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(opts.headers ?? {}) },
  })

let hong = 0
const dat = (ten, ok, chiTiet = '') => {
  console.log(`${ok ? '  OK  ' : '  LỖI '} ${ten}${chiTiet ? '  — ' + chiTiet : ''}`)
  if (!ok) hong++
}

/** Đếm bản ghi bằng header Content-Range, không tải dữ liệu về. */
async function dem(bang) {
  const r = await api(`${bang}?select=*`, { headers: { Prefer: 'count=exact', Range: '0-0' } })
  if (!r.ok) return { loi: `HTTP ${r.status} ${(await r.text()).slice(0, 120)}` }
  return { n: Number(r.headers.get('content-range')?.split('/')[1] ?? -1) }
}

// ---------------------------------------------------------------- kiểm tra
console.log(`\nCơ sở dữ liệu: ${URL_}\n`)

console.log('Bảng và số bản ghi')
const mong = { brands: 19, categories: 15, products: 35 }
for (const [bang, n] of Object.entries(mong)) {
  const r = await dem(bang)
  if (r.loi) dat(bang, false, r.loi)
  else dat(bang, r.n === n, `có ${r.n}, chờ ${n}`)
}

console.log('\nCột tìm kiếm do Postgres tự tính')
{
  const r = await api('products?select=part,name_vi,search_vi&part=eq.145001.12')
  const [p] = r.ok ? await r.json() : []
  if (!p) {
    dat('search_vi', false, 'không đọc được sản phẩm 145001.12')
  } else {
    // "SECUMAX 145" -> phải bỏ dấu, viết thường và chứa cả mã hàng
    const ok = p.search_vi?.includes('secumax') && p.search_vi?.includes('145001.12')
    dat('search_vi sinh đúng', ok, (p.search_vi ?? '').slice(0, 60) + '…')
  }
}
{
  // Chữ đ phải thành d thì khách gõ "dao" mới ra "Dao an toàn"
  const r = await api('products?select=part&search_vi=like.*dao an toan*&limit=3')
  const rows = r.ok ? await r.json() : []
  dat('bỏ dấu tiếng Việt', rows.length > 0, `khớp ${rows.length} sản phẩm với "dao an toan"`)
}

console.log('\nTìm theo tên hãng và tên nhóm')
for (const [q, mongDoi] of [
  ['morrisflex', true], // tên hãng, đúng chính tả
  ['air tools', true], // một phần tên hiển thị của ATA
  ['dung cu an toan', true], // tên nhóm
]) {
  const r = await api(`products?select=part&search_vi=like.*${encodeURIComponent(q)}*&limit=3`)
  const rows = r.ok ? await r.json() : []
  dat(`"${q}"`, rows.length > 0 === mongDoi, `${rows.length} kết quả`)
}

console.log('\nTìm kiếm chịu gõ sai')
for (const [q, mongDoi] of [
  ['secumax', true],
  ['secumx', true], // thiếu chữ a
  ['morisflex', true], // thiếu chữ r
  ['xyzzykhongcogi', false],
]) {
  const r = await api('rpc/search_products_fuzzy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, max_rows: 5 }),
  })
  if (!r.ok) {
    dat(`"${q}"`, false, `HTTP ${r.status} ${(await r.text()).slice(0, 120)}`)
    continue
  }
  const rows = await r.json()
  dat(`"${q}"`, rows.length > 0 === mongDoi, `${rows.length} kết quả`)
}

console.log('\nKho file')
{
  // Endpoint quản trị /storage/v1/bucket/... đòi service_role. Không có khoá đó
  // thì hỏi một file không tồn tại qua đường công khai: bucket có thật sẽ trả
  // "Object not found", bucket chưa tạo trả "Bucket not found". Cách này cũng
  // chứng minh luôn bucket đang ở chế độ công khai.
  const r = await fetch(`${URL_}/storage/v1/object/public/ktd/__kiem-tra__.webp`)
  const body = await r.json().catch(() => ({}))
  const chuaTao = body.code === 'NoSuchBucket'
  dat('bucket ktd tồn tại và công khai', !chuaTao, chuaTao ? 'xem 0002_storage.sql' : body.code)
}

console.log('\nPhân quyền')
{
  // Khoá anon nằm công khai trong mã nguồn trình duyệt, tuyệt đối không được ghi.
  const r = await api('brands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: '__thu-ghi__', name: 'x', origin_vi: 'x' }),
  })
  dat('anon KHÔNG ghi được', r.status === 401 || r.status === 403, `HTTP ${r.status}`)
  if (r.ok && SERVICE) {
    await api('brands?slug=eq.__thu-ghi__', { method: 'DELETE', key: SERVICE })
    console.log('       (đã xoá bản ghi thử)')
  }
}

console.log(
  hong ? `\n${hong} mục chưa đạt.\n` : '\nTất cả đạt. Cơ sở dữ liệu sẵn sàng cho chặng 2.\n'
)
process.exit(hong ? 1 : 0)
