// Nén ảnh Martor về chuẩn web và sinh mảng sản phẩm TypeScript.
// Chạy sau scripts/import-martor.py:  node scripts/build-martor.mjs
import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'fs'
import { join } from 'path'

const SRC = 'Hop-thu-den/Martor'
const OUT_IMG = 'public/products/martor'
const OUT_PDF = 'public/catalogs/martor'
const items = JSON.parse(readFileSync('scripts/martor-manifest.json', 'utf8'))

mkdirSync(OUT_IMG, { recursive: true })
mkdirSync(OUT_PDF, { recursive: true })

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")

let totalBefore = 0
let totalAfter = 0
const lines = []

for (const it of items) {
  const base = slugify(`${it.name}-${it.part}`)
  const images = []

  for (let i = 0; i < it.images.length; i++) {
    const src = join(SRC, it.folder, it.images[i])
    const out = join(OUT_IMG, `${base}-${i + 1}.webp`)
    totalBefore += statSync(src).size
    // Ảnh sản phẩm nền trắng, tỉ lệ 4:3 theo spec D3 — dùng contain để không
    // cắt mất phần nào của sản phẩm.
    await sharp(src)
      .resize({ width: 1000, height: 750, fit: 'contain', background: '#ffffff' })
      .webp({ quality: 82 })
      .toFile(out)
    totalAfter += statSync(out).size
    images.push(`/products/martor/${base}-${i + 1}.webp`)
  }

  let pdfPath = ''
  if (it.pdf) {
    const dest = join(OUT_PDF, `${base}.pdf`)
    copyFileSync(join(SRC, it.folder, it.pdf), dest)
    pdfPath = `/catalogs/martor/${base}.pdf`
  }

  const short = (it.paragraphs[0] || '').split(/(?<=\.)\s/)[0].slice(0, 200)
  const full = it.paragraphs

  lines.push(`  {
    part: '${esc(it.part)}', name: '${esc(it.name)}', brand: 'martor', category: 'an-toan',
    series: '${esc(it.series)}', origin: 'Đức',
    desc: '${esc(short)}',
    descFull: [${full.map((p) => `\n      '${esc(p)}'`).join(',')},
    ],
    applications: [${it.applications.map((a) => `\n      '${esc(a)}'`).join(',')},
    ],
    images: [${images.map((p) => `\n      '${p}'`).join(',')},
    ],${pdfPath ? `\n    docPdf: '${pdfPath}',` : ''}${it.docUrl ? `\n    docUrl: '${esc(it.docUrl)}',` : ''}
    kw: ['dao an toan', 'martor', '${esc(slugify(it.name).replace(/-/g, ' '))}'],
  },`)
}

writeFileSync('scripts/martor-products.ts.txt', lines.join('\n') + '\n', 'utf8')

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`ảnh: ${mb(totalBefore)} MB -> ${mb(totalAfter)} MB`)
console.log(`đã ghi scripts/martor-products.ts.txt (${items.length} sản phẩm)`)
