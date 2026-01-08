// src/app/auth/kakao/callback/page.tsx
// 카카오 로그인 처리 대기 페이지 (FE UI)

'use client'

import StepCard from '@/components/meeting/StepCard'
import Link from 'next/link'

export default function KakaoCallbackPage() {
  return (
    <main className="space-y-6">
      <StepCard className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            카카오 로그인 처리 중
          </h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오 인증 및 사용자 정보 확인을 진행하고 있습니다.
          </p>
        </div>

        <div className="h-40 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />

        <div className="space-y-1 text-sm text-[var(--wf-subtle)]">
          <p>카카오 로그인 - 필수 동의 항목</p>
          <ul className="list-disc pl-4">
            <li>이름</li>
            <li>이메일</li>
            <li>프로필 사진</li>
          </ul>
        </div>
      </StepCard>

      <Link
        href="/meetings/new"
        className="flex w-full items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
      >
        다음 단계로 이동
      </Link>
    </main>
  )
}
