// src/components/map/MapMarker.tsx
// 1/28 리팩토링시 추가된 내용
'use client'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default function MapMarker(): JSX.Element {
  return (
    <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-[var(--text)]">
          지도 마커 안내
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          지도에 표시되는 기본 마커의 의미를 확인하세요.
        </CardDescription>
      </CardHeader>

      {/* Marker Legend */}
      <CardContent className="space-y-3">
        {/* 기본 마커 */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-[var(--neutral)]" />
          <div className="text-sm text-[var(--text)]">
            참여 멤버의 출발 위치
          </div>
        </div>

        {/* 중간 지점 */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-[var(--primary)]" />
          <div className="text-sm text-[var(--text)]">
            계산된 중간 지점
          </div>
        </div>

        {/* 예외 / 참고 지점 */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-[var(--danger)]" />
          <div className="text-sm text-[var(--text)]">
            추천 제외 또는 참고 위치
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
