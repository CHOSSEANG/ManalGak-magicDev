import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form from "@/components/meeting/Step1Form";

export default function Step1BasicPage() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 1. 기본 정보</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            모임의 기본 정보와 목적, 일정을 한 번에 설정해 주세요. 선택한 정보에
            맞춰 최적의 장소를 추천해 드립니다.
          </p>
        </div>

        <Step1Form />
      </main>

      {/* 다음 단계는 Step 3 (참여자 입력)로 이동 */}
      <StepNavigation
        prevHref="/meetings/new"
        nextHref="/meetings/new/step3-members"
      />
    </>
  );
}
