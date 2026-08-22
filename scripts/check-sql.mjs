// Kiểm tra cú pháp các file migration bằng chính bộ phân tích của Postgres,
// biên dịch sang WebAssembly. Không cần cài Postgres, psql hay Docker.
//
// Chỉ bắt lỗi CÚ PHÁP. Không kiểm được tên bảng, tên cột, kiểu dữ liệu hay
// quyền — những thứ đó chỉ lộ ra khi chạy thật trên Supabase.
//
// Chạy: node scripts/check-sql.mjs
import initPg from 'pg-query-emscripten'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'supabase/migrations'

/**
 * File dữ liệu mồi có những câu INSERT dài hàng chục nghìn ký tự làm tràn bộ
 * nhớ của bản WASM. Các dòng VALUES sinh ra từ cùng một khuôn nên chỉ cần
 * kiểm vài dòng đầu là đủ kết luận cả khối.
 */
function rutGon(sql, soDong = 3) {
  const out = []
  let dem = 0
  let trongValues = false
  for (const line of sql.split('\n')) {
    const laDongValue = /^\s{2}\(/.test(line)
    if (laDongValue) {
      if (!trongValues) {
        trongValues = true
        dem = 0
      }
      dem++
      if (dem > soDong) continue
      // Dòng cuối được giữ phải kết thúc bằng dấu phẩy hay không tuỳ câu sau
      out.push(dem === soDong ? line.replace(/,\s*$/, '') : line)
    } else {
      trongValues = false
      out.push(line)
    }
  }
  return out.join('\n')
}

/** Mỗi câu lệnh phải có số dấu nháy đơn chẵn, nếu không là thoát ký tự sai. */
function canDauNhay(sql) {
  return sql
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .reduce((n, l, i) => (l.split("'").length % 2 === 0 ? [...n, i + 1] : n), [])
}

const pg = await initPg()
let hong = 0

for (const f of readdirSync(DIR).filter((x) => x.endsWith('.sql')).sort()) {
  const goc = readFileSync(join(DIR, f), 'utf8')
  const le = canDauNhay(goc)
  if (le.length) {
    hong++
    console.log(`LỖI  ${f}  lẻ dấu nháy đơn ở dòng ${le.slice(0, 5).join(', ')}`)
    continue
  }

  const lon = goc.length > 40_000
  const sql = lon ? rutGon(goc) : goc
  let res
  try {
    res = pg.parse(sql)
  } catch (e) {
    hong++
    console.log(`LỖI  ${f}  bộ phân tích gãy: ${e.message}`)
    continue
  }

  if (res.error) {
    hong++
    const dong = sql.slice(0, res.error.cursorpos).split('\n').length
    console.log(`LỖI  ${f}:${dong}  ${res.error.message}`)
    console.log(`      ${sql.split('\n')[dong - 1]?.trim().slice(0, 90)}`)
  } else {
    const ghiChu = lon ? ' (kiểm mẫu 3 dòng đầu mỗi khối VALUES)' : ''
    console.log(`OK    ${f.padEnd(20)} ${String(res.parse_tree.stmts.length).padStart(3)} câu lệnh${ghiChu}`)
  }
}

console.log(hong ? `\n${hong} file có lỗi` : '\nCú pháp sạch. Vẫn phải chạy thật trên Supabase mới chắc.')
process.exit(hong ? 1 : 0)
