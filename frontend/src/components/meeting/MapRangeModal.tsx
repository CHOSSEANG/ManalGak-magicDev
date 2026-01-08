// src/components/meeting/MapRangeModal.tsx
'use client'

type MapRangeOption = {
  label: string
  description: string
  level: number
}

const MAP_RANGE_OPTIONS: MapRangeOption[] = [
  { label: '근처 (생활권)', description: '도보·대중교통 기준 가까운 범위', level: 5 },
  { label: '구 단위', description: '행정구 기준 중간 범위', level: 7 },
  { label: '도시 전체', description: '도시 전역을 한눈에', level: 9 },
]

interface Props {
  currentLevel: number
  onSelect: (level: number) => void
}

export default function MapRangeModalContent({ currentLevel, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {/* 설명 영역 */}
      <p className="text-xs text-[var(--wf-subtle)]">
        원하는 조건을 선택해 추천 장소를 다시 찾아볼 수 있어요.
      </p>
    <div className="space-y-2">
      {MAP_RANGE_OPTIONS.map((option) => {
        const isSelected = option.level === currentLevel

        return (
          <button
            key={option.level}
            onClick={() => onSelect(option.level)}
            className={`w-full rounded-xl border px-4 py-3 text-left ${
              isSelected
                ? 'border-[var(--wf-border)] bg-[var(--wf-accent)]'
                : 'border-[var(--wf-border)] bg-[var(--wf-muted)]'
            }`}
          >
            <p className="text-sm font-semibold">{option.label}</p>
            <p className="text-xs text-[var(--wf-subtle)]">{option.description}</p>
          </button>
        )
      })}
    </div>
    </div>
  )
}