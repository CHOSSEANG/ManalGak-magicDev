// src/components/meeting/MoreRecommendModal.tsx
'use client'

type RecommendOption = {
  label: string
  description: string
  type: 'radius' | 'category' | 'sort' | 'openOnly'
  value?: any
}

const MORE_RECOMMEND_OPTIONS: RecommendOption[] = [
  { label: '조금 더 넓은 범위에서', description: '도보·대중교통 이동 가능 범위', type: 'radius', value: 2000 },
  { label: '다른 카테고리도 포함', description: '카페 외 음식점·기타 장소', type: 'category' },
  { label: '거리보다 인기 우선', description: '조금 멀어도 많이 찾는 장소', type: 'sort', value: 'accuracy' },
  { label: '지금 영업 중인 곳만', description: '바로 방문 가능한 장소', type: 'openOnly' },
]

interface Props {
  onSelect: (option: RecommendOption) => void
}

export default function MoreRecommendModalContent({ onSelect }: Props) {
  return (
    <div className="space-y-3">
      {/* 설명 영역 */}
      <p className="text-xs text-[var(--wf-subtle)]">
        원하는 조건을 선택해 추천 장소를 다시 찾아볼 수 있어요.
      </p>

      {/* 옵션 리스트 */}
      <div className="space-y-2">
        {MORE_RECOMMEND_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onSelect(option)}
            className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left hover:bg-[var(--wf-accent)]"
          >
            <p className="text-sm font-semibold">{option.label}</p>
            <p className="text-xs text-[var(--wf-subtle)]">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
