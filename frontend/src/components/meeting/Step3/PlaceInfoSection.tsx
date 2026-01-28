// src/components/meeting/Step3/PlaceInfoSection.tsx
export default function PlaceInfoSection() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-medium">마하 한남</p>
        <p className="text-xs text-[var(--wf-subtle)]">
          이탈리안 레스토랑
        </p>
      </div>

      <hr className="border-[var(--wf-border)]" />

      <div className="space-y-2">
        <div>
          <p className="text-xs text-[var(--wf-subtle)]">주소</p>
          <p className="text-sm">서울 중구 을지로 170-1</p>
        </div>

        <div>
          <p className="text-xs text-[var(--wf-subtle)]">전화</p>
          <p className="text-sm">02-2266-1234</p>
        </div>
      </div>
    </section>
  )
}
