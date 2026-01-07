// src/components/meeting/MeetingSummary.tsx

'use client'

import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'

const tabs = ['모임 정보', '추천 장소', '회비 정산']

export default function MeetingSummary() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  // 와이어프레임 단계: 탭 전환 UI
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-4 py-2 text-sm ${
              activeTab === tab
                ? 'border-[var(--wf-text)] bg-[var(--wf-accent)]'
                : 'border-[var(--wf-border)] bg-[var(--wf-surface)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '모임 정보' ? (
        <StepCard className="space-y-3">
          <h3 className="text-base font-semibold">모임 상세</h3>
          <div className="grid gap-3 text-sm text-[var(--wf-subtle)] md:grid-cols-2">
            <div>모임명: 친구들과 친목모임</div>
            <div>일시: 2026.01.23 12:00</div>
            <div>모임인원: 5인</div>
            <div>출발지: 서울시 어쩌구 저쩌동 12-34</div>
          </div>
        </StepCard>
      ) : null}

      {activeTab === '추천 장소' ? (
        <StepCard className="space-y-3">
          <h3 className="text-base font-semibold">확정된 중간지점</h3>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 text-sm">
            중간지점 카페 / 도보 5분 / 1,200원
          </div>
          <div className="h-32 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
        </StepCard>
      ) : null}

      {activeTab === '회비 정산' ? (
        <StepCard className="space-y-3">
          <h3 className="text-base font-semibold">회비 정산 요약</h3>
          <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
            <span>총 회비</span>
            <span className="font-semibold">90,000원</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
            <span>1인당 회비</span>
            <span className="font-semibold">15,000원</span>
          </div>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm">
            카카오페이 링크 placeholder
          </div>
        </StepCard>
      ) : null}
    </div>
  )
}
