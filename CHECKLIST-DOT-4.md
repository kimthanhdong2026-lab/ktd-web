# Checklist đợt 4 — đối chiếu từng đoạn của "Sửa web 4"

Dựng từ **toàn bộ 35 đoạn** của `Hop-thu-den/Sửa web 4.docx`, cộng bản chú giải
của Mr Nam. Mỗi dòng ghi rõ đã kiểm bằng cách nào.

Ký hiệu: ✅ xong và đã kiểm · ❌ chưa làm · ⚠️ làm một phần · ⛔ bị quyết định
khác đè lên.

---

## A. Trang Thương hiệu

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 1 | Thêm trang THƯƠNG HIỆU giữa SẢN PHẨM và TIN TỨC | ✅ đúng vị trí trên thanh điều hướng |
| 2 | Mọi lối vào đều về một trang chi tiết sản phẩm duy nhất | ✅ chỉ có một route `/san-pham/{slug}` |
| 3 | Rê chuột vào THƯƠNG HIỆU thì 19 hãng xổ xuống | ✅ 19 hãng, 2 cột; điện thoại chạm mũi tên để xổ |
| 10 | Bỏ phần giới thiệu bên cạnh; bấm logo → trang hãng | ✅ |
| 30–33 | 19 trang riêng, đường dẫn cố định, màu theo trang chủ | ✅ |
| 34 | Lọc Nhóm sản phẩm = lọc theo **nhóm nhỏ** | ✅ trang hãng chỉ hiện nhóm hãng đó có |
| 35 | Nội dung + ảnh banner | ✅ 19/19 |
| Mr Nam | Trang hãng chỉ liệt kê nhóm nhỏ hãng đó có hàng | ✅ |

## B. Màu nền, phông chữ

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 4 | Hai màu nền theo amphenol, bỏ nền xanh nhạt | ✅ BGĐ chốt dùng **một** màu `#F8F8F8` |
| 5 | Chữ nhỏ nhất to lên 1–2 cỡ, màu rõ hơn | ✅ sàn 13px toàn site, không còn cỡ nào nhỏ hơn |
| 6 | "Phân phối chính hãng" to lên 3–4 cỡ | ✅ 12px → 19/21px |
| 7 | Thử trên trang Giới thiệu trước | ✅ BGĐ duyệt phương án 2 |
| 12 | Chữ xanh nhạt → `#0C4C8B` | ⛔ Mr Nam chốt **giữ** `#005E96` |
| 27 | Màu thống nhất từ trang chủ | ✅ |

## C. Trang chủ

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 8 | Hạ logo cũ, dùng bộ logo mới | ✅ 19/19 từ thư mục mới |
| 9 | Kích thước logo đều nhau | ✅ chuẩn hoá về khung 320×128 |
| 11 | Danh mục mới | ✅ 12 nhóm chính / 41 nhóm nhỏ |
| 13 | Thêm ảnh vào mỗi ô danh mục, chữ xuống dưới ảnh | ✅ 12/12 ảnh, chữ dưới ảnh, có dải mờ sang trắng |
| 14 | Bỏ panel chi tiết hãng | ✅ |
| 15 | Đồng nhất màu chữ khối Danh mục | ✅ |
| 16 | Khung chữ nhật → tròn/lục giác/tứ giác | ✅ bo góc 26px |
| 17 | Đồng nhất màu chữ khối "Vì sao chọn KTĐ" | ✅ tiêu đề về xanh logo |
| 19 | Khung tròn + nền xanh đậm + bỏ số 1,2,3,4 | ✅ cả ba |
| 23 | Biểu tượng nổi: bỏ khung, chỉ dùng biểu tượng | ✅ bỏ khung, dùng **logo Zalo thật** lấy từ tài liệu |
| 24 | Shopee thay logo KTĐ, FB/YT to hơn, thêm LinkedIn | ✅ |

## D. Trang Giới thiệu

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 18 | Bài giới thiệu rộng bằng 3 ảnh bên dưới | ✅ |
| 19 | Bỏ số thứ tự ở khối Giá trị | ✅ đã bỏ |
| 20 | "Khởi đầu hành trình" → "KHỞI ĐẦU" | ✅ cả hai ngôn ngữ |
| 21 | "ATA TOOLS" → "ATA", thêm GARRYSON năm 2019 | ✅ |
| 22 | Cân chiều dài dòng timeline | ✅ `text-wrap: balance` |

## E. Trang Sản phẩm

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 25 | Giữ nguyên phần phía trên | ✅ |
| 26 | Mỗi sản phẩm một đường dẫn cố định | ✅ |
| 28a | Bộ lọc trái: nhóm lớn có mũi xổ ra nhóm con | ✅ mũi xổ tách riêng khỏi ô tích |
| 28b | Bên dưới là lọc theo thương hiệu | ✅ đã đảo: Danh mục trên, Thương hiệu dưới |
| 28c | Liệt kê sản phẩm phẳng, KHÔNG gom theo hãng | ✅ lưới phẳng, đã xoá `ProductGroups` |
| 28d | Phân trang 1,2,3… | ✅ có ← 1 2 →, rút gọn bằng dấu … khi nhiều trang |
| 28e | Chưa lọc thì hiện 20–24 sản phẩm ở trang 1 | ✅ 24/trang — đã đo: trang 1 có 24, trang 2 có 11 |
| 29 | Bản điện thoại: nút Bộ lọc, nhóm chính bấm xổ nhóm nhỏ | ✅ đã chụp thật ở 500px, có nút Áp dụng |
| Mr Nam | Chọn một hãng thì nhóm nhỏ thu theo hãng đó | ✅ chọn Martor → còn đúng 1 nhóm |

---

## Còn phải làm

Không còn. Toàn bộ 35 đoạn của "Sửa web 4" đã xử lý.

## Chờ bên ngoài

- Đường dẫn thật của gian hàng Shopee, Facebook, YouTube và LinkedIn. Hiện cả
  bốn biểu tượng trỏ về trang chủ của từng mạng. Sửa `MANG_XA_HOI` và `SHOPEE`
  trong `lib/constants.ts` là xong.

## Đã khép lại

- **Logo 5 hãng Martor, Buchem, Tschorn, Lenzkes, ATA** — chốt ngày 04/10/2026:
  dùng luôn file hiện có, không xin bản gốc từ hãng nữa. Lúc đầu đánh giá là
  "quá nhỏ", nhưng đó là vì file còn viền trắng thừa bao quanh nên phần chữ chỉ
  chiếm một góc. Sau khi cắt viền, ba hãng Tschorn, Lenzkes, ATA thực ra đang bị
  *thu nhỏ* khi hiển thị (0,56–0,71×), tức còn dư độ phân giải; Martor và Buchem
  phóng 1,09–1,22× nhưng là chữ màu phẳng nên không thấy rỗ.
- **Ba mã `BT-R2`, `LK-125`, `RTC-40`** — đã gán theo phỏng đoán và đã chạy vào
  cơ sở dữ liệu, website hiển thị bình thường. Bảng đối chiếu 35 sản phẩm đã gửi
  BGĐ ngày 03/10/2026 (dòng 3, 12, 31, cột "BGĐ sửa lại"). BGĐ trả lời khác thì
  sửa `scripts/doi-chieu-danh-muc.json`, chạy lại `gen-gan-san-pham-sql.mjs` rồi
  chạy file SQL sinh ra — không chặn việc gì.
