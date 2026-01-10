// src/app/meetings/[meetingId]/option-fee/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MinusCircle } from 'lucide-react'
import StepCard from '@/components/meeting/StepCard'
import CompleteSummaryCard from '@/components/meeting/Step6/CompleteSummaryCard'

// =====================
// 숫자 유틸
// =====================
const toNumber = (value: string) =>
  Number(value.replace(/,/g, '').replace(/\D/g, ''))

const toComma = (value: number) =>
  value === 0 ? '' : value.toLocaleString('ko-KR')

export default function OptionPaymentPage() {
  // =====================
  // 1. 상태
  // =====================
  const [baseFee, setBaseFee] = useState(0)
  const [baseFeeInput, setBaseFeeInput] = useState('')

  const [extraFees, setExtraFees] = useState<number[]>([])
  const [extraFeeInputs, setExtraFeeInputs] = useState<string[]>([])

  const memberCount = 6
  const meetingId = 'meeting-001'

  // =====================
  // 2. 계산
  // =====================
  const totalExtraFee = useMemo(
    () => extraFees.reduce((sum, v) => sum + v, 0),
    [extraFees]
  )

  const totalFee = baseFee + totalExtraFee

  const perPersonFee = useMemo(() => {
    return Math.ceil(totalFee / memberCount)
  }, [totalFee, memberCount])

  // =====================
  // 3. mock 데이터
  // =====================
  const mockMeetingData = {
    meetingName: '친구들끼리 친목모임',
    dateTime: '2026.01.23 12:00',
    memberCount: 5,
    category: '카페',
    placeName: '어쩌구 카페',
    address: '서울시 어쩌구 저쩌동 12-34',
    parkingInfo: '가능',
    reservationInfo: '불필요',
    phoneNumber: '02-123-4567',
  }

  return (
    <main className="space-y-6">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">옵션 2. 회비 관리</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          회비 금액 입력 및 카카오페이 링크
        </p>
      </div>

      {/* 기본 회비 */}
      <StepCard className="space-y-2">
        <label className="text-sm font-semibold">모임 총 비용</label>

        <div className="flex items-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm">
          <input
            type="text"
            value={baseFeeInput}
            onChange={(e) => {
              const num = toNumber(e.target.value)
              setBaseFee(num)
              setBaseFeeInput(toComma(num))
            }}
            className="flex-1 bg-transparent text-right outline-none"
            placeholder="0"
          />
          <span className="ml-2 w-4 text-right text-[var(--wf-subtle)]">
            원
          </span>
        </div>
      <hr />

      {/* 예외비용 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">예외비용</p>

        <button
          type="button"
          onClick={() => {
            setExtraFees([...extraFees, 0])
            setExtraFeeInputs([...extraFeeInputs, ''])
          }}
          className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
        >
          + 예외비용 추가
        </button>
      </div>

      {/* 예외비용 리스트 */}
      <div className="space-y-[2px]">
        {extraFees.map((fee, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[auto_1fr] items-center gap-2"
          >
            {/* 삭제 */}
            <button
              type="button"
              onClick={() => {
                setExtraFees(extraFees.filter((_, i) => i !== idx))
                setExtraFeeInputs(extraFeeInputs.filter((_, i) => i !== idx))
              }}
              className="text-[var(--wf-subtle)] hover:text-red-500"
            >
              <MinusCircle size={24} strokeWidth={1} />
            </button>

            {/* 입력 */}
            <div className="flex items-center rounded-lg border border-[var(--wf-border)] bg-[var(--wf-muted)] pl-2 pr-3 py-1 text-sm">
              <input
                type="text"
                value={extraFeeInputs[idx]}
                onChange={(e) => {
                  const num = toNumber(e.target.value)
                  const newFees = [...extraFees]
                  const newInputs = [...extraFeeInputs]

                  newFees[idx] = num
                  newInputs[idx] = toComma(num)

                  setExtraFees(newFees)
                  setExtraFeeInputs(newInputs)
                }}
                className="flex-1 bg-transparent text-right outline-none"
                placeholder="0"
              />
              <span className="ml-2 w-4 text-right text-[var(--wf-subtle)]">
                원
              </span>
            </div>
          </div>
        ))}
      <hr />
        {/* 합계 */}
        {extraFees.length > 0 && (
          <div className="mt-2 flex items-center justify-between rounded-md bg-[var(--wf-surface)] px-3 py-2 text-sm">
            <span className="text-[var(--wf-subtle)]">
              예외비용 총 금액
            </span>
            <span className="font-semibold text-right text-blue-500">
              {totalExtraFee.toLocaleString('ko-KR')}
              <span className="ml-2 text-[var(--wf-subtle)]">원</span>
            </span>
          </div>
        )}
      </div>

      {/* 1인당 금액 */}
        <p className="text-sm font-semibold">1인당 납부 회비</p>
        <div className="rounded-xl bg-[var(--wf-muted)] px-4 py-3 text-right text-lg font-bold text-red-500">
          {perPersonFee.toLocaleString('ko-KR')}
          <span className="ml-2 text-[var(--wf-subtle)]">원</span>
        </div>
      </StepCard>

      {/* 계좌 */}
      <StepCard>
        <div className="flex justify-between rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold">
          <span>카카오페이 3333-33-3333</span>
          <button
            onClick={() =>
              navigator.clipboard.writeText('3333-33-3333')
            }
          >
            복사
          </button>
        </div>
      </StepCard>

      {/* 모임 정보 */}
      <CompleteSummaryCard meeting={mockMeetingData} />

      {/* 완료 */}
      <Link
        href={`/meetings/${meetingId}/complete`}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
      >
        정산 완료
      </Link>
    </main>
  )
}
