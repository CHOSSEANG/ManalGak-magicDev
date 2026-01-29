// src/components/map/LocationPicker.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function LocationPicker() {
  return (
    <section className="space-y-4">
      {/* Header Card */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">위치 선택</CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            지도 기반 위치 선택 기능을 준비 중입니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Empty / Loading State Card */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] px-4 py-5 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              현재는 위치 선택 기능이 제공되지 않습니다.
            </p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              추후 카카오맵을 통해 검색 및 선택이 가능할 예정입니다.
            </p>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-40 w-full bg-[var(--neutral-soft)]" />
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              위치 선택 기능 요청하기
            </p>
            <p className="text-xs text-[var(--text-subtle)]">
              준비가 완료되면 알림으로 알려드릴게요.
            </p>
          </div>
          <Button
            type="button"
            className="bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            기능 요청
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
