/**
 * Ảnh sản phẩm và logo hãng nằm trên kho file Supabase chứ không trong repo,
 * nên phải khai báo tên miền ở đây thì next/image mới chịu tối ưu. Thiếu khai
 * báo này thì mọi ảnh đều vỡ với lỗi `"url" parameter is not allowed`.
 *
 * Không đọc tên miền từ NEXT_PUBLIC_SUPABASE_URL được: file cấu hình này chạy
 * TRƯỚC khi Next nạp .env.local nên biến còn rỗng, danh sách cho phép thành
 * trống và mọi ảnh hỏng. Vì vậy để ký tự đại diện cho mọi dự án Supabase.
 *
 * Đường dẫn giới hạn ở /object/public/ — phần công khai của kho file. Ảnh riêng
 * tư đi qua đường dẫn khác nên không lọt vào đây.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,

  /**
   * Chuyển hướng ba đường dẫn danh mục đã nghỉ hưu ở đợt 4.
   *
   * Cấu trúc danh mục chuyển từ 15 nhóm phẳng sang 12 nhóm chính. Mười hai nhóm
   * giữ nguyên slug cũ nên đường dẫn không đổi, nhưng ba nhóm dưới đây bị gộp
   * vào nhóm khác và không còn ai kế thừa. Không khai ở đây thì khách bấm vào
   * link cũ — trong lịch sử trình duyệt, trong email báo giá đã gửi, hoặc từ
   * kết quả Google — sẽ ra trang sản phẩm rỗng mà không hiểu vì sao.
   *
   * Dùng 301 (permanent) để Google chuyển hẳn thứ hạng sang đường dẫn mới.
   */
  async redirects() {
    const gop = {
      composite: 'cat-got-cnc',
      'nang-ha': 'siet-cong-nghiep',
      'siet-luc-cam-tay': 'siet-cong-nghiep',
    };

    const danhMucCu = Object.entries(gop).flatMap(([cu, moi]) =>
      ['/san-pham', '/en/san-pham'].map((duong) => ({
        source: duong,
        has: [{ type: 'query', key: 'category', value: cu }],
        destination: `${duong}?category=${moi}`,
        permanent: true,
      }))
    );

    /**
     * 15 địa chỉ của web WordPress cũ (www.kimthanhdong.com) team gửi 22/10/2026,
     * chốt 07/11/2026 (K1): 9 bài viết cũ đã chép sang mục Tin tức với nguyên slug.
     * Chỉ có tác dụng sau khi tên miền kimthanhdong.com trỏ về web này.
     * Có hoặc không có dấu "/" cuối đều khớp.
     */
    const BAI_CU = [
      'tungsten-la-gi-mui-doa-hop-kim-morrisflex',
      'microstructure-tungsten-carbide-structure',
      'mui-khoan-sau-mui-khoangun-drill-nong-sung-gun-drill-hartner',
      'mui-mai-mui-doa-hop-kim-hinh-tru-morrisflex-chinh-hang',
      'martor-safety-knife-for-manufacturing',
      '5-loi-khuyen-khi-ve-sinh-truc-vit-thay-mau-nhua',
      'giai-phap-ve-sinh-lam-sach-khuon-ep-nhua-hieu-qua',
      'safety-knives-in-manufacturing-importance-applications-and-how-to-choose-the-right-type',
      'what-is-a-safety-knife-applications-and-how-to-choose-the-right-type-for-manufacturing',
    ];
    const linkCu = [
      ...BAI_CU.map((s) => [`/${s}`, `/tin-tuc/${s}`]),
      ['/vi/tungsten-la-gi-mui-doa-hop-kim-morrisflex', '/tin-tuc/tungsten-la-gi-mui-doa-hop-kim-morrisflex'],
      // Team gửi địa chỉ có lỗi chính tả "chose"; địa chỉ thật trên web cũ là "choose".
      [
        '/what-is-a-safety-knife-applications-and-how-to-chose-the-right-type-for-manufacturing',
        '/tin-tuc/what-is-a-safety-knife-applications-and-how-to-choose-the-right-type-for-manufacturing',
      ],
      // MULTI4 chưa có trên web mới → nhóm máy khắc dấu.
      ['/product/mukti4-dot-peen-marking-machine', '/san-pham?category=may-khac-cham'],
      ['/product/screwcleaningchemicalinterkor-vp1026', '/san-pham/dung-dich-ve-sinh-truc-vit-interkor-vp1026-buchem-vp1026'],
      // 79.60 đang ẩn (chưa có ảnh) → lưỡi dao Martor. Có ảnh thì đổi về /san-pham/luoi-dao-styropor-79-60.
      ['/product/luoi-dao-an-toan-martor-no-79', '/san-pham?brand=martor&category=luoi-dao-phu-kien'],
      ['/contact-us', '/lien-he'],
    ].map(([source, destination]) => ({ source: `${source}{/}?`, destination, permanent: true }));

    return [...danhMucCu, ...linkCu];
  },
};

export default nextConfig;
