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
      or word_similarity(needle.n, p.search_vi) > min_score
    )
  order by
    case
      when ktd_norm(p.part) = needle.n                        then 0
      when ktd_norm(p.part) like needle.n || '%'              then 1
      when ktd_norm(p.name_vi) like needle.n || '%'           then 2
      when p.search_vi like '%' || needle.n || '%'            then 3
      else 4
    end,
    word_similarity(needle.n, p.search_vi) desc,
    p.priority nulls last,
    p.name_vi
  limit max_rows
$ktd$;

comment on function search_products_fuzzy(text, integer, real) is
  'Tim san pham chiu duoc go sai. Dung cho o tim kiem noi; trang San pham dung ilike.';

-- Vì sao word_similarity chứ không phải similarity
--
-- similarity(a, b) so hai chuỗi theo TỔNG THỂ: nó chia số trigram chung cho
-- tổng số trigram của cả hai. Cột search_vi gộp cả mô tả nên dài hàng trăm ký
-- tự; đem so với chuỗi tìm 6 ký tự thì điểm luôn xấp xỉ 0,01 — không bao giờ
-- vượt ngưỡng. Đây chính là lý do bản đầu tiên tìm "secumx" ra 0 kết quả.
--
-- word_similarity(a, b) tìm ĐOẠN GIỐNG NHẤT của b khớp với a, nên độ dài của b
-- không làm loãng điểm. "secumx" so với đoạn "secumax" cho khoảng 0,6.
--
-- Thứ tự tham số quan trọng: chuỗi tìm đứng trước, chuỗi bị tìm đứng sau.

grant execute on function search_products_fuzzy(text, integer, real) to anon, authenticated;
