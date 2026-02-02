// src/app/meetings/new/step1-basic/page.tsx
"use client";

import { useRef, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form, { Step1FormRef } from "@/components/meeting/Step1/Step1Form";
import { useUser } from "@/context/UserContext";
import LoginRequired from "@/components/common/LoginRequired";
import { Skeleton } from "@/components/ui/skeleton";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";

function Step1Content() {
  const { user, loading } = useUser();
  const formRef = useRef<Step1FormRef>(null);
  const searchParams = useSearchParams();
  const readonlyParam = searchParams.get("readonly") === "true";
  const meetingUuid = searchParams.get("meetingUuid") || undefined;
  const isCopied = searchParams.get("copied") === "true";
  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);
  // ✅ 복사된 모임이 아니고 meetingUuid가 있으면 readonly
  const isReadonly = meetingUuid && !isCopied ? true : readonlyParam;

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-[var(--bg)]">
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

  if (meetingStatus === "COMPLETED" && meetingUuid) {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  const handleNext = async () => {
    if (isReadonly && !isCopied) {
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
          <section className=" pb-24">
            {isCopied && (
              <div className="bg-blue-50 border-y border-blue-200 px-3 py-1">
                <p className="text-sm text-blue-800">
                  📋 <strong>복사된 모임입니다.</strong> <br />모임 목적과 날짜/시간을 수정한 후 저장 해 주세요.
                </p>
              </div>
            )}

            <Step1Form
              ref={formRef}
              meetingUuid={meetingUuid}
              readonly={isReadonly}
              onStatusLoaded={setMeetingStatus}
              isCopied={isCopied} // ✅ 복사 여부 전달
            />

            <p className="text-sm text-[var(--text-subtle)] text-center">
              {isReadonly && !isCopied
                ? "조회 모드입니다. 수정할 수 없습니다."
                : "입력 완료 후 다음 단계로 이동하세요."}
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