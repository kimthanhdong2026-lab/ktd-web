import { maQuocKy } from '@/lib/quoc-ky'

/**
 * Ô "Thương hiệu đến từ …" kèm lá cờ nước xuất xứ.
 *
 * Dùng thẻ <img> chứ không dùng next/image: bộ tối ưu ảnh của Next từ chối SVG
 * trừ khi bật dangerouslyAllowSVG, mà cờ chỉ nặng vài trăm byte nên chẳng có gì
 * để tối ưu. Bật cờ đó chỉ để lấy một file 300 byte là mở thêm đường cho SVG từ
 * máy chủ ngoài chạy mã trong trang — không đáng.
 *
 * Không tra được nước thì chỉ hiện chữ, không hiện cờ: một lá cờ sai nước còn
 * tệ hơn là không có cờ.
 */
export function NhanXuatXu({ xuatXu, nhan }: { xuatXu: string; nhan: string }) {
  const ma = maQuocKy(xuatXu)
  return (
    <p className="inline-flex items-center gap-2.5 rounded-lg border border-hairline bg-white px-3.5 py-2 text-[15px] font-medium text-ink-700">
      {ma && (
        <img
          src={`/assets/co/${ma}.svg`}
          alt=""
          width={22}
          height={16}
          className="h-4 w-[22px] flex-none rounded-[2px] object-cover ring-1 ring-black/10"
        />
      )}
      {nhan}
    </p>
  )
}
