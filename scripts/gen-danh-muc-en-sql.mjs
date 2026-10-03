// Sinh SQL điền bản tiếng Anh cho 12 nhóm chính và 41 nhóm nhỏ.
//
// Nguồn: scripts/danh-muc-en.json, khoá là nguyên văn tiếng Việt.
// Đích:  supabase/migrations/0015_danh_muc_tieng_anh.sql
//
// Dùng khoá tiếng Việt chứ không dùng slug: sửa tên tiếng Việt mà quên sửa bản
// dịch thì script dừng ngay với danh sách thiếu, thay vì âm thầm để trang tiếng
// Anh hiện tiếng Việt mà không ai biết.
//
// Chạy: node scripts/gen-danh-muc-en-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const DM = JSON.parse(readFileSync('scripts/danh-muc-chot.json', 'utf8'))
const EN = JSON.parse(readFileSync('scripts/danh-muc-en.json', 'utf8'))
const DICH = 'supabase/migrations/0015_danh_muc_tieng_anh.sql'

const q = (v) => `'${String(v).replace(/'/g, "''")}'`

const thieu = []
const dong = []

for (const g of DM) {
  const ten = EN.nhom_chinh[g.name]
  const sub = EN.chu_nho[g.sub]
  if (!ten) thieu.push(`nhóm chính: ${g.name}`)
  if (!sub) thieu.push(`chữ nhỏ của ${g.name}: ${g.sub}`)
  if (ten && sub) dong.push({ vi: g.name, ten, sub })

  for (const c of g.children) {
    const tenCon = EN.nhom_nho[c]
    if (!tenCon) thieu.push(`nhóm nhỏ: ${c}`)
    else dong.push({ vi: c, ten: tenCon, sub: null })
  }
}

// Bản dịch thừa: còn trong file nhưng tên tiếng Việt đã đổi hoặc đã xoá.
const dungRoi = new Set(dong.map((d) => d.vi))
const thua = [...Object.keys(EN.nhom_chinh), ...Object.keys(EN.nhom_nho)].filter(
  (k) => !dungRoi.has(k)
)

if (thieu.length) {
  console.error('THIẾU BẢN DỊCH:\n' + thieu.map((x) => '  - ' + x).join('\n'))
  process.exit(1)
}
if (thua.length) {
  console.log('Bản dịch thừa (tên tiếng Việt không còn dùng):')
  for (const t of thua) console.log('  - ' + t)
  console.log()
}

// Ghép theo name_vi chứ không theo slug: file này chỉ quan tâm chữ nghĩa, không
// phải quan tâm chuyện slug nào kế thừa slug nào.
const values = dong
  .map((d) => `  (${q(d.vi)}, ${q(d.ten)}, ${d.sub === null ? 'null' : q(d.sub)})`)
  .join(',\n')

const sql = `-- =============================================================================
-- Bản tiếng Anh cho 12 nhóm chính và ${dong.length - DM.length} nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-danh-muc-en-sql.mjs — đừng sửa tay file này,
-- sửa scripts/danh-muc-en.json rồi chạy lại script.
--
-- Thuật ngữ bám theo lib/i18n/glossary.ts để trang tiếng Anh không có hai cách
-- gọi cùng một thứ.
--
-- Ghép theo name_vi: trước đợt 4 có 15 danh mục cũ, 12 trong số đó bị đổi TÊN
-- nhưng giữ nguyên slug để không chết đường dẫn. Ghép theo tên tiếng Việt hiện
-- tại là cách duy nhất chắc chắn đúng.
--
-- Chạy sau 0008_danh_muc_moi.sql.
-- =============================================================================

update categories c
set name_en = v.ten_en,
    sub_en  = coalesce(v.sub_en, c.sub_en)
from (values
${values}
) as v(ten_vi, ten_en, sub_en)
where c.name_vi = v.ten_vi;

-- Kiểm nhanh sau khi chạy:
--   select count(*) from categories where name_en is not null and visible;
-- Phải ra ${dong.length} — đúng bằng 12 nhóm chính cộng ${dong.length - DM.length} nhóm nhỏ.
--
--   select name_vi, name_en from categories where visible and name_en is null;
-- Phải không ra dòng nào.
`

writeFileSync(DICH, sql)
console.log(`Đã ghi ${DICH}`)
console.log(`${DM.length} nhóm chính + ${dong.length - DM.length} nhóm nhỏ = ${dong.length} dòng.`)
