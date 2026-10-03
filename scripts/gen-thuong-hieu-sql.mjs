// Sinh file SQL nạp nội dung 19 trang thương hiệu.
//
// Nguồn: scripts/thuong-hieu.json — tách từ "19 trang thương hiệu.docx" bằng
// scripts/../Hop-thu-den (xem doc-19-thuong-hieu.py). Mỗi hãng gồm xuất xứ,
// đoạn giới thiệu và ba danh sách gạch đầu dòng.
//
// File SQL sinh ra làm bốn việc:
//   1. Thêm GARRYSON — hãng mới, chưa có trong cơ sở dữ liệu.
//   2. Cập nhật nội dung trang cho 18 hãng còn lại.
//   3. Ẩn MoldMender. Ban Giám đốc xác nhận MoldMender và Rocklinizer là
//      thương hiệu con của ROCKLIN, chỉ còn xuất hiện dưới dạng tên nhóm nhỏ.
//      Ẩn chứ không xoá — đúng nguyên tắc đã thống nhất.
//   4. Sửa xuất xứ theo đúng tài liệu, trong đó RTC từ "Đức" thành "Thổ Nhĩ Kỳ".
//
// Chạy: node scripts/gen-thuong-hieu-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const NGUON = 'scripts/thuong-hieu.json'
const DICH = 'supabase/migrations/0009_trang_thuong_hieu.sql'

/** Tên trong file Word -> slug trong cơ sở dữ liệu. */
const SLUG = {
  MARTOR: 'martor',
  KARNASCH: 'karnasch',
  HARTNER: 'hartner',
  'HELICAL SOLUTIONS': 'helical',
  COREHOG: 'corehog',
  'ATA AIR TOOLS': 'ata',
  MORRISFLEX: 'morrisflex',
  GARRYSON: 'garryson', // hãng mới
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

/** Hãng chưa có trong cơ sở dữ liệu — cần INSERT thay vì UPDATE. */
const MOI = { garryson: { name: 'Garryson', logo: 'brands/garryson.webp' } }

const XUAT_XU_EN = {
  Đức: 'Germany',
  'Hoa Kỳ': 'USA',
  Ireland: 'Ireland',
  Anh: 'United Kingdom',
  'Hà Lan': 'Netherlands',
  'Thụy Điển': 'Sweden',
  Ý: 'Italy',
  'Đài Loan': 'Taiwan',
  Pháp: 'France',
  'Thổ Nhĩ Kỳ': 'Turkey',
}

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const mang = (xs) => (xs.length ? `array[${xs.map(q).join(', ')}]::text[]` : `'{}'::text[]`)

const hangs = JSON.parse(readFileSync(NGUON, 'utf8'))

const thieu = hangs.filter((h) => !SLUG[h.ten])
if (thieu.length) throw new Error('Chưa biết slug của: ' + thieu.map((h) => h.ten).join(', '))

const lạ = hangs.filter((h) => !XUAT_XU_EN[h.xuat_xu])
if (lạ.length) {
  throw new Error(
    'Chưa biết tên tiếng Anh của xuất xứ: ' + [...new Set(lạ.map((h) => h.xuat_xu))].join(', ')
  )
}

const khoi = []
for (const [i, h] of hangs.entries()) {
  const slug = SLUG[h.ten]
  const moi = MOI[slug]
  const chung = `
    origin_vi   = ${q(h.xuat_xu)},
    origin_en   = ${q(XUAT_XU_EN[h.xuat_xu])},
    intro_vi    = ${q(h.intro)},
    dong_sp_vi  = ${mang(h.dong_sp)},
    noi_bat_vi  = ${mang(h.noi_bat)},
    ung_dung_vi = ${mang(h.ung_dung)},
    sort_order  = ${i + 1}`

  if (moi) {
    khoi.push(`-- ${h.ten} — hãng MỚI, chưa từng có trong cơ sở dữ liệu.
-- Logo đã có sẵn file nguồn nhưng chưa chuẩn hoá và chưa đẩy lên kho ảnh;
-- tới lúc đó trang vẫn chạy, chỉ hiện tên chữ thay cho logo.
insert into brands (slug, name, origin_vi, origin_en, desc_vi, logo, sort_order, visible)
values (${q(slug)}, ${q(moi.name)}, ${q(h.xuat_xu)}, ${q(XUAT_XU_EN[h.xuat_xu])},
        ${q(h.intro)}, ${q(moi.logo)}, ${i + 1}, true)
on conflict (slug) do nothing;

update brands set${chung}
where slug = ${q(slug)};`)
  } else {
    khoi.push(`-- ${h.ten}
update brands set${chung}
where slug = ${q(slug)};`)
  }
}

const sql = `-- =============================================================================
-- Nội dung 19 trang thương hiệu
--
-- SINH TỰ ĐỘNG bởi scripts/gen-thuong-hieu-sql.mjs — đừng sửa tay file này,
-- sửa scripts/thuong-hieu.json rồi chạy lại script.
--
-- Phải chạy 0007_danh_muc_hai_cap.sql trước, vì file này ghi vào các cột do
-- 0007 tạo ra (intro_vi, dong_sp_vi, noi_bat_vi, ung_dung_vi, visible).
--
-- Ba thay đổi đáng chú ý, cả ba đều do Ban Giám đốc chốt ngày 03/10/2026:
--   - RTC: xuất xứ từ "Đức" đổi thành "Thổ Nhĩ Kỳ".
--   - GARRYSON: thêm mới, chưa có sản phẩm nào.
--   - MoldMender: ẩn khỏi website (không xoá) vì là thương hiệu con của ROCKLIN.
--
-- Nội dung tiếng Anh để trống, điền ở bước dịch sau; en_status đánh dấu "trống"
-- nên trang tiếng Anh tạm hiện tiếng Việt chứ không hiện ô rỗng.
-- =============================================================================

${khoi.join('\n\n')}

-- -----------------------------------------------------------------------------
-- MoldMender: thương hiệu con của ROCKLIN, không còn đứng riêng.
--
-- Ẩn chứ không xoá. Hãng này hiện không có sản phẩm nào nên ẩn đi là an toàn
-- tuyệt đối; nếu sau này cần dựng lại thì chỉ việc bật visible lên.
-- -----------------------------------------------------------------------------
update brands set visible = false where slug = 'moldmender';

-- Kiểm nhanh sau khi chạy:
--   select count(*) from brands where visible;                  -- phải ra 19
--   select origin_vi from brands where slug = 'rtc';            -- phải ra Thổ Nhĩ Kỳ
--   select count(*) from brands where intro_vi is not null;     -- phải ra 19
`

writeFileSync(DICH, sql)
console.log(`Đã ghi ${DICH}`)
console.log(`${hangs.length} thương hiệu, ${Object.keys(MOI).length} hãng thêm mới.`)
