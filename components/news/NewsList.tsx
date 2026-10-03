'use client'

import Link from 'next/link'
import { useState } from 'react'
import { NEWS_CATEGORIES, NEWS_CATEGORIES_EN, newsFor } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'
import { useLang } from '@/components/LangProvider'


export function NewsList() {
  const { lang, t, path } = useLang()
  const [tab, setTab] = useState<string>('all')
  const NEWS = newsFor(lang)
  const TABS = ['all', ...(lang === 'en' ? NEWS_CATEGORIES_EN : NEWS_CATEGORIES)]
  const items = NEWS.filter((n) => tab === 'all' || n.cat === tab)

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label={t.news.tabsLabel}>
        {TABS.map((tabName) => (
          <button
            key={tabName}
            type="button"
            role="tab"
            aria-selected={tab === tabName}
            onClick={() => setTab(tabName)}
            className={cx(
              'min-h-[44px] rounded-full border px-5 text-sm font-medium transition-colors',
              tab === tabName
                ? 'border-ktd-600 bg-ktd-600 text-white'
                : 'border-ink-300 bg-white text-ink-700 hover:border-ktd-600 hover:text-ktd-600'
            )}
          >
            {tabName === 'all' ? t.news.all : tabName}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg bg-ink-100 px-5 py-16 text-center text-ink-500">
          {t.news.empty}
        </p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <li key={n.slug}>
              <Link
                href={path(`/tin-tuc/${n.slug}`)}
                className="block h-full overflow-hidden rounded-xl border border-hairline transition duration-200 hover:shadow-md"
              >
                <span className="placeholder-hatch relative flex aspect-video items-center justify-center bg-ink-100">
                  <span className="relative font-mono text-[13px] text-[#9aa3ad]">{t.news.imagePlaceholder}</span>
                </span>
                <span className="block p-5 md:p-6">
                  <span className="label-caps mb-2.5 block text-ktd-600">{n.cat}</span>
                  <span className="mb-3 block font-display text-[19px] font-semibold leading-snug text-ink-900">
                    {n.title}
                  </span>
                  <span className="mb-3 block text-sm leading-relaxed text-ink-500">
                    {n.excerpt}
                  </span>
                  <span className="block text-[13px] text-[#9aa3ad]">{n.date}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
