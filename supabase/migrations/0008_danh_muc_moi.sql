-- =============================================================================
-- Nạp danh mục hai cấp: 12 nhóm chính + 41 nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-danh-muc-sql.mjs — đừng sửa tay file này,
-- sửa scripts/danh-muc-chot.json rồi chạy lại script.
--
-- AN TOÀN KHI CHẠY TRÊN BẢN ĐANG PHỤC VỤ KHÁCH: các nhóm nhỏ nạp vào đều rỗng,
-- chưa sản phẩm nào trỏ tới, nên bộ lọc chưa hiện thêm gì. Chúng để visible =
-- true ngay từ đầu vì file 0010 sẽ gắn sản phẩm vào đây — để ẩn thì sản phẩm
-- gắn vào sẽ biến mất khỏi website.
--
-- Nhóm chính dùng lại slug cũ để đường dẫn Google đang biết không chết.
-- Ba slug cũ không còn nhóm kế thừa, cần khai báo chuyển hướng:
--     /san-pham?dm=composite  ->  /san-pham?dm=cat-got-cnc
--     /san-pham?dm=nang-ha  ->  /san-pham?dm=siet-cong-nghiep
--     /san-pham?dm=siet-luc-cam-tay  ->  /san-pham?dm=siet-cong-nghiep
-- =============================================================================

insert into categories
  (slug, name_vi, name_en, sub_vi, sub_en, parent_slug, sort_order, visible)
