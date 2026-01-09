'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StepCard from '@/components/meeting/StepCard'

export default function KakaoCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (!code) return

    // 지금은 콘솔만
    console.log('카카오 인가 코드:', code)

    // 나중에 여기서 백엔드 API 호출
    // fetch('/api/auth/kakao', { method: 'POST', body: JSON.stringify({ code }) })

    // 임시로 다음 단계 이동
    setTimeout(() => {
      router.push('/meetings/new')
    }, 1000)
  }, [router])

  return (
    <main className="space-y-6">
      <StepCard className="space-y-4">
        <h1 className="text-2xl font-semibold">
          카카오 로그인 처리 중
        </h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          카카오 인증 정보를 확인하고 있습니다.
        </p>
      </StepCard>
    </main>
  )
}
