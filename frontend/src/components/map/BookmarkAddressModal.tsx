// src/components/address/BookmarkAddressModal.tsx
'use client'

import { useEffect, useState } from 'react'
import WireframeModal from '@/components/ui/WireframeModal'
import axios from 'axios'

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
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/addresses/user`, {
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

  return (
    <WireframeModal
      open={open}
      title="저장된 주소 가져오기"
      onClose={onClose}
    >
      {/* 설명 + 리스트를 하나의 그룹으로 */}
      <div className="space-y-3">

        {loading ? (
          <p className="text-sm text-center">로딩 중...</p>
        ) : (
          <ul className="space-y-2">
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <li key={addr.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(addr.address)
                      onClose()
                    }}
                    className="w-full flex items-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm hover:bg-[var(--wf-accent)]"
                  >
                    {/* 카테고리 영역 */}
                    <div className="w-20 text-left font-medium">({addr.category || '-'})</div>
                    {/* 주소 영역 */}
                    <div className="flex-1 text-left truncate">{addr.address}</div>
                  </button>
                </li>
              ))
            ) : (
              <p className="text-xs text-center text-gray-400">저장된 주소가 없습니다.</p>
            )}
          </ul>
        )}
      </div>
    </WireframeModal>
  )
}
