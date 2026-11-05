/**
 * Đọc file Excel mẫu nhập sản phẩm của KTD (MAU-NHAP-SAN-PHAM-KTD) thành bản
 * ghi cho bảng products — bản TypeScript của scripts/nap_san_pham.py, để admin
 * tự nạp từ trang quản trị mà không cần bên kỹ thuật.
 *
 * Các quy tắc chuyển đổi theo câu trả lời của team ở file câu hỏi vòng 2:
 *   B1  ô có nhiều mã: mã đầu (hoặc mã sau "Mã chính:") là mã chính; các mã
 *       còn lại vào bảng thông số ("Các mã cùng dòng") và từ khóa tìm kiếm.
 *   B3  mã đã có trên web: ghi đè nội dung, GIỮ NGUYÊN slug và ảnh đang có.
 *   Phần C: ô ƯU TIÊN không phải số -> trống; link hãng không bắt đầu bằng
 *       http -> bỏ; ứng dụng / thông số ngăn bằng ";" -> tách dòng.
 *
 * Ảnh KHÔNG nạp ở đây (ảnh nằm trên Drive, kích thước lớn): admin tải ảnh ở
 * trang sửa từng sản phẩm. Tiếng Anh: file chỉ có tiếng Việt, trừ ô có sẵn
 * khối "EN:" của hãng; sản phẩm mới ở trạng thái en_status 'trống'.
 */
import * as XLSX from 'xlsx'
import { slugify } from '@/lib/utils'

export interface BanGhiNap {
  part: string
  slug: string
  brand_slug: string
  category_slug: string
  name_vi: string
  series: string | null
  origin_vi: string | null
  desc_vi: string
  highlights_vi: string[]
  desc_full_vi: string[]
  desc_full_en: string[] | null
  applications_vi: string[]
  applications_en: string[] | null
  specs_vi: { label: string; value: string }[]
  keywords: string[]
  doc_url: string | null
  priority: number | null
}

export interface DongKiem {
  /** Số dòng trong Excel (1 = tiêu đề). */
  dong: number
  part: string
  ten: string
  trangThai: 'THÊM MỚI' | 'GHI ĐÈ' | 'GHI ĐÈ (đổi hãng)'
  /** File có cột "MÔ TẢ NGẮN" và ô này có chữ: dùng làm câu ngắn trên thẻ. Không có thì
      ghi đè GIỮ câu ngắn đang có trên web (bên kỹ thuật/admin đã viết tay). */
  coMoTaNgan: boolean
  loi: string[]
  canh: string[]
  ban: BanGhiNap
}

export interface KetQuaKiem {
  sheet: string
  hang: string
  dong: DongKiem[]
  /** Mã của hãng đang có trên web mà không có trong file (B5 — xóa dần theo hãng, admin chọn). */
  khongCoTrongFile: string[]
}

export interface NguCanh {
  /** tên nhóm nhỏ (chữ thường) -> slug */
  nhomNho: Map<string, string>
  /** mã hàng -> thông tin đang có trên web */
  web: Map<string, { slug: string; brand_slug: string }>
  /** tên hãng / slug (chữ thường) -> slug hãng */
  hang: Map<string, string>
}

// ----------------------------------------------------------------- tiện ích

const chu = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim())

/** Tách một ô thành các dòng: theo xuống dòng; nếu chỉ một dòng thì theo ";". */
function dong(s: unknown): string[] {
  const t = chu(s)
  if (!t) return []
  let parts = t.split('\n').map((x) => x.replace(/^[\s\-•\t]+|[\s\-•\t]+$/g, '')).filter(Boolean)
  if (parts.length === 1 && parts[0].includes(';')) parts = parts[0].split(';').map((x) => x.trim()).filter(Boolean)
  return parts
}

const doan = (s: unknown) => chu(s).split('\n').map((x) => x.trim()).filter(Boolean)

