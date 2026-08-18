// Kim Thành Đông — business dataset.
// Mirrors the Claude Design prototype (ktd-data.js) and spec D2 field structure.
// Replace with the real Excel import when the operations team finishes it.

import { slugify } from './utils'

export interface Brand {
  slug: string
  name: string
  origin: string
  desc: string
  /** Path under /public. Undefined = show the neutral "LOGO" placeholder. */
  logo?: string
}

export interface Category {
  slug: string
  name: string
  /** Dòng chữ nhỏ liệt kê nhóm thiết bị — thay cho số đếm sản phẩm. */
  sub: string
  /** Khóa icon, ánh xạ sang component trong components/home/CategoryTiles.tsx */
  icon: string
  /** Ảnh thiết bị đại diện, đặt chìm làm nền ô. Chưa có thì ô dùng nền kỹ thuật. */
  image?: string
}

export interface Product {
  part: string
  name: string
  brand: string
  category: string
  sub?: string
  series: string
  origin: string
  featured?: boolean
  tag?: 'Mới' | 'Bán chạy'
  desc: string
  specs: [string, string][]
  kw: string[]
  pdf: { name: string; size: string; pages: number }
}

export interface Article {
  slug: string
  cat: string
  date: string
  title: string
  excerpt: string
}

export const BRANDS: Brand[] = [
  // Thứ tự ở đây là thứ tự ưu tiên hiển thị (dải logo trang chủ và cách gom
  // nhóm ở trang sản phẩm). 8 hãng đầu theo chỉ định trong tài liệu SỬA WEB;
  // phần còn lại giữ nguyên, chờ danh sách đầy đủ.
  { slug: 'martor', name: 'Martor', origin: 'Đức', desc: 'Dao an toàn, GS certified', logo: '/assets/brands/martor.webp' },
  { slug: 'morrisflex', name: 'Morrisflex', origin: 'Ireland', desc: 'Mũi mài hợp kim cacbua vonfram', logo: '/assets/brands/morrisflex.webp' },
  { slug: 'ata', name: 'ATA Air Tools', origin: 'Ireland', desc: 'Máy mài, chà nhám khí nén', logo: '/assets/brands/ata.webp' },
  { slug: 'technomark', name: 'Technomark', origin: 'Pháp', desc: 'Máy khắc dấu laser & chấm peen' },
  { slug: 'lenzkes', name: 'Lenzkes', origin: 'Đức', desc: 'Kẹp khuôn, kẹp gá máy công cụ', logo: '/assets/brands/lenzkes.webp' },
  { slug: 'tschorn', name: 'TSChorn', origin: 'Đức', desc: 'Thiết bị đo, đầu dò 3D', logo: '/assets/brands/tschorn.webp' },
  { slug: 'fiam', name: 'Fiam', origin: 'Ý', desc: 'Tua vít điện công nghiệp', logo: '/assets/brands/fiam.webp' },
  { slug: 'tecna', name: 'Tecna', origin: 'Ý', desc: 'Pa lăng cân bằng', logo: '/assets/brands/tecna.webp' },
  { slug: 'helical', name: 'Helical', origin: 'Mỹ', desc: 'Dao phay ngón hiệu suất cao' },
  { slug: 'corehog', name: 'Corehog', origin: 'Mỹ', desc: 'Công cụ CNC cho composite, CFRP', logo: '/assets/brands/corehog.webp' },
  { slug: 'bevel-tools', name: 'Bevel Tools', origin: 'Hà Lan', desc: 'Máy vát mép & bo tròn kim loại' },
  { slug: 'rocklinizer', name: 'Rocklinizer', origin: 'Mỹ', desc: 'Máy phủ cứng bề mặt khuôn', logo: '/assets/brands/rocklinizer.webp' },
  { slug: 'buchem', name: 'Buchem', origin: 'Đức', desc: 'Hóa chất vệ sinh khuôn mẫu', logo: '/assets/brands/buchem.webp' },
  { slug: 'diprofil', name: 'Diprofil', origin: 'Thụy Điển', desc: 'Máy đánh bóng khuôn', logo: '/assets/brands/diprofil.webp' },
  { slug: 'rtc', name: 'RTC', origin: 'Thổ Nhĩ Kỳ', desc: 'Khớp nối', logo: '/assets/brands/rtc.webp' },
  { slug: 'sloky', name: 'Sloky', origin: 'Đài Loan', desc: 'Tua vít lực chính xác', logo: '/assets/brands/sloky.webp' },
  { slug: 'hartner', name: 'Hartner', origin: 'Đức', desc: 'Dụng cụ cắt gọt chính xác', logo: '/assets/brands/hartner.webp' },
  { slug: 'karnasch', name: 'Karnasch', origin: 'Đức', desc: 'Dụng cụ cắt gọt, mũi khoan chuyên dụng', logo: '/assets/brands/karnasch.webp' },
]

