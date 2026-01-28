// src/app/meetings/new/step1-basic/page.tsx
"use client";

import { useRef, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form, { Step1FormRef } from "@/components/meeting/Step1/Step1Form";
import { useUser } from "@/context/UserContext";
import LoginRequired from "@/components/common/LoginRequired";

// shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// useSearchParams를 사용하는 컴포넌트를 분리
function Step1Content() {
  const { user, loading } = useUser();
  const formRef = useRef<Step1FormRef>(null);
  const searchParams = useSearchParams();
  const readonly = searchParams.get("readonly") === "true";

  const meetingUuid = searchParams.get("meetingUuid") || undefined;

  let loadingBlock: ReactNode = null;
  if (loading) {
    loadingBlock = (
      <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">기본 정보 불러오기</CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            데이터를 준비 중입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40 bg-[var(--neutral-soft)]" />
          <Skeleton className="h-6 w-72 bg-[var(--neutral-soft)]" />
          <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] px-4 py-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">{loadingBlock}</div>
      </main>
    );
  }

  if (!user) {
    return <LoginRequired />;
  }

  const handleNext = async () => {
    if (readonly) {
      // 참여자: 수정 API 호출 X
      return `/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}&readonly=true`;
    }

    // 모임장: 기존 로직 그대로
    if (!formRef.current) throw new Error("Form ref not found");

    if (!formRef.current.isValid()) {
      alert("모든 필수 정보를 입력해주세요.");
      throw new Error("Validation failed");
    }

    const resultMeetingUuid = await formRef.current.createOrUpdateMeeting();

    if (!resultMeetingUuid) {
      throw new Error("Meeting creation/update failed");
    }

    return `/meetings/new/step2-meetingmembers?meetingUuid=${resultMeetingUuid}`;
  };

  return (
    <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)]">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <section className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            모임 생성
          </h2>
          <p className="text-sm text-[var(--text-subtle)]">
            모임의 기본 정보와 목적, 일정을 한 번에 설정해 주세요. 선택한 정보에
              맞춰 최적의 장소를 추천해 드립니다.
          </p>
        </section>

        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">입력</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              아래 폼에서 기본 정보를 입력합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="max-h-[60vh] pr-1">
              <div className="space-y-4">
                <Step1Form ref={formRef} meetingUuid={meetingUuid} readonly={readonly} />
              </div>
            </ScrollArea>
            <Separator className="bg-[var(--border)]" />
            <div className="text-sm text-[var(--text-subtle)]">
              입력 완료 후 다음 단계로 이동하세요.
            </div>
          </CardContent>
        </Card>

            <StepNavigation
              prevHref="/meetings/new"
              nextHref="#"
              onNext={handleNext}
            />
      </div>
    </main>
  );
}

// Suspense로 감싸서 export
export default function Step1BasicPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] px-4 py-6">
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
              <CardHeader className="space-y-2">
                <CardTitle className="text-base text-[var(--text)]">
                  기본 정보 불러오기
                </CardTitle>
                <CardDescription className="text-[var(--text-subtle)]">
                  화면을 준비 중입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-40 bg-[var(--neutral-soft)]" />
                <Skeleton className="h-6 w-72 bg-[var(--neutral-soft)]" />
                <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
              </CardContent>
            </Card>
          </div>
        </main>
      }
    >
      <Step1Content />
    </Suspense>
  );
}
