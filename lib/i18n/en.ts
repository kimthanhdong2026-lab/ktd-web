import type { Dictionary } from './vi'

/**
 * Bản tiếng Anh.
 *
 * Khai kiểu `Dictionary` nên thiếu bất kỳ khoá nào là TypeScript báo lỗi lúc
 * build. Không bao giờ có chuyện khách nhìn thấy ô trống vì quên dịch.
 *
 * Thuật ngữ lấy theo cách chính các hãng gọi trong tài liệu tiếng Anh của họ,
 * không tự đặt: "safety cutter" (MARTOR), "carbide burr" (Morrisflex),
 * "quick coupling" (RTC), "workholding" (Lenzkes). Bảng đối chiếu đầy đủ ở
 * lib/i18n/glossary.ts.
 */
export const en: Dictionary = {
  nav: {
    home: 'HOME',
    about: 'ABOUT',
    products: 'PRODUCTS',
    news: 'NEWS',
    contact: 'CONTACT',
  },

  header: {
    searchPlaceholder: 'Search products',
    quote: 'Get a quote',
    switchTo: 'Switch to Vietnamese',
    menu: 'Menu',
    close: 'Close',
  },

  hero: {
    badge: 'PROVEN SOLUTIONS · TRUSTED BRANDS · LONG-TERM PARTNERSHIP',
    badgeShort: 'PROVEN · TRUSTED · LONG-TERM',
    title: 'Industrial tools & equipment distribution',
    subtitle:
      'Direct partnerships with manufacturers · Right-fit product advice · Fast support',
    searchPlaceholder: 'Enter a part number, product name or brand…',
    searchButton: 'Search',
    searchLabel: 'Search products',
    chipsPrefix: 'Popular:',
    chips: [
      'Carbide burrs',
      'Safety cutters',
      'Bevelling machines',
      'Pneumatic grinders',
      'Marking machines',
    ],
    ctaProducts: 'Browse products',
    ctaQuote: 'Advice & quotation',
    statYears: 'Years in business',
    statBrands: 'International brands',
    statCustomers: 'Business customers',
    scrollHint: '↓ SCROLL DOWN',
  },

  brands: {
    eyebrow: 'Authorised distribution',
    heading: (n: number) => `${n} international brands we distribute`,
    intro:
      'Each brand Kim Thanh Dong distributes covers one specific strength. Together they form a complementary product range that spans many stages of industrial production.',
    cta: 'Browse all products by brand →',
    viewProducts: (name: string) => `View ${name} products →`,
    productsOf: (name: string) => `${name} products`,
  },

  categories: {
    heading: 'Product categories',
  },

  sectors: {
    heading: 'Industries we serve',
    cards: [
      {
        name: 'Machining & CNC',
        desc: 'Cutting, measurement, workholding, surface finishing.',
      },
      {
        name: 'Moulds & plastic injection',
        desc: 'Workholding, polishing, mould repair, cleaning & maintenance.',
      },
      { name: 'Automotive & components', desc: 'Assembly tightening, serial number and QR marking.' },
      {
        name: 'Aerospace',
        desc: 'Composite machining, precision cutting, surface finishing.',
      },
      {
        name: 'Shipbuilding & metal structures',
        desc: 'Bevelling, finish grinding, code marking, pneumatic tools.',
      },
      { name: 'Oil, gas & energy', desc: 'Machining, maintenance, marking, metal finishing.' },
      {
        name: 'Electronics & precision assembly',
        desc: 'Torque-controlled tightening, code marking, lifting assistance.',
      },
    ],
  },

  featured: {
    heading: 'Products in demand',
  },

  why: {
    heading: 'Why choose Kim Thanh Dong',
    items: [
      {
        title: 'Trusted brands',
        body: 'Direct partnerships with established industrial manufacturers worldwide.',
      },
      {
        title: 'Right-fit product advice',
        body: 'We help you choose products that match your requirements, application and real working conditions.',
      },
      {
        title: 'Genuine products',
        body: 'Clear provenance, complete technical documentation and manufacturer-backed warranty.',
      },
      {
        title: 'Long-term support',
        body: 'Reliable supply and ongoing support throughout the working life of the product.',
      },
    ],
  },

  news: {
    heading: 'News & Knowledge',
    viewAll: 'View all articles →',
    related: 'Related products',
    all: 'All',
    empty: 'No articles in this category yet.',
    tabsLabel: 'Categories',
    bodyPlaceholder:
      'The full article is being written by the Kim Thanh Dong technical team, focusing on real shop-floor applications and how to choose the right equipment.',
    galleryViews: ['Front', 'Side', '45° angle', 'Mechanism detail', 'In use'],
    imagePlaceholder: '[ 16:9 IMAGE ]',
  },

  products: {
    title: 'Explore the range Kim Thanh Dong distributes',
    subtitle:
      'Search by product name, part number, brand or category — in Vietnamese or English.',
    searchPlaceholder: 'Search part number, product name, brand…',
    searchLabel: 'Search within the product range',
    filters: 'FILTERS',
    clearFilters: 'Clear filters',
    brand: 'Brand',
    category: 'Category',
    filterButton: 'Filters',
    filterSheetLabel: 'Product filters',
    sortLabel: 'Sort:',
    sorts: {
      default: 'Default',
      brand: 'Brand A–Z',
      name: 'Name A–Z',
      new: 'Newest',
    },
    matched: 'products found',
    countOf: (n: number) => `${n} products`,
    removeFilter: 'Remove filter',
    loadMore: 'Load more products',
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} products. Use the filters to narrow your results.`,
    apply: (n: number) => `Apply (${n} products)`,
    viewAllOf: (name: string) => `View all ${name} products →`,
    emptyTitle: 'No matching products',
    emptyBody: 'Try removing some filters, or let our engineers find it for you.',
    emptyCta: 'Ask an engineer',
    emptyNote: 'Please help me find a product that fits my requirements.',
    metaTitle: 'Products — Genuine industrial equipment',
    metaDesc: (brands: number, items: number) =>
      `${brands} genuine brands · ${items} part numbers. Filter by brand, category or industry; download PDF catalogues and request a fast quotation.`,
  },

  product: {
    partNo: 'Part number',
    brand: 'Brand',
    origin: 'Origin',
    addToQuote: '+ ADD TO QUOTE REQUEST',
    addToQuoteShort: '+ Add to quote',
    detail: 'Details →',
    detailOf: (name: string) => `View details for ${name}`,
    needAdvice: 'Need technical advice?',
    adviceBody: 'Our experienced engineers will help you choose the right specification.',
    quoteBody: 'Get a quotation quickly.',
    sendQuote: 'Send quote request',
    requestQuote: 'Request a trade or retail quote',
    related: 'More from this range',
    updatingImage: 'Image coming soon',
    notFound: 'Product not found',
    tabs: {
      desc: 'DESCRIPTION',
      specs: 'SPECIFICATIONS',
      apps: 'APPLICATIONS',
      docs: 'DOCUMENTS',
    },
    download: 'Download',
    docTitle: (name: string) => `${name} technical datasheet`,
    catalogTitle: (series: string) => `${series} Series catalogue`,
    downloadPdf: 'Download technical datasheet (PDF)',
    pages: (n: number) => `${n} page${n === 1 ? '' : 's'}`,
    manufacturerPage: "Manufacturer's product page",
    descFallback: (series: string) =>
      `Distributed by Kim Thanh Dong as an authorised partner, with technical support and the full ${series} range catalogue.`,
    metaDesc: (desc: string, part: string, brand: string) =>
      `${desc} Part ${part}, ${brand} brand. Download the PDF catalogue and request a fast quotation.`,
  },

  search: {
    placeholder: 'Search part number, product name, brand…',
    dialogLabel: 'Search products',
    recent: 'Recent searches',
    products: 'Products',
    brands: 'Brands',
    categories: 'Categories',
    results: (n: number) => `${n} results`,
    noResultsTitle: "Can't find what you need?",
    noResultsBody: 'Our engineers will find it for you.',
    askEngineer: 'Ask an engineer',
    askNote: (q: string) => `I am looking for: "${q}". Please advise.`,
  },

  rfq: {
    title: 'Request a quotation',
    productList: 'Products',
    contactInfo: 'Contact details',
    name: 'Full name',
    company: 'Company',
    phone: 'Phone number',
    email: 'Email',
    note: 'Notes',
    submit: 'Send quote request',
    sending: 'Sending…',
    sentTitle: 'Quote request received',
    sentBody: 'We will get back to you shortly.',
    yourCode: 'Your reference number',
    empty: 'No products in your request yet.',
    decrease: (part: string) => `Decrease quantity of ${part}`,
    increase: (part: string) => `Increase quantity of ${part}`,
    remove: (part: string) => `Remove ${part}`,
    added: (name: string) => `${name} added to your quote request`,
    errName: 'Please enter your name.',
    errPhone: 'Please enter your phone number.',
    errEmail: 'That email address is not valid.',
  },

  footer: {
    links: 'Links',
    categories: 'Categories',
    contact: 'Contact',
    viewAllCategories: 'View all categories →',
    rights: (year: number, company: string) => `© ${year} ${company}. All rights reserved.`,
    intro:
      'Kim Thanh Dong partners directly with international manufacturers to distribute industrial tools, equipment and supplies in Vietnam.',
  },

  about: {
    heading: 'Serving Vietnamese industry since 2011',
    metaTitle: 'About us — Serving Vietnamese industry since 2011',
    metaDesc:
      'Kim Thanh Dong Co., Ltd, founded in 2011, distributes industrial tools, equipment and supplies in Vietnam.',
    story: [
      'Kim Thanh Dong Co., Ltd was founded in 2011 to distribute industrial tools, equipment and supplies in Vietnam.',
      'Over the years the company has built direct partnerships with specialist manufacturers from Germany, the United States, Italy, France, Sweden and other countries. Each brand brings its own strength — from cutting, measurement, workholding, grinding and surface finishing through to assembly tightening, marking, lifting, maintenance and safety.',
      'Together these brands form a highly complementary range that covers many different stages of industrial production. That is the direction Kim Thanh Dong has chosen to follow: not to spread the catalogue thin, but to select manufacturers with clear expertise, products with real application value, and ranges that reinforce one another.',
      'Alongside supplying genuine products, Kim Thanh Dong focuses on helping customers choose what actually fits their requirements, providing full manufacturer information and documentation, and maintaining reliable supply and long-term support in use.',
      'Building on the foundation laid in 2011, Kim Thanh Dong continues to expand its range and partner network with one goal: to be a dependable industrial distributor connecting international manufacturers with the Vietnamese market through professionalism, transparency and lasting partnership.',
    ],
    photos: ['Office & warehouse', 'Technical team', 'MTA Vietnam exhibition'],
    photoPlaceholder: '[ IMAGE ]',
    visionHeading: 'Vision',
    vision:
      'To be a dependable industrial distributor in Vietnam, connecting international manufacturers effectively with what the market actually needs.',
    missionHeading: 'Mission',
    mission:
      'To bring genuine industrial products with real application value to the Vietnamese market, and to help customers choose what suits them best.',
    valuesHeading: 'The values we work by',
    values: [
      {
        title: 'Integrity & accountability',
        body: 'Transparent information, proactive cooperation, and everything we commit to delivered in full.',
      },
      {
        title: 'Fit for purpose',
        body: 'We put the right product for the job ahead of simply making a sale.',
      },
      {
        title: 'Long-term partnership',
        body: 'Relationships built on lasting benefit for both sides.',
      },
      {
        title: 'Compliance',
        body: 'Operating within the law, to proper process and sound business standards.',
      },
    ],
    timelineHeading: 'How we grew',
    timeline: [
      { year: '2011', title: 'The journey begins', text: 'Kim Thanh Dong founded in Vung Tau.' },
      { year: '2018', title: 'HARTNER · TECNA', text: 'Distribution of HARTNER and TECNA begins.' },
      {
        year: '2019',
        title: 'BUCHEM · MORRISFLEX · ATA TOOLS · SLOKY',
        text: 'Four more international industrial brands added.',
      },
      {
        year: '2021',
        title: 'TECHNOMARK · DIPROFIL',
        text: 'Marking and surface finishing solutions.',
      },
      {
        year: '2022',
        title: 'MARTOR · TSCHORN · FIAM · LENZKES · ROCKLIN',
        text: 'Major expansion of the brand network.',
      },
      { year: '2023', title: 'KARNASCH', text: 'Professional cutting tools added.' },
      { year: '2024', title: 'RTC', text: 'Industrial quick couplings.' },
      { year: '2025', title: 'BEVELTOOLS', text: 'Bevelling and metal edge preparation.' },
      {
        year: '2026',
        title: 'HELICAL · COREHOG',
        text: 'Precision machining and composite materials.',
      },
    ],
  },

  company: {
    legalName: 'Kim Thanh Dong Co., Ltd',
    // Giữ nguyên tên đường và toà nhà — đây là địa chỉ để tìm đến nơi, dịch
    // ra thì tài xế và bưu tá không đọc được. Chỉ dịch phần hành chính.
    addresses: [
      '444A Binh Gia Street, Tam Thang Ward, Ho Chi Minh City',
      'Ground floor, Seaview 4, Chi Linh Urban Area, Rach Dua Ward, Ho Chi Minh City',
      '326 Vo Van Hat Street, Long Truong Ward, Ho Chi Minh City',
      'Ruby City CT1, Viet Hung Ward, Hanoi',
    ],
  },

  contact: {
    metaTitle: 'Contact',
    metaDesc: 'Address, phone, email and opening hours for Kim Thanh Dong Co., Ltd.',
    registeredOffice: 'Registered address',
    offices: ['Head office', 'Ho Chi Minh City warehouse', 'Hanoi warehouse'],
    phone: 'Telephone',
    hotline1: 'Hotline 1 (Zalo)',
    hotline2: 'Hotline 2 (Zalo & WhatsApp)',
    email: 'Email',
    website: 'Website',
    hours: 'Opening hours:',
    workingHours: ['7:30 – 17:00, Monday to Friday', '7:30 – 11:30, Saturday'],
    mapPlaceholder: '[ EMBEDDED MAP — SEAVIEW 4 ]',
  },

  cta: {
    quote: 'Request a quote',
    chatZalo: 'Chat on Zalo',
    call: 'Call now',
    search: 'Search',
    backToTop: 'Back to top',
  },

  meta: {
    siteTitle: 'Kim Thanh Dong — Industrial equipment & engineering solutions',
    siteDesc: 'Genuine international brands · Engineer-led advice · Fast quotations.',
  },
}
