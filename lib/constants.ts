// Thông tin công ty và nội dung tĩnh.
// Nguồn: Hồ sơ năng lực KTĐ 2025, cập nhật theo tài liệu "SỬA WEB" (17/08/2026).

export const COMPANY_NAME = 'Công ty TNHH Kim Thành Đông'
export const COMPANY_NAME_UPPER = 'CÔNG TY TNHH KIM THÀNH ĐÔNG'
export const COMPANY_SHORT = 'Kim Thành Đông'
export const COMPANY_ADDRESS = '444A Bình Giã, P. Tam Thắng, Tp. Hồ Chí Minh'
export const COMPANY_PHONE = '02543 627760'
export const COMPANY_PHONE_TEL = '02543627760'
export const COMPANY_HOTLINE = '0914 897 227'
export const COMPANY_HOTLINE_TEL = '0914897227'
export const COMPANY_HOTLINE_2 = '0974 516 416'
export const COMPANY_HOTLINE_2_TEL = '0974516416'
export const COMPANY_EMAIL = 'sales@kimthanhdong.com'
export const COMPANY_WEBSITE = 'kimthanhdong.vn'
export const ZALO_URL = 'https://zalo.me/0914897227'

export const COMPANY_INTRO =
  'Kim Thành Đông trực tiếp hợp tác với các nhà sản xuất quốc tế để phân phối dụng cụ, thiết bị và sản phẩm công nghiệp tại thị trường Việt Nam.'

export const WORKING_HOURS = [
  '7h30 – 17h00, Thứ 2 đến Thứ 6',
  '7h30 – 11h30, Thứ 7',
]

/** Trụ sở đăng ký kinh doanh — khác địa chỉ văn phòng làm việc bên dưới. */
export const REGISTERED_OFFICE = {
  name: 'Địa chỉ ĐKKD',
  addr: 'Số 444A Bình Giã, P. Tam Thắng, Tp. Hồ Chí Minh',
}

/** Ba địa điểm làm việc thật. Trụ sở đăng ký nằm riêng ở REGISTERED_OFFICE. */
export const OFFICES = [
  {
    name: 'Văn phòng làm việc',
    addr: 'Tầng trệt Seaview 4, KĐT Chí Linh, P. Rạch Dừa, Tp. Hồ Chí Minh',
  },
  { name: 'Kho hàng HCM', addr: '326 Võ Văn Hát, P. Long Trường, Tp. Hồ Chí Minh' },
  { name: 'Kho hàng Hà Nội', addr: 'Ruby City CT1, P. Việt Hưng, Tp. Hà Nội' },
]

export const NAV_ITEMS = [
  { label: 'TRANG CHỦ', href: '/' },
  { label: 'GIỚI THIỆU', href: '/gioi-thieu' },
  { label: 'SẢN PHẨM', href: '/san-pham' },
  { label: 'TIN TỨC', href: '/tin-tuc' },
  { label: 'LIÊN HỆ', href: '/lien-he' },
]

/**
 * Bốn danh mục tiêu biểu, dùng chung cho cột "Danh mục" ở footer và bộ lọc
 * danh mục ở trang Sản phẩm — để hai chỗ không bao giờ lệch nhau.
 */
export const FEATURED_CATEGORIES = ['mai-hoan-thien', 'cat-got-cnc', 'an-toan', 'kep-khuon-phoi']

export const HERO_BADGE = 'GIẢI PHÁP TỐI ƯU · THƯƠNG HIỆU UY TÍN · ĐỒNG HÀNH DÀI HẠN'
/** Bản rút gọn cho điện thoại — câu đầy đủ 56 ký tự không thể nằm một dòng. */
export const HERO_BADGE_SHORT = 'TỐI ƯU · UY TÍN · DÀI HẠN'

export const HERO_TITLE = 'Phân phối dụng cụ & thiết bị công nghiệp'
export const HERO_SUBTITLE =
  'Hợp tác trực tiếp với hãng sản xuất · Tư vấn sản phẩm phù hợp · Hỗ trợ nhanh chóng'

