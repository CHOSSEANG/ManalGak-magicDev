// src/app/meetings/new/step2-meetingmembers/page.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Send } from "lucide-react";

import StepNavigation from "@/components/layout/StepNavigation";
import Address, { TransportMode } from "@/components/meeting/Step2/Step2Address";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import LoginRequired from "@/components/common/LoginRequired";
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

  const [originAddress, setOriginAddress] = useState("");
  const [transport, setTransport] = useState<TransportMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

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
          if (myParticipant.origin?.address) {
            setOriginAddress(myParticipant.origin.address);
          }
          if (myParticipant.transportType) {
            setTransport(myParticipant.transportType);
          }
        } else {
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
        }
      } catch (e) {
        console.error("모임 조회 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMeeting();
  }, [meetingUuid, user]);

  // =====================
  // 예외 케이스 UI
  // =====================
  if (!meetingUuid) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              아직 모임이 없어요
            </CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              Step1에서 모임을 생성해야 다음 단계를 진행할 수 있어요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              onClick={() => router.push("/meetings/new/step1-basic")}
            >
              Step1로 이동
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-20">
        <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
        <Skeleton className="h-40 w-full rounded-xl bg-[var(--neutral-soft)]" />
      </div>
    );
  }

  if (!user) {
    const currentUrl = `/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}&readonly=true`;
    localStorage.setItem("loginRedirect", currentUrl);
    return <LoginRequired />;
  }

  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="mx-auto max-w-xl space-y-6 pb-28">
        {/* 헤더 */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              참여자 설정
            </CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              멤버를 초대하고 출발지·교통수단을 설정하세요.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 초대 CTA */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="pt-6">
            <Button
              className="w-full gap-2 bg-[var(--primary)] text-[var(--primary-foreground)]"
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
              <Send size={18} />
              {isOrganizer
                ? "참여 멤버 초대"
                : "모임장만 멤버를 초대할 수 있어요"}
            </Button>
          </CardContent>
        </Card>

        {/* 주소 입력 */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="pt-6">
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl bg-[var(--neutral-soft)]" />
            ) : (
              <Address
                originAddress={originAddress}
                setOriginAddress={setOriginAddress}
                transport={transport}
                setTransport={setTransport}
                readonly={isReadonly}
              />
            )}
          </CardContent>
        </Card>

        {/* 멤버 리스트 */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="pt-6">
            <MemberList
              meetingUuid={meetingUuid}
              userId={user.id}
              onMyParticipantResolved={(id) => {
                if (!myParticipantId) {
                  setMyParticipantId(id);
                }
              }}
              readonly={isReadonly}
            />
          </CardContent>
        </Card>
      </main>

      <StepNavigation
        prevHref={prevHref}
        nextHref={`/meetings/new/step3-result?meetingUuid=${meetingUuid}`}
        onNext={async () => {
          if (meetingData?.status === "COMPLETED") {
            return `/meetings/new/step3-result?meetingUuid=${meetingUuid}`;
          }

          if (!myParticipantId) {
            alert("참여자 정보가 아직 준비되지 않았어요.");
            throw new Error("participantId 없음");
          }

          if (!transport || !originAddress) {
            alert("출발지와 이동수단을 입력해주세요.");
            throw new Error("입력값 부족");
          }

          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}/participants/${myParticipantId}`,
            {
              type: transport,
              originAddress,
            },
            { withCredentials: true }
          );

          return `/meetings/new/step3-result?meetingUuid=${meetingUuid}`;
        }}
      />
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
