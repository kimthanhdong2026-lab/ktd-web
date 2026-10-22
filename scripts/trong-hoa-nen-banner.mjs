// Bóc nền trắng của một ảnh banner trang thương hiệu thành trong suốt.
//
// Đầu trang riêng của hãng có nền xanh nhạt #EEF4F9, ảnh banner nằm bên phải.
// 16/19 banner KTD gửi vốn đã nền trong suốt nên tan vào nền trang; banner nào
// nền TRẮNG đặc thì hiện thành một khối trắng nổi lên — Garryson bị đúng lỗi
// này (góp ý của KTD ngày 22/10/2026).
//
// Cách làm: loang từ bốn mép ảnh vào trong, mọi điểm gần trắng nối liền với mép
// thì xoá. Chỉ loang từ mép chứ không xoá mọi điểm trắng, nên phần trắng NẰM
// TRONG sản phẩm (lõi đĩa nhám, vệt sáng trên thân kim loại) vẫn giữ nguyên.
// Viền sản phẩm được làm mềm theo độ trắng để không lộ răng cưa.
//
// Chạy: node scripts/trong-hoa-nen-banner.mjs garryson
// Ghi đè public/assets/brands/banner/<slug>.webp; bản cũ cất ở
// public/assets/brands/banner/goc-nen-trang/ để so lại khi cần.
import sharp from 'sharp'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const slug = process.argv[2]
if (!slug) {
  console.error('Thiếu slug. Ví dụ: node scripts/trong-hoa-nen-banner.mjs garryson')
  process.exit(1)
}

const DIR = 'public/assets/brands/banner'
const src = join(DIR, `${slug}.webp`)
const bak = join(DIR, 'goc-nen-trang', `${slug}.webp`)
if (!existsSync(src)) {
  console.error('Không thấy ' + src)
  process.exit(1)
}
mkdirSync(join(DIR, 'goc-nen-trang'), { recursive: true })
// Luôn làm từ bản GỐC nền trắng, nên chạy lại bao nhiêu lần cũng ra cùng kết quả.
if (!existsSync(bak)) copyFileSync(src, bak)

const { data, info } = await sharp(bak).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const C = info.channels

// "Độ trắng" của một điểm: điểm tối nhất trong ba kênh. 255 = trắng tinh.
const trang = (i) => Math.min(data[i * C], data[i * C + 1], data[i * C + 2])
const NGUONG = 238 // từ đây trở lên coi là nền, loang qua được
const MEM_TU = 215 // từ đây tới NGUONG là viền, trong suốt một phần

const nen = new Uint8Array(W * H)
const hang = new Int32Array(W * H)
let dau = 0
let cuoi = 0
const day = (p) => {
  if (!nen[p] && trang(p) >= NGUONG) {
    nen[p] = 1
    hang[cuoi++] = p
  }
}
for (let x = 0; x < W; x++) {
  day(x)
  day((H - 1) * W + x)
}
for (let y = 0; y < H; y++) {
  day(y * W)
  day(y * W + W - 1)
}
while (dau < cuoi) {
  const p = hang[dau++]
  const x = p % W
  const y = (p - x) / W
  if (x > 0) day(p - 1)
  if (x < W - 1) day(p + 1)
  if (y > 0) day(p - W)
  if (y < H - 1) day(p + W)
}

const out = Buffer.alloc(W * H * 4)
let xoa = 0
for (let p = 0; p < W * H; p++) {
  out[p * 4] = data[p * C]
  out[p * 4 + 1] = data[p * C + 1]
  out[p * 4 + 2] = data[p * C + 2]
  let a = 255
  if (nen[p]) {
    a = 0
    xoa++
  } else {
    // Điểm sát vùng nền mà còn khá trắng: viền, cho mờ dần.
    const x = p % W
    const ke =
      (x > 0 && nen[p - 1]) || (x < W - 1 && nen[p + 1]) || (p >= W && nen[p - W]) || (p < W * (H - 1) && nen[p + W])
    const t = trang(p)
    if (ke && t > MEM_TU) a = Math.round(255 * (1 - (t - MEM_TU) / (255 - MEM_TU)))
  }
  out[p * 4 + 3] = a
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 86, alphaQuality: 90 }).toFile(src)
console.log(`${slug}: xoá nền ${((xoa / (W * H)) * 100).toFixed(1)}% diện tích -> ${src}`)