export const CATEGORIES: Category[] = [
  { slug: 'an-toan', name: 'Dụng cụ an toàn', sub: 'Dao, kéo an toàn, lưỡi dao & phụ kiện', icon: 'shield', image: '/categories/an-toan.webp' },
  { slug: 'cat-got-cnc', name: 'Dụng cụ cắt gọt CNC', sub: 'Mũi khoan, dao phay, mũi khoét, ta rô', icon: 'drill' },
  { slug: 'mai-hoan-thien', name: 'Mài, đánh bóng & hoàn thiện bề mặt', sub: 'Máy mài, mũi mài, dụng cụ đánh bóng', icon: 'grind' },
  { slug: 'kep-ve-sinh-khuon', name: 'Kẹp và vệ sinh khuôn mẫu', sub: 'Kẹp khuôn, kẹp phôi, vệ sinh khuôn', icon: 'clamp' },
  { slug: 'do-can-chinh', name: 'Thiết bị đo & Căn chỉnh gia công', sub: 'Đầu dò 3D, Dò cạnh, Xác định điểm 0', icon: 'target' },
  { slug: 'danh-dau', name: 'Đánh dấu & truy xuất', sub: 'Khắc chấm, Khắc laser, Truy xuất nguồn gốc', icon: 'qr', image: '/categories/danh-dau.webp' },
  { slug: 'nang-ha', name: 'Thiết bị nâng hạ & công thái học', sub: 'Pa lăng cân bằng, Bộ cân bằng tải, Phụ kiện', icon: 'hoist' },
  { slug: 'siet-cong-nghiep', name: 'Thiết bị siết công nghiệp', sub: 'Tô vít công nghiệp, Máy siết bu lông, Hệ thống siết lực tự động', icon: 'gear' },
  { slug: 'siet-luc-cam-tay', name: 'Dụng cụ siết lực cầm tay', sub: 'Tô vít lực, Đầu vít, Phụ kiện', icon: 'screwdriver' },
  { slug: 'vat-mep', name: 'Máy vát mép & bo cạnh', sub: 'Vát mép, Bo tròn cạnh, Chuẩn bị mép hàn', icon: 'bevel' },
  { slug: 'composite', name: 'Dụng cụ gia công composite', sub: 'Dao phay, Mũi khoan, Dụng cụ Honeycomb', icon: 'honeycomb' },
  { slug: 'do-kiem-may-han', name: 'Thiết bị đo & Kiểm tra máy hàn', sub: 'Đo dòng điện hàn và lực ép', icon: 'wave' },
  { slug: 'phuc-hoi-be-mat', name: 'Xử lý & phục hồi bề mặt kim loại', sub: 'Phủ carbide, Sửa chữa khuôn, Phục hồi bề mặt', icon: 'diamond' },
  { slug: 'khop-noi', name: 'Khớp nối nhanh công nghiệp', sub: 'Khớp nối khí, Khớp nối thủy lực, Khớp nối nước', icon: 'coupling' },
]


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
  'an-toan': ['Ô tô & linh kiện', 'Điện tử & lắp ráp chính xác', 'Khuôn mẫu & ép nhựa'],
  'cat-got-cnc': ['Gia công cơ khí & CNC', 'Hàng không vũ trụ', 'Đóng tàu & kết cấu kim loại'],
  'mai-hoan-thien': ['Gia công cơ khí & CNC', 'Đóng tàu & kết cấu kim loại', 'Khuôn mẫu & ép nhựa'],
  'kep-ve-sinh-khuon': ['Khuôn mẫu & ép nhựa', 'Gia công cơ khí & CNC'],
  'do-can-chinh': ['Gia công cơ khí & CNC', 'Khuôn mẫu & ép nhựa'],
  'danh-dau': ['Ô tô & linh kiện', 'Dầu khí & năng lượng', 'Điện tử & lắp ráp chính xác'],
  'nang-ha': ['Ô tô & linh kiện', 'Đóng tàu & kết cấu kim loại', 'Điện tử & lắp ráp chính xác'],
  'siet-cong-nghiep': ['Ô tô & linh kiện', 'Điện tử & lắp ráp chính xác'],
  'siet-luc-cam-tay': ['Điện tử & lắp ráp chính xác', 'Gia công cơ khí & CNC'],
  'vat-mep': ['Đóng tàu & kết cấu kim loại', 'Gia công cơ khí & CNC'],
  'composite': ['Hàng không vũ trụ', 'Gia công cơ khí & CNC'],
  'do-kiem-may-han': ['Ô tô & linh kiện', 'Đóng tàu & kết cấu kim loại'],
  'phuc-hoi-be-mat': ['Khuôn mẫu & ép nhựa', 'Gia công cơ khí & CNC'],
  'khop-noi': ['Gia công cơ khí & CNC', 'Dầu khí & năng lượng'],
}

