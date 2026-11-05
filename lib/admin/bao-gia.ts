/** Kiểu dữ liệu và hàm thuần cho hộp thư yêu cầu báo giá (bảng yeu_cau_bao_gia). File thuần, dùng cả hai phía. */
import type { RfqFile, RfqItem, RfqKind } from '@/lib/rfq'

export interface YeuCauBaoGia {
  ma: string
  tao_luc: string
  loai: RfqKind
  ngon_ngu: 'vi' | 'en'
  ten: string
  cong_ty: string
  dien_thoai: string
  email: string
  ghi_chu: string
  san_pham: RfqItem[]
  tep: RfqFile[]
  email_da_gui: boolean
  email_loi: string | null
  trang_thai: 'moi' | 'da-xu-ly'
  ghi_chu_noi_bo: string
  xu_ly_luc: string | null
}

export const COT_YEU_CAU = 'ma,tao_luc,loai,ngon_ngu,ten,cong_ty,dien_thoai,email,ghi_chu,san_pham,tep,email_da_gui,email_loi,trang_thai,ghi_chu_noi_bo,xu_ly_luc'

export const tenLoai = (loai: RfqKind) => (loai === 'find' ? 'Tìm hàng' : 'Báo giá')

/** dd/mm/yyyy HH:MM theo giờ Việt Nam. */
export const gioVN = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })

/** Tóm tắt một dòng cho bảng danh sách: "3 sản phẩm · 2 tệp" hoặc đầu ghi chú. */
export function tomTat(y: YeuCauBaoGia): string {
  const phan: string[] = []
  if (y.san_pham.length) phan.push(`${y.san_pham.length} sản phẩm`)
  if (y.tep.length) phan.push(`${y.tep.length} tệp`)
  if (!phan.length && y.ghi_chu) return y.ghi_chu.length > 70 ? `${y.ghi_chu.slice(0, 70)}…` : y.ghi_chu
  return phan.join(' · ') || '(không có nội dung)'
}
