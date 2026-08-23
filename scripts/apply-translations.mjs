// Ghi bản dịch tiếng Anh trong scripts/translations.mjs vào Supabase.
//
// Chạy:  node scripts/apply-translations.mjs           chỉ xem trước
//        node scripts/apply-translations.mjs --apply   ghi thật
//
// Quy tắc quan trọng: KHÔNG bao giờ đè lên bản đã được người duyệt. Cột
// en_status quyết định — xem supabase/migrations/0006_en_status.sql.
import { readFileSync } from 'node:fs'
import { BRANDS, CATEGORIES, ORIGINS, PRODUCTS } from './translations.mjs'

const APPLY = process.argv.includes('--apply')

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/)
  if (m) env[m[1]] = m[2].trim()
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL_ || !ANON || (APPLY && !SERVICE)) {
  console.error('Thiếu khoá trong .env.local')
  process.exit(1)
}

const get = async (path) =>
  (await fetch(`${URL_}/rest/v1/${path}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  })).json()

const patch = async (path, body) => {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 140)}`)
}

const eq = (v) => `eq.${encodeURIComponent(v)}`

console.log(`\nChế độ: ${APPLY ? 'GHI THẬT' : 'xem trước'}\n`)
let n = 0
const thieu = []

// ------------------------------------------------------------- thương hiệu
const brands = await get('brands?select=slug,origin_vi,desc_vi,origin_en,desc_en')
console.log('Thương hiệu')
for (const b of brands) {
  const origin_en = ORIGINS[b.origin_vi]
  const desc_en = BRANDS[b.slug]
  if (!origin_en) thieu.push(`xuất xứ "${b.origin_vi}" (${b.slug})`)
  if (!desc_en) thieu.push(`mô tả hãng ${b.slug}`)
  if (!origin_en && !desc_en) continue
  if (APPLY) await patch(`brands?slug=${eq(b.slug)}`, { origin_en, desc_en })
  n++
}
console.log(`  ${n}/${brands.length} thương hiệu`)

// ---------------------------------------------------------------- danh mục
const cats = await get('categories?select=slug,name_vi,sub_vi')
let nc = 0
for (const c of cats) {
  const tr = CATEGORIES[c.slug]
  if (!tr) {
    thieu.push(`danh mục ${c.slug}`)
    continue
  }
  if (APPLY) await patch(`categories?slug=${eq(c.slug)}`, { name_en: tr[0], sub_en: tr[1] })
  nc++
}
console.log(`Danh mục\n  ${nc}/${cats.length} danh mục`)

// ---------------------------------------------------------------- sản phẩm
const prods = await get(
  'products?select=part,name_vi,sub_vi,origin_vi,desc_vi,desc_full_en,en_status'
)
let np = 0
let boQua = 0
console.log('Sản phẩm')
for (const p of prods) {
  // Người đã duyệt rồi thì không đụng vào nữa
  if (p.en_status === 'đã duyệt') {
    boQua++
    continue
  }

  const tr = PRODUCTS[p.part]
  if (!tr) {
    thieu.push(`sản phẩm ${p.part}`)
    continue
  }
  const [name_en, descIn] = tr

  // Mô tả để null: dùng đoạn mở đầu bản tiếng Anh của chính hãng
  const desc_en = descIn ?? (p.desc_full_en?.[0] ?? null)
  if (!desc_en) thieu.push(`mô tả ngắn ${p.part}`)

  const body = {
    name_en,
    origin_en: ORIGINS[p.origin_vi] ?? null,
    ...(desc_en ? { desc_en } : {}),
    // Có bản của hãng thì giữ nhãn "từ hãng"; còn lại là bản do mình dịch
    en_status: p.desc_full_en?.length ? 'từ hãng' : 'máy dịch',
  }
  if (APPLY) await patch(`products?part=${eq(p.part)}`, body)
  np++
}
console.log(`  ${np}/${prods.length} sản phẩm` + (boQua ? `, bỏ qua ${boQua} bản đã duyệt` : ''))

if (thieu.length) {
  console.log(`\nCHƯA CÓ BẢN DỊCH (${thieu.length}):`)
  for (const x of thieu.slice(0, 20)) console.log(`  - ${x}`)
}

console.log(
  APPLY
    ? `\nĐã ghi xong.\n`
    : `\nChưa ghi gì. Chạy lại với --apply để ghi vào cơ sở dữ liệu.\n`
)
process.exitCode = thieu.length ? 1 : 0
