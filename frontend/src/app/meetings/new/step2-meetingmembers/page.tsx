// src/app/meetings/new/step3-members/page.tsx

import StepNavigation from "@/components/layout/StepNavigation";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import Address from "@/components/meeting/Step2/Step2Address";

export default function Step2Page() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 2. 참여 멤버</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            출발지와 교통수단을 입력하고 참여 멤버들을 확인해보세요!
          </p>
        </div>
        <Address />
        <MemberList />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step1-basic"
        nextHref="/meetings/new/step3-result"
      />
    </>
  );
}
