'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/components/StoreProvider'
import type { Brand, Category } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'
import { useLang } from '@/components/LangProvider'

export interface BrowserProps {
  brands: Brand[]
  categories: Category[]
  selectedBrands: string[]
  selectedCategories: string[]
  query: string
  sort: string
  total: number
  countByBrand: Record<string, number>
  /**
   * Số sản phẩm mỗi nhóm TRONG phạm vi các hãng đang chọn.
   *
   * Chưa chọn hãng nào thì là số đếm của cả kho. Dùng để thu danh sách nhóm lại
   * khi khách chọn một hãng — Mr Nam yêu cầu rõ: bộ lọc hãng ở trang Sản phẩm
   * vẫn giữ, nhưng chọn xong một hãng thì lọc theo cách của trang thương hiệu.
   */
  countByCategory: Record<string, number>
  /** Kết quả do máy chủ dựng sẵn, truyền vào chỗ hiển thị. */
  children: React.ReactNode
}

/**
 * Khung của trang Sản phẩm: ô tìm, bộ lọc, sắp xếp, thẻ lọc đang bật.
 *
 * Việc lọc đã chuyển hẳn xuống Postgres — component này không giữ danh sách sản
 * phẩm nào cả, chỉ viết vào địa chỉ trang rồi để máy chủ dựng lại kết quả. Bản
 * trước nhập cả kho hàng vào trình duyệt, cách đó chỉ chạy được khi còn vài chục
 * mã và sẽ sập ở mức một nghìn.
 */
