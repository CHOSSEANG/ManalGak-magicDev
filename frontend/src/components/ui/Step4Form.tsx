// src/components/ui/Step4Form.tsx

'use client'

import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'
import SingleSelectGrid from '@/components/ui/SingleSelectGrid'

const transportModes = ['도보', '대중교통', '자동차']

export default function Step4Form() {
  const [addressOpen, setAddressOpen] = useState(false)

  // 와이어프레임 단계: 출발지 & 교통수단
  return (
    <div className="space-y-4">
      <StepCard className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">출발지 입력</h2>
            <button
              type="button"
              onClick={() => setAddressOpen(true)}
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
            >
              주소 입력
            </button>
          </div>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
            서울시 어쩌구 저쩌동 12-34
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold">교통수단 선택</h3>
          <SingleSelectGrid
            items={transportModes}
            helperText="이동 방식에 따라 추천이 달라집니다."
          />
        </div>
      </StepCard>

      <StepCard className="space-y-2">
        <p className="text-sm font-semibold">선택 단계 안내</p>
        <p className="text-sm text-[var(--wf-subtle)]">
          출발지와 교통수단은 선택 입력입니다. 생략 가능.
        </p>
      </StepCard>

      <WireframeModal
        open={addressOpen}
        title="주소 입력"
        onClose={() => setAddressOpen(false)}
      >
        <p>주소 입력 모달 (검색 UI placeholder)</p>
        <div className="h-32 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </WireframeModal>
    </div>
  )
}
