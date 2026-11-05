/**
 * Nội dung admin sửa được — phía máy chủ.
 *
 * Web đọc bảng noi_dung, đè lên từ điển mặc định trong mã (lib/i18n) rồi đưa
 * cho component như một từ điển bình thường. Bảng rỗng hoặc chưa tạo thì web
 * chạy y như trước — không chỗ nào hỏng.
 */
import { cache } from 'react'
import { fileUrl, rest } from '@/lib/db'
import { dict, type Dictionary, type Locale } from '@/lib/i18n'
import { apDungGhiDe, datTheoDuong, gopGhiDe, layTheoDuong, type GhiDe } from './ghep'
import { soQuocTe, soTel, timKhoi, type Khoi, type Truong } from './khoi'

export interface DuLieuKhoi {
  vi?: GhiDe
  en?: GhiDe
  chung?: Record<string, unknown>
}

export interface DongNoiDung {
  khoa: string
  du_lieu: DuLieuKhoi
  updated_at?: string
}

/**
 * Toàn bộ bảng, một lần cho mỗi yêu cầu. `moi` = bỏ qua bộ đệm (trang quản
 * trị phải thấy ngay thứ vừa lưu).
 */
export const layTatCa = cache(async (moi = false): Promise<DongNoiDung[]> => {
  try {
    return await rest<DongNoiDung[]>('noi_dung?select=khoa,du_lieu,updated_at', moi ? { revalidate: 0 } : undefined)
  } catch {
    // Chưa chạy migration 0022, hoặc Supabase tạm lỗi: web dùng chữ trong mã.
    return []
  }
})

export async function ghiDeCho(lang: Locale, moi = false): Promise<GhiDe> {
  const rows = await layTatCa(moi)
  return gopGhiDe(rows.map((r) => (r.du_lieu?.[lang] ?? {}) as GhiDe))
}

/** Từ điển đã đè nội dung admin sửa. Dùng thay dict(lang) ở Server Component. */
export async function tuDien(lang: Locale, moi = false): Promise<Dictionary> {
  return apDungGhiDe(dict(lang), await ghiDeCho(lang, moi))
}

/** Phần `chung` (ảnh, số, đường dẫn) của một khối. */
export async function layChung(khoa: string, moi = false): Promise<Record<string, unknown>> {
  const rows = await layTatCa(moi)
  return rows.find((r) => r.khoa === khoa)?.du_lieu?.chung ?? {}
}

/** Mặc định của một ô chung, lấy từ bảng khối. */
export function macDinhChung(truong: Truong, i = 0): string {
  const m = truong.macDinhChung
  return typeof m === 'function' ? m(i) : (m ?? '')
}

/** Một ô chung của một khối, có mặc định. Ví dụ layChungO('trang-chu.dau-trang', 'soNam'). */
export async function layChungO(khoa: string, duong: string, moi = false): Promise<string> {
  const v = (await layChung(khoa, moi))[duong]
  if (typeof v === 'string' && v.trim()) return v.trim()
  const tr = timKhoi(khoa)?.truong.find((t) => t.duong === duong)
  return tr ? macDinhChung(tr) : ''
}

/** Đường dẫn ảnh: bắt đầu bằng "/" là file trong public/, còn lại là kho Supabase. */
export const duongAnh = (p: string | null | undefined): string | undefined =>
  !p ? undefined : p.startsWith('/') ? p : fileUrl(p)

/** Giờ lưu gần nhất của một khối, để màn hình quản trị hiện "Lưu lúc …". */
export async function luuLuc(khoa: string): Promise<string | undefined> {
  return (await layTatCa(true)).find((r) => r.khoa === khoa)?.updated_at
}

// ------------------------------------------------------------- thông tin liên hệ

export interface LienHe {
  hotline: string
  hotlineTel: string
  dienThoai: string
  dienThoaiTel: string
  hotline2: string
  hotline2Tel: string
  email: string
  facebook: string
  youtube: string
  linkedin: string
  shopee: string
}

/** Số điện thoại, email, mạng xã hội — khối 'chung.lien-he', có mặc định. */
export async function lienHe(lang: Locale, moi = false): Promise<LienHe> {
  const khoi = timKhoi('chung.lien-he')!
  const chung = await layChung(khoi.khoa, moi)
  const o = (duong: string) => {
    const v = chung[duong]
    return typeof v === 'string' && v.trim() ? v.trim() : macDinhChung(khoi.truong.find((t) => t.duong === duong)!)
  }
  const so = (duong: string) => (lang === 'en' ? soQuocTe(o(duong)) : o(duong))
  return {
    hotline: so('hotline'), hotlineTel: soTel(o('hotline')),
    dienThoai: so('dienThoai'), dienThoaiTel: soTel(o('dienThoai')),
    hotline2: so('hotline2'), hotline2Tel: soTel(o('hotline2')),
    email: o('email'), facebook: o('facebook'), youtube: o('youtube'), linkedin: o('linkedin'), shopee: o('shopee'),
  }
}

