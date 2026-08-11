'use client'

import { useState } from 'react'
import { PROVINCES } from '@/lib/constants'
import { isValidPhone, isValidEmail, generateRFQCode } from '@/lib/utils'

interface CartItem {
  partNumber: string
  name: string
  brand: string
  qty: number
}

interface RFQModalProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onRemoveFromCart?: (partNumber: string) => void
  onUpdateQty?: (partNumber: string, delta: number) => void
  onProductsClick?: () => void
}

interface FormData {
  name: string
  company: string
  phone: string
  email: string
  province: string
  note: string
}

export function RFQModal({ isOpen, onClose, cart, onRemoveFromCart, onUpdateQty, onProductsClick }: RFQModalProps) {
  const [rfqSent, setRfqSent] = useState(false)
  const [rfqCode, setRfqCode] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    province: '',
    note: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [triedSubmit, setTriedSubmit] = useState(false)

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    if (field === 'name') {
      if (!value.trim()) return 'Vui lòng nhập họ tên'
      if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự'
    }
    if (field === 'phone') {
      if (!value.trim()) return 'Vui lòng nhập số điện thoại'
      if (!isValidPhone(value)) return 'Số điện thoại chưa hợp lệ'
    }
    if (field === 'email') {
      if (value.trim() && !isValidEmail(value)) return 'Email chưa hợp lệ'
    }
    return undefined
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    newErrors.name = validateField('name', formData.name)
    newErrors.phone = validateField('phone', formData.phone)
    newErrors.email = validateField('email', formData.email)

    setErrors(newErrors)
    return !Object.values(newErrors).some((e) => e)
  }

  const handleSubmit = async () => {
    setTriedSubmit(true)
    if (!validate()) return

    // TODO: Call API to submit RFQ
    const code = generateRFQCode()
    setRfqCode(code)
    setRfqSent(true)
  }

  const handleClose = () => {
    if (!rfqSent) {
      onClose()
    } else {
      // Reset form
      setRfqSent(false)
      setFormData({ name: '', company: '', phone: '', email: '', province: '', note: '' })
      setErrors({})
      setTriedSubmit(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-110 bg-ktd-dark/70 backdrop-blur-sm flex items-start justify-center pt-10 pb-8 px-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Screen */}
        {rfqSent && (
          <div className="px-10 py-14 text-center">
            <div className="w-18 h-18 rounded-full bg-green-50 text-green-500 text-5xl flex items-center justify-center mx-auto mb-6">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-ktd-dark mb-3">Đã gửi yêu cầu báo giá!</h2>
            <p className="text-ktd-dark/70 mb-2">Chúng tôi sẽ liên hệ quý khách hàng trong thời gian sớm nhất. Trân trọng cảm ơn.</p>
            <div className="bg-blue-50 rounded px-4 py-3 text-ktd-blue font-mono text-sm inline-block my-4">
              Mã yêu cầu: {rfqCode}
            </div>
            <div className="text-sm text-ktd-dark/60 mb-8">{cart.length} sản phẩm · {cart.reduce((sum, item) => sum + item.qty, 0)} đơn vị</div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  handleClose()
                  onProductsClick?.()
                }}
                className="bg-ktd-blue text-white rounded px-7 py-3 font-semibold hover:bg-blue-700"
              >
                Tiếp tục xem sản phẩm
              </button>
              <button
                onClick={handleClose}
                className="bg-white border-2 border-ktd-light text-ktd-dark rounded px-7 py-3 font-semibold hover:bg-ktd-light"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Form Screen */}
        {!rfqSent && (
          <>
            <div className="px-8 py-6 border-b border-ktd-light/80 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-ktd-dark mb-1">Yêu cầu báo giá</h2>
                <p className="text-sm text-ktd-dark/60">Chúng tôi sẽ phản hồi sớm nhất.</p>
              </div>
              <button
                onClick={handleClose}
                className="bg-ktd-light text-ktd-dark/60 rounded px-2 py-1 text-lg hover:text-ktd-dark"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6 max-h-96 overflow-y-auto">
              {/* Cart Section */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase text-ktd-dark mb-3">DANH SÁCH SẢN PHẨM</div>
                {cart.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                      <div key={item.partNumber} className="flex items-center gap-3 bg-ktd-light rounded-lg p-3">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-ktd-dark">{item.name}</div>
                          <div className="text-xs text-ktd-dark/60 font-mono">{item.partNumber}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQty?.(item.partNumber, -1)}
                            className="w-7 h-7 border border-ktd-light/80 bg-white rounded text-ktd-dark hover:border-ktd-blue"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty?.(item.partNumber, 1)}
                            className="w-7 h-7 border border-ktd-light/80 bg-white rounded text-ktd-dark hover:border-ktd-blue"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart?.(item.partNumber)}
                          className="text-ktd-dark/40 hover:text-ktd-dark text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-ktd-light border border-dashed border-ktd-light/80 rounded-lg p-5 text-center text-sm text-ktd-dark/60 mb-4">
                    Chưa có sản phẩm. Thêm sản phẩm từ trang danh mục, hoặc mô tả nhu cầu ở ô bên dưới.
                  </div>
                )}
                <button
                  onClick={() => {
                    handleClose()
                    onProductsClick?.()
                  }}
                  className="w-full border-2 border-ktd-blue text-ktd-blue rounded px-4 py-2 text-sm font-semibold hover:bg-blue-50"
                >
                  + Thêm sản phẩm khác
                </button>
              </div>

              {/* Contact Fields */}
              <div className="mb-4">
                <div className="text-xs font-bold uppercase text-ktd-dark mb-3">THÔNG TIN LIÊN HỆ</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-ktd-dark mb-1.5">Họ và tên *</label>
                    <input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => setTriedSubmit(true)}
                      placeholder="Nguyễn Văn A"
                      className={`w-full border rounded px-3 py-2 text-sm outline-none ${
                        triedSubmit && errors.name ? 'border-ktd-red' : 'border-ktd-light/80 focus:border-ktd-blue'
                      }`}
                    />
                    {triedSubmit && errors.name && <div className="text-xs text-ktd-red mt-1">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-xs text-ktd-dark mb-1.5">Công ty</label>
                    <input
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="ABC Corp"
                      className="w-full border border-ktd-light/80 rounded px-3 py-2 text-sm outline-none focus:border-ktd-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-ktd-dark mb-1.5">Số điện thoại *</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => setTriedSubmit(true)}
                      placeholder="0914 897 227"
                      className={`w-full border rounded px-3 py-2 text-sm outline-none ${
                        triedSubmit && errors.phone ? 'border-ktd-red' : 'border-ktd-light/80 focus:border-ktd-blue'
                      }`}
                    />
                    {triedSubmit && errors.phone && <div className="text-xs text-ktd-red mt-1">{errors.phone}</div>}
                  </div>
                  <div>
                    <label className="block text-xs text-ktd-dark mb-1.5">Email</label>
                    <input
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => setTriedSubmit(true)}
                      placeholder="name@company.com"
                      type="email"
                      className={`w-full border rounded px-3 py-2 text-sm outline-none ${
                        triedSubmit && errors.email ? 'border-ktd-red' : 'border-ktd-light/80 focus:border-ktd-blue'
                      }`}
                    />
                    {triedSubmit && errors.email && <div className="text-xs text-ktd-red mt-1">{errors.email}</div>}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mb-4">
                <label className="block text-xs text-ktd-dark mb-1.5">Ghi chú</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Yêu cầu riêng, thời hạn giao, thông số cần tư vấn…"
                  className="w-full border border-ktd-light/80 rounded px-3 py-2 text-sm outline-none focus:border-ktd-blue resize-none h-20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-8 py-4 border-t border-ktd-light/80">
              <button
                onClick={handleSubmit}
                className="w-full bg-ktd-red text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-700 transition-colors"
              >
                GỬI YÊU CẦU BÁO GIÁ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
