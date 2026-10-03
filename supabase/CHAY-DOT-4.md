# Đợt 4 — mười file SQL cần chạy

Mười file dưới đây dựng cấu trúc danh mục hai cấp, nội dung 19 trang thương hiệu
và bộ lọc hai cấp. Chạy trên dự án Supabase **KTD-WEB** đang phục vụ khách.

## Cảnh báo từ một lần đã sập

> Bản đầu của tài liệu này viết: *"chạy xong website vẫn y nguyên"*. **Câu đó
> sai** và đã làm trang Sản phẩm trên bản thật hiện 0 sản phẩm ngày 03/10/2026.
>
> Lý do: `0008` nạp danh mục ở trạng thái **ẩn** cho an toàn, nhưng `0010` lại
> gắn 35 sản phẩm đang chạy vào chính những nhóm ẩn đó, rồi `0011` lọc bỏ mọi
> thứ thuộc nhóm ẩn. Ba file **riêng lẻ thì an toàn, gộp lại thì không**.
>
> Đã sửa: `0008` nay nạp ở trạng thái hiện, và `0012` thêm một trigger chặn
> hẳn — từ nay cơ sở dữ liệu không cho phép tồn tại sản phẩm đang hiện mà nhóm
> của nó đang ẩn.

## Sau khi chạy, website đổi những gì

Trang Sản phẩm chuyển sang **bộ lọc hai cấp**: 12 nhóm chính, bấm vào thì các
nhóm nhỏ xổ ra. Chọn một nhóm chính thì ra toàn bộ sản phẩm của các nhóm nhỏ
bên dưới.

35 sản phẩm vẫn còn đủ, không mã nào mất. Các cột mới đều có giá trị mặc định,
không câu nào xoá dữ liệu cũ.

Ba mã `BT-R2`, `LK-125`, `RTC-40` đang nằm ở nhóm **đoán tạm** cho tới khi Ban
Giám đốc trả lời bảng đối chiếu
(`Hop-thu-den/KTD-Doi-chieu-danh-muc-35-san-pham.docx`). Chúng vẫn hiện bình
thường, chỉ là có thể đang ở nhầm nhóm nhỏ.

Ba thay đổi duy nhất nhìn thấy được, cả ba đều do Ban Giám đốc chốt 03/10/2026:

| Thay đổi | Ở đâu |
|---|---|
| RTC: xuất xứ Đức → **Thổ Nhĩ Kỳ** | thẻ thương hiệu, trang sản phẩm RTC-40 |
| **GARRYSON** xuất hiện | khối 19 thương hiệu (chưa có sản phẩm) |
| **MoldMender** biến mất | khối thương hiệu — ẩn, không xoá |

## Cách chạy

