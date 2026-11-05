/**
 * Đè nội dung admin đã sửa (lưu trong bảng noi_dung) lên từ điển mặc định
 * trong mã. Chạy được cả ở máy chủ lẫn trình duyệt — không nhập gì của Next.
 *
 * Quy tắc:
 *  - Thiếu ô nào thì giữ chữ mặc định trong mã. Bảng rỗng → web y như cũ.
 *  - Mảng: bản sửa thay cả mảng (admin thêm/bớt thẻ được), từng mục vẫn được
 *    ghép với mục mặc định cùng vị trí để không mất ô nào.
 *  - Ô mặc định là HÀM (ví dụ `heading(n)`): bản sửa là chuỗi có chỗ trống
 *    `{0}`, `{1}`… và được bọc lại thành hàm, nên component gọi như cũ.
 */
export type GhiDe = Record<string, unknown>

const laDoiTuong = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export function apDungGhiDe<T>(goc: T, ghiDe: unknown): T {
  if (ghiDe === undefined || ghiDe === null) return goc
  if (typeof goc === 'function') {
    if (typeof ghiDe !== 'string' || !ghiDe.trim()) return goc
    const mau = ghiDe
    return ((...a: unknown[]) => mau.replace(/\{(\d+)\}/g, (_, i) => String(a[Number(i)] ?? ''))) as T
  }
  if (Array.isArray(goc)) {
    if (!Array.isArray(ghiDe)) return goc
    const mauMuc = goc[0]
    return ghiDe.map((x, i) => (laDoiTuong(mauMuc) ? apDungGhiDe(goc[i] ?? mauMuc, x) : x)) as T
  }
  if (laDoiTuong(goc)) {
    if (!laDoiTuong(ghiDe)) return goc
    const ra: Record<string, unknown> = { ...goc }
    for (const k of Object.keys(ghiDe)) {
      ra[k] = k in goc ? apDungGhiDe(goc[k], ghiDe[k]) : ghiDe[k]
    }
    return ra as T
  }
  if (typeof goc === 'string') return (typeof ghiDe === 'string' && ghiDe.trim() ? ghiDe : goc) as T
  return ghiDe as T
}

/** Lấy giá trị theo đường dẫn 'hero.title'. */
export function layTheoDuong(goc: unknown, duong: string): unknown {
  return duong.split('.').reduce<unknown>((o, k) => (laDoiTuong(o) ? o[k] : undefined), goc)
}

/** Ghi giá trị theo đường dẫn, tạo các tầng còn thiếu. Đổi tại chỗ. */
export function datTheoDuong(goc: Record<string, unknown>, duong: string, giaTri: unknown) {
  const phan = duong.split('.')
  let o = goc
  for (const k of phan.slice(0, -1)) {
    if (!laDoiTuong(o[k])) o[k] = {}
    o = o[k] as Record<string, unknown>
  }
  o[phan[phan.length - 1]] = giaTri
}

/** Gộp nhiều bản ghi đè (mỗi khối một bản) thành một. Khối sau đè khối trước. */
export function gopGhiDe(cac: GhiDe[]): GhiDe {
  const ra: GhiDe = {}
  for (const g of cac) {
    for (const [k, v] of Object.entries(g)) {
      ra[k] = laDoiTuong(ra[k]) && laDoiTuong(v) ? gopGhiDe([ra[k] as GhiDe, v as GhiDe]) : v
    }
  }
  return ra
}
