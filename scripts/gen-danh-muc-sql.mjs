// Sinh file SQL nạp danh mục hai cấp (12 nhóm chính + 41 nhóm nhỏ).
//
// Nguồn: scripts/danh-muc-chot.json — dựng lại từ sheet "Danh mục sản phẩm"
// của file Excel "Danh sách thương hiệu", theo hai điều BGĐ đã duyệt:
//   - Nhóm nào có hai tên thì lấy tên ở DÒNG CUỐI (khớp bản mockup 8/8).
//   - Dòng 32 (STT ghi nhầm là 103) thuộc nhóm 8, hãng Sloky, tên nhóm nhỏ là
//     "Tô vít lực, bộ dụng cụ & phụ kiện".
//
// HAI ĐIỂM QUAN TRỌNG VỀ SLUG
//
// 1. Nhóm chính DÙNG LẠI slug cũ khi có dòng dõi rõ ràng. Slug là đường dẫn,
//    đổi slug là giết một trang Google đang biết. Đổi TÊN hiển thị thì được,
//    đổi slug thì không.
//
// 2. Ba slug cũ không còn nhóm nào kế thừa (composite, nang-ha,
//    siet-luc-cam-tay) vì nội dung của chúng bị gộp vào nhóm khác. Script in ra
//    danh sách này để còn khai báo chuyển hướng.
//
// NHÓM NHỎ NẠP VÀO Ở TRẠNG THÁI HIỆN, KHÔNG PHẢI ẨN.
//
// Bản đầu nạp mọi nhóm ở trạng thái ẩn với lý luận "website không đổi gì cho
// tới khi có người bật lên". Lý luận đó SAI và đã làm sập trang Sản phẩm trên
// bản thật ngày 03/10/2026: file 0010 gắn 35 sản phẩm vào các nhóm nhỏ, mà
// 0011 lọc bỏ mọi thứ thuộc nhóm đang ẩn, nên cả 35 sản phẩm biến mất.
//
// Bài học: nạp dữ liệu ở trạng thái ẩn chỉ an toàn khi KHÔNG có bước nào trỏ
// dữ liệu đang chạy vào đó. Ở đây có — nên nhóm phải hiện sẵn, và thứ giữ an
// toàn là bản thân các nhóm rỗng chưa ai trỏ tới.
//
// Chạy: node scripts/gen-danh-muc-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const NGUON = 'scripts/danh-muc-chot.json'
const DICH = 'supabase/migrations/0008_danh_muc_moi.sql'

/** Nhóm chính mới -> slug cũ được kế thừa. Giữ nguyên đường dẫn đang chạy. */
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

/** Slug cũ không còn nhóm nào kế thừa — nội dung đã gộp sang nhóm khác. */
const SLUG_NGHI = {
  composite: 'cat-got-cnc',
  'nang-ha': 'siet-cong-nghiep',
  'siet-luc-cam-tay': 'siet-cong-nghiep',
}

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Cắt bớt cho slug nhóm nhỏ khỏi dài lê thê, nhưng vẫn đọc ra nghĩa. */
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

const nhoms = JSON.parse(readFileSync(NGUON, 'utf8'))

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)

const dong = []
const daDung = new Set()
let soNho = 0

for (const g of nhoms) {
  const slug = SLUG_KE_THUA[g.name] ?? slugify(g.name)
  if (!SLUG_KE_THUA[g.name]) {
    console.log(`  CHÚ Ý: nhóm "${g.name}" không kế thừa slug cũ, dùng slug mới "${slug}"`)
  }
  if (daDung.has(slug)) throw new Error('Trùng slug: ' + slug)
  daDung.add(slug)

  dong.push(
    `  (${q(slug)}, ${q(g.name)}, null, ${q(g.sub)}, null, null, ${g.stt}, true)`
  )

  g.children.forEach((c, i) => {
    let s = slugNgan(c)
    // Nhóm nhỏ có thể trùng tên giữa các nhóm chính; thêm tiền tố nhóm cha.
    if (daDung.has(s)) s = `${slug}-${s}`.slice(0, 60)
    if (daDung.has(s)) throw new Error('Trùng slug nhóm nhỏ: ' + s)
    daDung.add(s)
    soNho++
    dong.push(
      `  (${q(s)}, ${q(c)}, null, '', null, ${q(slug)}, ${(i + 1) * 10}, true)`
    )
  })
}

const sql = `-- =============================================================================
-- Nạp danh mục hai cấp: 12 nhóm chính + ${soNho} nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-danh-muc-sql.mjs — đừng sửa tay file này,
-- sửa scripts/danh-muc-chot.json rồi chạy lại script.
--
-- AN TOÀN KHI CHẠY TRÊN BẢN ĐANG PHỤC VỤ KHÁCH: các nhóm nhỏ nạp vào đều rỗng,
-- chưa sản phẩm nào trỏ tới, nên bộ lọc chưa hiện thêm gì. Chúng để visible =
-- true ngay từ đầu vì file 0010 sẽ gắn sản phẩm vào đây — để ẩn thì sản phẩm
-- gắn vào sẽ biến mất khỏi website.
--
-- Nhóm chính dùng lại slug cũ để đường dẫn Google đang biết không chết.
-- Ba slug cũ không còn nhóm kế thừa, cần khai báo chuyển hướng:
${Object.entries(SLUG_NGHI)
  .map(([cu, moi]) => `--     /san-pham?dm=${cu}  ->  /san-pham?dm=${moi}`)
  .join('\n')}
-- =============================================================================

insert into categories
  (slug, name_vi, name_en, sub_vi, sub_en, parent_slug, sort_order, visible)
values
${dong.join(',\n')}
on conflict (slug) do update set
  name_vi     = excluded.name_vi,
  sub_vi      = excluded.sub_vi,
  parent_slug = excluded.parent_slug,
  sort_order  = excluded.sort_order;
  -- Cố ý KHÔNG đụng tới cột visible: chạy lại file này không được bật lại
  -- những nhóm mà người vận hành đã chủ động ẩn đi.

-- Kiểm nhanh sau khi chạy:
--   select count(*) filter (where parent_slug is null) as nhom_chinh,
--          count(*) filter (where parent_slug is not null) as nhom_nho
--   from categories;
-- Phải ra ${nhoms.length} và ${soNho}.
`

writeFileSync(DICH, sql)
console.log(`\nĐã ghi ${DICH}`)
console.log(`${nhoms.length} nhóm chính, ${soNho} nhóm nhỏ, ${dong.length} dòng INSERT.`)
console.log(`\nSlug cũ nghỉ hưu, cần chuyển hướng: ${Object.keys(SLUG_NGHI).join(', ')}`)
