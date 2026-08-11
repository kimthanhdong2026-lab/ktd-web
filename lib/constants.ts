// Contact & Office Information
export const COMPANY_NAME = 'Kim Thành Đông'
export const COMPANY_PHONE = '0914 897 227'
export const COMPANY_EMAIL = 'sales@kimthanhdong.com'
export const COMPANY_HOTLINE_2 = '0974 516 416'
export const COMPANY_PHONE_OFFICE = '02543 627760'
export const COMPANY_WEBSITE = 'kimthanhdong.vn'

// Category Icons (Emoji)
export const CATEGORY_ICONS: Record<string, string> = {
  'cat-got': '🔧',
  'khi-nen': '💨',
  'an-toan': '🛡️',
  'do-kiem': '📐',
  'nang-ha': '🏗️',
  'kep-ga': '🗜️',
  'danh-dau': '🔖',
  'hoa-chat': '🧪',
  'siet-luc': '⚙️',
}

// Vietnamese Slang to Standard Keywords
// Maps colloquial machine terms to proper product/brand names for search
export const SLANG_MAP: Record<string, string> = {
  'mui mai ca rem': 'morrisflex mũi mài hợp kim',
  'dao roc giay an toan': 'martor dao an toàn',
  'ba lang': 'tecna pa lăng cân bằng',
  'pa lang': 'tecna pa lăng cân bằng',
  'palang': 'tecna pa lăng cân bằng',
  'may khac chu len sat': 'technomark máy khắc dấu',
  'sung mai hoi': 'ata máy mài khí nén',
  'cao thuy luc': 'vật tư thủy lực',
  'to vit luc': 'sloky tua vít lực',
  'tua vit luc': 'sloky tua vít lực',
  'canh tay taro': 'roscamat máy taro',
}

// Office Locations
export const OFFICES = [
  {
    id: 1,
    name_vi: 'Trụ sở chính — Vũng Tàu',
    name_en: 'Headquarters - Vung Tau',
    address_vi: '444A Bình Giã, P. Tam Thắng, TP.HCM',
    address_en: '444A Binh Gia, Tam Thang Ward, TP.HCM',
    lat: 10.7769,
    lng: 106.6844,
    phone: '02543 627760',
  },
  {
    id: 2,
    name_vi: 'Văn phòng làm việc',
    name_en: 'Working Office',
    address_vi: 'Hà Nội',
    address_en: 'Hanoi',
    lat: 21.0285,
    lng: 105.8542,
    phone: '02543 627760',
  },
  {
    id: 3,
    name_vi: 'Kho HCM',
    name_en: 'Warehouse HCM',
    address_vi: 'TP. Hồ Chí Minh',
    address_en: 'Ho Chi Minh City',
    lat: 10.7769,
    lng: 106.6844,
    phone: '02543 627760',
  },
  {
    id: 4,
    name_vi: 'Kho Hà Nội',
    name_en: 'Warehouse Hanoi',
    address_vi: 'Hà Nội',
    address_en: 'Hanoi',
    lat: 21.0285,
    lng: 105.8542,
    phone: '02543 627760',
  },
]

// Provinces for RFQ form dropdown
export const PROVINCES = [
  { value: 'tphcm', label: 'TP.HCM' },
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'vungtau', label: 'Bà Rịa – Vũng Tàu' },
  { value: 'dongnai', label: 'Đồng Nai' },
  { value: 'binhduong', label: 'Bình Dương' },
  { value: 'haiphong', label: 'Hải Phòng' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'other', label: 'Khác' },
]

// News Categories
export const NEWS_CATEGORIES_VI = [
  { id: 'all', label: 'Tất cả' },
  { id: 'technical', label: 'Kiến thức kỹ thuật' },
  { id: 'solution', label: 'Giải pháp ứng dụng' },
  { id: 'company', label: 'Tin công ty' },
]

export const NEWS_CATEGORIES_EN = [
  { id: 'all', label: 'All' },
  { id: 'technical', label: 'Technical Knowledge' },
  { id: 'solution', label: 'Application Solutions' },
  { id: 'company', label: 'Company News' },
]