/** Câu đầu của mô tả đầy đủ, dưới 160 ký tự — chỉ dùng khi chưa có câu ngắn riêng. */
function cauDau(paras: string[], toiDa = 160): string {
  if (!paras.length) return ''
  const c = paras[0].split(/(?<=[.!?])\s/)[0].trim()
  if (c.length <= toiDa) return c
  const cat = c.slice(0, toiDa)
  return cat.slice(0, cat.lastIndexOf(' ')).replace(/[,;:]+$/, '') + '…'
}

/** Ô ỨNG DỤNG có cả khối "VI:" và "EN:" -> [vi, en]; ô thường -> [ds, null]. */
function tachViEn(ds: string[]): [string[], string[] | null] {
  const nhan = ds.map((x) => x.replace(/:$/, '').trim().toUpperCase())
  if (!nhan.includes('VI') || !nhan.includes('EN')) return [ds, null]
  const vi: string[] = [], en: string[] = []
  let dang: 'VI' | 'EN' | null = null
  ds.forEach((x, i) => {
    if (nhan[i] === 'VI' || nhan[i] === 'EN') dang = nhan[i] as 'VI' | 'EN'
    else (dang === 'EN' ? en : vi).push(x)
  })
  return [vi, en]
}

const VIET = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i

/** Mô tả dán nguyên từ trang bán hàng: khối 🇻🇳 tiếng Việt, khối 🇬🇧 tiếng Anh, cuối là đoạn bán hàng. */
function tachCo(paras: string[]): [string[], string[] | null] {
  const vt = paras.findIndex((x) => x.startsWith('🇻🇳'))
  const gb = paras.findIndex((x) => x.startsWith('🇬🇧'))
  if (vt < 0 || gb < 0 || vt > gb) return [paras, null]
  const vi = paras.slice(vt + 1, gb)
  let en = paras.slice(gb + 1)
  const i = en.findIndex((x) => VIET.test(x))
  if (i >= 0) en = en.slice(0, i)
  return [vi, en]
}

/** Ô MÃ HÀNG -> [mã chính, các mã biến thể]. */
export function tachMa(o: unknown): [string, string[]] {
  const s = chu(o).replace(/^\*+/, '').trim()
  // Bộ mũi mài Morrisflex: "MORFLX-BK-5X6MM-6" rồi danh sách mũi (có khi dính liền)
  const bo = s.match(/^(MORL?FLX-[A-Z]{2}-\d+X\d+MM-\d)/)
  if (bo) {
    const cac: string[] = []
    for (const t of s.slice(bo[0].length).match(/K[A-Z]\d{5}\s*-\s*\d/g) ?? []) {
      const u = t.replace(/\s/g, '')
      if (!cac.includes(u)) cac.push(u)
    }
    return [bo[1], cac]
  }
  const m = s.match(/Mã (?:chính|đại diện)\s*:\s*([^\s–,;]+)/)
  if (m) {
    const chinh = m[1].replace(/\.$/, '')
    const cac: string[] = []
    for (const t of s.match(/[A-Z]{2}\d{5}-(?:NG)?\d+(?:-\d+)?(?:\s+DIN)?(?:\s+ACC)?/g) ?? []) {
      const u = t.trim()
      if (u !== chinh && !cac.includes(u)) cac.push(u)
    }
    return [chinh, cac]
  }
  if (/[,;\n]| \/ /.test(s)) {
    const toks = s.split(/[,;\n]| \/ /).map((t) => t.trim().replace(/^\*+/, '')).filter(Boolean)
    return [toks[0], toks.slice(1)]
  }
  return [s, []]
}

/** Hết câu: dấu chấm sau chữ thường / số / ° / ), rồi chữ hoa. Không cắt "12.7" hay "O.A.L". */
const HET_CAU = /(?<=[a-zà-ỹ0-9°)%])\.\s*(?=[A-ZĐÀ-Ỹ])/

