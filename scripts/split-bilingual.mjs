// Dọn mô tả sản phẩm nhập từ nhà cung cấp: tách tiếng Anh, gỡ hashtag, rút
// bảng thông số ra khỏi văn xuôi.
//
// Mô tả gốc do hãng gửi gộp ba thứ vào một khối văn bản:
//   - bản tiếng Việt và bản tiếng Anh, ngăn nhau bằng một dòng gạch hoặc chữ ENGLISH
//   - bảng thông số kỹ thuật viết thành đoạn văn
//   - một dòng hashtag chép từ bài mạng xã hội
//
// Cả ba đều đang hiện nguyên si trên trang bán hàng.
//
// Chạy:  node scripts/split-bilingual.mjs           chỉ xem trước, không ghi
//        node scripts/split-bilingual.mjs --apply   ghi vào cơ sở dữ liệu
import { readFileSync } from 'node:fs'

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
  console.error('Thiếu khoá trong .env.local (ghi cần cả SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

// ------------------------------------------------------------------ mẫu nhận
/** Hãng dùng hai kiểu ngăn khác nhau, phải nhận cả hai. */
const DIVIDER = (s) => /^-{5,}$/.test(s.trim()) || /^english$/i.test(s.trim())
const HASHTAG = (s) => s.trim().startsWith('#')

/**
 * Tiêu đề các mục trong mô tả, kèm vai trò.
 *
 * Thứ tự các mục KHÔNG cố định giữa các sản phẩm: có bản ghi để Ứng dụng trước
 * Thông số, bản khác thì ngược lại. Vì vậy phải cắt theo tiêu đề chứ không
 * được giả định mục nào nằm cuối.
 */
const HEADINGS = [
  { re: /^thông số (kỹ thuật|chính)\s*:?\s*$/i, role: 'specs' },
  { re: /^(key )?specifications\s*:?\s*$/i, role: 'specs' },
  { re: /^technical data\s*:?\s*$/i, role: 'specs' },
  { re: /^ứng dụng\s*:?\s*$/i, role: 'apps' },
  { re: /^applications\s*:?\s*$/i, role: 'apps' },
  { re: /^ưu điểm nổi bật\s*:?\s*$/i, role: 'giữ' },
  { re: /^key features\s*:?\s*$/i, role: 'giữ' },
]

const headingRole = (s) => HEADINGS.find((h) => h.re.test(s.trim()))?.role ?? null

/** "Model: SECUMAX 145" hoặc "- Trọng lượng: 55 g" */
const SPEC_LINE = /^-?\s*([^:]{2,45}?)\s*:\s*(.+)$/

/**
 * Bản gốc có chỗ thiếu dấu cách sau dấu hai chấm: "Lắp đặt cho:GRAFIX...".
 * Chỉ sửa khi dấu hai chấm nằm đầu dòng và ký tự sau không phải dấu gạch chéo,
 * để không đụng vào đường dẫn web dạng "https://".
 */
const fixColon = (s) => s.replace(/^([^:]{2,45}):(?=[^\s/])/, '$1: ')

// ------------------------------------------------------------------- xử lý
/** Cắt khối tiếng Việt và tiếng Anh tại dòng ngăn. */
function splitLanguages(lines) {
  const i = lines.findIndex(DIVIDER)
  if (i < 0) return { vi: lines, en: [] }
  return { vi: lines.slice(0, i), en: lines.slice(i + 1) }
}

/** Gỡ dòng hashtag, trả lại từ khoá đã bỏ dấu # và tách theo từ. */
function pullHashtags(lines) {
  const tags = []
  const kept = []
  for (const l of lines) {
    if (HASHTAG(l)) tags.push(...l.split(/\s+/).filter((t) => t.startsWith('#')).map((t) => t.slice(1)))
    else kept.push(l)
  }
  return { kept, tags }
}

/** Cắt khối thành từng mục theo tiêu đề. Phần trước tiêu đề đầu tiên là mở đầu. */
function toSections(lines) {
  const out = [{ heading: null, role: 'giữ', lines: [] }]
  for (const l of lines) {
    const role = headingRole(l)
    if (role) out.push({ heading: l.trim(), role, lines: [] })
    else out[out.length - 1].lines.push(l)
  }
  return out
}

function clean(block) {
  const desc = []
  const specs = []
  const apps = []

  for (const s of toSections(block)) {
    if (s.role === 'specs') {
      // Dòng nào không đúng dạng "Nhãn: Giá trị" thì trả về mô tả, đừng nuốt
      // mất — có bản ghi kết bằng một câu văn ngay sau bảng thông số.
      for (const l of s.lines) {
        const m = l.match(SPEC_LINE)
        if (m) specs.push({ label: m[1].trim(), value: m[2].trim() })
        else desc.push(l)
      }
    } else if (s.role === 'apps') {
      apps.push(...s.lines.map((x) => x.trim()).filter(Boolean))
    } else {
      if (s.heading) desc.push(s.heading)
      desc.push(...s.lines)
    }
  }
  return { desc: desc.map((x) => fixColon(x.trim())).filter(Boolean), specs, apps }
}

// ------------------------------------------------------------------- chạy
const res = await fetch(
  `${URL_}/rest/v1/products?select=part,name_vi,desc_full_vi,desc_full_en,applications_vi,applications_en,specs_vi,specs_en,keywords&desc_full_vi=neq.{}`,
  { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } }
)
const rows = await res.json()

