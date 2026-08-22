-- =============================================================================
-- Tìm kiếm sản phẩm
--
-- Trang Sản phẩm lọc bằng ilike trên cột search_vi — chỉ mục GIN trigram ở
-- 0001 phục vụ được kiểu '%...%' nên không cần hàm riêng, và dùng thẳng query
-- builder thì lấy được cả tổng số bản ghi cho phân trang.
--
-- Hàm dưới đây chỉ dành cho ô tìm kiếm nổi: nó cần chịu được gõ sai vài ký tự
-- ("secumx", "morisflex"), việc mà ilike không làm được. Trước đây phần này
-- chạy Levenshtein trên trình duyệt sau khi tải toàn bộ kho hàng xuống.
--
-- Quy tắc xếp hạng, từ đúng nhất tới mơ hồ nhất:
--   1. Trùng khít mã hàng
--   2. Mã hàng hoặc tên bắt đầu bằng chuỗi tìm
--   3. Có chứa chuỗi tìm ở giữa
--   4. Gần giống (trigram) — dành cho trường hợp gõ sai
-- =============================================================================

create or replace function search_products_fuzzy(
  q          text,
  max_rows   integer default 8,
  min_score  real    default 0.25
)
  returns setof products
  language sql
  stable
  parallel safe
as $ktd$
  with needle as (
    select ktd_norm(q) as n
  )
  select p.*
  from products p, needle
  where needle.n <> ''
    and (
      p.search_vi like '%' || needle.n || '%'
      or similarity(p.search_vi, needle.n) > min_score
    )
  order by
    case
      when ktd_norm(p.part) = needle.n                        then 0
      when ktd_norm(p.part) like needle.n || '%'              then 1
      when ktd_norm(p.name_vi) like needle.n || '%'           then 2
      when p.search_vi like '%' || needle.n || '%'            then 3
      else 4
    end,
    similarity(p.search_vi, needle.n) desc,
    p.priority nulls last,
    p.name_vi
  limit max_rows
$ktd$;

comment on function search_products_fuzzy(text, integer, real) is
  'Tim san pham chiu duoc go sai. Dung cho o tim kiem noi; trang San pham dung ilike.';

-- Ngưỡng similarity mặc định của pg_trgm là 0.3, hơi chặt với chuỗi dài như
-- search_vi. Hàm trên nhận min_score làm tham số nên không cần đổi cấu hình
-- toàn cục — tránh ảnh hưởng tới thứ khác dùng chung cơ sở dữ liệu.

grant execute on function search_products_fuzzy(text, integer, real) to anon, authenticated;
