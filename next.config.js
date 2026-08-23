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
};

export default nextConfig;
