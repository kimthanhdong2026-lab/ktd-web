-- =============================================================================
-- "Sửa web 5" (09/10/2026) — đổi tên nhóm chính, chữ nhỏ và tên thương hiệu
--
-- Nguồn: file Excel "Danh sách thương hiệu (1).xlsx" KTD gửi kèm tài liệu.
--   Sheet "Danh mục sản phẩm": chữ ĐỎ là chỗ web phải sửa theo, chữ đen là đã
--   khớp. Có 8 tên nhóm chính và 9 dòng chữ nhỏ màu đỏ.
--   Sheet "Thương hiệu": cách viết chuẩn của 19 tên hãng.
--
-- Các mục liên quan: TC10, SP03, SP06, TH01, H05, H09, H13 và dòng "Footer
-- Danh mục". Trang chủ, bộ lọc trang Sản phẩm, menu Thương hiệu và chân trang
-- đều đọc từ hai bảng này, nên sửa ở đây là đổi đồng loạt mọi nơi.
--
-- CHỈ ĐỔI TÊN HIỂN THỊ. Slug giữ nguyên, nên mọi đường dẫn cũ, mọi liên kết
-- sản phẩm ↔ nhóm ↔ hãng và ảnh danh mục (đặt tên theo slug) không đổi.
--
-- Ghép theo TÊN TIẾNG VIỆT CŨ của nhóm chính (parent_slug is null), cùng cách
-- 0015 đã làm. Chạy lại lần hai thì không dòng nào khớp nữa — không hỏng gì.
--
-- Chạy sau 0016.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Nhóm chính: tên, chữ nhỏ, và bản tiếng Anh tương ứng
--
-- Bản tiếng Anh dịch lại theo tên mới, thuật ngữ bám lib/i18n/glossary.ts
-- (mould, workholding, edge finder, load balancer...). Nên có người của KTD
-- rà lại như đã làm với 0015.
-- -----------------------------------------------------------------------------
update categories c
set name_vi = v.ten_moi,
    sub_vi  = v.sub_moi,
    name_en = v.ten_en,
    sub_en  = v.sub_en
