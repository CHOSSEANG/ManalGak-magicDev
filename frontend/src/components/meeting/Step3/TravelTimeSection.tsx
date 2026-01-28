// src/components/meeting/Step3/TravelTimeSection.tsx
interface MemberTravel {
  name: string
  minutes: number
  transfers: number
}

export default function TravelTimeSection({
  members,
}: {
  members: MemberTravel[]
}) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium">이동시간</p>

      <div className="grid grid-cols-4 gap-2">
        {members.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-[var(--wf-border)] p-2 text-center"
          >
            <p className="text-xs font-medium">{m.name}</p>
            <p className="text-base font-bold">{m.minutes}분</p>
            <p className="text-[10px] text-[var(--wf-subtle)]">
              환승 {m.transfers}회
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
