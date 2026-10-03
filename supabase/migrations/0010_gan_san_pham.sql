-- =============================================================================
-- Gắn 35 sản phẩm hiện có vào nhóm nhỏ
--
-- SINH TỰ ĐỘNG bởi scripts/gen-gan-san-pham-sql.mjs — đừng sửa tay file này,
-- sửa scripts/doi-chieu-danh-muc.json rồi chạy lại script.
--
-- Phải chạy sau 0008_danh_muc_moi.sql, vì các nhóm nhỏ phải tồn tại trước.
--
-- CHẠY LẠI BAO NHIÊU LẦN CŨNG ĐƯỢC: câu lệnh là UPDATE theo mã hàng, không
-- thêm hay xoá dòng nào.
--
-- SAU KHI CHẠY, WEBSITE CHƯA ĐỔI GÌ: các nhóm nhỏ vẫn đang visible = false.
-- Chỉ khi bật chúng lên thì bộ lọc hai cấp mới hiện ra cho khách.
--
-- CÒN 3 MÃ CHỜ BAN GIÁM ĐỐC XÁC NHẬN. Chúng vẫn được gắn tạm theo
-- phán đoán để website không có sản phẩm nào lạc chỗ, nhưng phải sửa lại khi
-- có trả lời:
--   BT-R2        tên sản phẩm không cho biết là máy cầm tay hay máy để bàn
--   LK-125       Lenzkes có 4 dòng kẹp, tên "Bộ kẹp khuôn" không chỉ rõ dòng nào
--   RTC-40       tên là "khớp nối truyền động đàn hồi", không khớp nhóm nhỏ nào của RTC. Có thể tên sản phẩm đang sai.
-- =============================================================================

update products p
set category_slug = v.nhom
from (values
  ('10130610', 'dao-an-toan'),
  ('1031.50', 'luoi-dao-phu-kien'),
  ('110000.02', 'dao-an-toan'),
  ('110700.02', 'dao-an-toan'),
  ('116001.02', 'dao-an-toan'),
  ('11900771.02', 'dao-an-toan'),
  ('12.50', 'luoi-dao-phu-kien'),
  ('120701.02', 'dao-an-toan'),
  ('121001.02', 'dao-an-toan'),
  ('122001.02', 'dao-an-toan'),
  ('124001', 'dao-an-toan'),
  ('125002.02', 'dao-an-toan'),
  ('145001.12', 'dao-an-toan'),
  ('148001.12', 'dao-an-toan'),
  ('150001.12', 'dao-an-toan'),
  ('9502AX', 'pa-lang-can-bang'),
  ('AT-5012', 'may-mai-may-cha-nham-khi-nen'),
  ('AT-7033', 'may-mai-may-cha-nham-khi-nen'),
  -- CHỜ XÁC NHẬN: tên sản phẩm không cho biết là máy cầm tay hay máy để bàn
  ('BT-R2', 'may-vat-mep-bo-canh-cam-tay'),
  ('BX-88', 'hoa-chat-bao-duong-ve-sinh-khuon-truc-vit'),
  ('CH-C4', 'dung-cu-gia-cong-composite-honeycomb'),
  ('DF-BSG', 'may-giua-may-danh-bong-khuon'),
  ('FIAM-15C', 'to-vit-cong-nghiep-cam-tay'),
  ('HEV-40250', 'dao-phay'),
  ('HFV-30187', 'dao-phay'),
  ('HT-HSS8', 'mui-khoan'),
  ('KN-HSSDMOND', 'mui-khoet-mui-cua-lo'),
  -- CHỜ XÁC NHẬN: Lenzkes có 4 dòng kẹp, tên "Bộ kẹp khuôn" không chỉ rõ dòng nào
  ('LK-125', 'khung-kep-s-series'),
  ('MF-INOXCUT', 'mui-mai-hop-kim'),
  ('MP-350', 'may-khac-cham'),
  ('RK-500', 'thiet-bi-rocklinizer'),
  -- CHỜ XÁC NHẬN: tên là "khớp nối truyền động đàn hồi", không khớp nhóm nhỏ nào của RTC. Có thể tên sản phẩm đang sai.
  ('RTC-40', 'khop-noi-nhanh-don'),
  ('SLOKY-TS15', 'to-vit-luc-bo-dung-cu-phu-kien'),
  ('SPM80R', 'mui-mai-hop-kim'),
  ('TS-3D', 'dau-do-3d-dau-do-tiep-xuc')
) as v(part, nhom)
where p.part = v.part;

-- Trigger ktd_fill_search chạy lại theo từng dòng UPDATE, nên cột tìm kiếm tự
-- cập nhật tên nhóm mới. Không cần làm gì thêm.

-- Kiểm nhanh sau khi chạy:
--   select count(*) from products p join categories c on c.slug = p.category_slug
--   where c.parent_slug is not null;
-- Phải ra 35 — nghĩa là mọi sản phẩm đều đã nằm ở nhóm nhỏ, không còn
-- sản phẩm nào gắn thẳng vào nhóm chính.