/** Ô THÔNG SỐ -> [{label, value}]. Mẩu không nhãn gom vào "Đặc điểm khác". */
export function thongSo(o: unknown, canh: string[]): { label: string; value: string }[] {
  const s = chu(o)
  let manh: string[]
  if (s.includes('\n')) manh = dong(s)
  else if (HET_CAU.test(s)) manh = s.split(HET_CAU).map((x) => x.trim()).filter(Boolean)
  else manh = s.split(';').map((x) => x.trim()).filter(Boolean)
  const ra: { label: string; value: string }[] = []
  const le: string[] = []
  for (let d of manh) {
    d = d.replace(/\.+$/, '').trim()
    if (d.includes(':')) {
      const i = d.indexOf(':')
      ra.push({ label: d.slice(0, i).trim(), value: d.slice(i + 1).trim() })
    } else le.push(d)
  }
  if (le.length) {
    if (ra.length) ra.push({ label: 'Đặc điểm khác', value: le.join('; ') })
    else {
      ra.push({ label: '', value: le.join('; ') })
      canh.push(`Thông số không có dấu ":" — hiện thành một dòng không nhãn: "${le[0].slice(0, 50)}"`)
    }
  }
  for (const t of ra) t.label = t.label.charAt(0).toUpperCase() + t.label.slice(1)
  return ra
}

/** Bỏ dòng ví dụ và dòng hướng dẫn chọn của mẫu. */
const laDongSanPham = (r: unknown[]) =>
  Boolean(chu(r[3])) && chu(r[0]) !== '(ví dụ)' && !['Chọn từ danh sách', 'THƯƠNG HIỆU *'].includes(chu(r[1]))

// ----------------------------------------------------------------- đọc file

export function cacSheet(buf: ArrayBuffer): { ten: string; soDong: number }[] {
  const wb = XLSX.read(buf, { type: 'array' })
  return wb.SheetNames.map((ten) => {
    const ws = wb.Sheets[ten]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null })
    const hdr = (rows[0] ?? []).map((h) => chu(h).toUpperCase())
    const laMau = hdr.some((h) => h.startsWith('MÃ HÀNG')) && hdr.some((h) => h.startsWith('TÊN SẢN PHẨM'))
    const soDong = laMau ? rows.slice(1).filter((r) => laDongSanPham(r)).length : 0
    return { ten, soDong }
  })
}

/** Hãng của một sheet: tên sheet trùng tên hãng / slug, hoặc cột THƯƠNG HIỆU ở dòng đầu có dữ liệu. */
export function hangCuaSheet(buf: ArrayBuffer, sheet: string, ctx: NguCanh): string | null {
  const t = sheet.trim().toLowerCase()
  if (ctx.hang.has(t)) return ctx.hang.get(t)!
  const ws = XLSX.read(buf, { type: 'array' }).Sheets[sheet]
  if (!ws) return null
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null })
  for (const r of rows.slice(1)) {
    const h = chu(r[1]).toLowerCase()
    if (h && ctx.hang.has(h)) return ctx.hang.get(h)!
  }
  return null
}

