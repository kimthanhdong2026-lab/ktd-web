/**
 * Toàn bộ chữ hiển thị cho khách, bản tiếng Việt.
 *
 * Đây là bản gốc và cũng là khuôn kiểu: `lib/i18n/en.ts` khai kiểu theo file
 * này, nên thiếu một khoá là TypeScript báo lỗi ngay lúc build chứ không đợi
 * tới khi khách nhìn thấy ô trống.
 *
 * Không để chữ hiển thị trong component nữa. Số điện thoại, email và địa chỉ
 * vật lý vẫn nằm ở lib/constants.ts vì chúng không đổi theo ngôn ngữ.
 */
export const vi = {
  nav: {
    home: 'TRANG CHỦ',
    about: 'GIỚI THIỆU',
    products: 'SẢN PHẨM',
    news: 'TIN TỨC',
    contact: 'LIÊN HỆ',
  },

  header: {
    searchPlaceholder: 'Tìm kiếm sản phẩm',
    quote: 'Báo giá',
    switchTo: 'Chuyển sang tiếng Anh',
    menu: 'Menu',
    close: 'Đóng',
  },

  hero: {
    badge: 'GIẢI PHÁP TỐI ƯU · THƯƠNG HIỆU UY TÍN · ĐỒNG HÀNH DÀI HẠN',
    badgeShort: 'TỐI ƯU · UY TÍN · DÀI HẠN',
    title: 'Phân phối dụng cụ & thiết bị công nghiệp',
    subtitle:
      'Hợp tác trực tiếp với hãng sản xuất · Tư vấn sản phẩm phù hợp · Hỗ trợ nhanh chóng',
    searchPlaceholder: 'Nhập mã hàng, tên sản phẩm hoặc thương hiệu…',
    searchButton: 'Tìm',
    searchLabel: 'Tìm kiếm sản phẩm',
    chipsPrefix: 'Tìm nhiều:',
    chips: ['Mũi mài', 'Dao an toàn', 'Máy vát mép', 'Máy mài khí nén', 'Máy đánh dấu'],
    ctaProducts: 'Xem sản phẩm',
    ctaQuote: 'Tư vấn & Báo giá',
    statYears: 'Năm kinh nghiệm',
    statBrands: 'Thương hiệu quốc tế',
    statCustomers: 'Khách hàng doanh nghiệp',
    scrollHint: '↓ CUỘN XUỐNG',
  },

  brands: {
    eyebrow: 'Phân phối chính hãng',
    heading: (n: number) => `${n} thương hiệu quốc tế chúng tôi đang phân phối`,
    intro:
      'Mỗi thương hiệu Kim Thành Đông phân phối đảm nhiệm một thế mạnh chuyên biệt. Khi kết hợp lại, các thương hiệu này tạo thành một hệ sản phẩm bổ trợ xuyên suốt nhiều công đoạn của quá trình sản xuất công nghiệp.',
    cta: 'Xem tất cả sản phẩm theo thương hiệu →',
    viewProducts: (name: string) => `Xem sản phẩm ${name} →`,
    productsOf: (name: string) => `Sản phẩm ${name}`,
  },

  categories: {
    heading: 'Danh mục sản phẩm',
  },

  brandPage: {
    navLabel: 'THƯƠNG HIỆU',
    listHeading: '19 thương hiệu quốc tế chúng tôi đang phân phối',
    listSub: 'Mỗi thương hiệu đảm nhiệm một thế mạnh chuyên biệt. Chọn một hãng để xem đầy đủ dòng sản phẩm KTĐ cung cấp.',
    from: (xu: string) => `Thương hiệu đến từ ${xu}`,
    dongSp: 'Dòng sản phẩm KTĐ cung cấp',
    noiBat: 'Điểm nổi bật',
    ungDung: 'Ứng dụng tiêu biểu',
    productsHeading: (ten: string) => `Sản phẩm ${ten}`,
    filterLabel: 'Nhóm sản phẩm',
    filterAll: 'Tất cả',
    empty: 'Hãng này chưa có sản phẩm trên website. Liên hệ KTĐ để được tư vấn.',
    viewAll: (ten: string) => `Xem tất cả sản phẩm ${ten}`,
    count: (n: number) => `${n} sản phẩm`,
  },

  sectors: {
    heading: 'Lĩnh vực phục vụ',
    cards: [
      { name: 'Gia công cơ khí & CNC', desc: 'Cắt gọt, đo kiểm, gá kẹp, hoàn thiện bề mặt.' },
      {
        name: 'Khuôn mẫu & ép nhựa',
        desc: 'Gá kẹp, đánh bóng, sửa chữa khuôn, vệ sinh & bảo trì khuôn.',
      },
      { name: 'Ô tô & linh kiện', desc: 'Siết lắp ráp, đánh dấu số series, mã QR.' },
      {
        name: 'Hàng không vũ trụ',
        desc: 'Gia công composite, cắt gọt chính xác, hoàn thiện bề mặt.',
      },
      {
        name: 'Đóng tàu & kết cấu kim loại',
        desc: 'Vát mép, mài hoàn thiện, đánh dấu mã code, dụng cụ khí nén.',
      },
      { name: 'Dầu khí & năng lượng', desc: 'Gia công, bảo trì, đánh dấu, hoàn thiện kim loại.' },
      {
        name: 'Điện tử & lắp ráp công nghiệp chính xác',
        desc: 'Siết kiểm soát lực, đánh dấu mã code, nâng hạ hỗ trợ.',
      },
    ],
  },

  featured: {
    heading: 'Sản phẩm được quan tâm',
  },

  why: {
    heading: 'Vì sao chọn Kim Thành Đông',
    items: [
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
    ],
  },

  news: {
    heading: 'Tin tức & Kiến thức',
    viewAll: 'Xem tất cả tin tức →',
    related: 'Sản phẩm liên quan',
    all: 'Tất cả',
    empty: 'Chưa có bài viết trong chuyên mục này.',
    tabsLabel: 'Chuyên mục',
    bodyPlaceholder:
      'Nội dung chi tiết của bài viết sẽ được đội ngũ kỹ thuật Kim Thành Đông biên soạn, tập trung vào ứng dụng thực tế tại nhà máy và hướng dẫn lựa chọn thiết bị phù hợp.',
    galleryViews: ['Mặt trước', 'Mặt bên', 'Góc 45°', 'Chi tiết cơ cấu', 'Đang sử dụng'],
    imagePlaceholder: '[ ẢNH 16:9 ]',
  },

  products: {
    title: 'Khám phá danh mục sản phẩm Kim Thành Đông đang phân phối',
    subtitle:
      'Tìm kiếm nhanh theo tên sản phẩm, mã hàng, thương hiệu hoặc danh mục bằng tiếng Việt hoặc tiếng Anh.',
    searchPlaceholder: 'Tìm mã hàng, tên sản phẩm, thương hiệu…',
    searchLabel: 'Tìm trong danh mục sản phẩm',
    filters: 'BỘ LỌC',
    pagination: 'Phân trang',
    prevPage: 'Trang trước',
    nextPage: 'Trang sau',
    goToPage: (n: number) => `Tới trang ${n}`,
    pageOf: (t: number, s: number, tong: number) => `Trang ${t} / ${s} — ${tong} sản phẩm`,
    empty: 'Không tìm thấy sản phẩm nào phù hợp. Thử bỏ bớt bộ lọc hoặc đổi từ khóa.',
    clearFilters: 'Xóa bộ lọc',
    brand: 'Thương hiệu',
    category: 'Danh mục',
    filterButton: 'Bộ lọc',
    filterSheetLabel: 'Bộ lọc sản phẩm',
    sortLabel: 'Sắp xếp:',
    sorts: {
      default: 'Mặc định',
      brand: 'Thương hiệu A–Z',
      name: 'Tên A–Z',
      new: 'Mới nhất',
    },
    matched: 'sản phẩm phù hợp',
    countOf: (n: number) => `${n} sản phẩm`,
    removeFilter: 'Bỏ lọc',
    loadMore: 'Tải thêm sản phẩm',
    showing: (shown: number, total: number) =>
      `Đang hiện ${shown} trong ${total} sản phẩm. Dùng bộ lọc để thu hẹp kết quả.`,
    apply: (n: number) => `Áp dụng (${n} sản phẩm)`,
    viewAllOf: (name: string) => `Xem tất cả sản phẩm ${name} →`,
    emptyTitle: 'Không tìm thấy sản phẩm phù hợp',
    emptyBody: 'Thử bỏ bớt bộ lọc, hoặc để kỹ sư của chúng tôi tìm giúp bạn.',
    emptyCta: 'Nhờ kỹ sư tìm giúp',
    emptyNote: 'Nhờ kỹ sư tư vấn sản phẩm phù hợp với nhu cầu của tôi.',
    metaTitle: 'Sản phẩm — Thiết bị công nghiệp chính hãng',
    metaDesc: (brands: number, items: number) =>
      `${brands} thương hiệu chính hãng · ${items} mã hàng. Lọc theo thương hiệu, danh mục hoặc lĩnh vực; tải catalog PDF và nhận báo giá sớm nhất.`,
  },

  product: {
    partNo: 'Mã hàng',
    brand: 'Thương hiệu',
    origin: 'Xuất xứ',
    addToQuote: '+ THÊM VÀO YÊU CẦU BÁO GIÁ',
    addToQuoteShort: '+ Thêm báo giá',
    detail: 'Chi tiết →',
    detailOf: (name: string) => `Xem chi tiết ${name}`,
    needAdvice: 'Cần tư vấn kỹ thuật?',
    adviceBody: 'Kỹ sư giàu kinh nghiệm sẵn sàng hỗ trợ chọn đúng thông số.',
    quoteBody: 'Nhận báo giá sớm nhất.',
    sendQuote: 'Gửi yêu cầu báo giá',
    requestQuote: 'Yêu cầu báo giá sỉ / lẻ',
    related: 'Sản phẩm cùng dòng',
    updatingImage: 'Đang cập nhật ảnh',
    notFound: 'Không tìm thấy sản phẩm',
    tabs: {
      desc: 'MÔ TẢ',
      specs: 'THÔNG SỐ KỸ THUẬT',
      apps: 'ỨNG DỤNG',
      docs: 'TÀI LIỆU',
    },
    download: 'Tải về',
    docTitle: (name: string) => `Tài liệu kỹ thuật ${name}`,
    catalogTitle: (series: string) => `Catalog ${series} Series`,
    downloadPdf: 'Tải tài liệu kỹ thuật (PDF)',
    pages: (n: number) => `${n} tr.`,
    manufacturerPage: 'Trang sản phẩm của hãng',
    descFallback: (series: string) =>
      `Sản phẩm được phân phối chính hãng bởi Kim Thành Đông, kèm hỗ trợ kỹ thuật và catalog đầy đủ của cả dòng ${series}.`,
    metaDesc: (desc: string, part: string, brand: string) =>
      `${desc} Mã ${part}, thương hiệu ${brand}. Tải catalog PDF, nhận báo giá sớm nhất.`,
  },

  search: {
    placeholder: 'Tìm mã hàng, tên sản phẩm, thương hiệu…',
    dialogLabel: 'Tìm kiếm sản phẩm',
    recent: 'Tìm kiếm gần đây',
    products: 'Sản phẩm',
    brands: 'Thương hiệu',
    categories: 'Danh mục',
    results: (n: number) => `${n} kết quả`,
    noResultsTitle: 'Không thấy thứ bạn cần?',
    noResultsBody: 'Kỹ sư của chúng tôi tìm giúp bạn.',
    askEngineer: 'Nhờ kỹ sư tìm giúp',
    askNote: (q: string) => `Tôi đang tìm: "${q}". Nhờ kỹ sư tư vấn giúp.`,
  },

  rfq: {
    title: 'Yêu cầu báo giá',
    productList: 'Danh sách sản phẩm',
    contactInfo: 'Thông tin liên hệ',
    name: 'Họ và tên',
    company: 'Công ty',
    phone: 'Số điện thoại',
    email: 'Email',
    note: 'Ghi chú',
    submit: 'Gửi yêu cầu báo giá',
    sending: 'Đang gửi…',
    sentTitle: 'Đã nhận yêu cầu báo giá',
    sentBody: 'Chúng tôi sẽ phản hồi sớm nhất.',
    yourCode: 'Mã yêu cầu của bạn',
    empty: 'Chưa có sản phẩm nào trong yêu cầu.',
    decrease: (part: string) => `Giảm số lượng ${part}`,
    increase: (part: string) => `Tăng số lượng ${part}`,
    remove: (part: string) => `Xóa ${part}`,
    added: (name: string) => `Đã thêm ${name} vào yêu cầu báo giá`,
    errName: 'Vui lòng nhập họ tên.',
    errPhone: 'Vui lòng nhập số điện thoại.',
    errEmail: 'Email chưa đúng định dạng.',
  },

  footer: {
    links: 'Liên kết',
    categories: 'Danh mục',
    contact: 'Liên hệ',
    viewAllCategories: 'Xem tất cả danh mục →',
    rights: (year: number, company: string) => `© ${year} ${company}. Bản quyền được bảo lưu.`,
    intro:
      'Kim Thành Đông trực tiếp hợp tác với các nhà sản xuất quốc tế để phân phối dụng cụ, thiết bị và sản phẩm công nghiệp tại thị trường Việt Nam.',
  },

  about: {
    heading: 'Đồng hành cùng công nghiệp Việt Nam từ 2011',
    metaTitle: 'Giới thiệu — Đồng hành cùng công nghiệp Việt Nam từ 2011',
    metaDesc:
      'Công ty TNHH Kim Thành Đông thành lập 2011, phân phối dụng cụ, thiết bị và sản phẩm công nghiệp tại Việt Nam.',
    story: [
      'Công ty TNHH Kim Thành Đông được thành lập từ năm 2011, hoạt động trong lĩnh vực phân phối dụng cụ, thiết bị và sản phẩm công nghiệp tại Việt Nam.',
      'Trong suốt quá trình phát triển, Kim Thành Đông từng bước xây dựng quan hệ hợp tác trực tiếp với các nhà sản xuất chuyên ngành đến từ Đức, Mỹ, Ý, Pháp, Thụy Điển và nhiều quốc gia khác. Mỗi thương hiệu mang một thế mạnh riêng, từ gia công cắt gọt, đo kiểm, gá kẹp, mài và hoàn thiện bề mặt đến siết lắp ráp, đánh dấu, nâng hạ, bảo trì và an toàn.',
      'Sự kết hợp của các thương hiệu này tạo nên một hệ sản phẩm có tính bổ trợ cao, đáp ứng nhiều công đoạn khác nhau trong quá trình sản xuất công nghiệp. Đây cũng là định hướng Kim Thành Đông theo đuổi: không mở rộng danh mục một cách dàn trải, mà lựa chọn những nhà sản xuất có chuyên môn rõ ràng, sản phẩm có giá trị ứng dụng thực tế và có khả năng bổ trợ cho nhau.',
      'Bên cạnh việc cung cấp sản phẩm chính hãng, Kim Thành Đông chú trọng hỗ trợ khách hàng lựa chọn sản phẩm phù hợp với yêu cầu sử dụng, cung cấp đầy đủ thông tin và tài liệu từ nhà sản xuất, đồng thời duy trì khả năng cung ứng ổn định và hỗ trợ lâu dài trong quá trình sử dụng.',
      'Từ nền tảng được xây dựng từ năm 2011, Kim Thành Đông tiếp tục phát triển danh mục sản phẩm và mạng lưới đối tác với mục tiêu trở thành một đơn vị phân phối công nghiệp đáng tin cậy, kết nối các nhà sản xuất quốc tế với thị trường Việt Nam bằng sự chuyên nghiệp, minh bạch và hợp tác bền vững.',
    ],
    photos: ['Văn phòng & kho hàng', 'Đội ngũ kỹ thuật', 'Triển lãm MTA Vietnam'],
    photoPlaceholder: '[ ẢNH ]',
    visionHeading: 'Tầm nhìn',
    vision:
      'Trở thành đơn vị phân phối công nghiệp đáng tin cậy tại Việt Nam, kết nối hiệu quả các nhà sản xuất quốc tế với nhu cầu thực tế của thị trường.',
    missionHeading: 'Sứ mệnh',
    mission:
      'Mang đến thị trường Việt Nam các sản phẩm công nghiệp chính hãng, có giá trị ứng dụng thực tế; đồng thời hỗ trợ khách hàng lựa chọn sản phẩm phù hợp nhất.',
    valuesHeading: 'Giá trị chúng tôi theo đuổi',
    values: [
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
      { title: 'Tuân thủ', body: 'Hoạt động đúng pháp luật, quy trình và chuẩn mực kinh doanh.' },
    ],
    timelineHeading: 'Chặng đường phát triển',
    timeline: [
      { year: '2011', title: 'KHỞI ĐẦU', text: 'Thành lập Kim Thành Đông tại Vũng Tàu.' },
      { year: '2018', title: 'HARTNER · TECNA', text: 'Bắt đầu phân phối HARTNER và TECNA.' },
      {
        year: '2019',
        title: 'BUCHEM · MORRISFLEX · ATA · SLOKY · GARRYSON',
        text: 'Thêm 5 thương hiệu công nghiệp quốc tế.',
      },
      {
        year: '2021',
        title: 'TECHNOMARK · DIPROFIL',
        text: 'Giải pháp đánh dấu & hoàn thiện bề mặt.',
      },
      {
        year: '2022',
        title: 'MARTOR · TSCHORN · FIAM · LENZKES · ROCKLIN',
        text: 'Mở rộng mạnh mạng lưới thương hiệu.',
      },
      { year: '2023', title: 'KARNASCH', text: 'Bổ sung dụng cụ cắt gọt chuyên nghiệp.' },
      { year: '2024', title: 'RTC', text: 'Khớp nối nhanh công nghiệp.' },
      { year: '2025', title: 'BEVELTOOLS', text: 'Vát mép và xử lý cạnh kim loại.' },
      {
        year: '2026',
        title: 'HELICAL · COREHOG',
        text: 'Gia công chính xác và vật liệu composite.',
      },
    ],
  },

  company: {
    legalName: 'Công ty TNHH Kim Thành Đông',
    addresses: [
      'Số 444A Bình Giã, P. Tam Thắng, Tp. Hồ Chí Minh',
      'Tầng trệt Seaview 4, KĐT Chí Linh, P. Rạch Dừa, Tp. Hồ Chí Minh',
      '326 Võ Văn Hát, P. Long Trường, Tp. Hồ Chí Minh',
      'Ruby City CT1, P. Việt Hưng, Tp. Hà Nội',
    ],
  },

  contact: {
    metaTitle: 'Liên hệ',
    metaDesc: 'Địa chỉ, điện thoại, email và giờ làm việc của Công ty TNHH Kim Thành Đông.',
    registeredOffice: 'Địa chỉ ĐKKD',
    offices: ['Văn phòng làm việc', 'Kho hàng HCM', 'Kho hàng Hà Nội'],
    phone: 'Điện thoại',
    hotline1: 'Hotline 1 (Zalo)',
    hotline2: 'Hotline 2 (Zalo & WhatsApp)',
    email: 'Email',
    website: 'Website',
    hours: 'Giờ làm việc:',
    workingHours: ['7h30 – 17h00, Thứ 2 đến Thứ 6', '7h30 – 11h30, Thứ 7'],
    mapPlaceholder: '[ BẢN ĐỒ NHÚNG — SEAVIEW 4 ]',
  },

  cta: {
    quote: 'Yêu cầu báo giá',
    chatZalo: 'Chat Zalo',
    call: 'Gọi ngay',
    search: 'Tìm kiếm',
    backToTop: 'Về đầu trang',
  },

  meta: {
    siteTitle: 'Kim Thành Đông — Thiết bị công nghiệp & Giải pháp kỹ thuật',
    siteDesc: 'Thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá sớm nhất.',
  },
}

export type Dictionary = typeof vi
