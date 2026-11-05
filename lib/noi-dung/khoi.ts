/**
 * Các KHỐI admin sửa được, và trong mỗi khối là những Ô nào.
 *
 * Nguyên tắc "nhìn là hiểu": khối ở đây đặt tên và đánh số đúng như thứ tự
 * trên trang web; tên ô đặt theo chữ khách nhìn thấy. Mỗi ô trỏ vào một
 * đường dẫn trong từ điển lib/i18n (ví dụ 'hero.title'), nên chữ mặc định
 * chính là chữ đang có trong mã — không chép lại ở đâu cả.
 *
 * Ô `chung` là thứ không theo ngôn ngữ: ảnh, đường dẫn, số điện thoại.
 *
 * File này được cả trình duyệt nhập (form admin), nên không nhập gì của máy chủ.
 */
export type KieuTruong = 'text' | 'textarea' | 'danh-sach' | 'anh' | 'nhom'

export interface Truong {
  /** Đường dẫn trong từ điển, hoặc tên ô trong `chung` khi chung = true.
      Trong `con` của ô nhóm: đường dẫn tương đối trong một mục. */
  duong: string
  nhan: string
  kieu: KieuTruong
  /** Một giá trị cho cả hai ngôn ngữ (ảnh, số, đường dẫn). */
  chung?: boolean
  goiY?: string
  /** Ô nhóm (danh sách thẻ): các ô của mỗi mục. */
  con?: Truong[]
  toiThieu?: number
  toiDa?: number
  /** Mặc định cho ô chung; ô trong nhóm nhận thêm số thứ tự mục. */
  macDinhChung?: string | ((i: number) => string)
  /** Ảnh: khung để thu về khi tải lên (rộng × cao). */
  khungAnh?: { rong: number; cao: number; kieu?: 'cover' | 'contain' }
}

export interface Khoi {
  khoa: string
  /** Số thứ tự hiện trên khung trong màn hình quản trị. */
  so: number
  ten: string
  moTa?: string
  truong: Truong[]
}

export const KHOI_TRANG_CHU: Khoi[] = [
  {
    khoa: 'trang-chu.dau-trang',
    so: 1,
    ten: 'Dải đầu trang',
    moTa: 'Phần nền video với tiêu đề lớn, ô tìm kiếm và ba con số.',
    truong: [
      { duong: 'hero.badge', nhan: 'Dòng nhãn trên tiêu đề', kieu: 'text' },
      { duong: 'hero.badgeShort', nhan: 'Dòng nhãn — bản ngắn cho điện thoại', kieu: 'text' },
      { duong: 'hero.title', nhan: 'Tiêu đề lớn', kieu: 'text' },
      { duong: 'hero.subtitle', nhan: 'Câu dưới tiêu đề', kieu: 'textarea' },
      { duong: 'hero.searchPlaceholder', nhan: 'Chữ mờ trong ô tìm kiếm', kieu: 'text' },
      { duong: 'hero.chipsPrefix', nhan: 'Nhãn trước các từ khóa gợi ý', kieu: 'text' },
      { duong: 'hero.chips', nhan: 'Từ khóa gợi ý (mỗi dòng một từ)', kieu: 'danh-sach', toiDa: 6 },
      { duong: 'hero.ctaProducts', nhan: 'Nút 1', kieu: 'text' },
      { duong: 'hero.ctaQuote', nhan: 'Nút 2', kieu: 'text' },
      { duong: 'soNam', nhan: 'Con số 1', kieu: 'text', chung: true, macDinhChung: '15+' },
      { duong: 'hero.statYears', nhan: 'Chữ dưới con số 1', kieu: 'text' },
      { duong: 'hero.statBrands', nhan: 'Chữ dưới con số 2 (số hãng tự đếm)', kieu: 'text' },
      { duong: 'soKhach', nhan: 'Con số 3', kieu: 'text', chung: true, macDinhChung: '500+' },
      { duong: 'hero.statCustomers', nhan: 'Chữ dưới con số 3', kieu: 'text' },
    ],
  },
  {
    khoa: 'trang-chu.thuong-hieu',
    so: 2,
    ten: 'Thương hiệu phân phối',
    moTa: 'Chữ của khối. Logo và thứ tự hãng sửa ở mục Thương hiệu.',
    truong: [
      { duong: 'brands.eyebrow', nhan: 'Dòng nhỏ trên tiêu đề', kieu: 'text' },
      { duong: 'brands.heading', nhan: 'Tiêu đề ({0} = số hãng, tự đếm)', kieu: 'text' },
      { duong: 'brands.intro', nhan: 'Đoạn giới thiệu', kieu: 'textarea' },
      { duong: 'brands.cta', nhan: 'Liên kết cuối khối', kieu: 'text' },
    ],
  },
  {
    khoa: 'trang-chu.danh-muc',
    so: 3,
    ten: 'Danh mục sản phẩm',
    moTa: 'Tiêu đề khối. Tên, câu nhỏ và ảnh của từng ô sửa ở bảng bên dưới.',
    truong: [{ duong: 'categories.heading', nhan: 'Tiêu đề', kieu: 'text' }],
  },
  {
    khoa: 'trang-chu.linh-vuc',
    so: 4,
    ten: 'Lĩnh vực phục vụ',
    moTa: 'Băng thẻ tự chạy ngang. Mỗi thẻ: ảnh 3:2, tên và một câu.',
    truong: [
      { duong: 'sectors.heading', nhan: 'Tiêu đề', kieu: 'text' },
      {
        duong: 'sectors.cards',
        nhan: 'Các thẻ',
        kieu: 'nhom',
        toiThieu: 4,
        toiDa: 10,
        con: [
          { duong: 'name', nhan: 'Tên lĩnh vực', kieu: 'text' },
          { duong: 'desc', nhan: 'Một câu mô tả', kieu: 'text' },
          {
            duong: 'anh', nhan: 'Ảnh (3:2)', kieu: 'anh', chung: true,
            macDinhChung: (i) => `/sectors/${i + 1}.webp`,
            khungAnh: { rong: 1020, cao: 680, kieu: 'cover' },
          },
        ],
      },
    ],
  },
  {
    khoa: 'trang-chu.vi-sao',
    so: 5,
    ten: 'Vì sao chọn Kim Thành Đông',
    moTa: 'Bốn ô lục giác. Bố cục chịu được 3–4 ô.',
    truong: [
      { duong: 'why.heading', nhan: 'Tiêu đề', kieu: 'text' },
      {
        duong: 'why.items', nhan: 'Các ô', kieu: 'nhom', toiThieu: 3, toiDa: 4,
        con: [
          { duong: 'title', nhan: 'Tiêu đề ô', kieu: 'text' },
          { duong: 'body', nhan: 'Nội dung', kieu: 'textarea' },
        ],
      },
    ],
  },
  {
    khoa: 'trang-chu.tin-tuc',
    so: 6,
    ten: 'Tin tức & Kiến thức',
    moTa: 'Chữ của khối. Bài viết sửa ở mục Tin tức (bước sau).',
    truong: [
      { duong: 'news.heading', nhan: 'Tiêu đề', kieu: 'text' },
      { duong: 'news.viewAll', nhan: 'Liên kết xem tất cả', kieu: 'text' },
    ],
  },
]

