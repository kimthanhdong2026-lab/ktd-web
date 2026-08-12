# Kim Thành Đông — Website

Website B2B phân phối thiết bị công nghiệp, dựng bằng Next.js (App Router) + TypeScript + Tailwind CSS.

Giao diện bám theo bản bàn giao của Claude Design:
`handoff-extracted/kim-th-nh-ng-website-prototype/project/KTD Website.dc.html`
và đặc tả `uploads/KTD-Website-Plan-Document-Design-Handoff-v2.md`.

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # chỉnh NEXT_PUBLIC_SITE_URL nếu cần
npm run dev                  # http://localhost:3000
```

Lệnh khác:

```bash
npm run build       # build production (SSG)
npm start           # chạy bản đã build
npm run typecheck   # tsc --noEmit
npm run lint
npm run optimize:assets   # chuẩn hóa logo về WebP (chạy lại khi thêm logo mới)
```

## Cấu trúc

```
app/                  Routes (App Router) + sitemap.ts, robots.ts
  san-pham/           Trang danh mục + [slug] = trang chi tiết sản phẩm (PDP)
  tin-tuc/            Danh sách + [slug] = bài viết
components/           Header, Footer, FloatingCTA, SearchOverlay, RFQModal, ProductCard…
  StoreProvider.tsx   State toàn cục: giỏ RFQ, toast, overlay tìm kiếm, modal báo giá
lib/
  ktd-data.ts         Toàn bộ dữ liệu nghiệp vụ (21 thương hiệu, 26 mã đại diện, 9 danh mục…)
  search.ts           Tìm kiếm: khử dấu tiếng Việt, fuzzy, ánh xạ "ngôn ngữ thợ nghề"
  constants.ts        Thông tin công ty, nội dung tĩnh
  utils.ts            normalizeVi, slugify, levenshtein
public/assets/        Logo công ty + 15 logo thương hiệu (WebP, đều < 30KB)
```

## Nguồn dữ liệu

Hiện dùng dataset tĩnh trong `lib/ktd-data.ts`, cấu trúc bám theo bảng trường ở spec D2.
Khi đội vận hành hoàn thiện file Excel danh mục sản phẩm, thay dataset này bằng bước import —
toàn bộ trang sản phẩm, PDP, tìm kiếm và sitemap đọc chung từ đây nên không phải sửa giao diện.

## Còn thiếu để go-live (phía KTĐ, theo spec E4)

- Ảnh sản phẩm thật (tối đa 5 ảnh/mã, nền trắng) — hiện dùng placeholder trung tính.
- File catalog PDF từng series — nút tải hiện chỉ báo toast.
- Video Hero (desktop) + ảnh tĩnh WebP (mobile).
- Logo vector cho 6 thương hiệu còn thiếu: Helical, Bevel Tools, Technomark, Gruetzner, Roscamat, 3ARM.
- Backend nhận RFQ (email tới đầu mối điều phối + lưu DB + ping Zalo/Telegram), SLA 15–30 phút.
- Bản tiếng Anh `/en/` (giai đoạn P1).

## Liên hệ

sales@kimthanhdong.com · Hotline 0914 897 227
