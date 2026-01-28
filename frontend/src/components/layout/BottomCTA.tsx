// src/components/layout/BottomCTA.tsx
import { Suspense } from 'react'
import BottomTabNavigation from '@/components/layout/BottomTabNavigation'

export default function BottomCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-transparent">
      <div className="mx-auto w-full max-w-[1440px]">
        <Suspense fallback={null}>
          <BottomTabNavigation />
        </Suspense>
      </div>
    </div>
  )
}