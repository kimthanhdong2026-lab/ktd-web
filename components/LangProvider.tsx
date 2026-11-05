'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { DEFAULT_LOCALE, dict, href, type Dictionary, type Locale } from '@/lib/i18n'
import { apDungGhiDe, type GhiDe } from '@/lib/noi-dung/ghep'

interface LangValue {
  lang: Locale
  /** Từ điển của ngôn ngữ hiện tại, đã đè phần admin sửa trong bảng noi_dung. */
  t: Dictionary
  /** Dựng đường dẫn có tiền tố ngôn ngữ đúng. */
  path: (p: string) => string
}

const Ctx = createContext<LangValue>({
  lang: DEFAULT_LOCALE,
  t: dict(DEFAULT_LOCALE),
  path: (p) => p,
})

/**
 * Truyền xuống chuỗi `lang` và bản ghi đè (JSON thuần) chứ không truyền cả từ
 * điển: từ điển có chứa hàm (ví dụ `heading(n)`) mà hàm thì không đi qua
 * ranh giới máy chủ – trình duyệt. Trình duyệt tự nhập từ điển rồi đè.
 */
export function LangProvider({
  lang,
  ghiDe,
  children,
}: {
  lang: Locale
  ghiDe?: GhiDe
  children: ReactNode
}) {
  const value = useMemo<LangValue>(
    () => ({ lang, t: apDungGhiDe(dict(lang), ghiDe), path: (p) => href(p, lang) }),
    [lang, ghiDe]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
