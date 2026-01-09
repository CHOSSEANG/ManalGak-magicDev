// src/components/member/MemberStatusSelect.tsx
import { MemberStatus } from '@/components/meeting/Step3/Step3MemberList'

const statusOptions: { value: MemberStatus; label: string }[] = [
  { value: 'confirmed', label: '확정' },
  { value: 'pending', label: '대기' },
  { value: 'invited', label: '초대' },
]

interface Props {
  value: MemberStatus
  onChange: (status: MemberStatus) => void
}

export default function MemberStatusSelect({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as MemberStatus)}
      className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1 text-xs"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