export const HERO_CHIPS = [
  'Mũi mài',
  'Dao an toàn',
  'Máy vát mép',
  'Máy mài khí nén',
  'Máy đánh dấu',
]

export const CATEGORIES_HEADING = 'Danh mục sản phẩm'

export const BRANDS_EYEBROW = 'Phân phối chính hãng'

export const BRANDS_INTRO =
  'Mỗi thương hiệu Kim Thành Đông phân phối đảm nhiệm một thế mạnh chuyên biệt. Khi kết hợp lại, các thương hiệu này tạo thành một hệ sản phẩm bổ trợ xuyên suốt nhiều công đoạn của quá trình sản xuất công nghiệp.'

export const BRANDS_CTA = 'Xem tất cả sản phẩm theo thương hiệu →'

export const WHY_ITEMS = [
  {
    title: 'Thương hiệu uy tín',
    body: 'Hợp tác trực tiếp với các nhà sản xuất công nghiệp uy tín trên thế giới.',
  },
  {
    title: 'Tư vấn sản phẩm phù hợp',
    body: 'Hỗ trợ lựa chọn sản phẩm phù hợp với yêu cầu, ứng dụng và điều kiện sử dụng thực tế.',
  },
  {
    title: 'Sản phẩm chính hãng',
    body: 'Nguồn gốc rõ ràng, tài liệu kỹ thuật đầy đủ và chính sách bảo hành theo nhà sản xuất.',
  },
  {
    title: 'Hợp tác, hỗ trợ lâu dài',
    body: 'Duy trì nguồn cung ổn định và hỗ trợ khách hàng trong suốt quá trình sử dụng sản phẩm.',
  },
]

export const SECTORS_HEADING = 'Lĩnh vực phục vụ'

/** Thứ tự ở đây quyết định tên file ảnh: mục 1 dùng public/sectors/1.webp … */
export const SECTOR_CARDS = [
  { name: 'Gia công cơ khí & CNC', desc: 'Cắt gọt, đo kiểm, gá kẹp, hoàn thiện bề mặt.' },
  { name: 'Khuôn mẫu & ép nhựa', desc: 'Gá kẹp, đánh bóng, sửa chữa khuôn, vệ sinh & bảo trì khuôn.' },
  { name: 'Ô tô & linh kiện', desc: 'Siết lắp ráp, đánh dấu số series, mã QR.' },
  { name: 'Hàng không vũ trụ', desc: 'Gia công composite, cắt gọt chính xác, hoàn thiện bề mặt.' },
  { name: 'Đóng tàu & kết cấu kim loại', desc: 'Vát mép, mài hoàn thiện, đánh dấu mã code, dụng cụ khí nén.' },
  { name: 'Dầu khí & năng lượng', desc: 'Gia công, bảo trì, đánh dấu, hoàn thiện kim loại.' },
  { name: 'Điện tử & lắp ráp công nghiệp chính xác', desc: 'Siết kiểm soát lực, đánh dấu mã code, nâng hạ hỗ trợ.' },
]