// Category to Sectors Mapping
// Defines which industrial sectors each product category applies to
export const CATEGORY_SECTORS: Record<string, string[]> = {
  'cat-got': ['Gia công cơ khí', 'Đóng tàu', 'Công nghiệp nhựa'],
  'khi-nen': ['Gia công cơ khí', 'Đóng tàu'],
  'an-toan': ['Công nghiệp thực phẩm', 'Công nghiệp hóa chất', 'Công nghiệp nhựa'],
  'do-kiem': ['Gia công cơ khí', 'Nhà máy điện'],
  'nang-ha': ['Đóng tàu', 'Công nghiệp hàng hải', 'Gia công cơ khí'],
  'kep-ga': ['Gia công cơ khí', 'Công nghiệp nhựa'],
  'danh-dau': ['Gia công cơ khí', 'Đóng tàu', 'Công nghiệp hàng hải'],
  'hoa-chat': ['Công nghiệp hóa chất', 'Công nghiệp hóa dầu', 'Công nghiệp nhựa'],
  'siet-luc': ['Gia công cơ khí', 'Nhà máy điện'],
}

// Hero Statistics
export const HERO_STATS = [
  { num: '13+', label: 'Năm kinh nghiệm' },
  { num: '21', label: 'Thương hiệu chính hãng' },
  { num: '3', label: 'Kho hàng toàn quốc' },
]

// Why Choose KTĐ
export const WHY_ITEMS_VI = [
  {
    icon: '💰',
    title: 'Tiết kiệm chi phí',
    body: 'Công nghệ quốc tế với giá cạnh tranh, không phí trung gian, báo giá minh bạch.',
  },
  {
    icon: '⚙️',
    title: 'Nâng cao hiệu quả',
    body: 'Tư vấn kỹ thuật chuyên sâu, chọn đúng thiết bị, tối ưu hóa quy trình sản xuất.',
  },
  {
    icon: '🚚',
    title: 'Tiết kiệm thời gian',
    body: 'Kho hàng toàn quốc, giao hàng nhanh TP.HCM, Hà Nội, Đà Nẵng trong 24–48h.',
  },
  {
    icon: '🛡️',
    title: 'An tâm tuyệt đối',
    body: 'Bảo hành chính hãng, hỗ trợ kỹ thuật lâu dài, đội ngũ kỹ sư giàu kinh nghiệm.',
  },
]

// Core Operating Criteria
export const CRITERIA = [
  { n: '1', t: 'Hệ thống cung ứng bền vững và an định' },
  { n: '2', t: 'Uy tín, tin tưởng và minh bạch' },
  { n: '3', t: 'Tôn trọng, tin tưởng và trao quyền cho nhân viên' },
  { n: '4', t: 'Văn hóa cởi mở, học hỏi, cải tiến liên tục' },
  { n: '5', t: 'Tuân thủ pháp luật, đạo đức kinh doanh' },
]

// Company Timeline
export const TIMELINE = [
  { year: '2011', text: 'Thành lập Công ty TNHH Kim Thành Đông' },
  { year: '2015', text: 'Khai trương kho hàng TP.HCM' },
  { year: '2019', text: 'Mở rộng sang Hà Nội, Đà Nẵng' },
  { year: '2025', text: 'Tham dự triển lãm Machinery Taipei' },
  { year: '2026', text: 'Phát hành website quốc tế' },
]

// Sectors with Rich Descriptions
export const SECTORS_WITH_DESC = [
  {
    name: 'Công nghiệp hóa chất',
    desc: 'Thiết bị an toàn, kỹ thuật đo lường, công cụ đặc dụng cho nhà máy hóa chất',
  },
  {
    name: 'Công nghiệp hàng hải',
    desc: 'Dụng cụ, vật tư cho thi công đóng tàu, sửa chữa kỹ thuật',
  },
  {
    name: 'Công nghiệp hóa dầu',
    desc: 'Thiết bị chuyên dụng cho xây dựng, bảo trì hạ tầng dầu khí',
  },
  {
    name: 'Gia công cơ khí',
    desc: 'Công cụ CNC, dụng cụ cắt gọt, máy móc gia công chính xác',
  },
  {
    name: 'Nhà máy điện',
    desc: 'Thiết bị an toàn, công cụ siết lực, vật tư bảo trì điện',
  },
  {
    name: 'Đóng tàu',
    desc: 'Dụng cụ hàn, gia công, vật tư kỹ thuật cho ngành đóng tàu',
  },
  {
    name: 'Công nghiệp thực phẩm',
    desc: 'Dụng cụ an toàn, vật tư vệ sinh cho sản xuất thực phẩm',
  },
  {
    name: 'Công nghiệp nhựa',
    desc: 'Dụng cụ cắt gọt, khuôn mẫu, vật tư gia công nhựa',
  },
]
