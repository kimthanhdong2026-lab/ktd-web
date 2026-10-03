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

    return Object.entries(gop).flatMap(([cu, moi]) =>
      ['/san-pham', '/en/san-pham'].map((duong) => ({
        source: duong,
        has: [{ type: 'query', key: 'category', value: cu }],
        destination: `${duong}?category=${moi}`,
        permanent: true,
      }))
    );
  },
};

export default nextConfig;
