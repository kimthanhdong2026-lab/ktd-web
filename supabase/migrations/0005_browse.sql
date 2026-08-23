-- =============================================================================
-- Truy vấn cho trang Sản phẩm
--
-- Một hàm làm trọn bốn việc trong một lượt gọi: lọc, sắp xếp, cắt trang và đếm
-- tổng. Gọi riêng từng thứ sẽ phải quét bảng nhiều lần và dễ lệch nhau giữa số
-- đếm với số dòng thực trả về.
--
-- Trả về jsonb thay vì setof: PostgREST đưa thẳng ra ngoài, và gói được cả tổng
-- số lẫn số đếm theo hãng vào cùng một phản hồi.
-- =============================================================================

create or replace function search_products(
  q        text    default '',
  brand_in text[]  default null,
  cat_in   text[]  default null,
  sort     text    default 'default',
  lim      integer default 24,
  off      integer default 0
)
  returns jsonb
  language sql
  stable
  parallel safe
as $ktd$
  with n as (
    select ktd_norm(coalesce(q, '')) as q
  ),
  -- Đã lọc theo hãng và nhóm, chưa xét chuỗi tìm
  base as (
    select p.*,
           b.name    as brand_label,
           c.name_vi as category_label
    from products p
      join brands     b on b.slug = p.brand_slug
      join categories c on c.slug = p.category_slug
    where (brand_in is null or cardinality(brand_in) = 0 or p.brand_slug    = any(brand_in))
      and (cat_in   is null or cardinality(cat_in)   = 0 or p.category_slug = any(cat_in))
  ),
  -- Khớp chính xác: nhanh, có chỉ mục trigram phục vụ
  hit as (
    select b.* from base b, n
    where n.q = '' or b.search_vi like '%' || n.q || '%'
  ),
  -- Toàn bộ tập khớp, chưa cắt trang: dùng cho cả tổng số lẫn số đếm theo hãng
  loc as (
    select * from hit
    union all
    -- Không khớp chính xác chỗ nào thì mới nới sang tìm gần đúng. Nhờ vậy gõ
    -- sai vài ký tự vẫn ra sản phẩm thay vì trang trống, mà khi gõ đúng thì
    -- kết quả không bị pha thêm những mã chỉ na ná.
    select b.* from base b, n
    where not exists (select 1 from hit)
      and n.q <> ''
      and word_similarity(n.q, b.search_vi) > 0.3
  ),
  -- Mỗi nhánh case chỉ có giá trị khi đúng kiểu sắp xếp đó được chọn; các nhánh
  -- còn lại trả null nên không ảnh hưởng thứ tự.
  ordered as (
    select *
    from loc
    order by
      case when sort = 'brand' then brand_label end,
      case when sort = 'name'  then name_vi end,
      case when sort = 'new'   then (tag is distinct from 'Mới') end,
      priority nulls last,
      name_vi
    offset off
    limit  lim
  )
  select jsonb_build_object(
    'total', (select count(*) from loc),
    'items', coalesce((select jsonb_agg(to_jsonb(o)) from ordered o), '[]'::jsonb),
    -- Số sản phẩm mỗi hãng trong tập khớp, để dựng dòng "Xem tất cả sản phẩm X"
    -- mà không phải gọi thêm một truy vấn cho mỗi hãng.
    'by_brand', coalesce(
      (select jsonb_object_agg(brand_slug, n)
       from (select brand_slug, count(*) as n from loc group by brand_slug) f),
      '{}'::jsonb
    ),
    'by_category', coalesce(
      (select jsonb_object_agg(category_slug, n)
       from (select category_slug, count(*) as n from loc group by category_slug) f),
      '{}'::jsonb
    )
  )
$ktd$;

comment on function search_products(text, text[], text[], text, integer, integer) is
  'Loc, sap xep, cat trang va dem cho trang San pham. Tra ve jsonb: total, items, by_brand, by_category.';

grant execute on function search_products(text, text[], text[], text, integer, integer) to anon, authenticated;
