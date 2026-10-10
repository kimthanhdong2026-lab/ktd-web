// Giới hạn của form báo giá, dùng chung cho trình duyệt và máy chủ.
//
// Hai nơi phải kiểm cùng một bộ số: trình duyệt kiểm để báo lỗi ngay lúc khách
// chọn tệp, máy chủ kiểm lại vì yêu cầu gửi thẳng vào /api/rfq không đi qua
// form. Để lệch nhau thì khách chọn được tệp rồi mới bị từ chối lúc gửi.

/** Số tệp đính kèm tối đa cho một yêu cầu — BGĐ chốt ngày 10/10/2026. */
export const RFQ_MAX_FILES = 5

/** Dung lượng tối đa mỗi tệp: 3 MB — BGĐ chốt ngày 10/10/2026. */
export const RFQ_MAX_FILE_BYTES = 3 * 1024 * 1024

/** Bucket riêng tư trong Supabase Storage, tạo ở migration 0018. */
export const RFQ_BUCKET = 'rfq'

/**
 * Đuôi tệp được nhận và kiểu nội dung tương ứng: Word, Excel, PDF và ảnh
 * (mục BG04 của "Sửa web 5").
 *
 * Tra theo ĐUÔI chứ không tin `file.type` của trình duyệt: Windows không cài
 * Office trả kiểu rỗng cho .docx, và một số máy trả application/octet-stream.
 */
export const RFQ_FILE_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

/** Chuỗi cho thuộc tính accept của ô chọn tệp. */
export const RFQ_ACCEPT = Object.keys(RFQ_FILE_TYPES)
  .map((e) => `.${e}`)
  .join(',')

export const fileExt = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export const RFQ_MAX_QTY = 99999

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export type RfqKind = 'quote' | 'find'

export interface RfqItem {
  part: string
  name?: string
  brand?: string
  qty: number
}

export interface RfqFile {
  /** Đường dẫn trong bucket, do /api/rfq/upload cấp. */
  path: string
  /** Tên gốc khách đặt, dùng làm tên tệp đính kèm trong email. */
  name: string
}

export interface RfqPayload {
  kind: RfqKind
  lang: string
  name: string
  company: string
  phone: string
  email: string
  note: string
  items: RfqItem[]
  files: RfqFile[]
  /** Ô bẫy: người thật không thấy nên để trống, máy gửi rác thường điền. */
  website?: string
}

/** Mã lỗi máy chủ trả về; form dịch sang câu cho khách. */
export type RfqError =
  | 'invalid'
  | 'not-configured'
  | 'file-type'
  | 'file-size'
  | 'file-count'
  | 'upload-failed'
  | 'send-failed'
