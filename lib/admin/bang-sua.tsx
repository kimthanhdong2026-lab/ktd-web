import { soBanTruoc, type DongDanhMuc } from '@/app/admin/actions'
import { BangSua } from '@/components/admin/BangSua'
import { restCoThe } from '@/lib/db'
import { giaTriKhoi, luuLuc } from '@/lib/noi-dung'
import { timKhoi } from '@/lib/noi-dung/khoi'

/**
 * Bảng sửa cho một khối nội dung (noi_dung), dùng chung cho các màn hình
 * quản trị trang chủ, giới thiệu, liên hệ. Trả về null nếu không có khối.
 */
export async function bangSuaCho(khoa: string | undefined) {
  const khoi = khoa ? timKhoi(khoa) : undefined
  if (!khoa || !khoi) return null
  const [giaTri, luc, soBan] = await Promise.all([giaTriKhoi(khoi, true), luuLuc(khoa), soBanTruoc(khoa)])
  let danhMuc: DongDanhMuc[] | undefined
  if (khoa === 'trang-chu.danh-muc') {
    const rows = await restCoThe<Array<{ slug: string; name_vi: string; name_en: string | null; sub_vi: string; sub_en: string | null; image?: string | null }>>(
      'categories?select=slug,name_vi,name_en,sub_vi,sub_en,image&parent_slug=is.null&visible=eq.true&order=sort_order',
      'categories?select=slug,name_vi,name_en,sub_vi,sub_en&parent_slug=is.null&visible=eq.true&order=sort_order',
      { revalidate: 0 }
    )
    danhMuc = rows.map((r) => ({ slug: r.slug, name_vi: r.name_vi, name_en: r.name_en ?? '', sub_vi: r.sub_vi, sub_en: r.sub_en ?? '', image: r.image ?? '' }))
  }
  return <BangSua key={khoa} khoa={khoa} giaTri={giaTri} luuLuc={luc} soBanTruoc={soBan} danhMuc={danhMuc} />
}

/** Nhãn khung (số, tên) của một khối. */
export function nhanKhoi(khoa: string) {
  const kh = timKhoi(khoa)!
  return { khoa: kh.khoa, so: kh.so, ten: kh.ten }
}