values
  ('an-toan', 'Dụng cụ cắt an toàn', null, 'Dao an toàn, kéo an toàn, lưỡi dao & phụ kiện', null, null, 1, true),
  ('dao-an-toan', 'Dao an toàn', null, '', null, 'an-toan', 10, true),
  ('keo-an-toan', 'Kéo an toàn', null, '', null, 'an-toan', 20, true),
  ('luoi-dao-phu-kien', 'Lưỡi dao & phụ kiện', null, '', null, 'an-toan', 30, true),
  ('cat-got-cnc', 'Dụng cụ cắt gọt CNC & composite', null, 'Mũi khoan, dao phay, ta rô, doa, mũi khoét & dụng cụ gia công composite', null, null, 2, true),
  ('mui-khoan', 'Mũi khoan', null, '', null, 'cat-got-cnc', 10, true),
  ('dao-phay', 'Dao phay', null, '', null, 'cat-got-cnc', 20, true),
  ('ta-ro-dung-cu-tao-ren', 'Ta rô & dụng cụ tạo ren', null, '', null, 'cat-got-cnc', 30, true),
  ('dao-doa', 'Dao doa', null, '', null, 'cat-got-cnc', 40, true),
  ('mui-khoet-mui-cua-lo', 'Mũi khoét & mũi cưa lỗ', null, '', null, 'cat-got-cnc', 50, true),
  ('dung-cu-gia-cong-composite-honeycomb', 'Dụng cụ gia công composite & honeycomb', null, '', null, 'cat-got-cnc', 60, true),
  ('mai-hoan-thien', 'Mài, nhám & hoàn thiện bề mặt', null, 'Máy mài khí nén, mũi mài carbide, đĩa nhám, bánh nhám & vật tư mài', null, null, 3, true),
  ('may-mai-may-cha-nham-khi-nen', 'Máy mài & máy chà nhám khí nén', null, '', null, 'mai-hoan-thien', 10, true),
  ('mui-mai-hop-kim', 'Mũi mài hợp kim', null, '', null, 'mai-hoan-thien', 20, true),
  ('cac-loai-nham-phu-kien', 'Các loại nhám & phụ kiện', null, '', null, 'mai-hoan-thien', 30, true),
  ('vat-mep', 'Vát mép & bo cạnh kim loại', null, 'Máy vát mép, bo tròn cạnh, chuẩn bị mép hàn & dao cắt', null, null, 4, true),
  ('may-vat-mep-bo-canh-cam-tay', 'Máy vát mép & bo cạnh cầm tay', null, '', null, 'vat-mep', 10, true),
  ('may-vat-mep-de-ban', 'Máy vát mép để bàn', null, '', null, 'vat-mep', 20, true),
  ('dao-vat-mep-bo-canh-phu-kien', 'Dao vát mép, bo cạnh & phụ kiện', null, '', null, 'vat-mep', 30, true),
  ('ve-sinh-khuon', 'Khuôn mẫu & bảo trì khuôn', null, 'Máy giũa, dụng cụ đánh bóng khuôn, hóa chất bảo trì & thiết bị sửa chữa khuôn', null, null, 5, true),
  ('may-giua-may-danh-bong-khuon', 'Máy giũa & máy đánh bóng khuôn', null, '', null, 've-sinh-khuon', 10, true),
  ('giua-da-danh-bong-dung-cu-kim-cuong-cbn', 'Giũa, đá đánh bóng, dụng cụ kim cương & CBN', null, '', null, 've-sinh-khuon', 20, true),
  ('hoa-chat-bao-duong-ve-sinh-khuon-truc-vit', 'Hóa chất bảo dưỡng, vệ sinh khuôn & trục vít', null, '', null, 've-sinh-khuon', 30, true),
  ('thiet-bi-sua-chua-khuon', 'Thiết bị sửa chữa khuôn', null, '', null, 've-sinh-khuon', 40, true),
  ('do-can-chinh', 'Đo kiểm & xác định điểm 0', null, 'Đầu dò 3D, dò cạnh, đầu dò máy & thiết bị xác định điểm 0', null, null, 6, true),
  ('dau-do-3d-dau-do-tiep-xuc', 'Đầu dò 3D & đầu dò tiếp xúc', null, '', null, 'do-can-chinh', 10, true),
  ('dung-cu-do-canh', 'Dụng cụ dò cạnh', null, '', null, 'do-can-chinh', 20, true),
  ('thiet-bi-xac-dinh-diem-0', 'Thiết bị xác định điểm 0', null, '', null, 'do-can-chinh', 30, true),
  ('kep-khuon-phoi', 'Gá kẹp & định vị gia công', null, 'Kẹp nhanh, khung kẹp, kẹp cạnh, hệ thống zero-point & phụ kiện gá kẹp', null, null, 7, true),
  ('kep-nhanh-multi-quick', 'Kẹp nhanh Multi-Quick', null, '', null, 'kep-khuon-phoi', 10, true),
  ('khung-kep-s-series', 'Khung kẹp S-Series', null, '', null, 'kep-khuon-phoi', 20, true),
  ('kep-canh', 'Kẹp cạnh', null, '', null, 'kep-khuon-phoi', 30, true),
  ('kep-xich', 'Kẹp xích', null, '', null, 'kep-khuon-phoi', 40, true),
  ('siet-cong-nghiep', 'Siết lực & lắp ráp công nghiệp', null, 'Tô vít công nghiệp, cấp vít tự động, hệ thống siết & dụng cụ kiểm soát lực', null, null, 8, true),
  ('to-vit-cong-nghiep-cam-tay', 'Tô vít công nghiệp cầm tay', null, '', null, 'siet-cong-nghiep', 10, true),
  ('to-vit-cam-tay-cap-vit-tu-dong', 'Tô vít cầm tay cấp vít tự động', null, '', null, 'siet-cong-nghiep', 20, true),
  ('he-thong-siet-tu-dong', 'Hệ thống siết tự động', null, '', null, 'siet-cong-nghiep', 30, true),
  ('to-vit-luc-bo-dung-cu-phu-kien', 'Tô vít lực, bộ dụng cụ & phụ kiện', null, '', null, 'siet-cong-nghiep', 40, true),
  ('pa-lang-can-bang', 'Pa lăng cân bằng', null, '', null, 'siet-cong-nghiep', 50, true),
  ('danh-dau', 'Đánh dấu & truy xuất công nghiệp', null, 'Khắc chấm, khắc laser, máy di động, để bàn & tích hợp dây chuyền', null, null, 9, true),
  ('may-khac-cham', 'Máy khắc chấm', null, '', null, 'danh-dau', 10, true),
  ('may-khac-laser', 'Máy khắc laser', null, '', null, 'danh-dau', 20, true),
  ('do-kiem-may-han', 'Hàn điện trở & cân bằng tải', null, 'Máy/thiết bị đo kiểm hàn điện trở, bộ cân bằng tải & phụ kiện', null, null, 10, true),
  ('thiet-bi-do-thong-so-han', 'Thiết bị đo thông số hàn', null, '', null, 'do-kiem-may-han', 10, true),
  ('phu-kien-do', 'Phụ kiện đo', null, '', null, 'do-kiem-may-han', 20, true),
  ('phuc-hoi-be-mat', 'Phủ carbide & chống mài mòn', null, 'Thiết bị phủ carbide, điện cực & vật tư tăng độ bám, chống mài mòn kim loại', null, null, 11, true),
  ('thiet-bi-rocklinizer', 'Thiết bị Rocklinizer', null, '', null, 'phuc-hoi-be-mat', 10, true),
  ('dien-cuc-phu-kien-rocklinizer', 'Điện cực & phụ kiện Rocklinizer', null, '', null, 'phuc-hoi-be-mat', 20, true),
  ('khop-noi', 'Khớp nối nhanh & phụ kiện môi chất', null, 'Khớp nối đơn/đa, manifold, ống, điều khiển dòng & phụ kiện kết nối', null, null, 12, true),
  ('khop-noi-nhanh-don', 'Khớp nối nhanh đơn', null, '', null, 'khop-noi', 10, true),
  ('khop-noi-nhanh-da-duong', 'Khớp nối nhanh đa đường', null, '', null, 'khop-noi', 20, true),
  ('bo-chia-dong-ong-dan', 'Bộ chia dòng & ống dẫn', null, '', null, 'khop-noi', 30, true),
  ('bo-dieu-khien-luu-luong-phu-kien', 'Bộ điều khiển lưu lượng & phụ kiện', null, '', null, 'khop-noi', 40, true)
on conflict (slug) do update set
  name_vi     = excluded.name_vi,
  sub_vi      = excluded.sub_vi,
  parent_slug = excluded.parent_slug,
  sort_order  = excluded.sort_order;
  -- Cố ý KHÔNG đụng tới cột visible: chạy lại file này không được bật lại
  -- những nhóm mà người vận hành đã chủ động ẩn đi.

-- Kiểm nhanh sau khi chạy:
--   select count(*) filter (where parent_slug is null) as nhom_chinh,
--          count(*) filter (where parent_slug is not null) as nhom_nho
--   from categories;
-- Phải ra 12 và 41.
