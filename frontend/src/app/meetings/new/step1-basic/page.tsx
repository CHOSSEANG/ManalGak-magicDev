// src/app/meetings/new/step1-basic/page.tsx
"use client";

import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form, { Step1FormRef } from "@/components/meeting/Step1/Step1Form";
import { useUser } from "@/context/UserContext";
import LoginRequired from "@/components/common/LoginRequired";
import { Skeleton } from "@/components/ui/skeleton";

function Step1Content() {
  const { user, loading } = useUser();
  const formRef = useRef<Step1FormRef>(null);
  const searchParams = useSearchParams();
  const readonly = searchParams.get("readonly") === "true";
  const meetingUuid = searchParams.get("meetingUuid") || undefined;

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-[var(--bg)] ">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-6 w-40 bg-[var(--neutral-soft)]" />
          <Skeleton className="h-4 w-72 bg-[var(--neutral-soft)]" />
          <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
          <Skeleton className="h-40 w-full bg-[var(--neutral-soft)]" />
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginRequired />;
  }

  const handleNext = async () => {
    if (readonly) {
      return `/meetings/new/step2-members?meetingUuid=${meetingUuid}&readonly=true`;
    }

    if (!formRef.current) throw new Error("Form ref not found");

    if (!formRef.current.isValid()) {
      alert("모든 필수 정보를 입력해주세요.");
      throw new Error("Validation failed");
    }

    const resultMeetingUuid = await formRef.current.createOrUpdateMeeting();
    if (!resultMeetingUuid) {
      throw new Error("Meeting creation/update failed");
    }

    return `/meetings/new/step2-members?meetingUuid=${resultMeetingUuid}`;
  };


    return (
  <>
    <main className="bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="space-y-4 pb-24">
          <Step1Form
            ref={formRef}
            meetingUuid={meetingUuid}
            readonly={readonly}
          />

          <p className="text-sm text-[var(--text-subtle)] text-center">
            입력 완료 후 다음 단계로 이동하세요.
          </p>
        </section>
      </div>
    </main>

    <StepNavigation
      prevHref="/meetings/new"
      nextHref="/meetings/new/step2-members"
      onNext={handleNext}
    />
  </>
);

      {/* ===== Step Navigation ===== */}

}

export default function Step1BasicPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-[var(--bg)] px-0 py-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-6 w-40 bg-[var(--neutral-soft)]" />
            <Skeleton className="h-4 w-72 bg-[var(--neutral-soft)]" />
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
          </div>
        </main>
      }
    >
      <Step1Content />
    </Suspense>
  );
}
