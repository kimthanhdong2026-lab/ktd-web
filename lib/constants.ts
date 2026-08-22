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
export const COMPANY_EMAIL = 'sales@kimthanhdong.com'
export const COMPANY_WEBSITE = 'kimthanhdong.vn'
export const ZALO_URL = 'https://zalo.me/0914897227'

export const COMPANY_INTRO =
  'Nhà cung cấp giải pháp, thiết bị và dụng cụ công nghiệp từ các thương hiệu quốc tế uy tín, phục vụ doanh nghiệp sản xuất tại Việt Nam.'

export const WORKING_HOURS = [
  '7h30 – 17h00, Thứ 2 đến Thứ 6',
  '7h30 – 11h30, Thứ 7',
]

/** Văn phòng và kho. Trụ sở đăng ký nằm riêng ở COMPANY_ADDRESS. */
export const OFFICES = [
  { name: 'Văn phòng', addr: 'Tầng trệt Seaview 4, KĐT Chí Linh, P. Rạch Dừa, Tp. Hồ Chí Minh' },
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
export const FEATURED_CATEGORIES = ['mai-hoan-thien', 'cat-got-cnc', 'an-toan', 'kep-ve-sinh-khuon']

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

export const WHY_ITEMS = [
  {
    title: 'Thương hiệu uy tín',
    body: 'Phân phối sản phẩm từ các nhà sản xuất công nghiệp uy tín trên thế giới.',
  },
  {
    title: 'Tư vấn đúng giải pháp',
    body: 'Lựa chọn sản phẩm phù hợp yêu cầu và ứng dụng của khách hàng.',
  },
  {
    title: 'Sản phẩm chính hãng',
    body: 'Nguồn gốc rõ ràng, tài liệu và bảo hành đầy đủ.',
  },
  {
    title: 'Hợp tác, hỗ trợ lâu dài',
    body: 'Dịch vụ chuyên nghiệp và luôn đồng hành cùng khách hàng.',
  },
]

export const SECTOR_CARDS = [
  { name: 'Gia công cơ khí & CNC', desc: 'Cắt gọt, đo kiểm, gá kẹp, hoàn thiện bề mặt.' },
  { name: 'Khuôn mẫu & ép nhựa', desc: 'Gá kẹp, đánh bóng, sửa chữa khuôn, vệ sinh & bảo trì khuôn.' },
  { name: 'Ô tô & linh kiện', desc: 'Siết lắp ráp, đánh dấu số series, mã QR.' },
  { name: 'Hàng không vũ trụ', desc: 'Gia công composite, cắt gọt chính xác, hoàn thiện bề mặt.' },
  { name: 'Đóng tàu & kết cấu kim loại', desc: 'Vát mép, mài hoàn thiện, đánh dấu mã code, dụng cụ khí nén.' },
  { name: 'Dầu khí & năng lượng', desc: 'Gia công, bảo trì, đánh dấu, hoàn thiện kim loại.' },
  { name: 'Điện tử & lắp ráp chính xác', desc: 'Siết kiểm soát lực, đánh dấu mã code, nâng hạ hỗ trợ.' },
]

export const ABOUT_STORY = [
  'Công ty TNHH Kim Thành Đông được thành lập từ năm 2011, với định hướng cung cấp thiết bị, dụng cụ công nghiệp chất lượng cao và các giải pháp phục vụ hoạt động sản xuất công nghiệp tại Việt Nam.',
  'Trong quá trình hoạt động, Kim Thành Đông từng bước xây dựng quan hệ hợp tác với các nhà sản xuất công nghiệp uy tín đến từ Đức, Mỹ, Ý và nhiều quốc gia khác. Danh mục sản phẩm của chúng tôi tập trung vào những nhu cầu thực tế trong nhà máy như gia công cơ khí, khuôn mẫu, lắp ráp, đánh dấu và truy xuất, nâng hạ, an toàn lao động, bảo trì và hoàn thiện bề mặt.',
  'Chúng tôi hiểu rằng trong môi trường sản xuất, một sản phẩm phù hợp không chỉ cần đáp ứng yêu cầu kỹ thuật mà còn phải cân bằng giữa chất lượng, hiệu quả sử dụng, chi phí và khả năng cung ứng. Vì vậy, Kim Thành Đông không chỉ dừng lại ở việc cung cấp sản phẩm mà hướng đến việc giúp khách hàng lựa chọn giải pháp phù hợp với nhu cầu thực tế.',
  'Sau hơn một thập kỷ hoạt động, Kim Thành Đông đã có cơ hội phục vụ khách hàng thuộc nhiều lĩnh vực như gia công cơ khí & CNC, khuôn mẫu & ép nhựa, ô tô, điện tử, hàng không, đóng tàu và năng lượng. Chính những yêu cầu đa dạng từ khách hàng đã giúp chúng tôi ngày càng hiểu hơn về thị trường và liên tục hoàn thiện danh mục sản phẩm cũng như chất lượng dịch vụ của mình.',
  'Kim Thành Đông hướng đến những mối quan hệ hợp tác lâu dài, dựa trên sự minh bạch, trách nhiệm và lợi ích bền vững của các bên. Chúng tôi mong muốn trở thành một đối tác đáng tin cậy, kết nối các công nghệ và sản phẩm công nghiệp chất lượng từ thế giới với nhu cầu ngày càng phát triển của doanh nghiệp Việt Nam.',
]

export const ABOUT_VISION =
  'Trở thành đối tác cung ứng đáng tin cậy của các doanh nghiệp sản xuất tại Việt Nam, kết nối những sản phẩm và công nghệ công nghiệp chất lượng từ thế giới với nhu cầu thực tế của khách hàng.'

export const ABOUT_MISSION =
  'Cung cấp sản phẩm chất lượng, giải pháp phù hợp và dịch vụ chuyên nghiệp, giúp khách hàng nâng cao hiệu quả và tạo ra giá trị bền vững trong hoạt động sản xuất.'

export const ABOUT_VALUES = [
  {
    title: 'Uy tín & Trách nhiệm',
    body: 'Minh bạch thông tin, chủ động phối hợp và luôn thực hiện đầy đủ những gì đã cam kết.',
  },
  {
    title: 'Phù hợp',
    body: 'Ưu tiên giải pháp phù hợp với nhu cầu thực tế của khách hàng.',
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
