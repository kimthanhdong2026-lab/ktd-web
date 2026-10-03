// Chuẩn hoá 12 ảnh của các nhóm danh mục chính.
//
// Nguồn: thư mục KTĐ gửi trong Hop-thu-den, tên file là SỐ THỨ TỰ của nhóm
// (1..12) đúng theo "Sửa web 4" đoạn 13 — không đoán theo nội dung ảnh.
//
// Ảnh gốc đều 1254x1254 vuông, nền sáng nhưng KHÔNG trắng hẳn (xám xanh nhạt).
// Ô danh mục trên trang chủ có nền trắng, nên nếu đặt ảnh thẳng vào sẽ thấy một
// khối xám vuông nổi lên giữa thẻ trắng. Đoạn 13 nói rõ: "nên đồng bộ màu nền
// của ảnh với nội dung bên dưới".
//
// Vì vậy ảnh được cắt về tỉ lệ 4:3 và chèn lên nền TRẮNG, rồi để giao diện phủ
// một dải chuyển mờ ở đáy cho ảnh tan vào thẻ.
//
// Chạy: node scripts/build-category-images.mjs
import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

const SRC = 'Hop-thu-den/Ảnh danh mục sản phẩm-20261001T081011Z-1-001/Ảnh danh mục sản phẩm'
const OUT = 'public/assets/categories'
const RONG = 640
const CAO = 480 // 4:3 — thấp hơn ảnh vuông gốc, để ô không quá cao

/** Lặp lại cách đặt slug của gen-danh-muc-sql.mjs. */
const SLUG_THEO_STT = {
  1: 'an-toan',
  2: 'cat-got-cnc',
  3: 'mai-hoan-thien',
  4: 'vat-mep',
  5: 've-sinh-khuon',
  6: 'do-can-chinh',
  7: 'kep-khuon-phoi',
  8: 'siet-cong-nghiep',
  9: 'danh-dau',
  10: 'do-kiem-may-han',
  11: 'phuc-hoi-be-mat',
  12: 'khop-noi',
}

if (!existsSync(SRC)) {
  console.error('Không thấy thư mục ảnh nguồn:\n  ' + SRC)
  process.exit(1)
}

// Đối chiếu với cấu trúc danh mục để chắc chắn 12 số khớp 12 nhóm thật.
const dm = JSON.parse(readFileSync('scripts/danh-muc-chot.json', 'utf8'))
if (dm.length !== Object.keys(SLUG_THEO_STT).length) {
  console.error(`Lệch số nhóm: cấu trúc có ${dm.length}, bảng ảnh có ${Object.keys(SLUG_THEO_STT).length}`)
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })

const tep = readdirSync(SRC).filter((f) => /\.(webp|png|jpe?g)$/i.test(f))
const daLam = new Set()
let hong = 0

for (const f of tep.sort((a, b) => parseInt(a) - parseInt(b))) {
  const stt = parseInt(f, 10)
  const slug = SLUG_THEO_STT[stt]
  const nhom = dm.find((g) => g.stt === stt)
  if (!slug || !nhom) {
    console.log(`  BỎ QUA  ${f} — số ${stt} không có nhóm tương ứng`)
    hong++
    continue
  }
  if (daLam.has(slug)) {
    console.log(`  TRÙNG   ${f} — slug ${slug} đã xử lý`)
    hong++
    continue
  }
  daLam.add(slug)

  const info = await sharp(join(SRC, f))
    // flatten trước: ảnh có kênh alpha thì phần trong suốt thành trắng chứ
    // không thành đen.
    .flatten({ background: '#ffffff' })
    .resize(RONG, CAO, { fit: 'cover', position: 'centre' })
    .webp({ quality: 84 })
    .toFile(join(OUT, `${slug}.webp`))

  console.log(
    `  ${String(stt).padStart(2)}  ${slug.padEnd(16)} ${(info.size / 1024).toFixed(0).padStart(3)} KB   ${nhom.name}`
  )
}

const thieu = Object.values(SLUG_THEO_STT).filter((s) => !daLam.has(s))
console.log()
console.log(`Xong ${daLam.size}/12 ảnh danh mục.`)
if (thieu.length) {
  console.log('THIẾU: ' + thieu.join(', '))
  hong++
}
process.exit(hong ? 1 : 0)
