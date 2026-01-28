// src/components/meeting/PurposeSelector.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurposeSelector() {
  return (
    <section className="space-y-4">
      {/* Header */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">모임 목적 선택</CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            모임 목적에 따라 추천 장소가 달라집니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Empty / Loading */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] px-4 py-5 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              현재 목적 선택 UI를 준비 중입니다.
            </p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              곧 다양한 목적을 선택할 수 있어요.
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
            <p className="text-sm font-semibold text-[var(--text)]">목적 기능 요청</p>
            <p className="text-xs text-[var(--text-subtle)]">
              준비가 완료되면 안내드릴게요.
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
  );
}