export function ProductBrowser({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  query,
  sort,
  total,
  countByCategory,
  children,
}: BrowserProps) {
  const router = useRouter()
  const params = useSearchParams()
  const { openRfq } = useStore()
  const { t, path } = useLang()

  const SORTS = [
    { value: 'default', label: t.products.sorts.default },
    { value: 'brand', label: t.products.sorts.brand },
    { value: 'name', label: t.products.sorts.name },
    { value: 'new', label: t.products.sorts.new },
  ]

  const [q, setQ] = useState(query)
  const [sheetOpen, setSheetOpen] = useState(false)
  /**
   * Nhóm chính đang xổ nhóm nhỏ ra. Mỗi lúc chỉ một nhóm mở — mục SP04 của
   * "Sửa web 5": bấm tên nhóm chính là thấy ngay nhóm nhỏ, các nhóm khác tự
   * thu lại.
   *
   * Giá trị đầu lấy từ địa chỉ trang, nên khách đi từ ô nhóm chính ở trang chủ
   * (?category=...) hay mở lại một đường dẫn đã lọc cũng thấy nhóm nhỏ ngay.
   */
  const [moNhom, setMoNhom] = useState<string | null>(() => {
    const dau = categories.find((c) => selectedCategories.includes(c.slug))
    return dau ? (dau.parent ?? dau.slug) : null
  })
  const [pending, setPending] = useState(false)

  const brandsAZ = [...brands].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
  const activeCount = selectedBrands.length + selectedCategories.length

  /**
   * Cây danh mục hai cấp cho cột lọc.
   *
   * Khi chưa nhóm nào có cha — tức dữ liệu còn phẳng như trước — mọi nhóm đều
   * thành nhóm gốc không con, và cột lọc hiện ra y hệt bản cũ. Nhờ vậy giao
   * diện này chạy đúng cả trước lẫn sau khi chuyển đổi dữ liệu.
   *
   * Hiện ĐỦ CẢ 12 nhóm chính, không lọc theo cờ featured nữa. Cờ đó dựng cho
   * bản bộ lọc một cấp cũ, lúc 15 nhóm phẳng bày hết ra thì quá dài nên chỉ lấy
   * 4 nhóm tiêu biểu. Nay nhóm nhỏ nằm thu gọn bên trong nhóm chính, cột lọc
   * vừa đủ ngắn — mà giấu 8/12 nhóm thì khách không tìm ra hàng.
   *
   * Cờ featured vẫn dùng cho cột Danh mục ở chân trang.
   */
  const soCua = (slug: string) => countByCategory[slug] ?? 0
  const coHang = selectedBrands.length > 0

  const cayDanhMuc = categories
    .filter((c) => !c.parent)
    .map((cha) => {
      const con = categories.filter((c) => c.parent === cha.slug)
      // Số đếm không còn hiện ra (SP04), chỉ dùng để ẩn nhóm trống khi đã chọn hãng.
      const tong = soCua(cha.slug) + con.reduce((n, c) => n + soCua(c.slug), 0)
      return { cha, con: con.filter((c) => !coHang || soCua(c.slug) > 0), tong }
    })
    // Chọn hãng rồi thì bỏ hẳn những nhóm hãng đó không có hàng. Chưa chọn hãng
    // thì giữ đủ 12 nhóm, kể cả nhóm chưa có sản phẩm, để khách thấy toàn cảnh
    // danh mục KTĐ phân phối.
    .filter((x) => !coHang || x.tong > 0)

  /** Dựng địa chỉ mới từ địa chỉ hiện tại; giá trị rỗng thì bỏ hẳn tham số. */
  const go = useCallback(
    (patch: Record<string, string | string[] | null>) => {
      const sp = new URLSearchParams(params.toString())
      for (const [k, v] of Object.entries(patch)) {
        sp.delete(k)
        if (Array.isArray(v)) v.forEach((x) => sp.append(k, x))
        else if (v) sp.set(k, v)
      }
      // Đổi bộ lọc thì quay về trang 1, nếu không khách đang ở trang 5 của kết
      // quả cũ sẽ rơi vào một trang không tồn tại của kết quả mới.
      if (!('trang' in patch)) sp.delete('trang')
      const qs = sp.toString()
      setPending(true)
      router.push(path(qs ? `/san-pham?${qs}` : '/san-pham'), { scroll: false })
    },
    [params, router]
  )

  // Địa chỉ đã đổi xong thì tắt trạng thái chờ
  useEffect(() => {
    setPending(false)
    setQ(query)
  }, [params, query])

  // Gõ tới đâu tìm tới đó, nhưng đợi ngừng gõ mới gọi máy chủ
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const onType = (value: string) => {
    setQ(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => go({ q: value || null }), 400)
  }

  const toggle = (kind: 'brand' | 'category', value: string) => {
    const current = kind === 'brand' ? selectedBrands : selectedCategories
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    go({ [kind]: next })
  }

  /** Xoá cả bộ lọc lẫn từ khoá, và thu mọi nhóm đang mở. */
  const clearAll = () => {
    setMoNhom(null)
    setQ('')
    clearTimeout(timer.current)
    setPending(true)
    router.push(path('/san-pham'), { scroll: false })
  }

  const chips = [
    ...selectedBrands.map((v) => ({
      kind: 'brand' as const,
      value: v,
      label: brands.find((b) => b.slug === v)?.name ?? v,
    })),
    ...selectedCategories.map((v) => ({
      kind: 'category' as const,
      value: v,
      label: categories.find((c) => c.slug === v)?.name ?? v,
    })),
  ]

  const filterPanel = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-base font-semibold text-ink-900">{t.products.filters}</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[13px] text-ink-500 underline hover:text-ktd-600"
        >
          {t.products.clearFilters}
        </button>
      </div>

      {/* Nhóm sản phẩm đặt TRÊN thương hiệu. Bấm tên (hoặc ô tích) của nhóm
          chính là vừa lọc theo cả nhóm, vừa xổ các nhóm nhỏ ra để chọn tiếp —
          mục SP04 của "Sửa web 5". Mũi xổ riêng và số đếm sản phẩm của bản
          trước đã bỏ theo đúng mục đó. */}
      <FilterGroup title={t.products.category}>
        <div className="max-h-[460px] overflow-y-auto pr-1">
          {cayDanhMuc.map(({ cha, con }) => {
            const dangMo = moNhom === cha.slug
            const daChon = selectedCategories.includes(cha.slug)
            return (
              <div key={cha.slug} className={con.length ? 'mb-1' : undefined}>
                <FilterRow
                  label={cha.name}
                  checked={daChon}
                  onChange={() => {
                    // Bỏ tích một nhóm đang mở thì thu nó lại, trừ khi bên trong
                    // còn nhóm nhỏ đang được chọn.
                    const conDangChon = con.some((x) => selectedCategories.includes(x.slug))
                    setMoNhom(daChon && !conDangChon ? null : cha.slug)
                    toggle('category', cha.slug)
                  }}
                  dam={con.length > 0}
                  expanded={con.length > 0 ? dangMo : undefined}
                />

                {con.length > 0 && dangMo && (
                  <div className="ml-6 border-l border-hairline pl-2">
                    {con.map((c) => (
                      <FilterRow
                        key={c.slug}
                        label={c.name}
                        checked={selectedCategories.includes(c.slug)}
                        onChange={() => toggle('category', c.slug)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </FilterGroup>

      <FilterGroup title={t.products.brand}>
        <div className="max-h-[340px] overflow-y-auto pr-1">
          {brandsAZ.map((b) => (
            <FilterRow
              key={b.slug}
              label={b.name}
              checked={selectedBrands.includes(b.slug)}
              onChange={() => toggle('brand', b.slug)}
            />
          ))}
        </div>
      </FilterGroup>
    </>
  )

  return (
    <div className="container-ktd pb-16 pt-6 md:pb-24">
      <h1 className="mb-3 font-display text-h3 text-ktd-600">
        {t.products.title}
      </h1>
      <p className="mb-6 max-w-[1280px] text-body-lg text-ink-500">
        {t.products.subtitle}
      </p>

      <div className="mb-8 flex items-center gap-3 rounded-[10px] border border-[#e2e7ec] bg-ink-100 px-4 py-3.5 md:px-5">
        <span className="text-lg" aria-hidden="true">🔍</span>
        <input
          value={q}
          onChange={(e) => onType(e.target.value)}
          placeholder={t.products.searchPlaceholder}
          aria-label={t.products.searchLabel}
          className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-ink-500"
        />
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:sticky lg:top-[100px] lg:block">{filterPanel}</aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base text-ink-900">
              <b className="font-display">{total}</b> {t.products.matched}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex min-h-[44px] items-center rounded-md border border-ink-300 px-3.5 text-sm font-semibold text-ink-700 lg:hidden"
              >
                ⚙ {t.products.filterButton}{activeCount > 0 ? ` (${activeCount})` : ''}
              </button>
              <label className="flex items-center gap-2 text-sm text-ink-500">
                <span className="hidden sm:inline">{t.products.sortLabel}</span>
                <select
                  value={sort}
                  onChange={(e) => go({ sort: e.target.value === 'default' ? null : e.target.value })}
                  className="min-h-[44px] cursor-pointer rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-900"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={`${c.kind}-${c.value}`}
                  type="button"
                  onClick={() => toggle(c.kind, c.value)}
                  className="flex items-center gap-2 rounded-md border border-ktd-100 bg-ktd-50 px-3 py-1.5 text-[13px] font-medium text-ktd-700"
                >
                  {c.label} <span aria-hidden="true">×</span>
                  <span className="sr-only">{t.products.removeFilter}</span>
                </button>
              ))}
            </div>
          )}

          {total === 0 ? (
            // Mục SP09 của "Sửa web 5": không để khách hiểu rằng KTD không cung
            // cấp được mã chưa có trên web. Luôn có lối xoá bộ lọc và lối gửi
            // yêu cầu tìm hàng.
            <div className="rounded-lg border border-hairline bg-white px-5 py-16 text-center md:py-20">
              <div className="mb-5 text-[52px] leading-none opacity-60" aria-hidden="true">🔍</div>
              <p className="mb-3 font-display text-[26px] font-bold leading-tight text-ink-900">
                {t.products.emptyTitle}
              </p>
              <p className="mx-auto mb-7 max-w-[640px] text-[16px] leading-relaxed text-ink-700 [text-wrap:pretty]">
                {t.products.emptyBody}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearAll} className="btn-secondary min-w-[180px]">
                  {t.products.clearFilters}
                </button>
                <button
                  type="button"
                  onClick={() => openRfq(q.trim() || undefined, 'find')}
                  className="btn-primary min-w-[180px]"
                >
                  {t.products.emptyCta}
                </button>
              </div>
              <p className="mt-6 text-[13px] text-ink-500">{t.products.emptyHint}</p>
            </div>
          ) : (
            <div className={cx('transition-opacity duration-150', pending && 'opacity-50')}>
              {children}
            </div>
          )}
        </div>
      </div>

      {sheetOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-end bg-[rgba(0,38,63,.6)] lg:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.products.filterSheetLabel}
            className="flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white"
          >
            <div className="flex-1 overflow-y-auto p-5">{filterPanel}</div>
            <div className="border-t border-hairline p-4">
              <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary w-full">
                {t.products.apply(total)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      {/* Bỏ mũi tên "▸" vì tiêu đề không thu gọn được, và chữ to lên hai cỡ
          (12px -> 15px) — mục SP05 của "Sửa web 5". */}
      <h2 className="mb-3 font-display text-[15px] font-bold uppercase tracking-[0.08em] text-ink-900">
        {title}
      </h2>
      {children}
    </div>
  )
}

function FilterRow({
  label,
  checked,
  onChange,
  dam = false,
  expanded,
}: {
  label: string
  checked: boolean
  onChange: () => void
  /** Nhóm chính in đậm để tách khỏi các nhóm nhỏ thụt vào bên dưới. */
  dam?: boolean
  /** Nhóm chính có nhóm nhỏ: đang xổ ra hay không, báo cho trình đọc màn hình. */
  expanded?: boolean
}) {
  return (
    <label
      className={cx(
        'flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-ink-100',
        checked ? 'text-ktd-600' : 'text-ink-700',
        dam && 'font-semibold'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-expanded={expanded}
        className="h-4 w-4 cursor-pointer accent-ktd-600"
      />
      <span className="flex-1">{label}</span>
    </label>
  )
}