export const ABOUT_STORY = [
  'Công ty TNHH Kim Thành Đông được thành lập từ năm 2011, hoạt động trong lĩnh vực phân phối dụng cụ, thiết bị và sản phẩm công nghiệp tại Việt Nam.',
  'Trong suốt quá trình phát triển, Kim Thành Đông từng bước xây dựng quan hệ hợp tác trực tiếp với các nhà sản xuất chuyên ngành đến từ Đức, Mỹ, Ý, Pháp, Thụy Điển và nhiều quốc gia khác. Mỗi thương hiệu mang một thế mạnh riêng, từ gia công cắt gọt, đo kiểm, gá kẹp, mài và hoàn thiện bề mặt đến siết lắp ráp, đánh dấu, nâng hạ, bảo trì và an toàn.',
  'Sự kết hợp của các thương hiệu này tạo nên một hệ sản phẩm có tính bổ trợ cao, đáp ứng nhiều công đoạn khác nhau trong quá trình sản xuất công nghiệp. Đây cũng là định hướng Kim Thành Đông theo đuổi: không mở rộng danh mục một cách dàn trải, mà lựa chọn những nhà sản xuất có chuyên môn rõ ràng, sản phẩm có giá trị ứng dụng thực tế và có khả năng bổ trợ cho nhau.',
  'Bên cạnh việc cung cấp sản phẩm chính hãng, Kim Thành Đông chú trọng hỗ trợ khách hàng lựa chọn sản phẩm phù hợp với yêu cầu sử dụng, cung cấp đầy đủ thông tin và tài liệu từ nhà sản xuất, đồng thời duy trì khả năng cung ứng ổn định và hỗ trợ lâu dài trong quá trình sử dụng.',
  'Từ nền tảng được xây dựng từ năm 2011, Kim Thành Đông tiếp tục phát triển danh mục sản phẩm và mạng lưới đối tác với mục tiêu trở thành một đơn vị phân phối công nghiệp đáng tin cậy, kết nối các nhà sản xuất quốc tế với thị trường Việt Nam bằng sự chuyên nghiệp, minh bạch và hợp tác bền vững.',
]

export const ABOUT_VISION =
  'Trở thành đơn vị phân phối công nghiệp đáng tin cậy tại Việt Nam, kết nối hiệu quả các nhà sản xuất quốc tế với nhu cầu thực tế của thị trường.'

export const ABOUT_MISSION =
  'Mang đến thị trường Việt Nam các sản phẩm công nghiệp chính hãng, có giá trị ứng dụng thực tế; đồng thời hỗ trợ khách hàng lựa chọn sản phẩm phù hợp nhất.'

export const ABOUT_VALUES = [
  {
    title: 'Uy tín & Trách nhiệm',
    body: 'Minh bạch thông tin, chủ động phối hợp và luôn thực hiện đầy đủ những gì đã cam kết.',
  },
  {
    title: 'Phù hợp',
    body: 'Ưu tiên sản phẩm phù hợp với nhu cầu và ứng dụng thực tế, thay vì chỉ tập trung bán hàng.',
  },
  {
    title: 'Hợp tác lâu dài',
    body: 'Xây dựng mối quan hệ dựa trên lợi ích bền vững của các bên.',
  },
  {
    title: 'Tuân thủ',
    body: 'Hoạt động đúng pháp luật, quy trình và chuẩn mực kinh doanh.',
  },
]

/** Mốc hợp tác phân phối theo từng năm. `brands` dùng để sau này thay tên bằng logo. */
export const ABOUT_TIMELINE = [
  { year: '2011', title: 'Khởi đầu hành trình', text: 'Thành lập Kim Thành Đông tại Vũng Tàu.' },
  { year: '2018', title: 'HARTNER · TECNA', text: 'Bắt đầu phân phối HARTNER và TECNA.' },
  { year: '2019', title: 'BUCHEM · MORRISFLEX · ATA TOOLS · SLOKY', text: 'Thêm 4 thương hiệu công nghiệp quốc tế.' },
  { year: '2021', title: 'TECHNOMARK · DIPROFIL', text: 'Giải pháp đánh dấu & hoàn thiện bề mặt.' },
  { year: '2022', title: 'MARTOR · TSCHORN · FIAM · LENZKES · ROCKLIN', text: 'Mở rộng mạnh mạng lưới thương hiệu.' },
  { year: '2023', title: 'KARNASCH', text: 'Bổ sung dụng cụ cắt gọt chuyên nghiệp.' },
  { year: '2024', title: 'RTC', text: 'Khớp nối nhanh công nghiệp.' },
  { year: '2025', title: 'BEVELTOOLS', text: 'Vát mép và xử lý cạnh kim loại.' },
  { year: '2026', title: 'HELICAL · COREHOG', text: 'Gia công chính xác và vật liệu composite.' },
]