export const PRODUCTS: Product[] = [
  {
    part: '122001', name: 'SECUPRO MARTEGO', brand: 'martor', category: 'an-toan', sub: 'Dao rút lưỡi tự động',
    series: 'SECUPRO', origin: 'Đức', featured: true, tag: 'Bán chạy',
    desc: 'Dao an toàn rút lưỡi hoàn toàn tự động. An toàn – chắc chắn – linh hoạt – tiện dụng.',
    specs: [['Cơ chế an toàn', 'Rút lưỡi hoàn toàn tự động'], ['Vật liệu tay cầm', 'Nhôm'], ['Độ sâu cắt', '20 mm'], ['Chứng nhận', 'GS Certified'], ['Thay lưỡi', 'Không cần dụng cụ']],
    kw: ['dao an toan', 'dao roc giay', 'secupro', 'martego', 'cutter'],
    pdf: { name: 'SECUPRO Series', size: '4.2 MB', pages: 18 },
  },
  {
    part: '38000', name: 'SECUNORM 380', brand: 'martor', category: 'an-toan',
    series: 'SECUNORM', origin: 'Đức', tag: 'Mới',
    desc: 'Dao an toàn lưỡi tự động thu, thân kim loại chắc chắn cho môi trường công nghiệp nặng.',
    specs: [['Cơ chế an toàn', 'Lưỡi tự động thu'], ['Vật liệu', 'Kim loại'], ['Độ sâu cắt', '18 mm'], ['Chứng nhận', 'GS Certified']],
    kw: ['dao an toan', 'secunorm'],
    pdf: { name: 'SECUNORM Series', size: '3.8 MB', pages: 14 },
  },
  {
    part: '150001', name: 'SECUMAX 150', brand: 'martor', category: 'an-toan',
    series: 'SECUMAX', origin: 'Đức',
    desc: 'Dao an toàn lưỡi giấu hoàn toàn, cắt màng và dây đai không nguy cơ đứt tay.',
    specs: [['Cơ chế an toàn', 'Lưỡi giấu hoàn toàn'], ['Ứng dụng', 'Cắt màng, dây đai'], ['Vật liệu', 'Nhựa gia cường']],
    kw: ['dao an toan', 'secumax', 'cat mang'],
    pdf: { name: 'SECUMAX Series', size: '3.1 MB', pages: 12 },
  },
  {
    part: 'MF-INOXCUT', name: 'Mũi mài INOX CUT', brand: 'morrisflex', category: 'mai-hoan-thien',
    series: 'INOX CUT', origin: 'Ireland', featured: true, tag: 'Bán chạy',
    desc: 'Mũi mài hợp kim cacbua vonfram chuyên mài inox, không sinh nhiệt cháy bề mặt.',
    specs: [['Vật liệu', 'Cacbua vonfram'], ['Đường kính', '6 mm'], ['Chuôi', '6 mm'], ['Tốc độ tối đa', '30.000 rpm']],
    kw: ['mui mai', 'ca rem', 'hop kim', 'inox'],
    pdf: { name: 'Morrisflex Carbide Burrs', size: '5.6 MB', pages: 24 },
  },
  {
    part: 'SPM80R', name: 'Mũi mài hợp kim SPM80R', brand: 'morrisflex', category: 'mai-hoan-thien',
    series: 'SPM', origin: 'Ireland',
    desc: 'Mũi mài đầu tròn, gợn xoắn kép cho tốc độ bóc tách vật liệu cao.',
    specs: [['Vật liệu', 'Cacbua vonfram'], ['Đường kính', '8 mm'], ['Kiểu răng', 'Xoắn kép'], ['Tốc độ tối đa', '28.000 rpm']],
    kw: ['mui mai', 'ca rem', 'spm'],
    pdf: { name: 'Morrisflex Carbide Burrs', size: '5.6 MB', pages: 24 },
  },
  {
    part: 'HEV-40250', name: 'Dao phay ngón HEV 4 me', brand: 'helical', category: 'cat-got-cnc',
    series: 'HEV', origin: 'Mỹ', featured: true,
    desc: 'Dao phay ngón 4 me phủ AlTiN, biên dạng biến bước giảm rung, phay thép tôi.',
    specs: [['Số me', '4'], ['Đường kính', '6.35 mm'], ['Phủ', 'AlTiN'], ['Vật liệu phôi', 'Thép tôi ≤ 55 HRC']],
    kw: ['dao phay ngon', 'end mill', 'helical'],
    pdf: { name: 'Helical End Mills', size: '8.1 MB', pages: 36 },
  },
  {
    part: 'HFV-30187', name: 'Dao phay ngón HFV 3 me', brand: 'helical', category: 'cat-got-cnc',
    series: 'HFV', origin: 'Mỹ',
    desc: 'Dao phay ngón 3 me cho nhôm, rãnh thoát phoi rộng, độ bóng bề mặt cao.',
    specs: [['Số me', '3'], ['Đường kính', '4.76 mm'], ['Vật liệu phôi', 'Nhôm, hợp kim màu']],
    kw: ['dao phay ngon', 'nhom', 'helical'],
    pdf: { name: 'Helical End Mills', size: '8.1 MB', pages: 36 },
  },
  {
    part: 'CH-C4', name: 'Dao CNC composite CH-C4', brand: 'corehog', category: 'composite',
    series: 'C-Series', origin: 'Mỹ',
    desc: 'Công cụ cắt CFRP / honeycomb, hình học chống tưa sợi, tuổi thọ cao.',
    specs: [['Ứng dụng', 'CFRP, composite'], ['Đường kính', '6 mm'], ['Phủ', 'Kim cương (CVD)']],
    kw: ['composite', 'cfrp', 'corehog'],
    pdf: { name: 'Corehog Composite Tools', size: '4.9 MB', pages: 20 },
  },
  {
    part: 'BT-R2', name: 'Máy vát mép Bevel BT-R2', brand: 'bevel-tools', category: 'vat-mep',
    series: 'R', origin: 'Hà Lan',
    desc: 'Dụng cụ vát mép và bo tròn cạnh kim loại cầm tay, thay dao nhanh.',
    specs: [['Góc vát', '45°'], ['Bo tròn', 'R2'], ['Vật liệu', 'Thép, nhôm']],
    kw: ['vat mep', 'bo tron', 'bevel'],
    pdf: { name: 'Bevel Tools Catalog', size: '2.7 MB', pages: 10 },
  },
  {
    part: 'AT-7033', name: 'Máy mài khí nén AT-7033', brand: 'ata', category: 'mai-hoan-thien',
    series: 'AT', origin: 'Ireland', featured: true, tag: 'Bán chạy',
    desc: 'Máy mài thẳng khí nén 1/4", vòng bi kín chịu bụi, cân bằng độ rung thấp.',
    specs: [['Tốc độ', '25.000 rpm'], ['Kẹp', '6 mm'], ['Áp suất', '6.3 bar'], ['Tiêu thụ khí', '0.6 m³/min']],
    kw: ['may mai', 'sung mai hoi', 'khi nen', 'ata'],
    pdf: { name: 'ATA Air Tools', size: '6.3 MB', pages: 28 },
  },
  {
    part: 'AT-5012', name: 'Máy chà nhám khí nén AT-5012', brand: 'ata', category: 'mai-hoan-thien',
    series: 'AT', origin: 'Ireland',
    desc: 'Máy chà nhám lệch tâm, đế 125 mm, hút bụi trung tâm, tay cầm chống rung.',
    specs: [['Đế', '125 mm'], ['Quỹ đạo', '5 mm'], ['Tốc độ', '10.000 opm']],
    kw: ['cha nham', 'khi nen', 'ata'],
    pdf: { name: 'ATA Air Tools', size: '6.3 MB', pages: 28 },
  },
  {
    part: 'FIAM-15C', name: 'Tua vít điện Fiam 15C', brand: 'fiam', category: 'siet-cong-nghiep',
    series: '15C', origin: 'Ý',
    desc: 'Tua vít điện công nghiệp điều khiển mô-men, ly hợp chính xác cho dây chuyền lắp ráp.',
    specs: [['Mô-men', '1.5 – 15 Nm'], ['Điều khiển', 'Ly hợp cơ khí'], ['Nguồn', 'BLDC']],
    kw: ['tua vit dien', 'fiam', 'lap rap'],
    pdf: { name: 'Fiam Screwdrivers', size: '3.4 MB', pages: 16 },
  },
  {
    part: '9502AX', name: 'Pa lăng cân bằng Tecna 9502AX', brand: 'tecna', category: 'nang-ha',
    series: 'Retractor', origin: 'Ý', featured: true,
    desc: 'Pa lăng cân bằng tải trọng, giữ dụng cụ lơ lửng, giảm mỏi cho công nhân lắp ráp.',
    specs: [['Tải trọng', '4 – 6 kg'], ['Hành trình cáp', '2.000 mm'], ['Kiểu', 'Zero Gravity']],
    kw: ['pa lang', 'ba lang', 'palang', 'can bang', 'tecna'],
    pdf: { name: 'Tecna Balancers', size: '4.0 MB', pages: 18 },
  },
  {
    part: 'LK-125', name: 'Bộ kẹp khuôn Lenzkes LK-125', brand: 'lenzkes', category: 'kep-ve-sinh-khuon',
    series: 'Clamping', origin: 'Đức',
    desc: 'Bộ kẹp gá khuôn trên bàn máy công cụ, lực kẹp cao, tháo lắp nhanh không vặn ren dài.',
    specs: [['Rãnh T', '14 mm'], ['Lực kẹp', '25 kN'], ['Số chi tiết', '58']],
    kw: ['kep khuon', 'kep ga', 'lenzkes'],
    pdf: { name: 'Lenzkes Clamping', size: '5.2 MB', pages: 22 },
  },
  {
    part: 'RK-500', name: 'Máy phủ cứng Rocklinizer RK-500', brand: 'rocklinizer', category: 'phuc-hoi-be-mat',
    series: 'RK', origin: 'Mỹ',
    desc: 'Thiết bị phủ cứng bề mặt khuôn bằng phóng điện, tăng tuổi thọ cạnh sắc.',
    specs: [['Công suất', '500 VA'], ['Điện cực', 'Tungsten carbide'], ['Độ cứng phủ', '≤ 90 HRC']],
    kw: ['phu cung', 'khuon', 'rocklinizer'],
    pdf: { name: 'Rocklinizer Systems', size: '2.9 MB', pages: 12 },
  },
  {
    part: 'DF-BSG', name: 'Máy đánh bóng khuôn Diprofil BSG', brand: 'diprofil', category: 'mai-hoan-thien',
    series: 'BSG', origin: 'Thụy Điển',
    desc: 'Máy đánh bóng khuôn mẫu chuyển động thẳng, giũa và đá mài đổi nhanh.',
    specs: [['Hành trình', '3 mm'], ['Tần số', '6.500 spm'], ['Nguồn', 'Khí nén / điện']],
    kw: ['danh bong khuon', 'diprofil'],
    pdf: { name: 'Diprofil Polishing', size: '3.3 MB', pages: 14 },
  },
  {
    part: 'MP-350', name: 'Máy khắc dấu Technomark MP-350', brand: 'technomark', category: 'danh-dau',
    series: 'MarkPro', origin: 'Pháp', featured: true, tag: 'Mới',
    desc: 'Máy khắc dấu chấm peen khắc chữ, số, mã DataMatrix lên kim loại, truy xuất nguồn gốc.',
    specs: [['Vùng khắc', '120 × 100 mm'], ['Kiểu', 'Chấm peen (dot peen)'], ['Mã hỗ trợ', 'Text, DataMatrix']],
    kw: ['may khac dau', 'khac chu len sat', 'technomark'],
    pdf: { name: 'Technomark Marking', size: '4.6 MB', pages: 20 },
  },
  {
    part: 'TS-3D', name: 'Đầu dò 3D TSChorn TS-3D', brand: 'tschorn', category: 'do-can-chinh',
    series: '3D', origin: 'Đức',
    desc: 'Đầu dò 3D dò cạnh và tâm lỗ trên máy phay, đồng hồ so tích hợp độ chính xác cao.',
    specs: [['Độ chính xác', '0.01 mm'], ['Chuôi', '20 mm'], ['Đầu dò', 'Ø 4 mm']],
    kw: ['dau do', 'do kiem', 'tschorn'],
    pdf: { name: 'TSChorn Measuring', size: '2.4 MB', pages: 10 },
  },
  {
    part: 'SLOKY-TS15', name: 'Tua vít lực Sloky TS-15', brand: 'sloky', category: 'siet-luc-cam-tay',
    series: 'TS', origin: 'Đài Loan',
    desc: 'Tua vít lực chính xác cài đặt mô-men cố định, chống siết quá tay khi lắp mảnh dao.',
    specs: [['Dải mô-men', '0.6 – 1.5 Nm'], ['Sai số', '± 6%'], ['Đầu', 'Có thể thay']],
    kw: ['tua vit luc', 'to vit luc', 'sloky'],
    pdf: { name: 'Sloky Torque Drivers', size: '2.1 MB', pages: 9 },
  },
  {
    part: 'RTC-40', name: 'Khớp nối RTC-40', brand: 'rtc', category: 'khop-noi',
    series: 'RTC', origin: 'Thổ Nhĩ Kỳ',
    desc: 'Khớp nối truyền động bù lệch tâm, đàn hồi chống rung cho hệ trục.',
    specs: [['Đường kính trục', '40 mm'], ['Mô-men', '120 Nm'], ['Kiểu', 'Đàn hồi']],
    kw: ['khop noi', 'rtc', 'truyen dong'],
    pdf: { name: 'RTC Couplings', size: '1.9 MB', pages: 8 },
  },
  {
    part: 'BX-88', name: 'Hóa chất vệ sinh khuôn Buchem BX-88', brand: 'buchem', category: 'kep-ve-sinh-khuon',
    series: 'BX', origin: 'Đức',
    desc: 'Dung dịch tẩy nhựa cháy và cặn khuôn ép, an toàn với bề mặt thép khuôn.',
    specs: [['Dạng', 'Bình xịt 500 ml'], ['Ứng dụng', 'Khuôn ép nhựa'], ['Điểm chớp cháy', '> 60 °C']],
    kw: ['hoa chat', 've sinh khuon', 'buchem'],
    pdf: { name: 'Buchem Mold Care', size: '2.2 MB', pages: 9 },
  },
  {
    part: 'HT-HSS8', name: 'Mũi khoan HSS-E Hartner 8mm', brand: 'hartner', category: 'cat-got-cnc',
    series: 'HSS-E', origin: 'Đức',
    desc: 'Mũi khoan thép gió coban HSS-E mài chính xác, khoan thép hợp kim và inox độ bền cao.',
    specs: [['Vật liệu', 'HSS-E (Co5)'], ['Đường kính', '8 mm'], ['Góc mũi', '135°'], ['Chuẩn', 'DIN 338']],
    kw: ['mui khoan', 'hss', 'hartner', 'cat got'],
    pdf: { name: 'Hartner Drilling', size: '3.5 MB', pages: 15 },
  },
  {
    part: 'KN-HSSDMOND', name: 'Lưỡi khoét hợp kim Karnasch', brand: 'karnasch', category: 'cat-got-cnc',
    series: 'Master Cut', origin: 'Đức',
    desc: 'Lưỡi khoét lõi (annular cutter) phủ TiAlN, khoan lỗ lớn nhanh trên thép tấm và dầm.',
    specs: [['Đường kính', '12 – 60 mm'], ['Chiều sâu cắt', '30 mm / 50 mm'], ['Phủ', 'TiAlN'], ['Chuôi', 'Weldon 19 mm']],
    kw: ['luoi khoet', 'annular', 'karnasch', 'khoan lo'],
    pdf: { name: 'Karnasch Master Cut', size: '6.8 MB', pages: 30 },
  },
]