export function kiemSheet(buf: ArrayBuffer, sheet: string, hang: string, ctx: NguCanh): KetQuaKiem {
  const ws = XLSX.read(buf, { type: 'array' }).Sheets[sheet]
  if (!ws) throw new Error(`Không có sheet "${sheet}"`)
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null })
  const hdr = (rows[0] ?? []).map((h) => chu(h).toUpperCase())
  const cot = (...ten: string[]) => {
    for (const t of ten) {
      const j = hdr.findIndex((h) => h.startsWith(t))
      if (j >= 0) return j
    }
    return -1
  }
  const C = {
    ten: cot('TÊN SẢN PHẨM'), ma: cot('MÃ HÀNG'), series: cot('DÒNG SẢN PHẨM'), xx: cot('XUẤT XỨ'),
    nb: 7, full: cot('MÔ TẢ ĐẦY ĐỦ'), ud: cot('ỨNG DỤNG'), ts: cot('THÔNG SỐ'), tk: cot('TỪ KHÓA'),
    link: cot('LINK TRANG HÃNG'), ut: cot('ƯU TIÊN'), nho: cot('NHÓM NHỎ'),
    ngan: cot('MÔ TẢ NGẮN'),
  }
  if (C.ten < 0 || C.ma < 0) throw new Error(`Sheet "${sheet}" không đúng mẫu (thiếu cột TÊN SẢN PHẨM / MÃ HÀNG).`)

  const ra: DongKiem[] = []
  const dem = new Map<string, number>()
  rows.slice(1).forEach((r, k) => {
    const idx = k + 2
    const g = (c: number) => (c >= 0 && c < r.length ? r[c] : null)
    const ten = chu(g(C.ten))
    if (!ten || !laDongSanPham(r)) return
    const loi: string[] = [], canh: string[] = []
    const [ma, bienThe] = tachMa(g(C.ma))
    if (!ma) loi.push('Thiếu mã hàng')
    if (typeof g(C.ma) === 'number') canh.push('Mã hàng ở dạng số trong Excel — kiểm lại số 0 đầu/cuối')
    if (ten.length > 60) canh.push(`Tên dài ${ten.length} ký tự (khuyến nghị ≤ 60)`)
    const nho = ctx.nhomNho.get(chu(g(C.nho)).toLowerCase())
    if (!nho) loi.push(`Nhóm nhỏ "${chu(g(C.nho))}" không có trên web`)
    const [full, fullEn] = tachCo(doan(g(C.full)))
    if (!full.length) loi.push('Thiếu mô tả đầy đủ')
    const noiBat = dong(g(C.nb))
    const [ud, udEn] = tachViEn(dong(g(C.ud)))
    const ts = thongSo(g(C.ts), canh)
    if (bienThe.length) {
      ts.push(ma.startsWith('MOR')
        ? { label: 'Các mũi trong bộ', value: bienThe.join(', ') }
        : { label: 'Các mã cùng dòng', value: [ma, ...bienThe].join(', ') })
    }
    const tk = chu(g(C.tk)).split(/[,;\n]/).map((x) => x.trim()).filter(Boolean)
    for (const b of bienThe) if (!tk.includes(b)) tk.push(b)
    let link = chu(g(C.link))
    if (link && !/^https?:/i.test(link)) {
      canh.push(`Link hãng không phải đường dẫn, bỏ qua: "${link.slice(0, 40)}"`)
      link = ''
    }
    const ut = chu(g(C.ut))
    const uuTien = /^\d+(\.0)?$/.test(ut) ? Math.trunc(Number(ut)) : null

    const cu = ctx.web.get(ma)
    let trangThai: DongKiem['trangThai'] = cu ? 'GHI ĐÈ' : 'THÊM MỚI'
    if (cu && cu.brand_slug !== hang) {
      trangThai = 'GHI ĐÈ (đổi hãng)'
      canh.push(`Mã đang ở hãng "${cu.brand_slug}" trên web — sẽ chuyển sang hãng này`)
    }
    const slug = cu && cu.brand_slug === hang ? cu.slug : slugify(`${ten} ${ma}`)
    dem.set(ma, (dem.get(ma) ?? 0) + 1)

    const moTaNgan = chu(g(C.ngan))
    if (moTaNgan.length > 200) canh.push(`Mô tả ngắn dài ${moTaNgan.length} ký tự (nên ≤ 160)`)
    ra.push({
      dong: idx, part: ma, ten, trangThai, coMoTaNgan: Boolean(moTaNgan), loi, canh,
      ban: {
        part: ma, slug, brand_slug: hang, category_slug: nho ?? '', name_vi: ten,
        series: chu(g(C.series)) || null, origin_vi: chu(g(C.xx)) || null,
        desc_vi: moTaNgan || cauDau(full), highlights_vi: noiBat,
        desc_full_vi: full, desc_full_en: fullEn, applications_vi: ud, applications_en: udEn,
        specs_vi: ts, keywords: tk, doc_url: link || null, priority: uuTien,
      },
    })
  })
  for (const d of ra) if ((dem.get(d.part) ?? 0) > 1) d.loi.push('Mã bị trùng trong sheet')

  const maTrongFile = new Set(ra.map((d) => d.part))
  const khongCoTrongFile = [...ctx.web.entries()].filter(([p, v]) => v.brand_slug === hang && !maTrongFile.has(p)).map(([p]) => p)
  return { sheet, hang, dong: ra, khongCoTrongFile }
}
