-- =============================================================================
-- "Sửa web 5" — sửa nốt tên hãng viết kiểu cũ còn sót trong bảng sản phẩm
--
-- 0017 đã đổi tên ở bảng brands (Tschorn, CoreHog, Beveltools...). Rà lại toàn
-- bộ cơ sở dữ liệu ngày 10/10/2026 thì còn ba sản phẩm mẫu tự chép tên hãng
-- kiểu cũ vào chính dữ liệu của mình, nên không đổi theo:
--
--   TS-3D   tên sản phẩm "Đầu dò 3D TSChorn" và tên catalog "TSChorn Measuring"
--   CH-C4   tên catalog "Corehog Composite Tools"
--   BT-R2   tên catalog "Bevel Tools Catalog"
--
-- Các mục liên quan: H05, H09, H13 (chuẩn hoá CoreHog, Beveltools, Tschorn).
--
-- Slug KHÔNG đổi, nên đường dẫn trang sản phẩm giữ nguyên.
-- Dùng replace() nên chạy lại bao nhiêu lần cũng được.
--
-- Chạy sau 0017.
-- =============================================================================

update products
set name_vi = replace(name_vi, 'TSChorn', 'Tschorn'),
    name_en = replace(name_en, 'TSChorn', 'Tschorn')
where part = 'TS-3D';

-- Tên catalog nằm trong cột jsonb {name, size, pages}.
update products
set catalog = jsonb_set(
      catalog,
      '{name}',
      to_jsonb(
        replace(
          replace(
            replace(catalog->>'name', 'TSChorn', 'Tschorn'),
            'Corehog', 'CoreHog'),
          'Bevel Tools', 'Beveltools')
      )
    )
where part in ('TS-3D', 'CH-C4', 'BT-R2')
  and catalog ? 'name';

-- Trigger ktd_fill_search tự chạy lại cho ba dòng vừa sửa, nên cột tìm kiếm
-- cập nhật theo. Tìm kiếm vốn không phân biệt hoa thường, kết quả không đổi.

-- Kiểm nhanh sau khi chạy — phải ra 0:
--   select count(*) from products
--   where name_vi like '%TSChorn%' or name_en like '%TSChorn%'
--      or catalog->>'name' ~ 'TSChorn|Corehog|Bevel Tools';