export const NEWS: Article[] = [
  {
    slug: 'tungsten-carbide', cat: 'Kiến thức kỹ thuật', date: '28/07/2026',
    title: 'Tungsten Carbide: vì sao mũi mài hợp kim bền hơn thép gió',
    excerpt: 'Cấu trúc hạt cacbua vonfram và chất kết dính cobalt quyết định tuổi thọ và tốc độ bóc tách vật liệu.',
  },
  {
    slug: 'chon-dao-phay', cat: 'Giải pháp ứng dụng', date: '21/07/2026',
    title: 'Hướng dẫn chọn dao phay ngón theo vật liệu phôi',
    excerpt: 'Số me, lớp phủ và biên dạng — ba yếu tố cần cân nhắc khi phay nhôm, thép tôi hay composite.',
  },
  {
    slug: 'mta-2025', cat: 'Tin tức', date: '10/07/2026',
    title: 'Kim Thành Đông tại triển lãm MTA Vietnam 2025',
    excerpt: 'KTĐ giới thiệu danh mục dụng cụ an toàn Martor và pa lăng cân bằng Tecna tới khách hàng công nghiệp.',
  },
]

export const NEWS_CATEGORIES = ['Kiến thức kỹ thuật', 'Giải pháp ứng dụng', 'Tin tức'] as const

