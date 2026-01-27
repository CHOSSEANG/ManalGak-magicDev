// src/components/layout/BottomTabNavigation.tsx
'use client'

import { Suspense } from 'react'
import BottomTabNav from '@/components/layout/BottomTabNav'

export default function BottomTabNavigation() {
  return (
    <Suspense fallback={null}>
      <BottomTabNav />
    </Suspense>
  )
}