// src/components/meeting/PlaceList.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const recommendedPlaces = [
  { id: 'p1', name: '중간지점 카페', detail: '도보 5분 / 1,200원' },
  { id: 'p2', name: '추천 식당 A', detail: '도보 7분 / 2,400원' },
  { id: 'p3', name: '추천 식당 B', detail: '도보 10분 / 3,000원' },
  { id: 'p4', name: '추천 식당 C', detail: '도보 12분 / 3,500원' },
]

export default function PlaceList() {
  const [selected, setSelected] = useState(recommendedPlaces[0].id)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* 지도 영역 */}
      <Card className="border border-[var(--border)] bg-[var(--bg)]">
        <CardHeader>
          <CardTitle className="text-sm">지도 영역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] lg:h-full" />
        </CardContent>
      </Card>

      {/* 추천 장소 리스트 */}
      <Card className="border border-[var(--border)] bg-[var(--bg)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">추천 장소 리스트</CardTitle>
          <span className="text-xs text-[var(--text-subtle)]">범위 확장</span>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="max-h-[420px] px-4 pb-4">
            <div className="space-y-3">
              {recommendedPlaces.map((place) => {
                const isSelected = selected === place.id

                const handleSelect = () => {
                  setSelected(place.id)
                }

                return (
                  <Card
                    key={place.id}
                    className="border border-[var(--border)] bg-[var(--bg-soft)]"
                  >
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {place.name}
                        </p>
                        <p className="text-xs text-[var(--text-subtle)]">
                          {place.detail}
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleSelect}
                        variant={isSelected ? 'default' : 'outline'}
                        className={
                          isSelected
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'border-[var(--border)]'
                        }
                      >
                        {isSelected ? '확정됨' : '선택'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
