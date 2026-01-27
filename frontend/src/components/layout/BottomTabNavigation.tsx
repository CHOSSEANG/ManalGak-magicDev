// src/components/layout/BottomTabNavigation.tsx
'use client'

import { Suspense } from 'react'
import BottomTabNavigationContent from './BottomTabNavigation'

export default function BottomTabNavigation() {
  return (
    <Suspense fallback={null}>
      <BottomTabNavigationContent />
    </Suspense>
  )
}