// src/components/meeting/MapRangeModal.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type MapRangeOption = {
  label: string
  description: string
  level: number
}

const MAP_RANGE_OPTIONS: MapRangeOption[] = [
  {
    label: '근처 (생활권)',
    description: '도보·대중교통 기준 가까운 범위',
    level: 5,
  },
  {
    label: '구 단위',
    description: '행정구 기준 중간 범위',
    level: 7,
  },
  {
    label: '도시 전체',
    description: '도시 전역을 한눈에',
    level: 9,
  },
]

interface Props {
  currentLevel: number
  onSelect: (level: number) => void
}

export default function MapRangeModalContent({
  currentLevel,
  onSelect,
}: Props): JSX.Element {
  return (
    <section className="space-y-4">
      {/* 안내 설명 */}
      <p className="text-xs text-[var(--text-subtle)]">
        원하는 조건을 선택해 추천 장소를 다시 찾아볼 수 있어요.
      </p>

      {/* 옵션 리스트 */}
      <div className="space-y-2">
        {MAP_RANGE_OPTIONS.map((option) => {
          const isSelected = option.level === currentLevel

          return (
            <Card
              key={option.level}
              className={`border ${
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--bg-soft)]'
                  : 'border-[var(--border)] bg-[var(--bg)]'
              }`}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  onSelect(option.level)
                }}
                className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-[var(--text)]">
                  {option.label}
                </span>
                <span className="text-xs text-[var(--text-subtle)]">
                  {option.description}
                </span>
              </Button>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
