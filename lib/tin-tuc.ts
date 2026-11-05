/**
 * Bài viết (Tin tức & Kiến thức) — đọc từ bảng bai_viet (migration 0023).
 *
 * Chưa chạy 0023 thì lùi về ba bài mẫu trong lib/ktd-data.ts, nên đẩy mã
 * trước hay chạy SQL trước đều không làm web sập.
 */
import { fileUrl, rest } from '@/lib/db'
import type { Locale } from '@/lib/i18n'
import { NEWS, NEWS_CATEGORIES, NEWS_CATEGORIES_EN } from '@/lib/ktd-data'

export type MaChuyenMuc = 'kien-thuc' | 'tin-tuc'
export const CHUYEN_MUC: MaChuyenMuc[] = ['kien-thuc', 'tin-tuc']

export interface BaiViet {
  slug: string
  /** Mã chuyên mục. */
  cat: MaChuyenMuc
  /** Tên chuyên mục theo ngôn ngữ. */
  catLabel: string
  /** dd/mm/yyyy */
  date: string
  /** yyyy-mm-dd, để sắp xếp và cho ô nhập ngày. */
  ngay: string
  title: string
  excerpt: string
  /** Thân bài theo đoạn; trống thì trang hiện câu giữ chỗ. */
  body: string[]
  /** URL ảnh 16:9. */
  image?: string
  visible: boolean
}

interface Dong {
  slug: string
  cat: MaChuyenMuc
  ngay: string
  title_vi: string
  title_en: string | null
  excerpt_vi: string
  excerpt_en: string | null
  body_vi: string[] | null
  body_en: string[] | null
  image: string | null
  visible: boolean
}

export const tenChuyenMuc = (cat: MaChuyenMuc, lang: Locale) =>
  (lang === 'en' ? NEWS_CATEGORIES_EN : NEWS_CATEGORIES)[cat === 'kien-thuc' ? 0 : 1]

const ddmmyyyy = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

const pick = <T>(en: T | null | undefined, vi: T, lang: Locale): T =>
  lang === 'en' && en !== null && en !== undefined && (!Array.isArray(en) || en.length > 0) ? en : vi

const tuDong = (r: Dong, lang: Locale): BaiViet => ({
  slug: r.slug,
  cat: r.cat,
  catLabel: tenChuyenMuc(r.cat, lang),
  date: ddmmyyyy(r.ngay),
  ngay: r.ngay.slice(0, 10),
  title: pick(r.title_en, r.title_vi, lang),
  excerpt: pick(r.excerpt_en, r.excerpt_vi, lang),
  body: pick(r.body_en, r.body_vi ?? [], lang),
  image: fileUrl(r.image),
  visible: r.visible,
})

/** Ba bài mẫu trong mã, cùng khuôn với bảng. */
function baiMau(lang: Locale): BaiViet[] {
  return NEWS.map((n) => {
    const [d, m, y] = n.date.split('/')
    const cat: MaChuyenMuc = n.cat === NEWS_CATEGORIES[0] ? 'kien-thuc' : 'tin-tuc'
    return {
      slug: n.slug, cat, catLabel: tenChuyenMuc(cat, lang), date: n.date, ngay: `${y}-${m}-${d}`,
      title: lang === 'en' ? n.titleEn : n.title, excerpt: lang === 'en' ? n.excerptEn : n.excerpt,
      body: [], visible: true,
    }
  })
}

const COT = 'slug,cat,ngay,title_vi,title_en,excerpt_vi,excerpt_en,body_vi,body_en,image,visible'

/** Danh sách bài, mới nhất trước. `caAn` cho trang quản trị. */
export async function layBaiViet(lang: Locale, tuyChon: { moi?: boolean; caAn?: boolean } = {}): Promise<BaiViet[]> {
  try {
    const rows = await rest<Dong[]>(
      `bai_viet?select=${COT}${tuyChon.caAn ? '' : '&visible=eq.true'}&order=ngay.desc,created_at.desc`,
      tuyChon.moi ? { revalidate: 0 } : undefined
    )
    return rows.map((r) => tuDong(r, lang))
  } catch {
    return baiMau(lang)
  }
}

export async function layBai(slug: string, lang: Locale, tuyChon: { moi?: boolean } = {}): Promise<BaiViet | undefined> {
  try {
    const rows = await rest<Dong[]>(`bai_viet?select=${COT}&slug=eq.${encodeURIComponent(slug)}&limit=1`, tuyChon.moi ? { revalidate: 0 } : undefined)
    return rows[0] ? tuDong(rows[0], lang) : undefined
  } catch {
    return baiMau(lang).find((b) => b.slug === slug)
  }
}
