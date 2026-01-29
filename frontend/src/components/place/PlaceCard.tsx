// src/components/meeting/PlaceCard.tsx
// 1/28 리팩토링시 데이터 추가
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaceCard() {
  return (
    <section className="space-y-4">
      {/* Header */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">추천 장소 카드</CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            추천 장소 정보를 카드로 보여주는 영역입니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Empty / Loading */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] px-4 py-5 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              아직 추천 장소가 없습니다.
            </p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              장소 추천이 완료되면 이 카드가 활성화됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">장소 추천 요청</p>
            <p className="text-xs text-[var(--text-subtle)]">
              추천 결과를 빠르게 받아볼 수 있어요.
            </p>
          </div>
          <Button
            type="button"
            className="bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            추천 요청
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
