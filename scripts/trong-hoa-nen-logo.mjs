// Bóc nền trắng của logo thương hiệu thành nền trong suốt.
//
// VÌ SAO CẦN: trang thương hiệu dùng nền xanh rất nhạt (#EEF4F9). Logo nào lưu
// kèm nền trắng đặc sẽ hiện ra thành một ô trắng nổi hẳn lên nền xanh — nhìn
// như logo bị dán đè chứ không phải nằm trong trang.
//
// CÁCH LÀM — "gỡ nhân nền trắng" chứ không phải cắt theo ngưỡng:
// ảnh gốc là logo đã chồng sẵn lên nền trắng, nên mỗi điểm ảnh là
//     c = f·a + 255·(1−a)       (f: màu thật của logo, a: độ phủ)
// Cắt thẳng theo ngưỡng sẽ để lại viền trắng răng cưa quanh chữ. Ở đây suy
// ngược ra a từ kênh tối nhất rồi giải lại f, nên nét chữ vẫn mượt trên mọi
// màu nền.
//
//   a = clamp((245 − min(r,g,b)) / 40, 0, 1)
//
// Vùng đặc (min < 205) ra a = 1 nên GIỮ NGUYÊN màu gốc, không sai lệch chút
// nào; chỉ dải 205–245 — tức riêng mép khử răng cưa — mới được tính lại.
//
// KHÔNG đụng tới logo vốn là ô màu (Karnasch, Buchem, Lenzkes): góc ảnh của
// chúng là màu thương hiệu, không phải nền.
//
// Chạy: node scripts/trong-hoa-nen-logo.mjs [--that]
// Không có --that thì chỉ in ra xem sẽ làm gì, không ghi đè file nào.
import sharp from 'sharp'
import { copyFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'

const SRC = 'public/assets/brands'
const LUU = 'public/assets/brands/goc-nen-trang'
const MOI = 'public/assets/brands/trong-suot'

/**
 * Tám hãng lưu logo kèm nền trắng đặc.
 * `cat`: số điểm ảnh gọt vào bốn mép TRƯỚC khi bóc nền — dành cho file quét có
 * sẵn khung viền mảnh quanh ảnh; gọt rồi thì khung đó biến mất cùng nền.
 */
const LAM = [
  { slug: 'diprofil', cat: 3 },
  { slug: 'fiam' },
  { slug: 'garryson' },
  { slug: 'hartner' },
  { slug: 'helical' },
  { slug: 'morrisflex' },
  { slug: 'technomark' },
  { slug: 'tecna' },
]

const THAT = process.argv.includes('--that')
const DUOI = 245 // từ đây trở lên coi là nền
const DAI = 40 // bề rộng dải chuyển tiếp

if (THAT) {
  mkdirSync(LUU, { recursive: true })
  mkdirSync(MOI, { recursive: true })
}

for (const { slug, cat = 0 } of LAM) {
  const p = `${SRC}/${slug}.webp`
  if (!existsSync(p)) {
    console.log(`${slug.padEnd(12)} KHÔNG có file — bỏ qua`)
    continue
  }

  let anh = sharp(p).ensureAlpha()
  if (cat) {
    const m = await sharp(p).metadata()
    anh = anh.extract({ left: cat, top: cat, width: m.width - cat * 2, height: m.height - cat * 2 })
  }
  const { data, info } = await anh.raw().toBuffer({ resolveWithObject: true })
  const n = info.width * info.height
  const ra = Buffer.alloc(n * 4)

  let soTrong = 0
  for (let i = 0; i < n; i++) {
    const o = i * info.channels
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const a = Math.max(0, Math.min(1, (DUOI - Math.min(r, g, b)) / DAI))

    const q = i * 4
    if (a <= 0) {
      ra[q] = ra[q + 1] = ra[q + 2] = ra[q + 3] = 0
      soTrong++
      continue
    }
    // f = (c − 255·(1−a)) / a
    const go = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)))
    ra[q] = go(r)
    ra[q + 1] = go(g)
    ra[q + 2] = go(b)
    ra[q + 3] = Math.round(a * 255)
  }

  const tyLe = ((soTrong / n) * 100).toFixed(0)
  if (!THAT) {
    console.log(`${slug.padEnd(12)} ${info.width}x${info.height}  sẽ bóc ${tyLe}% diện tích thành trong suốt`)
    continue
  }

  copyFileSync(p, `${LUU}/${slug}.webp`)
  // Ghi ra thư mục riêng chứ KHÔNG ghi đè thẳng: trên máy này mọi lệnh mở file
  // .webp có sẵn để ghi đều bị từ chối (có tiến trình nền giữ thẻ tệp). Bước
  // chép đè để shell làm, xem ghi chú cuối file.
  // trim() cắt nốt viền trong suốt thừa, để logo lấp đầy khung thay vì bơi
  // giữa khoảng trống — quan trọng vì trang thương hiệu canh logo theo mép trái.
  const buf = await sharp(ra, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 2 })
    .webp({ quality: 95, alphaQuality: 100 })
    .toBuffer()
  writeFileSync(`${MOI}/${slug}.webp`, buf)
  const kq = await sharp(buf).metadata()
  kq.size = buf.length
  console.log(
    `${slug.padEnd(12)} ${kq.width}x${kq.height}  bóc ${tyLe}% nền  ${(kq.size / 1024).toFixed(1)} KB`
  )
}

console.log(THAT ? `\nBản cũ giữ ở ${LUU}` : '\nChưa ghi gì. Thêm --that để làm thật.')
