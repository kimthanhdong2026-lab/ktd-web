'use server'

/** Bài viết: thêm, sửa, ẩn/hiện, xóa, Hoàn tác — bảng bai_viet (migration 0023). */
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { THE_DU_LIEU } from '@/lib/db'
import { nguoiDung, supabaseServer } from '@/lib/supabase/server'
import { CHUYEN_MUC, type MaChuyenMuc } from '@/lib/tin-tuc'
import { slugify } from '@/lib/utils'

export type KetQua = { ok: true; thongBao?: string } | { ok: false; loi: string }
const loiCua = (e: unknown) => (e instanceof Error ? e.message : String(e))

async function batBuocDangNhap() {
  const u = await nguoiDung()
  if (!u) throw new Error('Chưa đăng nhập')
}
function lamTuoi() {
  revalidateTag(THE_DU_LIEU)
  revalidatePath('/', 'layout')
}
const gioVN = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

export interface DuLieuBaiViet {
  cat: MaChuyenMuc
  /** yyyy-mm-dd */
  ngay: string
  title_vi: string
  title_en: string
  excerpt_vi: string
  excerpt_en: string
  body_vi: string[]
  body_en: string[]
  image: string
  visible: boolean
}

const COT = 'cat,ngay,title_vi,title_en,excerpt_vi,excerpt_en,body_vi,body_en,image,visible'

export async function luuBaiViet(slug: string, d: DuLieuBaiViet): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    if (!d.title_vi.trim()) return { ok: false, loi: 'Cần tiêu đề.' }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.ngay)) return { ok: false, loi: 'Ngày không hợp lệ.' }
    const sb = supabaseServer()
    const { data: cu } = await sb.from('bai_viet').select(COT).eq('slug', slug).maybeSingle()
    if (cu) await sb.from('noi_dung_lich_su').insert({ khoa: `bai.${slug}`, du_lieu: cu })
    const vi = d.body_vi.map((x) => x.trim()).filter(Boolean)
    const en = vi.map((x, i) => (d.body_en[i] ?? '').trim() || x)
    const { error } = await sb
      .from('bai_viet')
      .update({
        cat: CHUYEN_MUC.includes(d.cat) ? d.cat : 'tin-tuc',
        ngay: d.ngay,
        title_vi: d.title_vi.trim(),
        title_en: d.title_en.trim() || null,
        excerpt_vi: d.excerpt_vi.trim(),
        excerpt_en: d.excerpt_en.trim() || null,
        body_vi: vi,
        body_en: d.body_en.some((x) => x.trim()) ? en : null,
        image: d.image.trim() || null,
        visible: d.visible,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu, web đã cập nhật.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function hoanTacBaiViet(slug: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data: truoc } = await sb
      .from('noi_dung_lich_su')
      .select('id,du_lieu,luu_luc')
      .eq('khoa', `bai.${slug}`)
      .order('luu_luc', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!truoc) return { ok: false, loi: 'Không còn bản trước để quay về.' }
    const { error } = await sb.from('bai_viet').update({ ...truoc.du_lieu, updated_at: new Date().toISOString() }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    await sb.from('noi_dung_lich_su').delete().eq('id', truoc.id)
    lamTuoi()
    return { ok: true, thongBao: `Đã quay về bản lưu lúc ${gioVN(truoc.luu_luc)}.` }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Thêm bài: tiêu đề, chuyên mục, ngày. Tạo xong vào trang sửa; bài mới ở trạng thái ẨN. */
export async function themBaiViet(_: unknown, formData: FormData): Promise<{ loi?: string }> {
  try {
    await batBuocDangNhap()
    const title = String(formData.get('title') ?? '').trim()
    const cat = String(formData.get('cat') ?? 'tin-tuc')
    const ngay = String(formData.get('ngay') ?? '').trim() || new Date().toISOString().slice(0, 10)
    if (!title) return { loi: 'Cần tiêu đề.' }
    const sb = supabaseServer()
    let slug = slugify(title).slice(0, 80)
    const { data: trung } = await sb.from('bai_viet').select('slug').eq('slug', slug).maybeSingle()
    if (trung) slug = `${slug}-${Date.now().toString(36)}`
    const { error } = await sb.from('bai_viet').insert({ slug, cat: CHUYEN_MUC.includes(cat as MaChuyenMuc) ? cat : 'tin-tuc', ngay, title_vi: title, visible: false })
    if (error) return { loi: error.message.includes('does not exist') ? 'Chưa tạo bảng bài viết — chạy file SQL 0023 trước.' : error.message }
    lamTuoi()
    redirect(`/admin/tin-tuc/${slug}`)
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e
    return { loi: loiCua(e) }
  }
}

export async function xoaBaiViet(slug: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('bai_viet').delete().eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function anHienBaiViet(slug: string, visible: boolean): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('bai_viet').update({ visible }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}
