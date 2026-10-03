-- =============================================================================
-- Gắn ảnh banner cho 19 trang thương hiệu
--
-- File ảnh do scripts/build-brand-banners.mjs dựng ra ở
-- public/assets/brands/banner/{slug}.webp, rồi `npm run db:upload` đẩy lên kho
-- với đường dẫn brand-banner/{slug}.webp.
--
-- Đường dẫn suy ra được từ slug nên không cần liệt kê 19 dòng. Chỉ gắn cho
-- những hãng đang hiện — MoldMender đã ẩn thì không có trang riêng, cũng không
-- cần banner.
--
-- Chạy sau 0007 (cột banner do 0007 tạo) và sau 0009 (GARRYSON phải tồn tại).
-- =============================================================================

update brands
set banner = 'brand-banner/' || slug || '.webp'
where visible
  and banner is distinct from 'brand-banner/' || slug || '.webp';

-- Kiểm nhanh sau khi chạy:
--   select count(*) from brands where visible and banner is not null;  -- phải ra 19
--   select slug, banner from brands where visible order by sort_order limit 5;