console.log(`\n${rows.length} sản phẩm có mô tả đầy đủ. Chế độ: ${APPLY ? 'GHI THẬT' : 'xem trước'}\n`)

let loi = 0
const updates = []

for (const p of rows) {
  const { kept, tags } = pullHashtags(p.desc_full_vi)
  const { vi, en } = splitLanguages(kept)
  const V = clean(vi)
  const E = clean(en)

  // Từ khoá: gộp cái đang có với hashtag, bỏ trùng
  const keywords = [...new Set([...(p.keywords ?? []), ...tags])]

  const patch = {
    desc_full_vi: V.desc,
    keywords,
  }
  if (E.desc.length) patch.desc_full_en = E.desc
  if (V.specs.length) patch.specs_vi = V.specs
  if (E.specs.length) patch.specs_en = E.specs
  if (E.apps.length) patch.applications_en = E.apps
  // Ứng dụng tiếng Việt đã có sẵn từ lúc nhập; chỉ ghi đè khi rút được nhiều hơn
  if (V.apps.length > (p.applications_vi ?? []).length) patch.applications_vi = V.apps
  if (E.desc.length) patch.en_status = 'từ hãng'

  const canhBao = []
  if (!en.length) canhBao.push('KHÔNG TÁCH ĐƯỢC TIẾNG ANH')
  if (!V.specs.length) canhBao.push('không rút được thông số')
  if (canhBao.length) loi++

  console.log(
    `  ${p.part.padEnd(13)} VI ${String(p.desc_full_vi.length).padStart(2)}→${String(V.desc.length).padStart(2)} đoạn` +
      `  EN ${String(E.desc.length).padStart(2)} đoạn` +
      `  thông số ${String(V.specs.length).padStart(2)}/${String(E.specs.length).padStart(2)}` +
      `  ứng dụng ${String(V.apps.length)}/${String(E.apps.length)}` +
      `  +${tags.length} từ khoá` +
      (canhBao.length ? `   ← ${canhBao.join(', ')}` : '')
  )

  updates.push({ part: p.part, patch })
}

if (!APPLY) {
  const mau = updates[0]
  console.log(`\n--- Xem trước bản ghi ${mau.part} ---`)
  console.log('desc_full_vi:'); mau.patch.desc_full_vi.forEach((x, i) => console.log(`  ${i} | ${x.slice(0, 88)}`))
  console.log('desc_full_en:'); (mau.patch.desc_full_en ?? []).forEach((x, i) => console.log(`  ${i} | ${x.slice(0, 88)}`))
  console.log('specs_vi    :', JSON.stringify(mau.patch.specs_vi ?? []).slice(0, 200))
  console.log('applications_en:', JSON.stringify(mau.patch.applications_en ?? []))
  console.log('keywords    :', JSON.stringify(mau.patch.keywords))
  console.log(`\nChưa ghi gì. Chạy lại với --apply để ghi vào cơ sở dữ liệu.`)
  // Dùng exitCode chứ không process.exit: trên Windows, thoát ngay khi stdout
  // chưa xả hết làm Node văng assertion của libuv.
  process.exitCode = loi ? 1 : 0
} else {
  let ok = 0
  for (const u of updates) {
    const r = await fetch(`${URL_}/rest/v1/products?part=eq.${encodeURIComponent(u.part)}`, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE,
        Authorization: `Bearer ${SERVICE}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(u.patch),
    })
    if (r.ok) ok++
    else console.log(`  LỖI ${r.status} ${u.part}: ${(await r.text()).slice(0, 120)}`)
  }
  console.log(`\nĐã ghi ${ok}/${updates.length} sản phẩm.`)
  process.exitCode = ok === updates.length ? 0 : 1
}
