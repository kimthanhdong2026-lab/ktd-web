// Kim Thành Đông — kiểu dữ liệu và cấu hình tĩnh.
//
// Thương hiệu, danh mục và sản phẩm KHÔNG còn ở đây: nguồn sự thật duy nhất là
// Supabase, đọc qua lib/db.ts. Bản chép tĩnh dùng để sinh file seed nằm ở
// lib/seed-data.ts và chỉ script scripts/gen-seed-sql.ts được đụng vào.
//
// Còn lại ở file này là những thứ không thuộc về cơ sở dữ liệu: bài viết, bảng
// tiếng lóng ngoài xưởng, ánh xạ ngành theo danh mục.

import { slugify } from './utils'

export interface Brand {
  slug: string
  name: string
  origin: string
  desc: string
  /** URL đầy đủ tới kho file. Không có thì trang hiện tên hãng bằng chữ. */
  logo?: string
}

export interface Category {
  slug: string
  name: string
  /** Dòng chữ nhỏ liệt kê nhóm thiết bị — thay cho số đếm sản phẩm. */
  sub: string
  /** Có nằm trong bộ lọc rút gọn và cột Danh mục ở chân trang không. */
  featured?: boolean
}

export interface Product {
  part: string
  /** Đường dẫn lưu trong cơ sở dữ liệu, KHÔNG suy ra từ tên lúc chạy. */
  slug: string
  /** Tên hãng và tên nhóm để hiển thị, lấy kèm khi truy vấn nên component
      không phải tự tra bảng khác. */
  brandLabel: string
  categoryLabel: string
  name: string
  brand: string
  category: string
  sub?: string
  series: string
  origin: string
  featured?: boolean
  tag?: 'Mới' | 'Bán chạy'
  /** Câu giới thiệu ngắn, dùng cho card và phần đầu trang chi tiết. */
  desc: string
  /** Mô tả đầy đủ theo từng đoạn, dùng cho tab "Mô tả". */
  descFull?: string[]
  /** Ứng dụng thực tế do hãng cung cấp; thiếu thì suy ra từ danh mục. */
  applications?: string[]
  /** Ảnh sản phẩm thật, tối đa 5 (spec C3). Thiếu thì hiện ô placeholder. */
  images?: string[]
  specs?: [string, string][]
  kw: string[]
  /** Catalog series — dữ liệu demo. */
  pdf?: { name: string; size: string; pages: number }
  /** Datasheet PDF thật kèm theo sản phẩm. */
  docPdf?: string
  /** Trang sản phẩm trên website hãng. */
  docUrl?: string
}

export interface Article {
  slug: string
  cat: string
  date: string
  title: string
  excerpt: string
}

/** Spec C4 ★ — shop-floor slang mapped onto standard technical terms. */
export const SLANG_MAP: Record<string, string> = {
  'mui mai ca rem': 'morrisflex mũi mài hợp kim',
  'dao roc giay an toan': 'martor dao an toàn',
  'ba lang': 'tecna pa lăng cân bằng',
  'pa lang': 'tecna pa lăng cân bằng',
  palang: 'tecna pa lăng cân bằng',
  'may khac chu len sat': 'technomark máy khắc dấu',
  'sung mai hoi': 'ata máy mài khí nén',
  'cao thuy luc': 'vật tư thủy lực',
  'to vit luc': 'sloky tua vít lực',
  'tua vit luc': 'sloky tua vít lực',
}

/** Ngành ứng dụng theo từng danh mục — dùng cho tab "Ứng dụng" ở trang chi
    tiết sản phẩm. Tên ngành khớp với SECTOR_CARDS trong lib/constants.ts. */
