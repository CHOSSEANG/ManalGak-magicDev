// src/app/my/page.tsx
"use client";

import StepCard from "@/components/meeting/StepCard";
import { useState } from "react";

export default function MyPage() {
  return (
    <>
      <main className="space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">내 페이지</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            북마크 출발지와 최근 모임을 확인할 수 있어요.
          </p>
        </div>

        {/* Profile */}
        <StepCard className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full border border-[var(--wf-border)] bg-[var(--wf-muted)]" />
            <div className="space-y-1">
              <p className="text-base font-semibold">김철수</p>
              <p className="text-sm text-[var(--wf-subtle)]">kim@example.com</p>
            </div>
          </div>
        </StepCard>

        {/* Bookmark Origins */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">북마크 출발지</h2>
          </div>

          <StepCard className="divide-y">
            {[
              { label: "우리집", address: "서울 강남구 역삼동 123-45" },
              { label: "회사", address: "서울 강남구 역삼동 123-45" },
              { label: "학교", address: "서울 강남구 역삼동 123-45" },
              { label: "카페 1", address: "서울 강남구 역삼동 123-45" },
              { label: "카페 2", address: "서울 강남구 역삼동 123-45" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[var(--wf-muted)]" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--wf-subtle)]">
                      {item.address}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-[var(--wf-border)] px-3 py-1 text-xs"
                >
                  수정
                </button>
              </div>
            ))}
          </StepCard>
          {/* TODO: 출발지 수정 모달 (지도 연동 예정) */}
        </section>

        {/* Recent Meetings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">최근 내 모임 리스트</h2>
            <button type="button" className="text-xs text-[var(--wf-subtle)]">
              더보기
            </button>
          </div>

          <StepCard className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1 border-b pb-3 last:border-b-0">
                <p className="text-sm font-semibold">친구들끼리 친목모임</p>
                <p className="text-xs text-[var(--wf-subtle)]">
                  2026.01.23 12:00 · 서울시 어쩌구 저쩌동
                </p>
                <p className="text-xs text-[var(--wf-subtle)]">
                  총 5인 · 3만원 +@
                </p>
              </div>
            ))}
          </StepCard>
        </section>

        {/* Settings */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">설정</h2>

          <StepCard>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">알림 설정</span>
              <div className="h-6 w-11 rounded-full bg-[var(--wf-muted)] relative">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
              </div>
            </div>
          </StepCard>
        </section>

        {/* Logout */}
        <button
          type="button"
          className="w-full rounded-2xl bg-[var(--wf-highlight)] px-6 py-4 text-sm font-semibold"
        >
          로그아웃
        </button>
      </main>
    </>
  );
}
