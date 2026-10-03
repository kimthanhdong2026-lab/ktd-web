-- =============================================================================
-- Cột tìm kiếm phải chứa CẢ tên nhóm nhỏ lẫn tên nhóm chính
--
-- LỖI ĐƯỢC PHÁT HIỆN NGÀY 03/10/2026, sau khi chuyển sang danh mục hai cấp.
--
-- Trigger ktd_fill_search của 0001 chép tên nhóm mà sản phẩm gắn vào. Hồi danh
-- mục còn một cấp thì nhóm đó chính là "Dụng cụ an toàn" nên khách gõ tên nhóm
-- là ra hàng. Sau khi chuyển hai cấp, sản phẩm gắn vào NHÓM NHỎ "Dao an toàn",
-- nên cột tìm kiếm mất hẳn tên nhóm chính "Dụng cụ cắt an toàn".
--
-- Hậu quả: khách gõ đúng tên nhóm chính — chính là chữ in trên ô danh mục ở
-- trang chủ và trên đầu bộ lọc — thì tìm chính xác KHÔNG ra gì. Vẫn còn tìm gần
-- đúng đỡ cho, nhưng tìm gần đúng chỉ nên là lưới an toàn, không phải đường
-- chính.
--
-- Sửa: trigger tra thêm một bậc lên nhóm cha và nối cả tên lẫn slug vào.
-- =============================================================================

create or replace function ktd_fill_search()
  returns trigger
  language plpgsql
as $ktd$
declare
  ten_hang      text;
  ten_nhom      text;
  slug_nhom_cha text;
  ten_nhom_cha  text;
begin
  select name into ten_hang from brands where slug = new.brand_slug;

  select c.name_vi, c.parent_slug
    into ten_nhom, slug_nhom_cha
  from categories c
  where c.slug = new.category_slug;

  -- Nhóm chính của sản phẩm. Khách thường gõ đúng chữ in trên ô danh mục ở
  -- trang chủ, mà chữ đó là tên nhóm CHÍNH chứ không phải tên nhóm nhỏ.
  if slug_nhom_cha is not null then
    select name_vi into ten_nhom_cha from categories where slug = slug_nhom_cha;
  end if;

  new.search_vi := ktd_norm(
    coalesce(new.name_vi, '')       || ' ' ||
    coalesce(new.part, '')          || ' ' ||
    coalesce(new.series, '')        || ' ' ||
    coalesce(new.sub_vi, '')        || ' ' ||
    coalesce(new.desc_vi, '')       || ' ' ||
    coalesce(new.brand_slug, '')    || ' ' ||
    coalesce(ten_hang, '')          || ' ' ||
    coalesce(new.category_slug, '') || ' ' ||
    coalesce(ten_nhom, '')          || ' ' ||
    coalesce(slug_nhom_cha, '')     || ' ' ||
    coalesce(ten_nhom_cha, '')      || ' ' ||
    array_to_string(coalesce(new.keywords, '{}'), ' ')
  );
  return new;
end;
$ktd$;

-- Nạp lại cột tìm kiếm cho toàn bộ sản phẩm đang có. Trigger chạy theo từng
-- dòng UPDATE nên câu này là đủ.
update products set search_vi = '';

-- Kiểm nhanh sau khi chạy — cả ba câu đều phải ra kết quả:
--   select count(*) from products where search_vi like '%dao an toan%';
--   select count(*) from products where search_vi like '%dung cu cat an toan%';
--   select count(*) from products where search_vi like '%an-toan%';
