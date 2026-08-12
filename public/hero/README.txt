Tài sản video nền Hero trang chủ.

  ktd-hero-1920x1080.mp4                 Desktop 16:9, 15 giây, không tiếng, 4.8 Mbps
  ktd-hero-mobile-1080x1350.mp4          Điện thoại 4:5 dọc, 15 giây, không tiếng
  ktd-hero-poster-1920x1080.webp/.jpg    Poster desktop
  ktd-hero-poster-mobile-1080x1350.*     Poster điện thoại

Cách hoạt động (components/home/HeroVideo.tsx):
  - Màn hình >= 768px  -> phát bản 16:9
  - Màn hình <  768px  -> phát bản dọc 4:5 (không bị cắt hai bên)
  - prefers-reduced-motion hoặc Save-Data -> chỉ hiện poster tĩnh ~48KB
  - Poster luôn vẽ sẵn phía dưới nên không bao giờ lộ khung đen khi đang tải

Thay video mới: giữ nguyên tên file là xong, không cần sửa code.
