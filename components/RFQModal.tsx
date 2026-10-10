'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useStore } from './StoreProvider'
import { useLang } from './LangProvider'
import { COMPANY_EMAIL, COMPANY_HOTLINE } from '@/lib/constants'
import {
  EMAIL_RE,
  RFQ_ACCEPT,
  RFQ_FILE_TYPES,
  RFQ_MAX_FILES,
  RFQ_MAX_FILE_BYTES,
  RFQ_MAX_QTY,
  fileExt,
  type RfqError,
  type RfqFile,
} from '@/lib/rfq'

interface FormState {
  name: string
  company: string
  phone: string
  email: string
  note: string
}

const EMPTY_FORM: FormState = { name: '', company: '', phone: '', email: '', note: '' }

const MAX_MB = RFQ_MAX_FILE_BYTES / 1024 / 1024

const sizeLabel = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

/** Lỗi gửi mang theo mã của máy chủ, để form chọn đúng câu báo cho khách. */
class SendError extends Error {
  constructor(public code: RfqError) {
    super(code)
  }
}

/**
 * Đẩy một tệp thẳng lên kho riêng tư rồi trả về đường dẫn của nó.
 *
 * Tệp không đi qua máy chủ của website: Vercel chặn yêu cầu trên 4,5 MB, mà
 * khách được đính tới 5 tệp × 3 MB. Xem app/api/rfq/upload/route.ts.
 */
async function uploadFile(file: File): Promise<RfqFile> {
  const sign = await fetch('/api/rfq/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, size: file.size }),
  })
  const signed = await sign.json().catch(() => null)
  if (!sign.ok || !signed?.ok) throw new SendError(signed?.error ?? 'upload-failed')

  const put = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': signed.contentType, 'x-upsert': 'false' },
    body: file,
  })
  if (!put.ok) throw new SendError('upload-failed')
  return { path: signed.path, name: file.name }
}

/**
 * Form yêu cầu báo giá, dùng chung cho "Gửi yêu cầu tìm hàng" ở trang Sản phẩm.
 *
 * Bốn trường bắt buộc — họ tên, công ty, điện thoại, email — theo mục BG05 và
 * TC21 của "Sửa web 5". Bản trước chỉ bắt buộc tên và điện thoại.
 *
 * Màn hình "đã gửi" chỉ hiện khi máy chủ xác nhận email đã đi. Gửi không được
 * thì báo rõ là CHƯA gửi và đưa số điện thoại, không giả vờ thành công.
 */
