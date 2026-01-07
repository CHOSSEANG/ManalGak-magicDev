// src/components/meeting/PlaceList.tsx

'use client'

import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'

const recommendedPlaces = [
  { id: 'p1', name: '중간지점 카페', detail: '도보 5분 / 1,200원' },
  { id: 'p2', name: '추천 식당 A', detail: '도보 7분 / 2,400원' },
  { id: 'p3', name: '추천 식당 B', detail: '도보 10분 / 3,000원' },
  { id: 'p4', name: '추천 식당 C', detail: '도보 12분 / 3,500원' },
]

export default function PlaceList() {
  const [selected, setSelected] = useState(recommendedPlaces[0].id)

  // 와이어프레임 단계: 중간지점 & 추천 장소
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StepCard className="space-y-3">
        <p className="text-sm font-semibold">지도 영역 (API 없음)</p>
        <div className="h-48 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)] lg:h-full" />
      </StepCard>

      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천 장소 리스트</h2>
          <span className="text-xs text-[var(--wf-subtle)]">범위 확장</span>
        </div>
        <div className="space-y-3">
          {recommendedPlaces.map((place) => {
            const isSelected = selected === place.id
            return (
              <div
                key={place.id}
                className={`flex items-center justify-between gap-3 rounded-xl border border-[var(--wf-border)] px-4 py-3 ${
                  isSelected ? 'bg-[var(--wf-accent)]' : 'bg-[var(--wf-muted)]'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">{place.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(place.id)}
                  className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
                >
                  {isSelected ? '확정됨' : '선택'}
                </button>
              </div>
            )
          })}
        </div>
      </StepCard>
    </div>
  )
}
