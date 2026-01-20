// src/app/meetings/[meetingId]/option-fee/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { MinusCircle, PlusCircle, Plus, Minus } from 'lucide-react'
import StepCard from '@/components/meeting/StepCard'
import CompleteSummaryCard from '@/components/meeting/Step6/CompleteSummaryCard'
import StepNavigation from '@/components/layout/StepNavigation'

// =====================
// 숫자 유틸
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
  const [isBaseComposing, setIsBaseComposing] = useState(false)

  // 영수증
  const [receiptInputs, setReceiptInputs] = useState<string[]>([])
  const [receiptFees, setReceiptFees] = useState<number[]>([])

  // 예외비용
  // eslint: remove unused state to satisfy lint
  const [extraFeeInputs, setExtraFeeInputs] = useState<string[]>([])
  const [extraFees, setExtraFees] = useState<number[]>([])

  const [memberCount, setMemberCount] = useState(1)

  // =====================
  // 계산
  // =====================
  const totalReceiptFee = useMemo(
    () => receiptFees.reduce((sum, v) => sum + v, 0),
    [receiptFees]
  )

  const totalExtraFee = useMemo(
    () => extraFees.reduce((sum, v) => sum + v, 0),
    [extraFees]
  )

  // ⭐ 핵심: 모임 총 비용 = 기본 + 영수증
  const totalMeetingFee = useMemo(
    () => baseFee + totalReceiptFee,
    [baseFee, totalReceiptFee]
  )

  const perPersonFee = useMemo(() => {
    const safeMemberCount = Math.max(1, memberCount)
    const payableTotal = Math.max(
      0,
      totalMeetingFee - totalExtraFee
    )
    return Math.ceil(payableTotal / safeMemberCount)
  }, [totalMeetingFee, totalExtraFee, memberCount])

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
        <h1 className="text-2xl font-semibold">회비 관리</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
           1인당 비용을 계산할 수 있는 계산기 기능입니다.
        </p>
      </div>

      {/* 기본 회비 */}
      <StepCard className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">1. 모임 총 비용</p>
          <button
            type="button"
            onClick={() => {
              setReceiptInputs([...receiptInputs, ''])
              setReceiptFees([...receiptFees, 0])
            }}
            className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
          >
            + 영수증별 입력
          </button>
        </div>

        {/* 모임 총 비용 입력 */}
        <div className="flex items-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm">
          <input
            type="text"
            value={
              isBaseComposing
                ? baseFeeInput
                : commaEvery3(String(totalMeetingFee))
            }
            onFocus={(e) => {
              const raw = onlyNumber(e.currentTarget.value)
              setBaseFeeInput(raw)
              setBaseFee(raw === '' ? 0 : Number(raw))
            }}
            onChange={(e) => {
              if (isBaseComposing) {
                setBaseFeeInput(e.currentTarget.value)
                return
              }
              const raw = onlyNumber(e.currentTarget.value)
              setBaseFeeInput(raw)
              setBaseFee(raw === '' ? 0 : Number(raw))
            }}
            onBlur={(e) => {
              if (isBaseComposing) return
              const raw = onlyNumber(e.currentTarget.value)
              setBaseFeeInput(raw === '' ? '' : commaEvery3(raw))
              setBaseFee(raw === '' ? 0 : Number(raw))
            }}
            onCompositionStart={() => setIsBaseComposing(true)}
            onCompositionEnd={(e) => {
              setIsBaseComposing(false)
              const raw = onlyNumber(e.currentTarget.value)
              setBaseFeeInput(raw)
              setBaseFee(raw === '' ? 0 : Number(raw))
            }}
            className="flex-1 bg-transparent text-right outline-none font-bold"
            placeholder="0"
          />
          <span className="ml-2 text-[var(--wf-subtle)]">원</span>
        </div>

        {/* 영수증 입력 */}
        {receiptInputs.map((input, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[auto_1fr] items-center gap-2"
          >
            <button
              type="button"
              onClick={() => {
                setReceiptInputs(receiptInputs.filter((_, i) => i !== idx))
                setReceiptFees(receiptFees.filter((_, i) => i !== idx))
              }}
              className="text-[var(--wf-subtle)] hover:text-red-500"
            >
              <MinusCircle size={24} strokeWidth={1} />
            </button>

            <div className="flex items-center rounded-lg border border-[var(--wf-border)] bg-[var(--wf-muted)] pl-2 pr-3 py-1 text-sm">
              <Plus size={16} strokeWidth={2} className='text-red-700'/>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  const raw = onlyNumber(e.currentTarget.value)
                  const inputs = [...receiptInputs]
                  const fees = [...receiptFees]

                  inputs[idx] = raw
                  fees[idx] = raw === '' ? 0 : Number(raw)

                  setReceiptInputs(inputs)
                  setReceiptFees(fees)
                }}
                onBlur={(e) => {
                  const raw = onlyNumber(e.currentTarget.value)
                  const inputs = [...receiptInputs]
                  inputs[idx] = raw === '' ? '' : commaEvery3(raw)
                  setReceiptInputs(inputs)
                }}
                className="flex-1 bg-transparent text-right outline-none"
                placeholder="0"
              />
              <span className="ml-2 text-[var(--wf-subtle)]">원</span>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-b border-[var(--wf-border)] py-1" />

        {/* 예외비용 */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">선택) 예외비용</p>
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
                <Minus size={16} strokeWidth={2} className='text-blue-500'/>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    const raw = onlyNumber(e.currentTarget.value)
                    const inputs = [...extraFeeInputs]
                    const fees = [...extraFees]

                    inputs[idx] = raw
                    fees[idx] = raw === '' ? 0 : Number(raw)

                    setExtraFeeInputs(inputs)
                    setExtraFees(fees)
                  }}
                  onBlur={(e) => {
                    const raw = onlyNumber(e.currentTarget.value)
                    const inputs = [...extraFeeInputs]
                    const fees = [...extraFees]

                    inputs[idx] = raw === '' ? '' : commaEvery3(raw)
                    fees[idx] = raw === '' ? 0 : Number(raw)

                    setExtraFeeInputs(inputs)
                    setExtraFees(fees)
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
              <span className="text-[var(--wf-subtle)]">예외비용 총 금액</span>
              <div className="flex font-semibold text-blue-500">
                <Minus size={16} strokeWidth={2} className='text-blue-500 mr-10' />
                {commaEvery3(String(totalExtraFee))}
              <span className="ml-2 text-[var(--wf-subtle)]">원</span>
              </div>
            </div>
          )}
        </div>

        {/* 참여 인원 */}
        <div className="flex items-center justify-between border-t border-[var(--wf-border)] pt-2">
          <p className="text-sm font-semibold">2. 총 참여 인원</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMemberCount((v) => Math.max(1, v - 1))}
            >
              <MinusCircle size={24} />
            </button>
            <input
              type="text"
              value={memberCount}
              onChange={(e) => {
                const v = Number(e.target.value.replace(/\D/g, ''))
                setMemberCount(v === 0 ? 1 : v)
              }}
              className="w-12 text-center"
            />
            <button
              type="button"
              onClick={() => setMemberCount((v) => v + 1)}
            >
              <PlusCircle size={24} />
            </button>
          </div>
        </div>

        {/* 1인당 */}
        <div className="flex items-center justify-between">
          <p className="text-ml font-semibold">1인당 납부 회비</p>
          <div className="w-[70%] rounded-xl bg-[var(--wf-muted)] px-4 py-2 text-right text-lg font-bold text-red-500">
            {commaEvery3(String(perPersonFee))}
            <span className="ml-2 text-[var(--wf-subtle)]">원</span>
          </div>
        </div>
      </StepCard>

      <CompleteSummaryCard meeting={mockMeetingData} />

      {/* 스텝 네비 */}
      <StepNavigation
        prevHref="/meetings/meeting-001/complete"
        prevLabel="모임정보 상세보기"
        nextHref="/my"
        nextLabel="내 모임 리스트"
      />
    </main>
  )
}
