-- =============================================================================
-- Bản tiếng Anh cho 12 nhóm chính và 41 nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-danh-muc-en-sql.mjs — đừng sửa tay file này,
-- sửa scripts/danh-muc-en.json rồi chạy lại script.
--
-- Thuật ngữ bám theo lib/i18n/glossary.ts để trang tiếng Anh không có hai cách
-- gọi cùng một thứ.
--
-- Ghép theo name_vi: trước đợt 4 có 15 danh mục cũ, 12 trong số đó bị đổi TÊN
-- nhưng giữ nguyên slug để không chết đường dẫn. Ghép theo tên tiếng Việt hiện
-- tại là cách duy nhất chắc chắn đúng.
--
-- Chạy sau 0008_danh_muc_moi.sql.
-- =============================================================================

update categories c
set name_en = v.ten_en,
    sub_en  = coalesce(v.sub_en, c.sub_en)
from (values
  ('Dụng cụ cắt an toàn', 'Safety cutting tools', 'Safety cutters, safety scissors, blades & accessories'),
  ('Dao an toàn', 'Safety cutters', null),
  ('Kéo an toàn', 'Safety scissors', null),
  ('Lưỡi dao & phụ kiện', 'Blades & accessories', null),
  ('Dụng cụ cắt gọt CNC & composite', 'CNC & composite cutting tools', 'Drill bits, end mills, taps, reamers, counterbores & composite tooling'),
  ('Mũi khoan', 'Drill bits', null),
  ('Dao phay', 'End mills', null),
  ('Ta rô & dụng cụ tạo ren', 'Taps & thread tools', null),
  ('Dao doa', 'Reamers', null),
  ('Mũi khoét & mũi cưa lỗ', 'Counterbores & hole saws', null),
  ('Dụng cụ gia công composite & honeycomb', 'Composite & honeycomb tooling', null),
  ('Mài, nhám & hoàn thiện bề mặt', 'Grinding, abrasives & surface finishing', 'Pneumatic grinders, carbide burrs, abrasive discs, flap wheels & consumables'),
  ('Máy mài & máy chà nhám khí nén', 'Pneumatic grinders & sanders', null),
  ('Mũi mài hợp kim', 'Carbide burrs', null),
  ('Các loại nhám & phụ kiện', 'Abrasives & accessories', null),
  ('Vát mép & bo cạnh kim loại', 'Metal chamfering & edge breaking', 'Chamfering, edge rounding, weld edge preparation & cutting inserts'),
  ('Máy vát mép & bo cạnh cầm tay', 'Handheld chamfering & deburring machines', null),
  ('Máy vát mép để bàn', 'Bench chamfering machines', null),
  ('Dao vát mép, bo cạnh & phụ kiện', 'Chamfering inserts, deburring tools & accessories', null),
  ('Khuôn mẫu & bảo trì khuôn', 'Mould making & maintenance', 'Filing machines, mould polishing tools, maintenance chemicals & mould repair equipment'),
  ('Máy giũa & máy đánh bóng khuôn', 'Filing & mould polishing machines', null),
  ('Giũa, đá đánh bóng, dụng cụ kim cương & CBN', 'Files, polishing stones, diamond & CBN tools', null),
  ('Hóa chất bảo dưỡng, vệ sinh khuôn & trục vít', 'Mould and screw cleaning & maintenance chemicals', null),
  ('Thiết bị sửa chữa khuôn', 'Mould repair equipment', null),
  ('Đo kiểm & xác định điểm 0', 'Measurement & zero-point setting', '3D probes, edge finders, machine probes & zero-point setters'),
  ('Đầu dò 3D & đầu dò tiếp xúc', '3D probes & touch probes', null),
  ('Dụng cụ dò cạnh', 'Edge finders', null),
  ('Thiết bị xác định điểm 0', 'Zero-point setters', null),
  ('Gá kẹp & định vị gia công', 'Workholding & machining fixtures', 'Quick clamps, clamping frames, edge clamps, zero-point systems & workholding accessories'),
  ('Kẹp nhanh Multi-Quick', 'Multi-Quick quick clamps', null),
  ('Khung kẹp S-Series', 'S-Series clamping frames', null),
  ('Kẹp cạnh', 'Edge clamps', null),
  ('Kẹp xích', 'Chain clamps', null),
  ('Siết lực & lắp ráp công nghiệp', 'Torque control & industrial assembly', 'Industrial screwdrivers, automatic screw feeding, screwdriving systems & torque control tools'),
  ('Tô vít công nghiệp cầm tay', 'Handheld industrial screwdrivers', null),
  ('Tô vít cầm tay cấp vít tự động', 'Handheld screwdrivers with automatic screw feed', null),
  ('Hệ thống siết tự động', 'Automated screwdriving systems', null),
  ('Tô vít lực, bộ dụng cụ & phụ kiện', 'Torque screwdrivers, kits & accessories', null),
  ('Pa lăng cân bằng', 'Load balancers', null),
  ('Đánh dấu & truy xuất công nghiệp', 'Industrial marking & traceability', 'Dot peen marking, laser marking, portable, benchtop & in-line integrated units'),
  ('Máy khắc chấm', 'Dot peen markers', null),
  ('Máy khắc laser', 'Laser markers', null),
  ('Hàn điện trở & cân bằng tải', 'Resistance welding & load balancing', 'Resistance welding testers, load balancers & accessories'),
  ('Thiết bị đo thông số hàn', 'Welding parameter testers', null),
  ('Phụ kiện đo', 'Measuring accessories', null),
  ('Phủ carbide & chống mài mòn', 'Carbide coating & wear protection', 'Carbide coating units, electrodes & consumables for grip and wear protection on metal'),
  ('Thiết bị Rocklinizer', 'Rocklinizer units', null),
  ('Điện cực & phụ kiện Rocklinizer', 'Rocklinizer electrodes & accessories', null),
  ('Khớp nối nhanh & phụ kiện môi chất', 'Quick couplings & fluid accessories', 'Single and multi-line couplings, manifolds, hoses, flow control & connection accessories'),
  ('Khớp nối nhanh đơn', 'Single quick couplings', null),
  ('Khớp nối nhanh đa đường', 'Multi-line quick couplings', null),
  ('Bộ chia dòng & ống dẫn', 'Manifolds & hoses', null),
  ('Bộ điều khiển lưu lượng & phụ kiện', 'Flow controllers & accessories', null)
) as v(ten_vi, ten_en, sub_en)
where c.name_vi = v.ten_vi;

-- Kiểm nhanh sau khi chạy:
--   select count(*) from categories where name_en is not null and visible;
-- Phải ra 53 — đúng bằng 12 nhóm chính cộng 41 nhóm nhỏ.
--
--   select name_vi, name_en from categories where visible and name_en is null;
-- Phải không ra dòng nào.
