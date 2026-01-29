// src/components/meeting/MeetingSummary.tsx
// 더미데이터, 사용안하고 있음
"use client";

import { useState } from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tabs = ["모임 정보", "추천 장소", "회비 정산"];

export default function MeetingSummary() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  let infoSection = null;
  if (activeTab === "모임 정보") {
    infoSection = (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--text)]">모임 상세</h3>
        <div className="grid gap-3 text-sm text-[var(--text-subtle)] md:grid-cols-2">
          <div>모임명: 공주파티</div>
          <div>일시: 2026.01.23 12:00</div>
          <div>모임인원: 5인</div>
          <div>출발지: 서울시 어쩌구 저쩌동 12-34</div>
        </div>
      </div>
    );
  }

  let placeSection = null;
  if (activeTab === "추천 장소") {
    placeSection = (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--text)]">확정된 중간지점</h3>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--neutral-soft)] p-4 text-sm text-[var(--text)]">
          중간지점 카페 / 도보 5분 / 1,200원
        </div>
        <div className="h-32 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)]" />
      </div>
    );
  }

  let feeSection = null;
  if (activeTab === "회비 정산") {
    feeSection = (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--text)]">회비 정산 요약</h3>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--neutral-soft)] px-4 py-3 text-sm">
          <span className="text-[var(--text-subtle)]">총 회비</span>
          <span className="font-semibold text-[var(--text)]">90,000원</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--neutral-soft)] px-4 py-3 text-sm">
          <span className="text-[var(--text-subtle)]">1인당 회비</span>
          <span className="font-semibold text-[var(--text)]">15,000원</span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--text)]">
          카카오페이 링크 placeholder
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[var(--text)]">요약 보기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            let tabClass =
              "rounded-full border px-4 py-2 text-sm text-[var(--text)]";
            if (isActive) {
              tabClass += " border-[var(--border)] bg-[var(--neutral-soft)]";
            } else {
              tabClass += " border-[var(--border)] bg-[var(--bg)]";
            }

            return (
              <Button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={tabClass}
                variant="ghost"
              >
                {tab}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {infoSection}
      {placeSection}
      {feeSection}
    </div>
  );
}
