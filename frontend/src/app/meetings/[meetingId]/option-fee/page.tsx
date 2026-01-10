// src/app/meetings/[meetingId]/option-fee/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MinusCircle } from 'lucide-react'
import StepCard from '@/components/meeting/StepCard'
import CompleteSummaryCard from '@/components/meeting/Step6/CompleteSummaryCard'

// =====================
// 숫자 유틸 (절대 안전)
// =====================
const onlyNumber = (v: string) => v.replace(/\D/g, '')
const commaEvery3 = (v: string) =>
  v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export default function OptionPaymentPage() {
  // =====================
  // 상태
  // =====================
  const [baseFeeInput, setBaseFeeInput] = useState('')
  const [baseFee, setBaseFee] = useState(0)

  const [extraFeeInputs, setExtraFeeInputs] = useState<string[]>([])
  const [extraFees, setExtraFees] = useState<number[]>([])

  const memberCount = 6
  const meetingId = 'meeting-001'

  // =====================
  // 계산
  // =====================
  const totalExtraFee = useMemo(
    () => extraFees.reduce((sum, v) => sum + v, 0),
    [extraFees]
  )

  const perPersonFee = useMemo(() => {
    return Math.ceil((baseFee + totalExtraFee) / memberCount)
  }, [baseFee, totalExtraFee, memberCount])

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
            onFocus={() => {
              setBaseFeeInput(onlyNumber(baseFeeInput))
            }}
            onChange={(e) => {
              const raw = onlyNumber(e.target.value)
              setBaseFeeInput(raw)
              setBaseFee(raw === '' ? 0 : Number(raw))
            }}
            onBlur={() => {
              if (baseFeeInput !== '') {
                setBaseFeeInput(commaEvery3(baseFeeInput))
              }
            }}
            className="flex-1 bg-transparent text-right outline-none"
            placeholder="0"
          />
          <span className="ml-2 text-[var(--wf-subtle)]">원</span>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--wf-border)] py-1" />

        {/* 예외비용 */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">예외비용</p>
          <button
            type="button"
            onClick={() => {
              setExtraFeeInputs([...extraFeeInputs, ''])
              setExtraFees([...extraFees, 0])
            }}
            className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
          >
            + 예외비용 추가
          </button>
        </div>

        <div className="space-y-[2px]">
          {extraFeeInputs.map((input, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[auto_1fr] items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  setExtraFeeInputs(extraFeeInputs.filter((_, i) => i !== idx))
                  setExtraFees(extraFees.filter((_, i) => i !== idx))
                }}
                className="text-[var(--wf-subtle)] hover:text-red-500"
              >
                <MinusCircle size={24} strokeWidth={1} />
              </button>

              <div className="flex items-center rounded-lg border border-[var(--wf-border)] bg-[var(--wf-muted)] pl-2 pr-3 py-1 text-sm">
                <input
                  type="text"
                  value={input}
                  onFocus={() => {
                    const inputs = [...extraFeeInputs]
                    inputs[idx] = onlyNumber(inputs[idx])
                    setExtraFeeInputs(inputs)
                  }}
                  onChange={(e) => {
                    const raw = onlyNumber(e.target.value)
                    const inputs = [...extraFeeInputs]
                    const fees = [...extraFees]

                    inputs[idx] = raw
                    fees[idx] = raw === '' ? 0 : Number(raw)

                    setExtraFeeInputs(inputs)
                    setExtraFees(fees)
                  }}
                  onBlur={() => {
                    if (input !== '') {
                      const inputs = [...extraFeeInputs]
                      inputs[idx] = commaEvery3(input)
                      setExtraFeeInputs(inputs)
                    }
                  }}
                  className="flex-1 bg-transparent text-right outline-none"
                  placeholder="0"
                />
                <span className="ml-2 text-[var(--wf-subtle)]">원</span>
              </div>
            </div>
          ))}

          {extraFees.length > 0 && (
            <div className="mt-2 flex items-center justify-between rounded-md bg-[var(--wf-surface)] px-3 py-2 text-sm">
              <span className="text-[var(--wf-subtle)]">
                예외비용 총 금액
              </span>
              <span className="font-semibold text-right text-blue-500">
                {commaEvery3(String(totalExtraFee))}
                <span className="ml-2 text-[var(--wf-subtle)]">원</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-b border-[var(--wf-border)] py-1" />

        {/* 1인당 */}
        <p className="text-sm font-semibold">1인당 납부 회비</p>
        <div className="rounded-xl bg-[var(--wf-muted)] px-4 py-3 text-right text-lg font-bold text-red-500">
          {commaEvery3(String(perPersonFee))}
          <span className="ml-2 text-[var(--wf-subtle)]">원</span>
        </div>
      </StepCard>

      <StepCard>
        <div className="flex justify-between rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold">
          <span>카카오페이 3333-33-3333</span>
          <button onClick={() => navigator.clipboard.writeText('3333-33-3333')}>
            복사
          </button>
        </div>
      </StepCard>

      <CompleteSummaryCard meeting={mockMeetingData} />

      <Link
        href={`/meetings/${meetingId}/complete`}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
      >
        정산 완료
      </Link>
    </main>
  )
}