from (values
  (
    'Dụng cụ cắt an toàn',
    'Dụng cụ an toàn lao động',
    'Dao an toàn, kéo an toàn, lưỡi dao & phụ kiện',
    'Workplace safety tools',
    'Safety cutters, safety scissors, blades & accessories'
  ),
  (
    -- Tên giữ nguyên; chữ nhỏ đổi "mũi mài carbide" thành "mũi mài hợp kim".
    'Mài, nhám & hoàn thiện bề mặt',
    'Mài, nhám & hoàn thiện bề mặt',
    'Máy mài khí nén, mũi mài hợp kim, đĩa nhám, bánh nhám & vật tư mài',
    'Grinding, abrasives & surface finishing',
    'Pneumatic grinders, carbide burrs, abrasive discs, flap wheels & consumables'
  ),
  (
    'Khuôn mẫu & bảo trì khuôn',
    'Dụng cụ sửa chữa & bảo trì khuôn',
    'Máy giũa, dụng cụ đánh bóng, hóa chất vệ sinh bảo dưỡng & thiết bị sửa chữa khuôn',
    'Mould repair & maintenance tools',
    'Filing machines, polishing tools, cleaning & maintenance chemicals, mould repair equipment'
  ),
  (
    'Đo kiểm & xác định điểm 0',
    'Thiết bị đo & định vị gia công',
    'Đầu dò 3D, dụng cụ dò cạnh, thiết bị xác định điểm 0 & đo trên máy gia công',
    'Measuring & machining positioning equipment',
    '3D probes, edge finders, zero-point setters & on-machine measurement'
  ),
  (
    'Gá kẹp & định vị gia công',
    'Hệ thống gá kẹp công nghiệp',
    'Kẹp nhanh, khung kẹp, kẹp cạnh & kẹp xích cho khuôn, phôi và chi tiết gia công',
    'Industrial workholding systems',
    'Quick clamps, clamping frames, side clamps & chain clamps for moulds, workpieces and machined parts'
  ),
  (
    'Siết lực & lắp ráp công nghiệp',
    'Thiết bị siết & lắp ráp công nghiệp',
    'Tô vít công nghiệp, hệ thống siết tự động, dụng cụ siết lực & pa lăng cân bằng',
    'Industrial tightening & assembly equipment',
    'Industrial screwdrivers, automated screwdriving systems, torque tools & load balancers'
  ),
  (
    'Đánh dấu & truy xuất công nghiệp',
    'Thiết bị đánh dấu & truy xuất công nghiệp',
    'Máy khắc số, mã, logo, mã QR, DataMatrix trên kim loại, nhựa và chi tiết công nghiệp',
    'Industrial marking & traceability equipment',
    'Machines for marking numbers, codes, logos, QR and DataMatrix on metal, plastic and industrial parts'
  ),
  (
    'Hàn điện trở & cân bằng tải',
    'Thiết bị đo & kiểm tra hàn điện trở',
    'Thiết bị đo các thông số của máy hàn điểm, hàn lồi và các hệ thống hàn điện trở',
    'Resistance welding measurement & testing equipment',
    'Instruments for measuring the parameters of spot welders, projection welders and resistance welding systems'
  ),
  (
    'Phủ carbide & chống mài mòn',
    'Thiết bị xử lý & phục hồi bề mặt kim loại',
    'Thiết bị phủ vật liệu cứng, chống mài mòn, tạo độ nhám & phục hồi kích thước bề mặt',
    'Metal surface treatment & restoration equipment',
    'Equipment for hard-facing, wear protection, surface texturing & dimensional restoration'
  ),
  (
    -- Tên giữ nguyên; chỉ chữ nhỏ đổi.
    'Khớp nối nhanh & phụ kiện môi chất',
    'Khớp nối nhanh & phụ kiện môi chất',
    'Khớp nối khí, nước, thủy lực; bộ chia dòng, ống dẫn & phụ kiện môi chất',
    'Quick couplings & fluid accessories',
    'Air, water and hydraulic couplings; manifolds, hoses & fluid accessories'
  )
) as v(ten_cu, ten_moi, sub_moi, ten_en, sub_en)
where c.name_vi = v.ten_cu
  and c.parent_slug is null;

-- -----------------------------------------------------------------------------
-- 2. Tên thương hiệu
--
-- Quy tắc KTD chốt: chỉ viết hoa chữ cái đầu; riêng RTC viết hoa cả ba chữ,
-- CoreHog viết hoa chữ H, Beveltools viết liền. Mười bốn hãng còn lại đã đúng.
--
-- Ghép theo slug vì slug không bao giờ đổi. Slug "rocklinizer" là của hãng
-- Rocklin (Rocklinizer và MoldMender là thương hiệu con, BGĐ chốt 03/10/2026).
-- -----------------------------------------------------------------------------
update brands b
set name = v.ten
from (values
  ('helical',     'Helical Solutions'),
  ('corehog',     'CoreHog'),
  ('bevel-tools', 'Beveltools'),
  ('rocklinizer', 'Rocklin'),
  ('tschorn',     'Tschorn')
) as v(slug, ten)
where b.slug = v.slug;

-- -----------------------------------------------------------------------------
-- 3. Nạp lại cột tìm kiếm
--
-- Tên hãng và tên nhóm đã được chép sẵn vào products.search_vi (xem 0013), nên
-- không tự đổi theo. Câu dưới làm trigger ktd_fill_search chạy lại cho mọi sản
-- phẩm. Thiếu bước này thì khách gõ tên nhóm MỚI sẽ không ra sản phẩm nào.
-- -----------------------------------------------------------------------------
update products set search_vi = '';

-- Kiểm nhanh sau khi chạy — cả ba câu phải ra đúng số ghi bên cạnh:
--   select count(*) from categories where parent_slug is null
--     and name_vi in ('Dụng cụ an toàn lao động', 'Hệ thống gá kẹp công nghiệp',
--                     'Thiết bị đo & kiểm tra hàn điện trở');              -- 3
--   select count(*) from brands
--     where name in ('Helical Solutions', 'CoreHog', 'Beveltools', 'Rocklin', 'Tschorn');  -- 5
--   select count(*) from products where search_vi like '%an toan lao dong%';  -- > 0
