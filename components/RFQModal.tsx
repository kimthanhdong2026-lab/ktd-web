'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from './StoreProvider'
import { brandName, getProductByPart } from '@/lib/ktd-data'

interface FormState {
  name: string
  company: string
  phone: string
  email: string
  note: string
}

const EMPTY_FORM: FormState = { name: '', company: '', phone: '', email: '', note: '' }

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** RFQ-YYMMDD-NNN, e.g. RFQ-260805-014. */
function makeRequestCode(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `RFQ-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${seq}`
}

/**
 * Form rút gọn theo đúng bản thiết kế mới nhất: chỉ Họ tên và Số điện thoại
 * là bắt buộc. Công ty / Email để trống vẫn gửi được — càng ít trường,
 * tỉ lệ gửi càng cao.
 */
export function RFQModal() {
  const router = useRouter()
  const { rfqOpen, rfqNote, closeRfq, cart, setQty, removeFromCart } = useStore()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [tried, setTried] = useState(false)
  const [sentCode, setSentCode] = useState<string | null>(null)
  const [sentSummary, setSentSummary] = useState('')

  useEffect(() => {
    if (rfqOpen && rfqNote) setForm((f) => (f.note ? f : { ...f, note: rfqNote }))
  }, [rfqOpen, rfqNote])

  useEffect(() => {
    if (rfqOpen) {
      setSentCode(null)
      setTried(false)
    }
  }, [rfqOpen])

  if (!rfqOpen) return null

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const errors = {
    name: !form.name.trim() ? 'Vui lòng nhập họ tên' : '',
    phone: !form.phone.trim() ? 'Vui lòng nhập số điện thoại' : '',
    // Optional field: only complain when something was typed and it is malformed.
    email: form.email.trim() && !EMAIL_RE.test(form.email) ? 'Email chưa hợp lệ' : '',
  }
  const blocking = !!errors.name || !!errors.phone

  const showError = (field: keyof typeof errors) =>
    (tried || touched[field]) && errors[field] ? errors[field] : ''

  const fieldClass = (field: keyof typeof errors | null) =>
    `w-full rounded-md border px-3.5 py-2.5 text-[15px] outline-none focus:border-ktd-600 ${
      field && showError(field) ? 'border-quote' : 'border-ink-300'
    }`

  const submit = () => {
    setTried(true)
    if (blocking || errors.email) return
    const units = cart.reduce((s, c) => s + c.qty, 0)
    setSentSummary(
      cart.length ? `${cart.length} sản phẩm · ${units} đơn vị` : 'Yêu cầu tư vấn chung'
    )
    setSentCode(makeRequestCode())
    // Gửi tới đầu mối điều phối (email + DB + ping Zalo/Telegram) sẽ nối ở bước backend.
  }

  return (
    <div
      onClick={closeRfq}
      className="fixed inset-0 z-[110] flex animate-fadeup items-start justify-center overflow-y-auto bg-[rgba(0,38,63,.72)] px-4 py-[5vh] backdrop-blur-[4px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Yêu cầu báo giá"
        className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-overlay"
      >
        {sentCode ? (
          <div className="px-6 py-12 text-center md:px-10">
            <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#e8f7ee] text-[34px] text-success">
              ✓
            </div>
            <h2 className="mb-3 font-display text-[28px] font-bold text-ink-900">
              Đã gửi yêu cầu báo giá!
            </h2>
            <p className="mb-2 text-base text-ink-500">
              Chúng tôi sẽ liên hệ quý khách hàng trong thời gian sớm nhất. Trân trọng cảm ơn.
            </p>
            <p className="my-4 inline-block rounded-md bg-ktd-50 px-4 py-3 font-mono text-[15px] text-ktd-600">
              Mã yêu cầu: {sentCode}
            </p>
            <p className="mb-7 text-sm text-ink-500">{sentSummary}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  closeRfq()
                  router.push('/san-pham')
                }}
                className="btn-primary"
              >
                Tiếp tục xem sản phẩm
              </button>
              <button
                type="button"
                onClick={closeRfq}
                className="btn border-[1.5px] border-ink-300 text-ink-700 hover:bg-ink-100"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-[#eef1f4] px-6 py-5 md:px-8">
              <div>
                <h2 className="mb-1.5 font-display text-2xl font-bold text-ink-900">
                  Yêu cầu báo giá
                </h2>
                <p className="text-sm text-ink-500">Chúng tôi sẽ phản hồi sớm nhất.</p>
              </div>
              <button
                type="button"
                onClick={closeRfq}
                aria-label="Đóng"
                className="h-9 w-9 flex-shrink-0 rounded-md bg-ink-100 text-base text-ink-500 hover:bg-ink-300"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[64vh] overflow-y-auto px-6 py-6 md:px-8">
              <p className="label-caps mb-3 text-ink-900">Danh sách sản phẩm</p>

              {cart.length > 0 ? (
                <ul className="mb-4 flex flex-col gap-2.5">
                  {cart.map((line) => {
                    const p = getProductByPart(line.part)
                    return (
                      <li
                        key={line.part}
                        className="flex flex-wrap items-center gap-3 rounded-[10px] bg-ink-100 px-3.5 py-3"
                      >
                        <div className="min-w-[140px] flex-1">
                          <div className="font-display text-sm font-semibold text-ink-900">
                            {p ? p.name : line.part}
                          </div>
                          <div className="mt-0.5 text-xs text-ink-500">
                            <span className="part-no">{line.part}</span>
                            {p ? ` · ${brandName(p.brand)}` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setQty(line.part, -1)}
                            aria-label={`Giảm số lượng ${line.part}`}
                            className="h-8 w-8 rounded-md border border-ink-300 bg-white text-base text-ink-700 hover:border-ktd-600"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.part, 1)}
                            aria-label={`Tăng số lượng ${line.part}`}
                            className="h-8 w-8 rounded-md border border-ink-300 bg-white text-base text-ink-700 hover:border-ktd-600"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.part)}
                          aria-label={`Xóa ${line.part}`}
                          className="p-1 text-lg text-ink-500 hover:text-quote"
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mb-3.5 rounded-[10px] border border-dashed border-ink-300 bg-ink-100 p-5 text-center text-sm text-ink-500">
                  Chưa có sản phẩm. Thêm sản phẩm từ trang danh mục, hoặc mô tả nhu cầu ở ô bên dưới.
                </p>
              )}

              <div className="mb-7">
                <button
                  type="button"
                  onClick={() => {
                    closeRfq()
                    router.push('/san-pham')
                  }}
                  className="btn-secondary w-full text-sm"
                >
                  + Thêm sản phẩm khác
                </button>
              </div>

              <p className="label-caps mb-3.5 text-ink-900">Thông tin liên hệ</p>

              <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rfq-name" className="mb-1.5 block text-[13px] text-ink-700">
                    Họ và tên *
                  </label>
                  <input
                    id="rfq-name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    aria-invalid={!!showError('name')}
                    className={fieldClass('name')}
                  />
                  {showError('name') && (
                    <p className="mt-1 text-xs text-quote">⚠ {showError('name')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rfq-company" className="mb-1.5 block text-[13px] text-ink-700">
                    Công ty
                  </label>
                  <input
                    id="rfq-company"
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                    className={fieldClass(null)}
                  />
                </div>

                <div>
                  <label htmlFor="rfq-phone" className="mb-1.5 block text-[13px] text-ink-700">
                    Số điện thoại *
                  </label>
                  <input
                    id="rfq-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                    aria-invalid={!!showError('phone')}
                    className={fieldClass('phone')}
                  />
                  {showError('phone') && (
                    <p className="mt-1 text-xs text-quote">⚠ {showError('phone')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rfq-email" className="mb-1.5 block text-[13px] text-ink-700">
                    Email
                  </label>
                  <input
                    id="rfq-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={!!showError('email')}
                    className={fieldClass('email')}
                  />
                  {showError('email') && (
                    <p className="mt-1 text-xs text-quote">⚠ {showError('email')}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="rfq-note" className="mb-1.5 block text-[13px] text-ink-700">
                  Ghi chú
                </label>
                <textarea
                  id="rfq-note"
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder="Yêu cầu riêng, thời hạn giao, thông số cần tư vấn…"
                  className="min-h-[80px] w-full resize-y rounded-md border border-ink-300 px-3.5 py-2.5 text-[15px] outline-none focus:border-ktd-600"
                />
              </div>

              <button type="button" onClick={submit} className="btn-quote mt-1.5 w-full">
                GỬI YÊU CẦU BÁO GIÁ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