export const KHOI_CHUNG: Khoi[] = [
  {
    khoa: 'chung.thanh-dau-trang',
    so: 0,
    ten: 'Thanh đầu trang',
    moTa: 'Menu và hai nút bên phải. Hiện ở mọi trang.',
    truong: [
      { duong: 'nav.home', nhan: 'Menu 1', kieu: 'text' },
      { duong: 'nav.about', nhan: 'Menu 2', kieu: 'text' },
      { duong: 'nav.products', nhan: 'Menu 3', kieu: 'text' },
      { duong: 'brandPage.navLabel', nhan: 'Menu 4', kieu: 'text' },
      { duong: 'nav.news', nhan: 'Menu 5', kieu: 'text' },
      { duong: 'nav.contact', nhan: 'Menu 6', kieu: 'text' },
      { duong: 'header.searchPlaceholder', nhan: 'Chữ trong ô tìm kiếm', kieu: 'text' },
      { duong: 'header.quote', nhan: 'Nút báo giá', kieu: 'text' },
    ],
  },
  {
    khoa: 'chung.lien-he',
    so: 8,
    ten: 'Thông tin liên hệ',
    moTa: 'Số điện thoại, email, mạng xã hội — dùng ở đầu trang và chân trang.',
    truong: [
      { duong: 'hotline', nhan: 'Hotline (hiện ở đầu trang)', kieu: 'text', chung: true, macDinhChung: '0914 897 227',
        goiY: 'Bản tiếng Anh tự đổi sang dạng +84' },
      { duong: 'dienThoai', nhan: 'Điện thoại bàn', kieu: 'text', chung: true, macDinhChung: '02543 627760' },
      { duong: 'hotline2', nhan: 'Hotline 2', kieu: 'text', chung: true, macDinhChung: '0974 516 416' },
      { duong: 'email', nhan: 'Email', kieu: 'text', chung: true, macDinhChung: 'sales@kimthanhdong.com' },
      { duong: 'facebook', nhan: 'Đường dẫn Facebook', kieu: 'text', chung: true,
        macDinhChung: 'https://www.facebook.com/kimthanhdongthietbicongnghiepvietnam' },
      { duong: 'youtube', nhan: 'Đường dẫn YouTube', kieu: 'text', chung: true, macDinhChung: 'https://www.youtube.com/@kimthanhdong' },
      { duong: 'linkedin', nhan: 'Đường dẫn LinkedIn', kieu: 'text', chung: true,
        macDinhChung: 'https://www.linkedin.com/company/kim-thanh-dong-co-ltd/' },
      { duong: 'shopee', nhan: 'Đường dẫn gian hàng Shopee', kieu: 'text', chung: true, macDinhChung: 'https://shopee.vn/shop/961761465' },
      { duong: 'company.addresses', nhan: 'Địa chỉ (ĐKKD, văn phòng, kho HCM, kho Hà Nội)', kieu: 'danh-sach', toiThieu: 4, toiDa: 4 },
    ],
  },
  {
    khoa: 'chung.chan-trang',
    so: 9,
    ten: 'Chân trang',
    truong: [
      { duong: 'footer.intro', nhan: 'Đoạn giới thiệu', kieu: 'textarea' },
      { duong: 'footer.links', nhan: 'Tiêu đề cột 2', kieu: 'text' },
      { duong: 'footer.categories', nhan: 'Tiêu đề cột 3', kieu: 'text' },
      { duong: 'footer.viewAllCategories', nhan: 'Liên kết cuối cột 3', kieu: 'text' },
      { duong: 'footer.contact', nhan: 'Tiêu đề cột 4', kieu: 'text' },
    ],
  },
]

export const TAT_CA_KHOI = [...KHOI_CHUNG, ...KHOI_TRANG_CHU]

export const timKhoi = (khoa: string) => TAT_CA_KHOI.find((k) => k.khoa === khoa)

/** Dạng +84 cho bản tiếng Anh và cho đường dẫn tel:. '0914 897 227' -> '+84 914 897 227'. */
export const soQuocTe = (so: string) => so.trim().replace(/^0/, '+84 ')
export const soTel = (so: string) => soQuocTe(so).replace(/\s+/g, '')
