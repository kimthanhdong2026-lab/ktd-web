-- =============================================================================
-- Trang Sản phẩm: bộ lọc hai cấp
--
-- Thay hàm search_products của 0005 bằng bản hiểu cấu trúc cha–con.
-- PHẢI chạy sau 0007_danh_muc_hai_cap.sql vì dùng cột parent_slug và visible.
--
-- Bốn thay đổi so với bản cũ:
--
-- 1. cat_in nhận CẢ slug nhóm chính lẫn slug nhóm nhỏ.
--    Chọn một nhóm chính thì ra toàn bộ sản phẩm của mọi nhóm nhỏ bên dưới,
--    người dùng không phải tự tick hết các nhóm con.
--
-- 2. Chỉ trả về những gì đang hiện. Sản phẩm bị ẩn, hoặc thuộc hãng đang ẩn,
--    hoặc thuộc nhóm đang ẩn, đều biến mất — đúng quy tắc "xoá nghĩa là ẩn".
--
-- 3. Thêm by_parent: số sản phẩm gộp theo nhóm CHÍNH, để dựng bộ lọc hai cấp
--    mà không phải cộng tay ở trình duyệt.
--
-- 4. by_category giữ nguyên hình dạng cũ (slug -> số lượng) nên phần giao diện
--    hiện tại chạy tiếp không cần sửa gì.
--
-- CHẠY ĐƯỢC NGAY CẢ KHI DỮ LIỆU CÒN PHẲNG: lúc chưa nhóm nào có parent_slug,
-- nhánh mở rộng nhóm cha không khớp gì và by_parent trả về rỗng — hành vi y
-- hệt hàm cũ. Nhờ vậy chạy file này trước hay sau lúc nạp danh mục đều an toàn.
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
  base as (
    select p.*,
           b.name    as brand_label,
           c.name_vi as category_label,
           c.parent_slug,
           -- Nhóm chính của sản phẩm: nếu nhóm nó gắn vào đã là nhóm gốc thì
           -- chính nó, ngược lại là nhóm cha.
           coalesce(c.parent_slug, c.slug) as nhom_chinh
    from products p
      join brands     b on b.slug = p.brand_slug
      join categories c on c.slug = p.category_slug
      left join categories cc on cc.slug = c.parent_slug
    where p.visible
      and b.visible
      and c.visible
      and (cc.slug is null or cc.visible)
      and (brand_in is null or cardinality(brand_in) = 0 or p.brand_slug = any(brand_in))
      -- Khớp nếu slug được chọn là chính nhóm nhỏ của sản phẩm, HOẶC là nhóm
      -- chính chứa nó.
      and (
        cat_in is null
        or cardinality(cat_in) = 0
        or p.category_slug = any(cat_in)
        or c.parent_slug = any(cat_in)
      )
  ),
  hit as (
    select b.* from base b, n
    where n.q = '' or b.search_vi like '%' || n.q || '%'
  ),
  loc as (
    select * from hit
    union all
    -- Không khớp chính xác chỗ nào thì mới nới sang tìm gần đúng.
    select b.* from base b, n
    where not exists (select 1 from hit)
      and n.q <> ''
      and word_similarity(n.q, b.search_vi) > 0.3
  ),
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
    'by_brand', coalesce(
      (select jsonb_object_agg(brand_slug, n)
       from (select brand_slug, count(*) as n from loc group by brand_slug) f),
      '{}'::jsonb
    ),
    -- Đếm theo đúng nhóm sản phẩm gắn vào (sau khi chuyển đổi là nhóm nhỏ).
    'by_category', coalesce(
      (select jsonb_object_agg(category_slug, n)
       from (select category_slug, count(*) as n from loc group by category_slug) f),
      '{}'::jsonb
    ),
    -- Đếm gộp theo nhóm chính. Khi dữ liệu còn phẳng thì giá trị này trùng với
    -- by_category, không gây hại gì.
    'by_parent', coalesce(
      (select jsonb_object_agg(nhom_chinh, n)
       from (select nhom_chinh, count(*) as n from loc group by nhom_chinh) f),
      '{}'::jsonb
    )
  )
$ktd$;

comment on function search_products(text, text[], text[], text, integer, integer) is
  'Loc hai cap, sap xep, cat trang va dem cho trang San pham. Tra ve jsonb: total, items, by_brand, by_category, by_parent. Chi tra ve nhung gi dang hien.';

grant execute on function search_products(text, text[], text[], text, integer, integer) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Cây danh mục cho bộ lọc
--
-- Trả nguyên cây hai cấp trong một lượt gọi, kèm số sản phẩm đang hiện của mỗi
-- nhánh. Nhóm nào không có sản phẩm nào thì vẫn trả về nhưng mang so = 0, để
-- phía giao diện tự quyết ẩn đi hay hiện mờ.
-- -----------------------------------------------------------------------------
create or replace function cay_danh_muc()
  returns jsonb
  language sql
  stable
  parallel safe
as $ktd$
  with dem as (
    select category_slug, count(*) as so
    from products_hien_thi
    group by category_slug
  )
  select coalesce(jsonb_agg(x order by x.sort_order, x.name_vi), '[]'::jsonb)
  from (
    select
      c.slug,
      c.name_vi,
      c.name_en,
      c.sub_vi,
      c.sub_en,
      c.sort_order,
      -- Tổng của cả nhánh: sản phẩm gắn thẳng vào nhóm chính (nếu còn) cộng
      -- sản phẩm của mọi nhóm nhỏ bên dưới.
      coalesce((select dem.so from dem where dem.category_slug = c.slug), 0)
        + coalesce((
            select sum(d.so) from categories con
            join dem d on d.category_slug = con.slug
            where con.parent_slug = c.slug and con.visible
          ), 0) as so,
      coalesce((
        select jsonb_agg(jsonb_build_object(
                 'slug', con.slug,
                 'name_vi', con.name_vi,
                 'name_en', con.name_en,
                 'so', coalesce((select d.so from dem d where d.category_slug = con.slug), 0)
               ) order by con.sort_order, con.name_vi)
        from categories con
        where con.parent_slug = c.slug and con.visible
      ), '[]'::jsonb) as con
    from categories c
    where c.parent_slug is null and c.visible
  ) x;
$ktd$;

comment on function cay_danh_muc() is
  'Cay danh muc hai cap kem so san pham dang hien cua tung nhanh. Dung cho bo loc trang San pham.';

grant execute on function cay_danh_muc() to anon, authenticated;
