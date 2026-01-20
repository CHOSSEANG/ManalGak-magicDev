// src/app/meetings/new/step3-members/page.tsx
"use client";

import StepNavigation from "@/components/layout/StepNavigation";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import Address from "@/components/meeting/Step2/Step2Address";
import { Send } from "lucide-react";

const sendKakaoInvite = () => {
  if (typeof window === "undefined") return;

  const { Kakao } = window;

  if (!Kakao) {
    alert("카카오 SDK가 로드되지 않았어요.");
    return;
  }

  if (!Kakao.isInitialized()) {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!kakaoKey) {
      alert("카카오 JS KEY가 설정되지 않았어요.");
      return;
    }
    Kakao.init(kakaoKey);
  }

  // ✅ 카카오 개발자 센터에 등록된 템플릿 사용
  Kakao.Share.sendCustom({
    templateId: 128179,
  });
};

export default function Step3Page() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">참여자 설정</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            멤버를 초대하고, 나의 출발지와 교통정보 & 참석여부를 설정하세요.
          </p>
        </div>

        <button
          onClick={sendKakaoInvite}
          className="flex w-full items-center justify-center gap-2 rounded-2xl
          bg-[var(--wf-highlight)] py-4 text-base font-semibold text-[var(--wf-text)]
          hover:bg-[var(--wf-accent)] disabled:opacity-40"
        >
          <Send size={18} />
          참여 멤버 초대
        </button>

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
