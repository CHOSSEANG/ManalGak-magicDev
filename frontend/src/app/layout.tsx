import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '만날각 - 중간 만남 장소 추천',
  description: '모임 목적에 맞는 중간 만남 장소를 추천해드립니다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
