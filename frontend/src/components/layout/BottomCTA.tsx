// src/components/layout/BottomCTA.tsx

import type { ReactNode } from 'react'

interface BottomCTAProps {
  children: ReactNode
}

export default function BottomCTA({ children }: BottomCTAProps) {
  // 와이어프레임 단계: 하단 CTA 컨테이너
  return (
    <div className="fixed inset-x-0 bottom-0 bg-transparent">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4">
        {children}
      </div>
    </div>
  )
}
