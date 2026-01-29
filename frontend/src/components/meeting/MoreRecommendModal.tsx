// src/components/meeting/MoreRecommendModal.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type RecommendOption = {
  label: string
  description: string
  type: 'radius' | 'category' | 'sort' | 'openOnly'
  // eslint: flexible value type without any
  value?: unknown
}

const MORE_RECOMMEND_OPTIONS: RecommendOption[] = [
  {
    label: '조금 더 넓은 범위에서',
    description: '도보·대중교통 이동 가능 범위',
    type: 'radius',
    value: 2000,
  },
  {
    label: '다른 카테고리도 포함',
    description: '카페 외 음식점·기타 장소',
    type: 'category',
  },
  {
    label: '거리보다 인기 우선',
    description: '조금 멀어도 많이 찾는 장소',
    type: 'sort',
    value: 'accuracy',
  },
  {
    label: '지금 영업 중인 곳만',
    description: '바로 방문 가능한 장소',
    type: 'openOnly',
  },
]

interface Props {
  onSelect: (option: RecommendOption) => void
}

export default function MoreRecommendModalContent({ onSelect }: Props) {
  return (
    <section className="space-y-4">
      {/* 안내 문구 */}
      <p className="text-xs text-[var(--text-subtle)]">
        원하는 조건을 선택해 추천 장소를 다시 찾아볼 수 있어요.
      </p>

      {/* 옵션 카드 리스트 */}
      <div className="space-y-2">
        {MORE_RECOMMEND_OPTIONS.map((option) => {
          const handleClick = () => {
            onSelect(option)
          }

          return (
            <Card
              key={option.label}
              className="border border-[var(--border)] bg-[var(--bg-soft)]"
            >
              <CardContent className="p-0">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClick}
                  className="h-auto w-full flex-col items-start gap-1 rounded-xl px-4 py-3 text-left hover:bg-[var(--neutral-soft)]"
                >
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {option.label}
                  </span>
                  <span className="text-xs text-[var(--text-subtle)]">
                    {option.description}
                  </span>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