// ---------------------------------------------------------------- lookups

const brandBySlug = new Map(BRANDS.map((b) => [b.slug, b]))
const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]))

export function getBrand(slug: string): Brand | undefined {
  return brandBySlug.get(slug)
}

export function brandName(slug: string): string {
  return brandBySlug.get(slug)?.name ?? slug
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug)
}

export function categoryName(slug: string): string {
  return categoryBySlug.get(slug)?.name ?? slug
}

export function countByBrand(slug: string): number {
  return PRODUCTS.filter((p) => p.brand === slug).length
}

export function countByCategory(slug: string): number {
  return PRODUCTS.filter((p) => p.category === slug).length
}

/** Spec C0: slug = {ten-khong-dau}-{part-number}, lowercase, hyphenated. */
export function productSlug(p: Product): string {
  return slugify(`${p.name} ${p.part}`)
}

const productsBySlug = new Map(PRODUCTS.map((p) => [productSlug(p), p]))

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug.get(slug)
}

export function getProductByPart(part: string): Product | undefined {
  return PRODUCTS.find((p) => p.part === part)
}

export function productSectors(p: Product): string[] {
  return CATEGORY_SECTORS[p.category] ?? []
}

export function pdfLine(p: Product): string {
  return `${p.pdf.name} · ${p.pdf.size} · ${p.pdf.pages} tr.`
}

/** The five prescribed photo angles for a representative part (spec C3). */
export const GALLERY_VIEWS = ['Mặt trước', 'Mặt bên', 'Góc 45°', 'Chi tiết cơ cấu', 'Đang sử dụng'] as const
