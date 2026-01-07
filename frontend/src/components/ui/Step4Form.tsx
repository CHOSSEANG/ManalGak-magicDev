// src/components/ui/Step4Form.tsx
'use client'

import { useState } from 'react'
import { PersonStanding, Bus, Car, Bookmark} from 'lucide-react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'

export default function Step4Form() {
 const [searchAddressOpen, setSearchAddressOpen] = useState(false)
 const [bookmarkOpen, setBookmarkOpen] = useState(false)


  return (
    <div className="space-y-6">
      {/* 출발지 입력 */}
      <StepCard className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">출발지 입력</h2>
            <button
          type="button"
          onClick={() => setBookmarkOpen(true)}
          className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
        >
          <Bookmark className="h-3 w-3" />
          가져오기 &gt;
        </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <input
              type="text"
              placeholder="출발지를 입력해 주세요"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchAddressOpen(true)}
              className="shrink-0 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-2 text-sm"
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 교통수단 선택 */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">교통수단 선택</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] py-4 text-sm">
              <PersonStanding className="h-14 w-14" />
              도보
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] py-4 text-sm">
              <Bus className="h-14 w-14" />
              대중교통
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] py-4 text-sm">
              <Car className="h-14 w-14" />
              자동차
            </button>
          </div>
        </div>
      </StepCard>

      {/* 지도 영역 (Kakao Map 예정) */}
      <div className="h-56 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] flex items-center justify-center text-sm text-[var(--wf-subtle)]">
        지도 영역 (Kakao Map 예정)
      </div>

      {/* 옵션 영역 */}
      <StepCard className="space-y-6">
        {/* 모임 종료시간 설정 */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">모임 종료시간 설정</h3>
          <div className="flex items-center justify-between rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
            <span>종료 시간 선택</span>
            <button
              type="button"
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
            >
              시계
            </button>
          </div>
        </div>

        {/* 돌아가는 주소 입력 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">돌아가는 주소 입력</h3>
            <button
              type="button"
              onClick={() => setBookmarkOpen(true)}
              className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
            >
              <Bookmark className="h-3 w-3" />
              가져오기 &gt;
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <input
              type="text"
              placeholder="돌아가는 주소를 입력해 주세요"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchAddressOpen(true)}
              className="shrink-0 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-2 text-sm"
            >
              주소 검색
            </button>
          </div>
        </div>


      </StepCard>

      {/* 주소 검색 모달 */}
      <WireframeModal
        open={searchAddressOpen}
        title="주소 검색"
        onClose={() => setSearchAddressOpen(false)}
      >
        <p className="mb-2 text-sm">
          주소 검색 UI (카카오 주소 검색 예정)
        </p>
        <div className="h-32 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </WireframeModal>

      {/* 북마크 모달 */}
      <WireframeModal
          open={bookmarkOpen}
          title="저장된 주소 가져오기"
          onClose={() => setBookmarkOpen(false)}
        >
          <p className="mb-2 text-sm">
            내 페이지에 저장된 북마크 주소 목록
          </p>

          <ul className="space-y-2">
            <li className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
              집 (서울시 어쩌구 저쩌동 12-34)
            </li>
            <li className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
              회사 (서울시 어쩌구 저쩌동 56-78)
            </li>
          </ul>
        </WireframeModal>


    </div>
  )
}
