// Chuẩn hoá logo thương hiệu về cùng một khung để dải logo trên trang chủ
// nhìn đều nhau. Logo nào nền trắng thì cắt hết viền trắng thừa rồi mới
// đưa vào khung; logo nào vốn là ô màu (Karnasch, Buchem, Lenzkes) thì giữ
// nguyên nền, chỉ thu về đúng khung.
import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'public/assets/brands'
const OUT = 'public/assets/brands/norm'
const BOX = { width: 320, height: 128 } // tỉ lệ 2.5:1, đủ chỗ cho cả logo chữ dài

mkdirSync(OUT, { recursive: true })

const isTile = async (p) => {
  const { data, info } = await sharp(p).flatten({ background: '#fff' }).raw().toBuffer({ resolveWithObject: true })
  const at = (x, y) => { const i = (y * info.width + x) * info.channels; return [data[i], data[i + 1], data[i + 2]] }
  // trim() lấy chính điểm góc trên trái làm màu nền, nên chỉ cần xét điểm đó:
  // góc trắng thì cắt được, góc có màu nghĩa là màu đó thuộc về logo.
  return !at(0, 0).every((n) => n > 240)
}

for (const f of readdirSync(SRC).filter((f) => f.endsWith('.webp'))) {
  const p = join(SRC, f)
  const tile = await isTile(p)
  let img = sharp(p).flatten({ background: '#ffffff' })
  if (!tile) img = img.trim({ threshold: 8 })
  const out = join(OUT, f)
  const info = await img
    .resize({ ...BOX, fit: 'contain', background: '#ffffff' })
    .webp({ quality: 92 })
    .toFile(out)
  console.log(`${f.padEnd(18)} ${tile ? 'ô màu ' : 'nền trắng'} -> ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}KB`)
}
