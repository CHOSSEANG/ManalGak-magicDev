'use client'

import { useState } from 'react'

interface SingleSelectGridProps {
  items: string[]
  initial?: string
  helperText?: string
}

export default function SingleSelectGrid({
  items,
  initial,
  helperText,
}: SingleSelectGridProps) {
  const [selected, setSelected] = useState(initial ?? items[0])

  // 와이어프레임 단계: 단일 선택 그리드
  return (
    <div className="space-y-3">
      {helperText ? (
        <p className="text-sm text-[var(--wf-subtle)]">{helperText}</p>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const isSelected = selected === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => setSelected(item)}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                isSelected
                  ? 'border-[var(--wf-text)] bg-[var(--wf-accent)]'
                  : 'border-[var(--wf-border)] bg-[var(--wf-surface)]'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}
