// src/app/meetings/fee/page.tsx
'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { MinusCircle, PlusCircle, Plus, Minus } from 'lucide-react'

// shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

// =====================
// 숫자 유틸
// =====================
const onlyNumber = (v: string) => v.replace(/\D/g, '')
const commaEvery3 = (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

function SectionLabel({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
}) {
  let subtitleNode: ReactNode = null
  if (subtitle) {
    subtitleNode = <p className="text-xs text-[var(--text-subtle)]">{subtitle}</p>
  }

  let rightNode: ReactNode = null
  if (right) {
    rightNode = <div className="shrink-0">{right}</div>
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        {subtitleNode}
      </div>
      {rightNode}
    </div>
  )
}

function MoneyRow({
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  onRemove,
  removeLabel,
  accentKind,
}: {
  icon: ReactNode
  value: string
  onChange: (v: string) => void
  onBlur: (v: string) => void
  placeholder?: string
  onRemove: () => void
  removeLabel: string
  accentKind: 'plus' | 'minus'
}) {
  let iconColor = 'text-[var(--primary)]'
  if (accentKind === 'minus') {
    iconColor = 'text-[var(--danger)]'
  }
  const removeColor = 'text-[var(--text-subtle)] hover:text-[var(--danger)]'

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className={`inline-flex items-center justify-center rounded-md ${removeColor}`}
      >
        <MinusCircle size={22} strokeWidth={1.25} />
      </button>

      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--neutral-soft)] px-3 py-2">
        <span className={`inline-flex items-center ${iconColor}`}>{icon}</span>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onBlur={(e) => onBlur(e.currentTarget.value)}
          placeholder={placeholder ?? '0'}
          className="h-8 flex-1 border-0 bg-transparent p-0 text-right text-sm text-[var(--text)] shadow-none outline-none focus-visible:ring-0"
        />
        <span className="text-xs text-[var(--text-subtle)]">원</span>
      </div>
    </div>
  )
}

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
    const payableTotal = Math.max(0, totalMeetingFee - totalExtraFee)
    return Math.ceil(payableTotal / safeMemberCount)
  }, [totalMeetingFee, totalExtraFee, memberCount])

  // =====================
  // 렌더링용 상태
  // =====================
  const hasReceipts = receiptInputs.length > 0
  const hasExtras = extraFeeInputs.length > 0

  let receiptBlock: ReactNode = null
  if (!hasReceipts) {
    receiptBlock = (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
        <p className="text-sm text-[var(--text-subtle)]">
          영수증이 있다면 “영수증별 입력”으로 항목을 추가해 정확히 분배할 수 있어요.
        </p>
      </div>
    )
  } else {
    receiptBlock = (
      <ScrollArea className="max-h-64 pr-1">
        <div className="space-y-2">
          {receiptInputs.map((input, idx) => (
            <MoneyRow
              key={idx}
              icon={<Plus size={16} strokeWidth={2} />}
              value={input}
              accentKind="plus"
              onRemove={() => {
                setReceiptInputs(receiptInputs.filter((_, i) => i !== idx))
                setReceiptFees(receiptFees.filter((_, i) => i !== idx))
              }}
              removeLabel="영수증 항목 삭제"
              onChange={(v) => {
                const raw = onlyNumber(v)
                const inputs = [...receiptInputs]
                const fees = [...receiptFees]

                inputs[idx] = raw
                fees[idx] = raw === '' ? 0 : Number(raw)

                setReceiptInputs(inputs)
                setReceiptFees(fees)
              }}
              onBlur={(v) => {
                const raw = onlyNumber(v)
                const inputs = [...receiptInputs]
                inputs[idx] = raw === '' ? '' : commaEvery3(raw)
                setReceiptInputs(inputs)
              }}
            />
          ))}
        </div>
      </ScrollArea>
    )
  }

  let extraBlock: ReactNode = null
  if (!hasExtras) {
    extraBlock = (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
        <p className="text-sm text-[var(--text-subtle)]">
          특정 멤버만 제외할 비용(예: 개인 구매)이 있다면 “예외비용 추가”로 입력하세요.
        </p>
      </div>
    )
  } else {
    extraBlock = (
      <div className="space-y-2">
        <ScrollArea className="max-h-64 pr-1">
          <div className="space-y-2">
            {extraFeeInputs.map((input, idx) => (
              <MoneyRow
                key={idx}
                icon={<Minus size={16} strokeWidth={2} />}
                value={input}
                accentKind="minus"
                onRemove={() => {
                  setExtraFeeInputs(extraFeeInputs.filter((_, i) => i !== idx))
                  setExtraFees(extraFees.filter((_, i) => i !== idx))
                }}
                removeLabel="예외비용 항목 삭제"
                onChange={(v) => {
                  const raw = onlyNumber(v)
                  const inputs = [...extraFeeInputs]
                  const fees = [...extraFees]

                  inputs[idx] = raw
                  fees[idx] = raw === '' ? 0 : Number(raw)

                  setExtraFeeInputs(inputs)
                  setExtraFees(fees)
                }}
                onBlur={(v) => {
                  const raw = onlyNumber(v)
                  const inputs = [...extraFeeInputs]
                  const fees = [...extraFees]

                  inputs[idx] = raw === '' ? '' : commaEvery3(raw)
                  fees[idx] = raw === '' ? 0 : Number(raw)

                  setExtraFeeInputs(inputs)
                  setExtraFees(fees)
                }}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--neutral-soft)] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-subtle)]">예외비용 총 금액</span>
            <div className="flex items-center gap-2 font-semibold text-[var(--text)]">
              <span className="inline-flex text-[var(--danger)]">
                <Minus size={16} strokeWidth={2} />
              </span>
              <span>{commaEvery3(String(totalExtraFee))}</span>
              <span className="text-xs font-normal text-[var(--text-subtle)]">원</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isEmptyState =
    totalMeetingFee === 0 &&
    totalExtraFee === 0 &&
    receiptInputs.length === 0 &&
    extraFeeInputs.length === 0

  let resultBlock: ReactNode = null
  if (isEmptyState) {
    resultBlock = (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] px-4 py-4">
        <p className="text-sm text-[var(--text-subtle)]">
          금액과 인원을 입력하면 1인당 회비가 계산됩니다.
        </p>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-32 bg-[var(--neutral-soft)]" />
          <Skeleton className="h-6 w-48 bg-[var(--neutral-soft)]" />
        </div>
      </div>
    )
  } else {
    resultBlock = (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--neutral-soft)] px-4 py-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm text-[var(--text-subtle)]">계산 결과</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[var(--primary)]">
              {commaEvery3(String(perPersonFee))}
            </span>
            <span className="text-sm text-[var(--text-subtle)]">원</span>
          </div>
        </div>
      </div>
    )
  }

  let baseDisplayValue = ''
  if (isBaseComposing) {
    baseDisplayValue = baseFeeInput
  } else {
    baseDisplayValue = commaEvery3(String(totalMeetingFee))
  }

  return (
    <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] px-4 py-6">
      <div className="mx-auto w-full max-w-xl space-y-4">
        {/* Page Header */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-[var(--text)]">회비 관리</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              모임 총 비용과 예외비용을 기준으로 1인당 금액을 계산합니다.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* CTA */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[var(--text)]">빠른 추가</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              필요한 항목을 먼저 추가하고 금액을 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--neutral-soft)]"
              onClick={() => {
                setReceiptInputs([...receiptInputs, ''])
                setReceiptFees([...receiptFees, 0])
              }}
            >
              + 영수증별 입력
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--neutral-soft)]"
              onClick={() => {
                setExtraFeeInputs([...extraFeeInputs, ''])
                setExtraFees([...extraFees, 0])
              }}
            >
              + 예외비용 추가
            </Button>
          </CardFooter>
        </Card>

        {/* Result (Primary) */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">1인당 납부 회비</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              (모임 총 비용 - 예외비용) ÷ 참여 인원, 올림 처리
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resultBlock}

            <div className="rounded-xl bg-[var(--bg)] px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-subtle)]">모임 총 비용</span>
                <span className="font-semibold text-[var(--text)]">
                  {commaEvery3(String(totalMeetingFee))}원
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-[var(--text-subtle)]">예외비용</span>
                <span className="font-semibold text-[var(--text)]">
                  {commaEvery3(String(totalExtraFee))}원
                </span>
              </div>
              <Separator className="my-3 bg-[var(--border)]" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-subtle)]">참여 인원</span>
                <span className="font-semibold text-[var(--text)]">{memberCount}명</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inputs (Secondary) */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">입력</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              금액과 인원을 입력하면 결과가 즉시 반영됩니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 1) Total */}
            <div className="space-y-3">
              <SectionLabel
                title="1. 모임 총 비용"
                subtitle="기본 비용을 입력하고, 필요하면 영수증 단위로 추가하세요."
              />

              {/* Base input */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[var(--text)]">기본</span>

                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="text"
                      value={baseDisplayValue}
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
                        if (isBaseComposing) {
                          return
                        }
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
                      placeholder="0"
                      className="h-9 flex-1 border-0 bg-transparent p-0 text-right text-base font-semibold text-[var(--text)] shadow-none outline-none focus-visible:ring-0"
                    />
                    <span className="text-xs text-[var(--text-subtle)]">원</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-[var(--text-subtle)]">
                  * 영수증을 추가하면 “모임 총 비용”은 (기본 + 영수증 합)으로 계산됩니다.
                </p>
              </div>

              {receiptBlock}
            </div>

            <Separator className="bg-[var(--border)]" />

            {/* Optional extras */}
            <div className="space-y-3">
              <SectionLabel
                title="선택) 예외비용"
                subtitle="특정 항목을 총액에서 제외하고 싶을 때 사용합니다."
              />
              {extraBlock}
            </div>

            <Separator className="bg-[var(--border)]" />

            {/* 2) Members */}
            <div className="space-y-3">
              <SectionLabel title="2. 총 참여 인원" subtitle="최소 1명부터 계산됩니다." />

              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 border-[var(--border)] bg-[var(--bg)] p-0 text-[var(--text)] hover:bg-[var(--neutral-soft)]"
                    onClick={() => setMemberCount((v) => Math.max(1, v - 1))}
                    aria-label="인원 감소"
                  >
                    <MinusCircle size={22} />
                  </Button>

                  <Input
                    type="text"
                    value={memberCount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '')
                      const v = raw === '' ? 0 : Number(raw)
                      if (v === 0) {
                        setMemberCount(1)
                      } else {
                        setMemberCount(v)
                      }
                    }}
                    className="h-10 w-16 border-[var(--border)] bg-[var(--bg)] text-center text-[var(--text)]"
                    inputMode="numeric"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-10 border-[var(--border)] bg-[var(--bg)] p-0 text-[var(--text)] hover:bg-[var(--neutral-soft)]"
                    onClick={() => setMemberCount((v) => v + 1)}
                    aria-label="인원 증가"
                  >
                    <PlusCircle size={22} />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--text-subtle)]">현재</p>
                  <p className="text-sm font-semibold text-[var(--text)]">{memberCount}명</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
