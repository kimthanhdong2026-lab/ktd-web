// Chuẩn hoá ảnh banner của 19 trang thương hiệu.
//
// Nguồn: thư mục KTĐ gửi trong Hop-thu-den. Tên file đánh số theo đúng thứ tự
// 19 hãng trong "19 trang thương hiệu.docx", nên ghép số với slug là đủ — không
// đoán theo tên file, vì tên viết hoa thường lẫn lộn ("garryson", "Beveltools",
// "CoreHog") và có file thừa dấu cách.
//
// Ảnh gốc đều 1200x900 (4:3), 3 định dạng khác nhau. Xuất về cùng một khuôn
// webp để trang nào cũng tải như nhau.
//
// Chạy: node scripts/build-brand-banners.mjs
import sharp from 'sharp'
import { readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'Hop-thu-den/Ảnh banner trang Thương hiệu nhỏ-20261001T080740Z-1-001/Ảnh banner trang Thương hiệu nhỏ'
const OUT = 'public/assets/brands/banner'
const RONG = 1200 // giữ nguyên bề rộng gốc; nguồn vốn đã 1200x900

/** Số thứ tự trong tên file -> slug thương hiệu trong cơ sở dữ liệu. */
const THEO_SO = {
  1: 'martor',
  2: 'karnasch',
  3: 'hartner',
  4: 'helical',
  5: 'corehog',
  6: 'ata',
  7: 'morrisflex',
  8: 'garryson',
  9: 'bevel-tools',
  10: 'diprofil',
  11: 'buchem',
  12: 'rocklinizer',
  13: 'tschorn',
  14: 'lenzkes',
  15: 'fiam',
  16: 'sloky',
  17: 'technomark',
  18: 'tecna',
  19: 'rtc',
}

if (!existsSync(SRC)) {
  console.error('Không thấy thư mục ảnh nguồn:\n  ' + SRC)
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })

const tep = readdirSync(SRC).filter((f) => /\.(webp|png|jpe?g)$/i.test(f))
const daLam = new Set()
let hong = 0

for (const f of tep.sort((a, b) => parseInt(a) - parseInt(b))) {
  const so = parseInt(f, 10)
  const slug = THEO_SO[so]
  if (!slug) {
    console.log(`  BỎ QUA  ${f}  — số ${so} không có trong bảng`)
    hong++
    continue
  }
  if (daLam.has(slug)) {
    console.log(`  TRÙNG   ${f}  — slug ${slug} đã xử lý rồi`)
    hong++
    continue
  }
  daLam.add(slug)

  const goc = await sharp(join(SRC, f)).metadata()
  const info = await sharp(join(SRC, f))
    .resize({ width: RONG, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${slug}.webp`))

  console.log(
    `  ${String(so).padStart(2)}  ${slug.padEnd(12)} ${goc.width}x${goc.height} ${String(goc.format).padEnd(4)}` +
      ` -> ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`
  )
}

const thieu = Object.values(THEO_SO).filter((s) => !daLam.has(s))
console.log()
console.log(`Xong ${daLam.size}/19 banner.`)
if (thieu.length) {
  console.log('THIẾU: ' + thieu.join(', '))
  hong++
}
process.exit(hong ? 1 : 0)
