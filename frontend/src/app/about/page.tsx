// src/app/about/page.tsx
'use client'

import { useState } from 'react'
import { Users, Image, Info } from 'lucide-react'

type TabKey = 'intro' | 'preview' | 'team'

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('intro')

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Tab Menu */}
      <div className="mb-6 flex gap-4 border-b pb-2 text-sm">
        <TabButton
          icon={<Info size={16} />}
          label="만날각 소개"
          active={activeTab === 'intro'}
          onClick={() => setActiveTab('intro')}
        />
        <TabButton
          // eslint-disable-next-line jsx-a11y/alt-text -- lucide icon is decorative
          icon={<Image size={16} />}
          label="미리 보기"
          active={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        />
        <TabButton
          icon={<Users size={16} />}
          label="만든 사람들"
          active={activeTab === 'team'}
          onClick={() => setActiveTab('team')}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'intro' && <IntroSection />}
      {activeTab === 'preview' && <PreviewSection />}
      {activeTab === 'team' && <TeamSection />}
    </main>
  )
}

/* ---------- Components ---------- */

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 ${
        active ? 'font-semibold underline' : 'opacity-60'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

/* ---------- Sections ---------- */

function IntroSection() {
  return (
    <section className="space-y-6 text-sm leading-relaxed">
      <h1 className="text-xl font-semibold">만날각</h1>

      <p>
        <strong>만날각</strong>은 여러 사람이 모이는 약속에서
        “누가 더 멀리 가는지”, “누가 더 불편한지”를 감으로 정하지 않고,
        데이터 기반으로 가장 공정한 중간지점을 찾기 위해 만들어진 서비스입니다.
      </p>

      <p>
        친구 모임, 회사 모임, 가족 약속처럼
        각자의 출발지가 다르고 이동 수단도 다른 상황에서
        항상 한 사람이 손해를 보는 구조는 자연스럽게 반복되어 왔습니다.
        만날각은 이 불편함에서 출발했습니다.
      </p>

      <h2 className="pt-4 text-base font-semibold">
        왜 만날각이 필요했을까요?
      </h2>

      <p>
        약속을 잡을 때 우리는 보통 이런 과정을 거칩니다.
      </p>

      <ul className="list-disc pl-5">
        <li>“강남이 중간 아닌가?”</li>
        <li>“일단 여기서 만나자”</li>
        <li>“다들 괜찮지?”</li>
      </ul>

      <p>
        하지만 실제로는 누군가는 20분,
        누군가는 1시간 이상 이동해야 하는 경우가 많고,
        그 부담은 특정 사람에게 계속 쌓이게 됩니다.
      </p>

      <p>
        만날각은 출발지, 교통수단, 이동 시간을 함께 고려하여
        모두에게 가장 합리적인 중간지점을 계산하고
        그 결과를 바탕으로 장소를 추천합니다.
      </p>

      <h2 className="pt-4 text-base font-semibold">
        만날각은 이렇게 사용됩니다
      </h2>

      <ul className="list-disc pl-5">
        <li>모임 날짜와 시간을 선택하고</li>
        <li>모임의 목적을 설정한 뒤</li>
        <li>참여 멤버와 출발지를 입력하면</li>
        <li>자동으로 중간지점을 계산하고</li>
        <li>주변 장소를 추천합니다</li>
      </ul>

      <p>
        추천된 장소는 투표를 통해 확정할 수 있으며,
        모임 확정 후에는 카카오톡 초대, 위치 공유, 회비 정산까지
        모임에 필요한 모든 과정을 하나의 흐름으로 관리할 수 있습니다.
      </p>

      <h2 className="pt-4 text-base font-semibold">
        우리가 만들고 싶은 경험
      </h2>

      <p>
        만날각은 단순히 장소를 추천하는 서비스가 아니라,
        모임 준비 과정에서의 스트레스를 줄이고
        모두가 납득할 수 있는 약속 경험을 만드는 것을 목표로 합니다.
      </p>

      <p>
        누군가의 희생이 아니라,
        모두가 합의한 선택으로 약속을 시작할 수 있도록.
        만날각은 그렇게 만들어지고 있습니다.
      </p>
    </section>
  )
}

function PreviewSection() {
  const steps = [
    '모임 신규 생성',
    'Step 1. 날짜 / 시간 선택',
    'Step 2. 모임 목적',
    'Step 3. 참여 멤버',
    'Step 4. 출발지 & 교통수단',
    'Step 5. 중간지점 & 장소 확정',
    '모임 확정 결과 화면',
    '옵션 1. 실시간 위치 공유',
    '옵션 2. 회비 정산',
  ]

  return (
    <section className="space-y-6">
      {steps.map((step) => (
        <div key={step} className="space-y-2">
          <div className="h-40 w-full rounded border bg-gray-100" />
          <p className="text-sm font-medium">{step}</p>
        </div>
      ))}
    </section>
  )
}

function TeamSection() {
  const members = [
    { name: '팀장 A', role: 'Team Lead' },
    { name: '백엔드 B', role: 'Backend Developer' },
    { name: '백엔드 C', role: 'Backend Developer' },
    { name: '프론트엔드 D', role: 'Frontend Developer' },
    { name: '프론트엔드 E', role: 'Frontend Developer' },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {members.map((m) => (
        <div key={m.name} className="rounded border p-4 text-sm">
          <div className="mb-2 flex items-center gap-2">
            <Users size={50} />
            <strong>{m.name}</strong>
          </div>
          <p className="opacity-70">{m.role}</p>
          <p className="mt-2 opacity-80">
            프로젝트를 통해 실무에 가까운 협업 경험을 쌓았습니다.
          </p>
        </div>
      ))}
    </section>
  )
}