export const CATEGORY_SECTORS: Record<string, string[]> = {
  'an-toan': ['Ô tô & linh kiện', 'Điện tử & lắp ráp công nghiệp chính xác', 'Khuôn mẫu & ép nhựa'],
  'cat-got-cnc': ['Gia công cơ khí & CNC', 'Hàng không vũ trụ', 'Đóng tàu & kết cấu kim loại'],
  'mai-hoan-thien': ['Gia công cơ khí & CNC', 'Đóng tàu & kết cấu kim loại', 'Khuôn mẫu & ép nhựa'],
  'kep-khuon-phoi': ['Khuôn mẫu & ép nhựa', 'Gia công cơ khí & CNC'],
  've-sinh-khuon': ['Khuôn mẫu & ép nhựa'],
  'do-can-chinh': ['Gia công cơ khí & CNC', 'Khuôn mẫu & ép nhựa'],
  'danh-dau': ['Ô tô & linh kiện', 'Dầu khí & năng lượng', 'Điện tử & lắp ráp công nghiệp chính xác'],
  'nang-ha': ['Ô tô & linh kiện', 'Đóng tàu & kết cấu kim loại', 'Điện tử & lắp ráp công nghiệp chính xác'],
  'siet-cong-nghiep': ['Ô tô & linh kiện', 'Điện tử & lắp ráp công nghiệp chính xác'],
  'siet-luc-cam-tay': ['Điện tử & lắp ráp công nghiệp chính xác', 'Gia công cơ khí & CNC'],
  'vat-mep': ['Đóng tàu & kết cấu kim loại', 'Gia công cơ khí & CNC'],
  'composite': ['Hàng không vũ trụ', 'Gia công cơ khí & CNC'],
  'do-kiem-may-han': ['Ô tô & linh kiện', 'Đóng tàu & kết cấu kim loại'],
  'phuc-hoi-be-mat': ['Khuôn mẫu & ép nhựa', 'Gia công cơ khí & CNC'],
  'khop-noi': ['Gia công cơ khí & CNC', 'Dầu khí & năng lượng'],
}

export const NEWS: Article[] = [
  {
    slug: 'tungsten-carbide', cat: 'Kiến thức kỹ thuật', date: '28/07/2026',
    title: 'Tungsten Carbide: vì sao mũi mài hợp kim bền hơn thép gió',
    excerpt: 'Cấu trúc hạt cacbua vonfram và chất kết dính cobalt quyết định tuổi thọ và tốc độ bóc tách vật liệu.',
  },
  {
    slug: 'chon-dao-phay', cat: 'Kiến thức kỹ thuật', date: '21/07/2026',
    title: 'Hướng dẫn chọn dao phay ngón theo vật liệu phôi',
    excerpt: 'Số me, lớp phủ và biên dạng — ba yếu tố cần cân nhắc khi phay nhôm, thép tôi hay composite.',
  },
  {
    slug: 'mta-2025', cat: 'Tin tức', date: '10/07/2026',
    title: 'Kim Thành Đông tại triển lãm MTA Vietnam 2025',
    excerpt: 'KTĐ giới thiệu danh mục dụng cụ an toàn Martor và pa lăng cân bằng Tecna tới khách hàng công nghiệp.',
  },
]

export const NEWS_CATEGORIES = ['Kiến thức kỹ thuật', 'Tin tức'] as const

// ---------------------------------------------------------------- lookups

/** Quy tắc dựng đường dẫn: {ten-khong-dau}-{ma-hang}. Chỉ dùng lúc sinh dữ
    liệu; khi đọc từ cơ sở dữ liệu thì lấy thẳng cột slug đã lưu. */
export function productSlug(p: { name: string; part: string }): string {
  return slugify(`${p.name} ${p.part}`)
}

export function productSectors(p: Product): string[] {
  return CATEGORY_SECTORS[p.category] ?? []
}

export function pdfLine(p: Product): string | null {
  return p.pdf ? `${p.pdf.name} · ${p.pdf.size} · ${p.pdf.pages} tr.` : null
}

/** The five prescribed photo angles for a representative part (spec C3). */
export const GALLERY_VIEWS = ['Mặt trước', 'Mặt bên', 'Góc 45°', 'Chi tiết cơ cấu', 'Đang sử dụng'] as const
