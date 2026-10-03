// Sinh SQL điền bản tiếng Anh cho 19 trang thương hiệu.
//
// Nguồn: scripts/thuong-hieu.json (tiếng Việt) + scripts/thuong-hieu-en.json
// Đích:  supabase/migrations/0016_thuong_hieu_tieng_anh.sql
//
// Script dừng ngay nếu:
//   - thiếu bản dịch của một hãng
//   - số gạch đầu dòng tiếng Anh khác tiếng Việt
//
// Điều kiện thứ hai quan trọng hơn vẻ ngoài của nó: thiếu một gạch đầu dòng thì
// trang tiếng Anh vẫn hiện bình thường, chỉ là mất một ý — không ai phát hiện
// cho tới khi có người đọc kỹ cả hai bản.
//
// Chạy: node scripts/gen-thuong-hieu-en-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const VI = JSON.parse(readFileSync('scripts/thuong-hieu.json', 'utf8'))
const EN = JSON.parse(readFileSync('scripts/thuong-hieu-en.json', 'utf8'))
const DICH = 'supabase/migrations/0016_thuong_hieu_tieng_anh.sql'

/** Tên trong file Word -> slug. Giữ khớp với gen-thuong-hieu-sql.mjs. */
const SLUG = {
  MARTOR: 'martor',
  KARNASCH: 'karnasch',
  HARTNER: 'hartner',
  'HELICAL SOLUTIONS': 'helical',
  COREHOG: 'corehog',
  'ATA AIR TOOLS': 'ata',
  MORRISFLEX: 'morrisflex',
  GARRYSON: 'garryson',
  BEVELTOOLS: 'bevel-tools',
  DIPROFIL: 'diprofil',
  BUCHEM: 'buchem',
  ROCKLIN: 'rocklinizer',
  TSCHORN: 'tschorn',
  LENZKES: 'lenzkes',
  FIAM: 'fiam',
  SLOKY: 'sloky',
  TECHNOMARK: 'technomark',
  TECNA: 'tecna',
  RTC: 'rtc',
}

const q = (v) => `'${String(v).replace(/'/g, "''")}'`
const mang = (xs) => (xs.length ? `array[${xs.map(q).join(', ')}]::text[]` : `'{}'::text[]`)

const loi = []
const khoi = []

for (const h of VI) {
  const slug = SLUG[h.ten]
  const en = EN[h.ten]
  if (!slug) {
    loi.push(`${h.ten}: chưa biết slug`)
    continue
  }
  if (!en) {
    loi.push(`${h.ten}: chưa có bản tiếng Anh`)
    continue
  }
  if (!en.intro?.trim()) loi.push(`${h.ten}: thiếu đoạn giới thiệu tiếng Anh`)

  for (const k of ['dong_sp', 'noi_bat', 'ung_dung']) {
    const nVi = h[k].length
    const nEn = en[k]?.length ?? 0
    if (nVi !== nEn) loi.push(`${h.ten}.${k}: tiếng Việt ${nVi} mục, tiếng Anh ${nEn} mục`)
  }

  khoi.push(`-- ${h.ten}
update brands set
    intro_en    = ${q(en.intro)},
    dong_sp_en  = ${mang(en.dong_sp ?? [])},
    noi_bat_en  = ${mang(en.noi_bat ?? [])},
    ung_dung_en = ${mang(en.ung_dung ?? [])},
    en_status   = 'máy dịch'
where slug = ${q(slug)};`)
}

if (loi.length) {
  console.error('KHÔNG SINH ĐƯỢC FILE:\n' + loi.map((x) => '  - ' + x).join('\n'))
  process.exit(1)
}

const sql = `-- =============================================================================
-- Bản tiếng Anh cho ${khoi.length} trang thương hiệu
--
-- SINH TỰ ĐỘNG bởi scripts/gen-thuong-hieu-en-sql.mjs — đừng sửa tay file này,
-- sửa scripts/thuong-hieu-en.json rồi chạy lại script.
--
-- Thuật ngữ bám theo lib/i18n/glossary.ts.
--
-- en_status đặt là 'máy dịch': bản dịch đã được đọc và nắn chứ không phải chạy
-- máy thẳng, nhưng vẫn nên có người của KTĐ rà lại tên riêng và cách gọi sản
-- phẩm theo thói quen của khách nước ngoài. Rà xong thì đổi sang 'đã duyệt';
-- script dịch tự động sau này không được đụng vào những dòng đã duyệt.
--
-- Chạy sau 0009_trang_thuong_hieu.sql.
-- =============================================================================

${khoi.join('\n\n')}

-- Kiểm nhanh sau khi chạy:
--   select count(*) from brands where visible and intro_en is not null;   -- phải ra ${khoi.length}
--   select slug, en_status from brands where visible order by sort_order;
`

writeFileSync(DICH, sql)
console.log(`Đã ghi ${DICH}`)
console.log(`${khoi.length} thương hiệu, số gạch đầu dòng khớp đúng bản tiếng Việt.`)
