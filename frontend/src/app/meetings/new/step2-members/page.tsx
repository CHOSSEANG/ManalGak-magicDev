// src/app/meetings/new/step2-members/page.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Send } from "lucide-react";

import StepNavigation from "@/components/layout/StepNavigation";
import { TransportMode } from "@/components/meeting/Step2/Step2Address";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import LoginRequired from "@/components/common/LoginRequired";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";
import RequireMeeting from "@/components/common/RequireMeeting";
import { useUser } from "@/context/UserContext";

// shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// =====================
// 타입 / 유틸 (기존 유지)
// =====================
type KakaoShareWithCustom = {
  sendCustom: (params: {
    templateId: number;
    templateArgs?: Record<string, string>;
  }) => void;
};

interface Participant {
  participantId: number;
  meetingId: number;
  status: string;
  nickName: string;
  profileImageUrl: string;
  origin: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  transportType: TransportMode;
  userId: number;
  handicap: boolean;
}

interface MeetingData {
  meetingName: string;
  meetingTime: string;
  endTime: string;
  purpose: string;
  status: string;
  totalParticipants: number;
  organizerId: number;
  meetingUuid: string;
  participants: Participant[];
}

interface ApiResponse {
  data: MeetingData;
  success: boolean;
  error: unknown;
}

const formatMeetingTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sendKakaoInvite = (
  meetingUuid: string,
  meetingName: string,
  meetingTime: string
): void => {
  if (typeof window === "undefined") return;

  const Kakao = window.Kakao;
  if (!Kakao) {
    alert("카카오 SDK가 로드되지 않았어요.");
    return;
  }

  if (!Kakao.isInitialized()) {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!kakaoKey) {
      alert("카카오 JavaScript 키가 설정되지 않았어요.");
      return;
    }
    Kakao.init(kakaoKey);
  }

  const share = Kakao.Share as unknown as KakaoShareWithCustom;

  share.sendCustom({
    templateId: 128179,
    templateArgs: {
      meetingLink: meetingUuid,
      meetingName,
      meetingDate: formatMeetingTime(meetingTime),
    },
  });
};

// =====================
// 메인 콘텐츠
// =====================
function Step3MembersContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const readonlyParam = searchParams.get("readonly") === "true";

  const { user, loading } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const joinedRef = useRef(false);

  const isReadonly = meetingData?.status === "COMPLETED";
  const isOrganizer = meetingData?.organizerId === user?.id;

  const prevHref = `/meetings/new/step1-basic?meetingUuid=${meetingUuid}${
    readonlyParam ? "&readonly=true" : ""
  }`;

  // =====================
  // 모임 조회 + 참여자 생성
  // =====================
  useEffect(() => {
    if (!user || !meetingUuid || joinedRef.current) return;
    joinedRef.current = true;

    const fetchMeeting = async (): Promise<void> => {
      try {
        setIsLoading(true);

        const res = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
          { withCredentials: true }
        );

        const data = res.data.data;
        setMeetingData(data);

        const myParticipant = data.participants.find(
          (p) => p.userId === user.id
        );

        if (myParticipant) {
          setMyParticipantId(myParticipant.participantId);
        } else {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}/participants`,
              null,
              { withCredentials: true }
            );

            const resAfter = await axios.get<ApiResponse>(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
              { withCredentials: true }
            );

            const updatedData = resAfter.data.data;
            setMeetingData(updatedData);

            const newParticipant = updatedData.participants.find(
              (p) => p.userId === user.id
            );
            if (newParticipant) {
              setMyParticipantId(newParticipant.participantId);
            }
          } catch (err: unknown) {
            console.error("참여 생성 실패", err);

            if (axios.isAxiosError(err) && err.response?.status === 400) {
              const errorCode = err.response?.data?.error?.code;

              if (errorCode === "MEETING_EXPIRED") {
                setIsExpired(true);
              }
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMeeting();
  }, [meetingUuid, user]);

  // =====================
  // 예외 케이스 UI
  // =====================
  if (!meetingUuid) return <RequireMeeting />;

  if (loading || isLoading) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-20">
        <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
        <Skeleton className="h-40 w-full rounded-xl bg-[var(--neutral-soft)]" />
      </div>
    );
  }

  if (!user) {
    const currentUrl = `/meetings/new/step2-members?meetingUuid=${meetingUuid}&readonly=true`;
    localStorage.setItem("loginRedirect", currentUrl);
    return <LoginRequired />;
  }

  if (meetingData?.status === "COMPLETED") {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  if (isExpired) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md text-center bg-[var(--bg-soft)] shadow-none">
          {/* 1/30[유리] - 카드 그림자 제거 */}
          <CardHeader>
            <CardTitle>이미 만료된 모임입니다</CardTitle>
            <CardDescription>
              이 모임은 참여 기한이 지났습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/meetings/new")}>
              모임 리스트로 이동
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="mx-auto max-w-xl space-y-6">
        <section>
          <h2 className="text-lg font-semibold">참여자</h2>
          <p className="text-sm text-[var(--text-subtle)]">
            멤버를 초대하세요.
          </p>
        </section>

        <Button
          className="w-full gap-2 py-6 rounded-xl bg-[var(--kakao-yellow)] text-black"
          disabled={isReadonly || !isOrganizer}
          onClick={() => {
            if (!meetingData) return;
            sendKakaoInvite(
              meetingUuid,
              meetingData.meetingName,
              meetingData.meetingTime
            );
          }}
        >
          {/* 1/30[유리] - 카카오 컬러 토큰 적용 */}
          <Send size={18} />
          참여 멤버 초대
        </Button>

        <p className="text-xs text-[var(--text-subtle)]">
          참여자 리스트에는 현재 로그인한 사용자만 표시됩니다.
        </p>
        {/* 1/30[유리] - 참여자 표시 기준 안내 */}

        <Card className="bg-[var(--bg-soft)] shadow-none">
          {/* 1/30[유리] - 교통편/주소 비노출 및 닉네임 중심 안내 */}
          <CardContent className="text-sm text-[var(--text-subtle)]">
            이 단계에서는 닉네임을 기준으로 참여자가 표시됩니다.
          </CardContent>
        </Card>

        <MemberList
          meetingUuid={meetingUuid}
          userId={user.id}
          onMyParticipantResolved={(id) => {
            if (!myParticipantId) setMyParticipantId(id);
          }}
          readonly={isReadonly}
        />
      </main>

      <div className="mt-10">
        {/* 1/30[유리] - 하단 버튼 영역 상단 여백 추가 */}
        <StepNavigation
          prevHref={prevHref}
          nextHref={`/meetings/new/step3-meeting?meetingUuid=${meetingUuid}`}
          onNext={async () => {
            if (!myParticipantId) {
              alert("참여자 정보가 아직 준비되지 않았어요.");
              throw new Error("participantId 없음");
            }
            return `/meetings/new/step3-meeting?meetingUuid=${meetingUuid}`;
          }}
        />
      </div>
    </>
  );
}

// =====================
// Suspense Wrapper
// =====================
export default function Step3MembersPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Skeleton className="h-24 w-64 rounded-xl bg-[var(--neutral-soft)]" />
        </div>
      }
    >
      <Step3MembersContent />
    </Suspense>
  );
}
