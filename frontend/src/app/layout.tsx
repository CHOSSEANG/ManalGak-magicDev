// src/app/layout.tsx

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import '@/styles/globals.css'

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
    <html lang="ko">
      <body>
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-[var(--wf-bg)] text-[var(--wf-text)]">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
