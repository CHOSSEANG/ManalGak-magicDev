'use client'

import { useState } from 'react'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeModal from '@/components/wireframe/WireframeModal'

export default function Step1Form() {
  const [calendarOpen, setCalendarOpen] = useState(false)

  // 와이어프레임 단계: 날짜/시간 선택 UI
  return (
    <div className="space-y-4">
      <WireframeCard className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">모임명</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <span className="text-sm">모일각이 처음으로 모임</span>
            <button
              type="button"
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
            >
              수정
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">만날 날짜 선택</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <span className="text-sm">2026. 1. 23. 금요일</span>
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
            >
              달력
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">만남 시간 선택</p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <span className="text-sm">11:30 - 14:00 (2시간 반)</span>
            <button
              type="button"
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
            >
              시간
            </button>
          </div>
        </div>
      </WireframeCard>

      <WireframeCard className="space-y-2">
        <p className="text-sm font-semibold">날씨 예보 (더미)</p>
        <div className="h-24 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </WireframeCard>

      <WireframeModal
        open={calendarOpen}
        title="달력 선택"
        onClose={() => setCalendarOpen(false)}
      >
        <p>캘린더 모달 영역 (API 연동 없음)</p>
        <div className="h-32 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </WireframeModal>
    </div>
  )
}
