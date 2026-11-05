import { NhapExcel } from '@/components/admin/NhapExcel'

export const metadata = { title: 'Nhập từ Excel' }

export default function AdminNhapExcel() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="mb-4">
        <h1 className="font-display text-[22px] font-bold text-ktd-600">Nhập sản phẩm từ Excel</h1>
        <p className="text-[13px] text-ink-600">
          Nạp hàng loạt từ file mẫu của KTD. Mã đã có trên web thì ghi đè nội dung (giữ ảnh và đường dẫn); mã mới thì thêm.
        </p>
      </div>
      <NhapExcel />
    </main>
  )
}
