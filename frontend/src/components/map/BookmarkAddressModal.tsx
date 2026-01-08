// src/components/address/BookmarkAddressModal.tsx
'use client'

import WireframeModal from '@/components/ui/WireframeModal'

interface BookmarkAddressModalProps {
  open: boolean
  onClose: () => void
  onSelect: (address: string) => void
}

const MOCK_BOOKMARKS = [
  '집 (서울시 어쩌구 저쩌동 12-34)',
  '회사 (서울시 어쩌구 저쩌동 56-78)',
]

export default function BookmarkAddressModal({
  open,
  onClose,
  onSelect,
}: BookmarkAddressModalProps) {
  return (
    <WireframeModal
      open={open}
      title="저장된 주소 가져오기"
      onClose={onClose}
    >
      {/* 설명 + 리스트를 하나의 그룹으로 */}
      <div className="space-y-3">
        <p className="text-xs text-[var(--wf-subtle)]">
          모임이 종료되는 예상 시간을 선택해 주세요.
        </p>

        <ul className="space-y-2">
          {MOCK_BOOKMARKS.map((address) => (
            <li key={address}>
              <button
                type="button"
                onClick={() => {
                  onSelect(address)
                  onClose()
                }}
                className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left text-sm hover:bg-[var(--wf-accent)]"
              >
                {address}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </WireframeModal>
  )
}
