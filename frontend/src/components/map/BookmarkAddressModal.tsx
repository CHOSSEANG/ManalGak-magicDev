// src/components/address/BookmarkAddressModal.tsx
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import WireframeModal from '@/components/ui/WireframeModal'
import axios from 'axios'

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface Address {
  id: number
  address: string
  category?: string
}

interface BookmarkAddressModalProps {
  open: boolean
  onClose: () => void
  onSelect: (address: string) => void
}

export default function BookmarkAddressModal({
  open,
  onClose,
  onSelect,
}: BookmarkAddressModalProps) {
  /** API에서 가져온 주소 목록 */
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)

  // open이 true일 때 API 호출
  useEffect(() => {
    if (open) {
      setLoading(true)
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/addresses/user`, {
          withCredentials: true, // 쿠키 전송
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setAddresses(res.data.data)
        })
        .catch((err) => console.error('주소 가져오기 실패:', err))
        .finally(() => setLoading(false))
    }
  }, [open])

  let bodyContent: ReactNode = null

  if (loading) {
    bodyContent = (
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 bg-[var(--neutral-soft)]" />
        <Skeleton className="h-12 w-full bg-[var(--neutral-soft)]" />
        <Skeleton className="h-12 w-full bg-[var(--neutral-soft)]" />
      </div>
    )
  } else {
    if (addresses.length === 0) {
      bodyContent = (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-6 text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            저장된 주소가 없습니다.
          </p>
        </div>
      )
    } else {
      bodyContent = (
        <ScrollArea className="max-h-72 pr-1">
          <div className="space-y-2">
            {addresses.map((addr) => (
              <Card
                key={addr.id}
                className="border border-[var(--border)] bg-[var(--bg)]"
              >
                <CardContent className="p-2">
                  <Button
                    type="button"
                    onClick={() => {
                      onSelect(addr.address)
                      onClose()
                    }}
                    className="w-full justify-start gap-3 rounded-xl bg-[var(--neutral-soft)] text-[var(--text)]"
                  >
                    <div className="w-20 text-left font-medium">
                      ({addr.category || '-'})
                    </div>
                    <div className="flex-1 truncate text-left">{addr.address}</div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )
    }
  }

  return (
    <WireframeModal
      open={open}
      title="저장된 주소 가져오기"
      onClose={onClose}
    >
      <div className="space-y-3">
        <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">
              주소 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">{bodyContent}</CardContent>
        </Card>
      </div>
    </WireframeModal>
  )
}
