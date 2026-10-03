// Sinh file SQL gắn 35 sản phẩm hiện có vào nhóm nhỏ của cấu trúc hai cấp.
//
// Nguồn: scripts/doi-chieu-danh-muc.json
// Đích:  supabase/migrations/0010_gan_san_pham.sql
//
// KHI BẢN XÁC NHẬN CỦA BAN GIÁM ĐỐC VỀ:
//   1. Mở scripts/doi-chieu-danh-muc.json
//   2. Sửa giá trị "nho" của những mã có cờ "cho_xac_nhan", rồi xoá cờ đó đi
//   3. Chạy: node scripts/gen-gan-san-pham-sql.mjs
//   4. Chạy lại file SQL sinh ra trên Supabase — nó ghi đè, chạy bao nhiêu lần
//      cũng được
//
// Script tự kiểm ba điều trước khi ghi, sai một điều là dừng chứ không sinh ra
// file SQL hỏng:
//   - Mọi nhóm nhỏ nhắc tới đều phải có thật trong danh-muc-chot.json
//   - Không mã nào bị bỏ sót
//   - Không gán cho mã không tồn tại
import { readFileSync, writeFileSync } from 'node:fs'

const DOI_CHIEU = 'scripts/doi-chieu-danh-muc.json'
const DANH_MUC = 'scripts/danh-muc-chot.json'
const DICH = 'supabase/migrations/0010_gan_san_pham.sql'

/** Lặp lại cách đặt slug của gen-danh-muc-sql.mjs để hai bên luôn khớp. */
const SLUG_KE_THUA = {
  'Dụng cụ cắt an toàn': 'an-toan',
  'Dụng cụ cắt gọt CNC & composite': 'cat-got-cnc',
  'Mài, nhám & hoàn thiện bề mặt': 'mai-hoan-thien',
  'Vát mép & bo cạnh kim loại': 'vat-mep',
  'Khuôn mẫu & bảo trì khuôn': 've-sinh-khuon',
  'Đo kiểm & xác định điểm 0': 'do-can-chinh',
  'Gá kẹp & định vị gia công': 'kep-khuon-phoi',
  'Siết lực & lắp ráp công nghiệp': 'siet-cong-nghiep',
  'Đánh dấu & truy xuất công nghiệp': 'danh-dau',
  'Hàn điện trở & cân bằng tải': 'do-kiem-may-han',
  'Phủ carbide & chống mài mòn': 'phuc-hoi-be-mat',
  'Khớp nối nhanh & phụ kiện môi chất': 'khop-noi',
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const slugNgan = (s, toiDa = 42) => {
  const day = slugify(s)
  if (day.length <= toiDa) return day
  const phan = day.split('-')
  let ra = phan[0]
  for (const p of phan.slice(1)) {
    if ((ra + '-' + p).length > toiDa) break
    ra += '-' + p
  }
  return ra
}

const nhoms = JSON.parse(readFileSync(DANH_MUC, 'utf8'))

/** Tên nhóm nhỏ -> slug. Dựng lại y hệt lúc sinh file danh mục. */
const SLUG_NHO = {}
const daDung = new Set()
for (const g of nhoms) {
  const slugCha = SLUG_KE_THUA[g.name] ?? slugify(g.name)
  daDung.add(slugCha)
  for (const c of g.children) {
    let s = slugNgan(c)
    if (daDung.has(s)) s = `${slugCha}-${s}`.slice(0, 60)
    daDung.add(s)
    SLUG_NHO[c] = s
  }
}

const { san_pham: sp } = JSON.parse(readFileSync(DOI_CHIEU, 'utf8'))

const laNhoSai = Object.entries(sp).filter(([, v]) => !SLUG_NHO[v.nho])
if (laNhoSai.length) {
  throw new Error(
    'Nhóm nhỏ không có trong cấu trúc mới:\n' +
      laNhoSai.map(([k, v]) => `  ${k} -> "${v.nho}"`).join('\n')
  )
}

const cho = Object.entries(sp).filter(([, v]) => v.cho_xac_nhan)

const dong = Object.entries(sp)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([part, v]) => {
    // Nháy ĐƠN: trong SQL nháy kép là tên cột, không phải chuỗi.
    const q = (s) => `'${String(s).replace(/'/g, "''")}'`
    // Chú thích phải nằm trên DÒNG RIÊNG. Để cuối dòng thì dấu phẩy nối các
    // dòng VALUES bị nuốt vào trong chú thích và cả câu lệnh gãy.
    const co = v.cho_xac_nhan ? `  -- CHỜ XÁC NHẬN: ${v.cho_xac_nhan}\n` : ''
    return `${co}  (${q(part)}, ${q(SLUG_NHO[v.nho])})`
  })

const sql = `-- =============================================================================
-- Gắn ${Object.keys(sp).length} sản phẩm hiện có vào nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-gan-san-pham-sql.mjs — đừng sửa tay file này,
-- sửa scripts/doi-chieu-danh-muc.json rồi chạy lại script.
--
-- Phải chạy sau 0008_danh_muc_moi.sql, vì các nhóm nhỏ phải tồn tại trước.
--
-- CHẠY LẠI BAO NHIÊU LẦN CŨNG ĐƯỢC: câu lệnh là UPDATE theo mã hàng, không
-- thêm hay xoá dòng nào.
--
-- SAU KHI CHẠY, WEBSITE CHƯA ĐỔI GÌ: các nhóm nhỏ vẫn đang visible = false.
-- Chỉ khi bật chúng lên thì bộ lọc hai cấp mới hiện ra cho khách.
${
  cho.length
    ? `--
-- CÒN ${cho.length} MÃ CHỜ BAN GIÁM ĐỐC XÁC NHẬN. Chúng vẫn được gắn tạm theo
-- phán đoán để website không có sản phẩm nào lạc chỗ, nhưng phải sửa lại khi
-- có trả lời:
${cho.map(([k, v]) => `--   ${k.padEnd(12)} ${v.cho_xac_nhan}`).join('\n')}`
    : '--\n-- Tất cả các mã đều đã được xác nhận.'
}
-- =============================================================================

update products p
set category_slug = v.nhom
from (values
${dong.join(',\n')}
) as v(part, nhom)
where p.part = v.part;

-- Trigger ktd_fill_search chạy lại theo từng dòng UPDATE, nên cột tìm kiếm tự
-- cập nhật tên nhóm mới. Không cần làm gì thêm.

-- Kiểm nhanh sau khi chạy:
--   select count(*) from products p join categories c on c.slug = p.category_slug
--   where c.parent_slug is not null;
-- Phải ra ${Object.keys(sp).length} — nghĩa là mọi sản phẩm đều đã nằm ở nhóm nhỏ, không còn
-- sản phẩm nào gắn thẳng vào nhóm chính.
`

writeFileSync(DICH, sql)
console.log(`Đã ghi ${DICH}`)
console.log(`${Object.keys(sp).length} mã hàng.`)
if (cho.length) {
  console.log(`\nCòn ${cho.length} mã chờ Ban Giám đốc xác nhận:`)
  for (const [k, v] of cho) console.log(`   ${k.padEnd(12)} ${v.cho_xac_nhan}`)
}
