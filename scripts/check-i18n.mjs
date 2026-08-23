// Dò chữ tiếng Việt còn sót trên các trang tiếng Anh.
//
// Quét HTML thôi là KHÔNG ĐỦ: ProductTabs chỉ dựng tab đang mở, nên nội dung
// tab Thông số và Ứng dụng không có trong HTML. Lần đầu chạy kiểu đó đã báo
// "sạch" trong khi 32/35 sản phẩm vẫn hiện bảng thông số tiếng Việt khi khách
// bấm sang tab đó.
//
// Vì vậy script này kiểm hai lớp:
//   1. HTML từng trang tiếng Anh
//   2. Dữ liệu thô trong cơ sở dữ liệu, gồm cả những trường không có trong HTML
//
// Chạy: node scripts/check-i18n.mjs [địa-chỉ-gốc]
import { readFileSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:3000'

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/)
  if (m) env[m[1]] = m[2].trim()
}

const DAU =
  /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i

/**
 * Tiếng Việt KHÔNG DẤU cũng phải bắt.
 *
 * Bộ dò bản đầu chỉ tìm ký tự có dấu, nên bỏ lọt "28 tr." (viết tắt của
 * "trang") hiện ngay dưới nút tải catalog trên trang tiếng Anh. Chủ đầu tư
 * nhìn ảnh chụp mới thấy.
 */
const KHONG_DAU = [
  /\b\d+\s*tr\.?(?!\w)/i, // 28 tr. = 28 trang
  /\bv\/ph\b/i, // vòng/phút
  /\bcai\b/i,
  /\bhop\b/i,
  /\bTNHH\b/,
]

const VIET = {
  test: (s) => DAU.test(s) || KHONG_DAU.some((re) => re.test(s)),
}

let loi = 0

// ------------------------------------------------------- lớp 1: HTML từng trang
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
  .filter((u) => u.startsWith('/en'))

console.log(`\nLớp 1 — HTML ${urls.length} trang tiếng Anh`)
for (const u of urls) {
  const html = (await (await fetch(`${BASE}${u}`)).text()).replace(/<!-- -->/g, '')
  const body = html.replace(/<script[\s\S]*?<\/script>/g, ' ')
  const texts = [...new Set([...body.matchAll(/>([^<>]{4,})</g)].map((m) => m[1].trim()))]
  const bad = texts.filter((t) => VIET.test(t))
  if (bad.length) {
    loi++
    console.log(`  ${u}`)
    for (const b of bad.slice(0, 3)) console.log(`      ${b.slice(0, 80)}`)
  }
}
if (!loi) console.log('  ✓ sạch')

// ---------------------------- lớp 2: dữ liệu, gồm cả trường không hiện trong HTML
const rest = (p) =>
  fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${p}`, {
    headers: {
      apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  }).then((r) => r.json())

console.log('\nLớp 2 — dữ liệu tiếng Anh trong cơ sở dữ liệu')

const check = (nhan, gia_tri, id) => {
  const chuoi = Array.isArray(gia_tri)
    ? gia_tri.map((x) => (typeof x === 'object' ? `${x.label} ${x.value}` : x)).join(' ')
    : String(gia_tri ?? '')
  if (chuoi && VIET.test(chuoi)) {
    loi++
    console.log(`  ${nhan} (${id}): ${chuoi.slice(0, 70)}`)
  }
}

const prods = await rest(
  'products?select=part,name_en,desc_en,sub_en,origin_en,desc_full_en,applications_en,specs_en'
)
for (const p of prods) {
  for (const f of ['name_en', 'desc_en', 'sub_en', 'origin_en', 'desc_full_en', 'applications_en', 'specs_en'])
    check(f, p[f], p.part)
  // Trường bỏ trống sẽ lùi về tiếng Việt trên trang — cũng là lỗi
  for (const f of ['name_en', 'desc_en'])
    if (!p[f]) {
      loi++
      console.log(`  ${f} TRỐNG (${p.part}) — trang tiếng Anh sẽ hiện tiếng Việt`)
    }
}

const brands = await rest('brands?select=slug,origin_en,desc_en')
for (const b of brands) for (const f of ['origin_en', 'desc_en']) check(f, b[f], b.slug)

const cats = await rest('categories?select=slug,name_en,sub_en')
for (const c of cats) for (const f of ['name_en', 'sub_en']) check(f, c[f], c.slug)

console.log(loi ? `\n${loi} chỗ còn tiếng Việt.\n` : '  ✓ sạch\n\nTiếng Anh phủ kín.\n')
process.exitCode = loi ? 1 : 0
