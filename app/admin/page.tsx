import { redirect } from 'next/navigation'

/** /admin đưa thẳng vào màn hình đầu tiên: trang chủ. */
export default function AdminHome() {
  redirect('/admin/trang-chu')
}
