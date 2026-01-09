// src/components/ui/Step4Form.tsx
'use client'

import { useState } from 'react'
import { PersonStanding, Bus, Car, Bookmark } from 'lucide-react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'
import AddressSearch from '@/components/map/AddressSearch'
import BookmarkAddressModal from '@/components/map/BookmarkAddressModal'
import TimeSelectModal from '@/components/map/TimeSelectModal'
import KakaoMap from '@/components/map/KakaoMap'


type AddressType = 'origin' | 'return'

export default function Step4Form() {
  /** 현재 주소 입력 대상 */
  const [activeAddressType, setActiveAddressType] =
    useState<AddressType | null>(null)

  /** 주소 값 */
  const [originAddress, setOriginAddress] = useState('')
  const [returnAddress, setReturnAddress] = useState('')

  /** 교통수단 */
  const [transport, setTransport] =
    useState<'walk' | 'bus' | 'car' | null>(null)

  /** 모달 상태 */
  const [searchAddressOpen, setSearchAddressOpen] = useState(false)
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)

  /** 종료 시간 */
  const [endTime, setEndTime] = useState<string | null>(null)

  /** 주소 적용 */
  const applyAddress = (address: string) => {
    if (activeAddressType === 'origin') {
      setOriginAddress(address)
    }
    if (activeAddressType === 'return') {
      setReturnAddress(address)
    }

    // 모달 정리
    setSearchAddressOpen(false)
    setBookmarkOpen(false)
    setActiveAddressType(null)
  }

  return (
    <>

    <div className="space-y-6">
      {/* 출발지 */}
      <StepCard className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">출발지 입력</h2>
            <button
              type="button"
              onClick={() => {
                setActiveAddressType('origin')
                setBookmarkOpen(true)
              }}
              className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
            >
              <Bookmark className="h-3 w-3" />
              가져오기 &gt;
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <input
              type="text"
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
              placeholder="출발지를 입력해 주세요"
              className="flex-1 bg-transparent text-base outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setActiveAddressType('origin')
                setSearchAddressOpen(true)
              }}
              className="shrink-0 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-2 text-sm"
            >
              주소 검색
            </button>
          </div>
        </div>

        {/* 교통수단 */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">교통수단 선택</h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'walk', label: '도보', icon: PersonStanding },
              { key: 'bus', label: '대중교통', icon: Bus },
              { key: 'car', label: '자동차', icon: Car },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTransport(key as any)}
                className={`flex flex-col items-center gap-2 rounded-2xl border py-4 text-sm transition
                  ${
                    transport === key
                      ? 'bg-[var(--wf-accent)] border-[var(--wf-accent)]'
                      : 'bg-[var(--wf-muted)] border-[var(--wf-border)]'
                  }`}
              >
                <Icon className="h-14 w-14" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </StepCard>

      {/* 지도 영역 */}
<div className="h-56 rounded-2xl border border-[var(--wf-border)] overflow-hidden">
  <KakaoMap />
</div>



      {/* 옵션 */}
      <StepCard className="space-y-6">
        {/* 종료 시간 */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">모임 종료시간 설정</h3>

          <div className="flex items-center justify-between rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <span
              className={
                endTime
                  ? 'text-base font-medium'
                  : 'text-sm text-[var(--wf-subtle)]'
              }
            >
              {endTime ? `${endTime} 종료 예정` : '종료 시간 선택'}
            </span>

            <button
              type="button"
              onClick={() => setTimeOpen(true)}
              className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-sm"
            >
              {endTime ? '변경' : '시간 선택'}
            </button>
          </div>
        </div>

        {/* 돌아가는 주소 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">돌아가는 주소 입력</h3>
            <button
              type="button"
              onClick={() => {
                setActiveAddressType('return')
                setBookmarkOpen(true)
              }}
              className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
            >
              <Bookmark className="h-3 w-3" />
              가져오기 &gt;
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <input
              type="text"
              value={returnAddress}
              onChange={(e) => setReturnAddress(e.target.value)}
              placeholder="돌아가는 주소를 입력해 주세요"
              className="flex-1 bg-transparent text-base outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setActiveAddressType('return')
                setSearchAddressOpen(true)
              }}
              className="shrink-0 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-2 text-sm"
            >
              주소 검색
            </button>
          </div>
        </div>
      </StepCard>

      {/* 주소 검색 모달 (단일 인스턴스) */}
      <WireframeModal
        open={searchAddressOpen}
        title="주소 검색"
        onClose={() => {
          setSearchAddressOpen(false)
          setActiveAddressType(null)
        }}
      >
        {activeAddressType && (
          <AddressSearch
            key={`${activeAddressType}-search`}
            onSelect={applyAddress}
          />
        )}
      </WireframeModal>

      {/* 북마크 모달 */}
      <BookmarkAddressModal
        open={bookmarkOpen}
        onClose={() => {
          setBookmarkOpen(false)
          setActiveAddressType(null)
        }}
        onSelect={applyAddress}
      />

      {/* 시간 선택 모달 */}
      <TimeSelectModal
        open={timeOpen}
        value={endTime ?? undefined}
        onClose={() => setTimeOpen(false)}
        onConfirm={(time) => {
          setEndTime(time)
          setTimeOpen(false)
        }}
      />
      </div>
      </>
  )
}