export function RFQModal() {
  const { t, lang, path } = useLang()
  const router = useRouter()
  const { rfqOpen, rfqNote, rfqKind, closeRfq, cart, setQty, setQtyTo, removeFromCart } = useStore()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [website, setWebsite] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [tried, setTried] = useState(false)
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState('')
  const [sentCode, setSentCode] = useState<string | null>(null)
  const [sentSummary, setSentSummary] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const find = rfqKind === 'find'

  useEffect(() => {
    if (rfqOpen && rfqNote) setForm((f) => (f.note ? f : { ...f, note: rfqNote }))
  }, [rfqOpen, rfqNote])

  useEffect(() => {
    if (rfqOpen) {
      setSentCode(null)
      setTried(false)
      setFailure('')
      setFileError('')
    }
  }, [rfqOpen])

  if (!rfqOpen) return null

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const errors = {
    name: !form.name.trim() ? t.rfq.errName : '',
    company: !form.company.trim() ? t.rfq.errCompany : '',
    phone: !form.phone.trim() ? t.rfq.errPhone : '',
    email: !form.email.trim()
      ? t.rfq.errEmailRequired
      : !EMAIL_RE.test(form.email.trim())
        ? t.rfq.errEmail
        : '',
    // Yêu cầu tìm hàng không có danh sách sản phẩm, nên phải có mô tả hoặc tệp
    // — nếu không KTD nhận một email trống, không biết khách cần gì.
    note: find && !form.note.trim() && files.length === 0 ? t.rfq.errNote : '',
  }
  const blocking = Object.values(errors).some(Boolean)

  const showError = (field: keyof typeof errors) =>
    (tried || touched[field]) && errors[field] ? errors[field] : ''

  const fieldClass = (field: keyof typeof errors) =>
    `w-full rounded-md border px-3.5 py-2.5 text-[15px] outline-none focus:border-ktd-600 ${
      showError(field) ? 'border-quote' : 'border-ink-300'
    }`

  const addFiles = (picked: FileList | null) => {
    if (!picked) return
    const next = [...files]
    let problem = ''
    for (const f of Array.from(picked)) {
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue
      if (!RFQ_FILE_TYPES[fileExt(f.name)]) problem = t.rfq.attachBadType(f.name)
      else if (f.size > RFQ_MAX_FILE_BYTES) problem = t.rfq.attachTooBig(f.name, MAX_MB)
      else if (next.length >= RFQ_MAX_FILES) problem = t.rfq.attachTooMany(RFQ_MAX_FILES)
      else next.push(f)
    }
    setFiles(next)
    setFileError(problem)
    // Xoá giá trị để chọn lại đúng tệp vừa bỏ vẫn kích hoạt onChange.
    if (fileInput.current) fileInput.current.value = ''
  }

  const submit = async () => {
    setTried(true)
    setFailure('')
    if (blocking || sending) return
    setSending(true)
    try {
      const uploaded: RfqFile[] = []
      for (const f of files) uploaded.push(await uploadFile(f))

      const items = find ? [] : cart
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: rfqKind,
          lang,
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          note: form.note,
          items: items.map((c) => ({ part: c.part, name: c.name, brand: c.brand, qty: c.qty })),
          files: uploaded,
          website,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new SendError(data?.error ?? 'send-failed')

      const units = items.reduce((s, c) => s + c.qty, 0)
      const parts = [
        find
          ? t.rfq.summaryFind
          : items.length
            ? t.rfq.summaryItems(items.length, units)
            : t.rfq.summaryGeneral,
      ]
      if (uploaded.length) parts.push(t.rfq.summaryFiles(uploaded.length))
      setSentSummary(parts.join(' · '))
      setSentCode(data.code)
      setForm(EMPTY_FORM)
      setFiles([])
      setTouched({})
      setTried(false)
    } catch (e) {
      const code = e instanceof SendError ? e.code : 'send-failed'
      setFailure(
        code === 'invalid'
          ? t.rfq.failInvalid
          : code.startsWith('file') || code === 'upload-failed'
            ? t.rfq.failUpload
            : t.rfq.failBody(COMPANY_HOTLINE, COMPANY_EMAIL)
      )
    } finally {
      setSending(false)
    }
  }

  const goProducts = () => {
    closeRfq()
    router.push(path('/san-pham'))
  }

  const star = (
    <span className="text-quote" title={t.rfq.required}>
      {' '}
      *
    </span>
  )

  return (
    <div
      onClick={closeRfq}
      className="fixed inset-0 z-[110] flex animate-fadeup items-start justify-center overflow-y-auto bg-[rgba(0,38,63,.72)] px-4 py-[5vh] backdrop-blur-[4px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={find ? t.rfq.findTitle : t.rfq.title}
        className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-overlay"
      >
        {sentCode ? (
          <div className="px-6 py-12 text-center md:px-10" role="status">
            <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#e8f7ee] text-[34px] text-success">
              ✓
            </div>
            <h2 className="mb-3 font-display text-[28px] font-bold text-ink-900">
              {t.rfq.sentHeading}
            </h2>
            <p className="mb-2 text-base text-ink-500">{t.rfq.sentThanks}</p>
            <p className="my-4 inline-block rounded-md bg-ktd-50 px-4 py-3 font-mono text-[15px] text-ktd-600">
              {t.rfq.codeLabel} {sentCode}
            </p>
            <p className="mb-7 text-sm text-ink-500">{sentSummary}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={goProducts} className="btn-primary">
                {t.rfq.continueBrowsing}
              </button>
              <button
                type="button"
                onClick={closeRfq}
                className="btn border-[1.5px] border-ink-300 text-ink-700 hover:bg-ink-100"
              >
                {t.rfq.close}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-[#eef1f4] px-6 py-5 md:px-8">
              <div>
                <h2 className="mb-1.5 font-display text-2xl font-bold text-ink-900">
                  {find ? t.rfq.findTitle : t.rfq.title}
                </h2>
                <p className="text-sm text-ink-500">{find ? t.rfq.findSubtitle : t.rfq.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={closeRfq}
                aria-label={t.rfq.close}
                className="h-9 w-9 flex-shrink-0 rounded-md bg-ink-100 text-base text-ink-500 hover:bg-ink-300"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[64vh] overflow-y-auto px-6 py-6 md:px-8">
              {!find && (
                <>
                  <p className="label-caps mb-3 text-ink-900">{t.rfq.productList}</p>

                  {cart.length > 0 ? (
                    <ul className="mb-4 flex flex-col gap-2.5">
                      {cart.map((line) => (
                        <li
                          key={line.part}
                          className="flex flex-wrap items-center gap-3 rounded-[10px] bg-ink-100 px-3.5 py-3"
                        >
                          <div className="min-w-[140px] flex-1">
                            <div className="font-display text-sm font-semibold text-ink-900">
                              {line.name ?? line.part}
                            </div>
                            <div className="mt-0.5 text-[13px] text-ink-500">
                              <span className="part-no">{line.part}</span>
                              {line.brand ? ` · ${line.brand}` : ''}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setQty(line.part, -1)}
                              aria-label={t.rfq.decrease(line.part)}
                              className="h-8 w-8 rounded-md border border-ink-300 bg-white text-base text-ink-700 hover:border-ktd-600"
                            >
                              −
                            </button>
                            <QtyInput
                              value={line.qty}
                              label={t.rfq.qty(line.part)}
                              onCommit={(n) => setQtyTo(line.part, n)}
                            />
                            <button
                              type="button"
                              onClick={() => setQty(line.part, 1)}
                              aria-label={t.rfq.increase(line.part)}
                              className="h-8 w-8 rounded-md border border-ink-300 bg-white text-base text-ink-700 hover:border-ktd-600"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(line.part)}
                            aria-label={t.rfq.remove(line.part)}
                            className="p-1 text-lg text-ink-500 hover:text-quote"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-3.5 rounded-[10px] border border-dashed border-ink-300 bg-ink-100 p-5 text-center text-sm text-ink-500">
                      {t.rfq.emptyCart}
                    </p>
                  )}
                </>
              )}

              {/* Hai nút ngang nhau — mục BG04: một nút thêm sản phẩm, một nút
                  đính kèm tệp. Form tìm hàng không có giỏ nên chỉ còn nút tệp. */}
              <div className={`mb-2 grid gap-3 ${find ? '' : 'sm:grid-cols-2'}`}>
                {!find && (
                  <button type="button" onClick={goProducts} className="btn-secondary w-full text-sm">
                    {t.rfq.addMore}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={files.length >= RFQ_MAX_FILES}
                  className="btn-secondary w-full text-sm"
                >
                  <span aria-hidden="true">📎</span> {t.rfq.attach}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={RFQ_ACCEPT}
                  onChange={(e) => addFiles(e.target.files)}
                  className="hidden"
                />
              </div>
              <p className="mb-3 text-[13px] text-ink-500">
                {t.rfq.attachHint(RFQ_MAX_FILES, MAX_MB)}
              </p>

              {files.length > 0 && (
                <ul className="mb-3 flex flex-col gap-1.5">
                  {files.map((f) => (
                    <li
                      key={`${f.name}-${f.size}`}
                      className="flex items-center gap-3 rounded-md border border-hairline px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-ink-900">{f.name}</span>
                      <span className="flex-none text-[13px] text-ink-500">{sizeLabel(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => setFiles((v) => v.filter((x) => x !== f))}
                        aria-label={t.rfq.removeFile(f.name)}
                        className="flex-none text-base text-ink-500 hover:text-quote"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {fileError && (
                <p className="mb-3 text-[13px] text-quote" role="alert">
                  ⚠ {fileError}
                </p>
              )}

              <p className="label-caps mb-3.5 mt-6 text-ink-900">{t.rfq.contactInfo}</p>

              <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rfq-name" className="mb-1.5 block text-[13px] text-ink-700">
                    {t.rfq.name}
                    {star}
                  </label>
                  <input
                    id="rfq-name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    onBlur={() => setTouched((v) => ({ ...v, name: true }))}
                    aria-required="true"
                    aria-invalid={!!showError('name')}
                    className={fieldClass('name')}
                  />
                  {showError('name') && (
                    <p className="mt-1 text-[13px] text-quote">⚠ {showError('name')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rfq-company" className="mb-1.5 block text-[13px] text-ink-700">
                    {t.rfq.company}
                    {star}
                  </label>
                  <input
                    id="rfq-company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                    onBlur={() => setTouched((v) => ({ ...v, company: true }))}
                    aria-required="true"
                    aria-invalid={!!showError('company')}
                    className={fieldClass('company')}
                  />
                  {showError('company') && (
                    <p className="mt-1 text-[13px] text-quote">⚠ {showError('company')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rfq-phone" className="mb-1.5 block text-[13px] text-ink-700">
                    {t.rfq.phone}
                    {star}
                  </label>
                  <input
                    id="rfq-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    onBlur={() => setTouched((v) => ({ ...v, phone: true }))}
                    aria-required="true"
                    aria-invalid={!!showError('phone')}
                    className={fieldClass('phone')}
                  />
                  {showError('phone') && (
                    <p className="mt-1 text-[13px] text-quote">⚠ {showError('phone')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rfq-email" className="mb-1.5 block text-[13px] text-ink-700">
                    {t.rfq.email}
                    {star}
                  </label>
                  <input
                    id="rfq-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    onBlur={() => setTouched((v) => ({ ...v, email: true }))}
                    aria-required="true"
                    aria-invalid={!!showError('email')}
                    className={fieldClass('email')}
                  />
                  {showError('email') && (
                    <p className="mt-1 text-[13px] text-quote">⚠ {showError('email')}</p>
                  )}
                </div>
              </div>

              {/* Ô bẫy máy gửi rác: người thật không thấy, không tab tới được. */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="mb-4">
                <label htmlFor="rfq-note" className="mb-1.5 block text-[13px] text-ink-700">
                  {find ? t.rfq.findNote : t.rfq.note}
                  {find && star}
                </label>
                <textarea
                  id="rfq-note"
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  onBlur={() => setTouched((v) => ({ ...v, note: true }))}
                  placeholder={find ? t.rfq.findNotePlaceholder : t.rfq.notePlaceholder}
                  aria-invalid={!!showError('note')}
                  className={`min-h-[80px] resize-y ${fieldClass('note')}`}
                />
                {showError('note') && (
                  <p className="mt-1 text-[13px] text-quote">⚠ {showError('note')}</p>
                )}
              </div>

              {failure && (
                <div
                  role="alert"
                  className="mb-4 rounded-md border border-quote bg-[#fdecee] px-4 py-3 text-sm text-ink-900"
                >
                  <p className="mb-1 font-display font-semibold text-quote">⚠ {t.rfq.failTitle}</p>
                  <p>{failure}</p>
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={sending}
                aria-busy={sending}
                className="btn-quote mt-1.5 w-full uppercase"
              >
                {sending
                  ? t.rfq.sending
                  : failure
                    ? t.rfq.retry
                    : find
                      ? t.rfq.findSubmit
                      : t.rfq.submit}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Ô số lượng gõ tay được — mục BG02 và SP10. Khách sỉ cần vài chục, vài trăm
 * cái, không thể bấm + từng cái một.
 *
 * Giữ chuỗi đang gõ riêng với số trong giỏ: nếu ghi thẳng vào giỏ ở mỗi phím
 * thì xoá hết để gõ số mới sẽ bị ép về 1 ngay, khách gõ "250" thành "1250".
 * Chỉ chốt vào giỏ khi rời ô hoặc nhấn Enter.
 */
function QtyInput({
  value,
  label,
  onCommit,
}: {
  value: number
  label: string
  onCommit: (n: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  // Nút − / + đổi số trong giỏ thì ô phải theo.
  useEffect(() => setDraft(String(value)), [value])

  const commit = () => {
    const n = parseInt(draft, 10)
    if (Number.isFinite(n) && n >= 1) {
      const chot = Math.min(n, RFQ_MAX_QTY)
      onCommit(chot)
      setDraft(String(chot))
    } else setDraft(String(value))
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={draft}
      aria-label={label}
      onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 5))}
      onBlur={commit}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
      className="h-8 w-[58px] rounded-md border border-ink-300 bg-white text-center text-sm font-semibold text-ink-900 outline-none focus:border-ktd-600"
    />
  )
}
