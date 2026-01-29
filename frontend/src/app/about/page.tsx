// src/app/about/page.tsx
"use client";

import { useState } from "react";
import { Users, Image as ImageIcon, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabKey = "intro" | "preview" | "team";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("intro");

  const handleTabChange = (value: string) => {
    // Tabs는 string을 주므로 안전 캐스팅 (허용된 값만 세팅)
    if (value === "intro" || value === "preview" || value === "team") {
      setActiveTab(value);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Page Title / Description */}
      <div className="mb-6 space-y-2">
        <h1 className="text-xl font-semibold text-[var(--text)]">About</h1>
        <p className="text-sm text-[var(--text-subtle)]">
          만날각 소개, 기능 흐름 미리 보기, 만든 사람들 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* Tabs (shadcn) */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardHeader className="pb-3">
            <TabsList className="w-full bg-[var(--bg-soft)]">
              <TabsTrigger value="intro" className="gap-2">
                <Info className="h-4 w-4" />
                만날각 소개
              </TabsTrigger>

              <TabsTrigger value="preview" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                미리 보기
              </TabsTrigger>

              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                만든 사람들
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-0">
            <TabsContent value="intro" className="m-0">
              <IntroSection />
            </TabsContent>

            <TabsContent value="preview" className="m-0">
              <PreviewSection />
            </TabsContent>

            <TabsContent value="team" className="m-0">
              <TeamSection />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}

/* ---------- Sections ---------- */

function IntroSection() {
  return (
    <section className="space-y-6 text-sm leading-relaxed text-[var(--text)]">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">만날각</h2>
        <p className="text-[var(--text-subtle)]">
          “감”이 아니라 “데이터”로, 모두가 납득하는 중간지점을 찾습니다.
        </p>
      </div>

      <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[var(--text)]">
            서비스 소개
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[var(--text)]">
          <p>
            <strong>만날각</strong>은 여러 사람이 모이는 약속에서 “누가 더
            멀리 가는지”, “누가 더 불편한지”를 감으로 정하지 않고, 데이터
            기반으로 가장 공정한 중간지점을 찾기 위해 만들어진 서비스입니다.
          </p>

          <p>
            친구 모임, 회사 모임, 가족 약속처럼 각자의 출발지가 다르고 이동
            수단도 다른 상황에서 특정 사람에게 부담이 반복되는 문제를
            해결하고자 합니다.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">왜 만날각이 필요했을까요?</h3>

        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardContent className="pt-6 space-y-3">
            <p className="text-[var(--text-subtle)]">
              약속을 잡을 때 우리는 보통 이런 과정을 거칩니다.
            </p>

            <ul className="list-disc pl-5 text-[var(--text)]">
              <li>“강남이 중간 아닌가?”</li>
              <li>“일단 여기서 만나자”</li>
              <li>“다들 괜찮지?”</li>
            </ul>

            <p>
              하지만 실제로는 누군가는 20분, 누군가는 1시간 이상 이동해야 하는
              경우가 많고, 그 부담은 특정 사람에게 계속 쌓이게 됩니다.
            </p>

            <p>
              만날각은 출발지, 교통수단, 이동 시간을 함께 고려하여 모두에게
              가장 합리적인 중간지점을 계산하고 그 결과를 바탕으로 장소를
              추천합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">만날각은 이렇게 사용됩니다</h3>

        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardContent className="pt-6">
            <ul className="list-disc space-y-1 pl-5 text-[var(--text)]">
              <li>모임 날짜와 시간을 선택하고</li>
              <li>모임의 목적을 설정한 뒤</li>
              <li>참여 멤버와 출발지를 입력하면</li>
              <li>자동으로 중간지점을 계산하고</li>
              <li>주변 장소를 추천합니다</li>
            </ul>

            <p className="mt-4 text-[var(--text)]">
              추천된 장소는 투표를 통해 확정할 수 있으며, 모임 확정 후에는
              카카오톡 초대, 위치 공유, 회비 정산까지 하나의 흐름으로 관리할 수
              있습니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-[var(--text)]">
            우리가 만들고 싶은 경험
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[var(--text)]">
          <p>
            만날각은 단순히 장소를 추천하는 서비스가 아니라, 모임 준비 과정에서
            스트레스를 줄이고 모두가 납득할 수 있는 약속 경험을 만드는 것을
            목표로 합니다.
          </p>
          <p>
            누군가의 희생이 아니라, 모두가 합의한 선택으로 약속을 시작할 수
            있도록. 만날각은 그렇게 만들어지고 있습니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function PreviewSection() {
  const steps = [
    "모임 신규 생성",
    "Step 1. 날짜 / 시간 선택",
    "Step 2. 모임 목적",
    "Step 3. 참여 멤버",
    "Step 4. 출발지 & 교통수단",
    "Step 5. 중간지점 & 장소 확정",
    "모임 확정 결과 화면",
    "옵션 1. 실시간 위치 공유",
    "옵션 2. 회비 정산",
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-[var(--text)]">미리 보기</h2>
        <p className="text-sm text-[var(--text-subtle)]">
          실제 화면 캡처(또는 이미지)를 넣기 전 단계용 구조입니다.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <Card key={step} className="border-[var(--border)] bg-[var(--bg)]">
            <CardContent className="pt-6 space-y-2">
              {/* Placeholder */}
              <div className="h-28 w-full rounded-md border border-[var(--border)] bg-[var(--bg-soft)]" />
              <p className="text-sm font-medium text-[var(--text)]">{step}</p>
              <p className="text-xs text-[var(--text-subtle)]">
                (이미지 교체 예정)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TeamSection() {
  const members = [
    { name: "팀장 A", role: "Team Lead" },
    { name: "백엔드 B", role: "Backend Developer" },
    { name: "백엔드 C", role: "Backend Developer" },
    { name: "프론트엔드 D", role: "Frontend Developer" },
    { name: "프론트엔드 E", role: "Frontend Developer" },
  ];

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-[var(--text)]">
          만든 사람들
        </h2>
        <p className="text-sm text-[var(--text-subtle)]">
          역할 기반으로 구성된 팀 소개 카드입니다.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {members.map((m) => (
          <Card key={m.name} className="border-[var(--border)] bg-[var(--bg)]">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-soft)]">
                  <Users className="h-6 w-6 text-[var(--text-subtle)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {m.name}
                  </p>
                  <p className="text-xs text-[var(--text-subtle)]">{m.role}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-[var(--text-subtle)]">
                프로젝트를 통해 실무에 가까운 협업 경험을 쌓았습니다.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
