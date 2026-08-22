// Ảnh 7 ngành do team gửi trong "Hop-thu-den/Ảnh ngành", đặt tên 1..7 đúng
// thứ tự SECTOR_CARDS trong lib/constants.ts. Nén về 3:2 cho khối "Lĩnh vực
// phục vụ" trên trang chủ.
import sharp from 'sharp'
import { existsSync } from 'node:fs'

const SRC = 'Hop-thu-den/Ảnh ngành'
const OUT = 'public/sectors'

for (let i = 1; i <= 7; i++) {
  const src = `${SRC}/${i}.jpg`
  if (!existsSync(src)) {
    console.log(`${i}. thiếu file ${src}`)
    continue
  }
  const info = await sharp(src)
    .resize(880, 587, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(`${OUT}/${i}.webp`)
  console.log(`${i}. ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
