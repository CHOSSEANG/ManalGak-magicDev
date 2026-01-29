// src/components/meeting/RouteInfo.tsx
// 1/28 리팩토링시 데이터 추가
"use client";

/**
 * RouteInfo
 * - 현재 단계에서는 기존 동작(렌더링 없음)을 유지해야 하므로 null 반환을 유지합니다.
 * - 추후 라우트/경로 정보 UI를 붙일 때는 아래 주석 블록을 기반으로 확장하세요.
 */
export default function RouteInfo(): JSX.Element | null {
  // ✅ 기존 동작 유지: 아무것도 렌더링하지 않음
  return null;

  /**
   * ✅ (향후 확장용) 21st.dev / shadcn 기반 설계 스캐폴딩 예시
   *
   * import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
   * import { Skeleton } from "@/components/ui/skeleton";
   * import { ScrollArea } from "@/components/ui/scroll-area";
   * import { Button } from "@/components/ui/button";
   *
   * return (
   *   <Card className="border-[var(--border)] bg-[var(--bg)]">
   *     <CardHeader className="space-y-1">
   *       <CardTitle className="text-base text-[var(--text)]">경로 요약</CardTitle>
   *       <CardDescription className="text-xs text-[var(--text-subtle)]">
   *         대중교통/차량 기준 이동 시간과 환승 정보를 보여줘요.
   *       </CardDescription>
   *     </CardHeader>
   *
   *     <CardContent className="space-y-3">
   *       <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-3">
   *         <div className="flex items-center justify-between">
   *           <Skeleton className="h-4 w-24 bg-[var(--neutral-soft)]" />
   *           <Skeleton className="h-4 w-14 bg-[var(--neutral-soft)]" />
   *         </div>
   *         <div className="mt-2">
   *           <Skeleton className="h-3 w-full bg-[var(--neutral-soft)]" />
   *         </div>
   *       </div>
   *
   *       <ScrollArea className="h-40 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]">
   *         <div className="space-y-2 p-3">
   *           <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
   *           <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
   *           <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
   *         </div>
   *       </ScrollArea>
   *
   *       <div className="flex gap-2">
   *         <Button
   *           type="button"
   *           variant="outline"
   *           className="w-full border-[var(--border)] text-[var(--text)]"
   *         >
   *           대중교통 보기
   *         </Button>
   *         <Button
   *           type="button"
   *           className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
   *         >
   *           차량 보기
   *         </Button>
   *       </div>
   *     </CardContent>
   *   </Card>
   * );
   */
}
