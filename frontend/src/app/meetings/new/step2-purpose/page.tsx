// src/app/meetings/new/step2-purpose/page.tsx
"use client";

import { useState } from "react";
import StepNavigation from "@/components/layout/StepNavigation";
import StepCard from "@/components/meeting/StepCard";
import SingleSelectGrid from "@/components/ui/SingleSelectGrid";

import {
  FaBook,
  FaMountain,
  FaChessBoard,
  FaCoffee,
  FaDoorClosed,
  FaBeer,
  FaFilm,
  FaShoppingBag,
  FaMicrophone,
} from "react-icons/fa";

const purposeGroups = [
  {
    title: "공부 / 카페",
    items: ["스터디카페", "카페", "룸카페"],
  },
  {
    title: "문화 / 여가",
    items: ["영화관", "쇼핑", "노래방"],
  },
  {
    title: "활동 / 술자리",
    items: ["술집", "클라이밍", "보드게임카페"],
  },
];

const purposeIconMap: Record<string, JSX.Element> = {
  스터디카페: <FaBook size={28} />,
  카페: <FaCoffee size={28} />,
  룸카페: <FaDoorClosed size={28} />,

  영화관: <FaFilm size={28} />,
  쇼핑: <FaShoppingBag size={28} />,
  노래방: <FaMicrophone size={28} />,

  술집: <FaBeer size={28} />,
  클라이밍: <FaMountain size={28} />,
  보드게임카페: <FaChessBoard size={28} />,
};

export default function Step2Page() {
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 2. 모임 목적</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
<<<<<<< HEAD
            목적 선택 버튼 리스트 placeholder
          </p>
        </div>
        <StepCard className="space-y-4">
          <SingleSelectGrid items={purposes} helperText="단일 선택만 가능합니다." />
=======
            모임 목적에 맞는 장소 유형을 선택해 주세요.
            <br />
            선택한 목적에 따라 추천 장소가 달라져요.
          </p>
        </div>

        <StepCard>
          <div className="space-y-6">
            {purposeGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h2 className="text-sm font-semibold">{group.title}</h2>
                <SingleSelectGrid
                  items={group.items}
                  selectedItem={selectedPurpose}
                  onSelect={setSelectedPurpose}
                  iconMap={purposeIconMap}
                />
              </div>
            ))}
          </div>
>>>>>>> origin/main
        </StepCard>
      </main>

      <StepNavigation
        prevHref="/meetings/new/step1-date"
        nextHref="/meetings/new/step3-members"
      />
    </>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> origin/main
}
