'use server'

/** Hộp thư yêu cầu báo giá: đánh dấu đã xử lý, ghi chú nội bộ, xóa — bảng yeu_cau_bao_gia (migration 0024). */
import { revalidatePath } from 'next/cache'
import { RFQ_BUCKET, type RfqFile } from '@/lib/rfq'
import { nguoiDung, supabaseServer } from '@/lib/supabase/server'

export type KetQua = { ok: true; thongBao?: string } | { ok: false; loi: string }
const loiCua = (e: unknown) => (e instanceof Error ? e.message : String(e))

async function batBuocDangNhap() {
  const u = await nguoiDung()
  if (!u) throw new Error('Chưa đăng nhập')
}

export type TrangThaiYeuCau = 'moi' | 'da-xu-ly'

export async function doiTrangThaiYeuCau(ma: string, trangThai: TrangThaiYeuCau): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer()
      .from('yeu_cau_bao_gia')
      .update({ trang_thai: trangThai, xu_ly_luc: trangThai === 'da-xu-ly' ? new Date().toISOString() : null })
      .eq('ma', ma)
    if (error) return { ok: false, loi: error.message }
    revalidatePath('/admin/bao-gia', 'layout')
    return { ok: true, thongBao: trangThai === 'da-xu-ly' ? 'Đã đánh dấu xử lý xong.' : 'Đã chuyển lại thành Mới.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function luuGhiChuNoiBo(ma: string, ghiChu: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('yeu_cau_bao_gia').update({ ghi_chu_noi_bo: ghiChu.trim().slice(0, 4000) }).eq('ma', ma)
    if (error) return { ok: false, loi: error.message }
    revalidatePath('/admin/bao-gia', 'layout')
    return { ok: true, thongBao: 'Đã lưu ghi chú.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Xóa hẳn yêu cầu cùng tệp đính kèm trong kho. Trang gọi phải hỏi lại trước. */
export async function xoaYeuCau(ma: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data } = await sb.from('yeu_cau_bao_gia').select('tep').eq('ma', ma).maybeSingle()
    const tep = (Array.isArray(data?.tep) ? data.tep : []) as RfqFile[]
    if (tep.length) await sb.storage.from(RFQ_BUCKET).remove(tep.map((t) => t.path))
    const { error } = await sb.from('yeu_cau_bao_gia').delete().eq('ma', ma)
    if (error) return { ok: false, loi: error.message }
    revalidatePath('/admin/bao-gia', 'layout')
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}
