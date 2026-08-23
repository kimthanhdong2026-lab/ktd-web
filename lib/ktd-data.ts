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
  /** Chuyên mục bản tiếng Anh. */
  catEn: string
  date: string
  title: string
  titleEn: string
  excerpt: string
  excerptEn: string
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
    slug: 'tungsten-carbide',
    cat: 'Kiến thức kỹ thuật',
    catEn: 'Technical knowledge',
    date: '28/07/2026',
    title: 'Tungsten Carbide: vì sao mũi mài hợp kim bền hơn thép gió',
    titleEn: 'Tungsten carbide: why carbide burrs outlast high-speed steel',
    excerpt:
      'Cấu trúc hạt cacbua vonfram và chất kết dính cobalt quyết định tuổi thọ và tốc độ bóc tách vật liệu.',
    excerptEn:
      'Tungsten carbide grain structure and the cobalt binder are what determine tool life and material removal rate.',
  },
  {
    slug: 'chon-dao-phay',
    cat: 'Kiến thức kỹ thuật',
    catEn: 'Technical knowledge',
    date: '21/07/2026',
    title: 'Hướng dẫn chọn dao phay ngón theo vật liệu phôi',
    titleEn: 'Choosing an end mill to match the workpiece material',
    excerptEn:
      'Flute count, coating and geometry — the three things to weigh up when milling aluminium, hardened steel or composites.',
    excerpt:
      'Số me, lớp phủ và biên dạng — ba yếu tố cần cân nhắc khi phay nhôm, thép tôi hay composite.',
  },
  {
    slug: 'mta-2025',
    cat: 'Tin tức',
    catEn: 'News',
    date: '10/07/2026',
    title: 'Kim Thành Đông tại triển lãm MTA Vietnam 2025',
    titleEn: 'Kim Thanh Dong at MTA Vietnam 2025',
    excerpt:
      'KTĐ giới thiệu danh mục dụng cụ an toàn Martor và pa lăng cân bằng Tecna tới khách hàng công nghiệp.',
    excerptEn:
      'KTD presented the Martor safety cutter range and Tecna load balancers to industrial customers.',
  },
]

export const NEWS_CATEGORIES = ['Kiến thức kỹ thuật', 'Tin tức'] as const
export const NEWS_CATEGORIES_EN = ['Technical knowledge', 'News'] as const

/** Bài viết theo ngôn ngữ, đưa về đúng kiểu Article để giao diện không phải biết. */
export function newsFor(lang: 'vi' | 'en'): Article[] {
  if (lang === 'vi') return NEWS
  return NEWS.map((n) => ({ ...n, cat: n.catEn, title: n.titleEn, excerpt: n.excerptEn }))
}

// ---------------------------------------------------------------- lookups

/** Quy tắc dựng đường dẫn: {ten-khong-dau}-{ma-hang}. Chỉ dùng lúc sinh dữ
    liệu; khi đọc từ cơ sở dữ liệu thì lấy thẳng cột slug đã lưu. */
export function productSlug(p: { name: string; part: string }): string {
  return slugify(`${p.name} ${p.part}`)
}

export function productSectors(p: Product): string[] {
  return CATEGORY_SECTORS[p.category] ?? []
}

/** Dòng phụ dưới nút tải catalog. Đơn vị "trang" đổi theo ngôn ngữ nên phải
    nhận hàm dịch từ ngoài vào, không ghép chữ cứng ở đây. */
export function pdfLine(p: Product, pages: (n: number) => string): string | null {
  return p.pdf ? `${p.pdf.name} · ${p.pdf.size} · ${pages(p.pdf.pages)}` : null
}

/** The five prescribed photo angles for a representative part (spec C3). */
export const GALLERY_VIEWS = ['Mặt trước', 'Mặt bên', 'Góc 45°', 'Chi tiết cơ cấu', 'Đang sử dụng'] as const
