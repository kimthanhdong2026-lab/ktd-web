// Spec B2: three families, only the weights actually used, font-display: swap.
// Dùng chung cho website và trang quản trị, để hai bên hiện cùng một kiểu chữ.
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from 'next/font/google'

export const display = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const body = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontClass = `${display.variable} ${body.variable} ${mono.variable}`
