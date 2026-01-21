"use client";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api/meeting";

import StepNavigation from "@/components/layout/StepNavigation";
import Step5PlaceList from "@/components/meeting/Step3/Step3PlaceList";

export default function Step3ResultPage() {
  const router = useRouter();

  const handleCreateMeeting = async () => {
    try {
      const payload = {
        // ⚠️ 임시값 → 나중에 상태값으로 교체
        title: "테스트 모임",
        date: "2026-01-21",
        time: "18:00",
        purpose: "STUDY",
        members: [
          {
            name: "김규리",
            startAddress: "서울시 강남구",
            latitude: 37.4979,
            longitude: 127.0276,
          },
        ],
        // 장소 확정 스텝이면 여기 들어갈 가능성 큼
        placeId: "uuid-or-id",
      };

      const res = await createMeeting(payload);
      const meetingId = res.meetingId; // ❗ interceptor 때문에 res.data 아님

      router.push(`/meetings/${meetingId}/complete`);
    } catch (e) {
      console.error(e);
      alert("모임 생성 실패");
    }
  };

  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">추천장소 확정</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            참여 멤버들의 중간지점 및 추천 장소를 보여드립니다. 필요시 투표도
            가능합니다
          </p>
        </div>

        <Step5PlaceList />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step2-meetingmembers"
        nextLabel="확정 내용 확인"
        onNext={handleCreateMeeting}
      />
    </>
  );
}