Mở [supabase.com](https://supabase.com) → dự án **KTD-WEB** → **SQL Editor** →
**New query**. Dán nội dung từng file rồi bấm **Run**. Chạy **đúng thứ tự**:

| Thứ tự | File | Làm gì |
|---|---|---|
| 1 | `0007_danh_muc_hai_cap.sql` | Thêm cột cha–con, cột ẩn/hiện, cột nội dung trang thương hiệu |
| 2 | `0008_danh_muc_moi.sql` | Nạp 12 nhóm chính + 41 nhóm nhỏ |
| 3 | `0009_trang_thuong_hieu.sql` | Nạp nội dung 19 trang thương hiệu |
| 4 | `0010_gan_san_pham.sql` | Gắn 35 sản phẩm vào nhóm nhỏ |
| 5 | `0011_browse_hai_cap.sql` | Nâng hàm tìm kiếm lên hai cấp, thêm hàm cây danh mục |
| 6 | `0012_nghi_huu_nhom_cu.sql` | Ẩn 3 nhóm cũ đã gộp, và chặn vĩnh viễn lỗi "sản phẩm lạc nhóm ẩn" |
| 7 | `0013_tim_kiem_hai_cap.sql` | Cho cột tìm kiếm chứa cả tên nhóm chính, không chỉ nhóm nhỏ |
| 8 | `0014_banner_thuong_hieu.sql` | Gắn ảnh banner cho 19 trang thương hiệu |
| 9 | `0015_danh_muc_tieng_anh.sql` | Tên tiếng Anh cho 12 nhóm chính + 41 nhóm nhỏ |
| 10 | `0016_thuong_hieu_tieng_anh.sql` | Nội dung tiếng Anh cho 19 trang thương hiệu |

Mỗi file chạy xong Supabase báo **Success. No rows returned** là đúng.

Thứ tự bắt buộc: file 2 ghi vào cột `parent_slug` do file 1 tạo ra; file 3 cũng
vậy; file 4 cần các nhóm nhỏ của file 2 đã tồn tại.

### Riêng file 4 — còn ba mã chờ Ban Giám đốc

`0010_gan_san_pham.sql` gắn cả 35 mã, nhưng ba mã `BT-R2`, `LK-125` và `RTC-40`
mới chỉ gắn **tạm theo phán đoán** (xem chú thích ngay trong file). Vẫn nên chạy
file này ngay — ba mã đó hiện bình thường trên web, chỉ là có thể đang nằm ở
nhầm nhóm nhỏ. Sửa lại lúc nào cũng được, chỉ tốn một lần chạy lại.

Khi bản xác nhận của Ban Giám đốc về:

1. Mở `scripts/doi-chieu-danh-muc.json`
2. Sửa giá trị `"nho"` của ba mã đó, xoá cờ `cho_xac_nhan`
3. Chạy `node scripts/gen-gan-san-pham-sql.mjs`
4. Chạy lại file SQL vừa sinh ra — nó ghi đè, chạy bao nhiêu lần cũng được

### Mã nguồn web cần file 1 đã chạy

Trang Sản phẩm đọc hai cột `parent_slug` và `visible`. Chạy mã nguồn mới trên
cơ sở dữ liệu chưa có hai cột đó thì trang trả về lỗi 500. Đẩy mã nguồn lên
*sau* khi đã chạy file 1, đừng làm ngược lại.

## Kiểm lại sau khi chạy

Dán đoạn này vào SQL Editor:

```sql
select
  (select count(*) from categories where parent_slug is null)     as nhom_chinh,
  (select count(*) from categories where parent_slug is not null) as nhom_nho,
  (select count(*) from brands where visible)                     as hang_dang_hien,
  (select origin_vi from brands where slug = 'rtc')               as xuat_xu_rtc,
  (select count(*) from brands where intro_vi is not null)        as hang_co_noi_dung,
  (select count(*) from products_hien_thi)                        as san_pham_hien,
  (select count(*) from products p
     join categories c on c.slug = p.category_slug
   where c.parent_slug is not null)                               as sp_da_gan_nhom_nho;
```

Kết quả phải là:

| Cột | Giá trị đúng |
|---|---|
| `nhom_chinh` | 12 |
| `nhom_nho` | 41 |
| `hang_dang_hien` | 19 |
| `xuat_xu_rtc` | Thổ Nhĩ Kỳ |
| `hang_co_noi_dung` | 19 |
| `san_pham_hien` | 35 |
| `sp_da_gan_nhom_nho` | 35 |

`san_pham_hien` phải vẫn là **35**. Nếu ra ít hơn nghĩa là có thứ gì đó bị ẩn
nhầm — dừng lại, đừng chạy tiếp.

Thử luôn hai hàm mới:

```sql
select jsonb_pretty(search_products('', null, array['an-toan'], 'default', 3, 0) - 'items');
select jsonb_pretty(cay_danh_muc());
```

Câu đầu lọc theo **nhóm chính** `an-toan` và phải trả về `total` = 15 — nghĩa là
chọn nhóm chính thì ra hết sản phẩm của các nhóm nhỏ bên dưới, đúng như yêu cầu
của Mr Nam. Câu sau trả về cây 12 nhánh kèm số sản phẩm từng nhánh.

## Sau đó còn gì

1. **Bản xác nhận của Ban Giám đốc** cho ba mã `BT-R2`, `LK-125`, `RTC-40` —
   xem mục "Riêng file 4" ở trên.
2. ~~Chuyển hướng ba đường dẫn danh mục cũ~~ — xong, khai ở `next.config.js`,
   trả 308 sang nhóm đã gộp.
3. ~~Dựng 19 trang thương hiệu~~ — xong, `/thuong-hieu` và
   `/thuong-hieu/{slug}`, cả hai ngôn ngữ.

## Nếu chạy nhầm hoặc muốn lùi lại

Cả mười file đều chạy lại được nhiều lần mà không hỏng gì. Không file nào xoá dữ
liệu. Muốn gỡ hẳn danh mục mới thì phải trả sản phẩm về nhóm cũ TRƯỚC, nếu
không sẽ vướng khoá ngoại:

```sql
delete from categories where parent_slug is not null;
-- 12 nhóm chính dùng lại slug cũ nên KHÔNG được xoá, sản phẩm đang trỏ vào đó.
```