// ------------------------------------------------------- giá trị cho form admin

export type OChu = { vi: string; en: string }
export type ODanhSach = { vi: string[]; en: string[] }
export type Muc = Record<string, OChu | string>
export type GiaTriO = OChu | ODanhSach | string | Muc[]
export type GiaTriKhoi = Record<string, GiaTriO>

const chuoi = (v: unknown): string =>
  typeof v === 'function' ? String(v('{0}', '{1}', '{2}')) : v == null ? '' : String(v)
const mang = (v: unknown): string[] => (Array.isArray(v) ? v.map(chuoi) : [])

/**
 * Giá trị hiện tại của mọi ô trong một khối — thứ admin thấy trong form. Là
 * chữ đang hiện trên web (mặc định trong mã đã đè phần đã sửa), nên form
 * không bao giờ trống.
 */
export async function giaTriKhoi(khoi: Khoi, moi = true): Promise<GiaTriKhoi> {
  const [tVi, tEn, chung] = await Promise.all([tuDien('vi', moi), tuDien('en', moi), layChung(khoi.khoa, moi)])
  const ra: GiaTriKhoi = {}
  for (const tr of khoi.truong) {
    if (tr.kieu === 'nhom') {
      const vi = (layTheoDuong(tVi, tr.duong) as unknown[]) ?? []
      const en = (layTheoDuong(tEn, tr.duong) as unknown[]) ?? []
      const ch = (Array.isArray(chung[tr.duong]) ? chung[tr.duong] : []) as Record<string, unknown>[]
      const n = Math.max(vi.length, en.length)
      ra[tr.duong] = Array.from({ length: n }, (_, i) => {
        const muc: Muc = {}
        for (const c of tr.con ?? []) {
          if (c.chung) muc[c.duong] = chuoi(ch[i]?.[c.duong]) || macDinhChung(c, i)
          else muc[c.duong] = { vi: chuoi(layTheoDuong(vi[i], c.duong)), en: chuoi(layTheoDuong(en[i], c.duong)) }
        }
        return muc
      })
    } else if (tr.chung) {
      ra[tr.duong] = chuoi(chung[tr.duong]) || macDinhChung(tr)
    } else if (tr.kieu === 'danh-sach') {
      ra[tr.duong] = { vi: mang(layTheoDuong(tVi, tr.duong)), en: mang(layTheoDuong(tEn, tr.duong)) }
    } else {
      ra[tr.duong] = { vi: chuoi(layTheoDuong(tVi, tr.duong)), en: chuoi(layTheoDuong(tEn, tr.duong)) }
    }
  }
  return ra
}

/**
 * Ngược lại: từ form thành du_lieu {vi, en, chung} để lưu. EN bỏ trống thì
 * chép tiếng Việt sang (quyết định 05/11: EN trống → web hiện tiếng Việt).
 */
export function tachDuLieu(khoi: Khoi, giaTri: GiaTriKhoi): DuLieuKhoi {
  const vi: GhiDe = {}
  const en: GhiDe = {}
  const chung: Record<string, unknown> = {}
  const chu = (o: OChu) => ({ vi: o.vi.trim(), en: o.en.trim() || o.vi.trim() })
  for (const tr of khoi.truong) {
    const g = giaTri[tr.duong]
    if (g === undefined) continue
    if (tr.kieu === 'nhom') {
      const mucs = (g as Muc[]) ?? []
      const vMuc: Record<string, string>[] = []
      const eMuc: Record<string, string>[] = []
      const cMuc: Record<string, string>[] = []
      for (const m of mucs) {
        const v: Record<string, string> = {}
        const e: Record<string, string> = {}
        const c: Record<string, string> = {}
        for (const con of tr.con ?? []) {
          if (con.chung) c[con.duong] = String(m[con.duong] ?? '')
          else {
            const o = chu(m[con.duong] as OChu)
            v[con.duong] = o.vi
            e[con.duong] = o.en
          }
        }
        vMuc.push(v); eMuc.push(e); cMuc.push(c)
      }
      datTheoDuong(vi, tr.duong, vMuc)
      datTheoDuong(en, tr.duong, eMuc)
      chung[tr.duong] = cMuc
    } else if (tr.chung) {
      chung[tr.duong] = String(g).trim()
    } else if (tr.kieu === 'danh-sach') {
      const d = g as ODanhSach
      const vL = d.vi.map((x) => x.trim()).filter(Boolean)
      const eL = d.en.map((x) => x.trim())
      datTheoDuong(vi, tr.duong, vL)
      datTheoDuong(en, tr.duong, vL.map((x, i) => eL[i]?.trim() || x))
    } else {
      const o = chu(g as OChu)
      datTheoDuong(vi, tr.duong, o.vi)
      datTheoDuong(en, tr.duong, o.en)
    }
  }
  return { vi, en, chung }
}
