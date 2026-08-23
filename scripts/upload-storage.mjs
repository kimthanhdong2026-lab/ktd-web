// Đẩy ảnh, logo và datasheet từ thư mục public/ lên kho file Supabase.
//
// Chỉ đẩy đúng những file mà cơ sở dữ liệu đang trỏ tới, đọc thẳng từ ba cột
// products.images, products.doc_pdf và brands.logo. Nhờ vậy không bao giờ đẩy
// thừa file rác, và bắt được luôn những đường dẫn trỏ vào chỗ không có gì.
//
// Chạy:  node scripts/upload-storage.mjs           bỏ qua file đã có
//        node scripts/upload-storage.mjs --force   ghi đè
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const BUCKET = 'ktd'
const FORCE = process.argv.includes('--force')

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && m[2]) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY

if (!URL_ || !SERVICE) {
  console.error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local')
  process.exit(1)
}

const MIME = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
}

/**
 * Đường dẫn trong kho ứng với file nào dưới public/.
 *
 * Hầu hết trùng nhau, riêng logo hãng thì không: trong kho là brands/martor.webp
 * nhưng dưới máy nằm ở public/assets/brands/norm/martor.webp — bản đã chuẩn hoá
 * về khung 320x128, không phải bản gốc ở thư mục cha.
 */
const nguon = (duongDanKho) =>
  duongDanKho.startsWith('brands/')
    ? join('public', 'assets', 'brands', 'norm', duongDanKho.slice('brands/'.length))
    : join('public', duongDanKho)

// --------------------------------------------------------- lấy danh sách cần
const doc = async (path) => {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
  })
  if (!r.ok) throw new Error(`đọc ${path}: HTTP ${r.status}`)
  return r.json()
}

const products = await doc('products?select=part,images,doc_pdf')
const brands = await doc('brands?select=slug,logo')

const can = new Set()
for (const p of products) {
  for (const img of p.images ?? []) can.add(img)
  if (p.doc_pdf) can.add(p.doc_pdf)
}
for (const b of brands) if (b.logo) can.add(b.logo)

console.log(`\nCơ sở dữ liệu đang trỏ tới ${can.size} file.\n`)

// ------------------------------------------------------------------ đẩy lên
let len = 0
let bo = 0
let thieu = 0
let loi = 0
let bytes = 0

for (const kho of [...can].sort()) {
  const src = nguon(kho)

  if (!existsSync(src)) {
    console.log(`  THIẾU FILE   ${kho}`)
    thieu++
    continue
  }

  const ext = extname(src).toLowerCase()
  const mime = MIME[ext]
  if (!mime) {
    console.log(`  KIỂU LẠ      ${kho}`)
    loi++
    continue
  }

  // Đã có trên kho thì bỏ qua, trừ khi --force
  if (!FORCE) {
    const head = await fetch(`${URL_}/storage/v1/object/public/${BUCKET}/${kho}`, { method: 'HEAD' })
    if (head.ok) {
      bo++
      continue
    }
  }

  const body = readFileSync(src)
  const r = await fetch(`${URL_}/storage/v1/object/${BUCKET}/${kho}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': mime,
      'x-upsert': 'true',
    },
    body,
  })

  if (r.ok) {
    len++
    bytes += statSync(src).size
    console.log(`  lên          ${kho}  ${(statSync(src).size / 1024).toFixed(0)} KB`)
  } else {
    loi++
    console.log(`  LỖI ${r.status}     ${kho}  ${(await r.text()).slice(0, 100)}`)
  }
}

console.log(
  `\nĐã lên ${len} file (${(bytes / 1024 / 1024).toFixed(2)} MB)` +
    (bo ? `, bỏ qua ${bo} file đã có` : '') +
    (thieu ? `, THIẾU ${thieu} file dưới public/` : '') +
    (loi ? `, ${loi} lỗi` : '') +
    '.\n'
)
process.exit(thieu + loi ? 1 : 0)
