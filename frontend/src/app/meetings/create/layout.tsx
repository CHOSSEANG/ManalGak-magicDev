import type { ReactNode } from 'react'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function CreateLayout({ children }: { children: ReactNode }) {
  // 와이어프레임 단계: 모임 생성 플로우 레이아웃
  return <WireframeShell>{children}</WireframeShell>
}
