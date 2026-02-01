// src/app/meetings/new/step3-members/page.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import StepNavigation from "@/components/layout/StepNavigation";
import Address, { TransportMode } from "@/components/meeting/Step2/Step2Address";
import MeetingAccessBoundary from "@/components/common/MeetingAccessBoundary";
import { useUser } from "@/context/UserContext";

// shadcn/ui
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isOrganizer = meetingData?.organizerId === user?.id;

  const prevHref = `/meetings/new/step1-basic?meetingUuid=${meetingUuid}${
    readonlyParam ? "&readonly=true" : ""
  }`;

  const [openFetchModal, setOpenFetchModal] = useState(false);
  // 1/30[유리] - [가져오기] 버튼 모달 트리거 상태 추가

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

        const myParticipant = data.participants.find((p) => p.userId === user.id);

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

          const newParticipant = updatedData.participants.find((p) => p.userId === user.id);
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
  // 정상 화면
  // =====================
  return (
    <MeetingAccessBoundary meetingUuid={meetingUuid} loading={loading} user={user}>
      <>
        <main className="mx-auto max-w-xl space-y-6">
          {/* ===== Header ===== */}
          <section className="space-y-1">
            <h2 className="text-lg font-semibold text-[var(--text)]">
              출발지와 교통편을 선택하세요
            </h2>
            <p className="text-sm text-[var(--text-subtle)]">
              출발지·교통수단을 설정하세요.
            </p>
          </section>

          <div className="border-b border-[var(--border)]" />
          {/* 1/30[유리] - 카드 느낌 제거 대신 구분선만 추가 */}

          {/* 나의 출발지 입력 / 가져오기 (한 줄 정렬) */}
          <div className="flex items-center justify-between">
            {/* 1/30[유리] - "나의 출발지 입력" + [가져오기] 한 줄(Row) 정렬 */}
            <span className="text-sm font-medium text-[var(--text)]">나의 출발지 입력</span>

            <Button
              type="button"
              onClick={() => setOpenFetchModal(true)}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm text-[var(--text)]"
            >
              가져오기
            </Button>
            {/* 1/30[유리] - [가져오기] 버튼을 모달 트리거로 변경 + rounded-full */}
          </div>

          {/* 주소 입력 */}
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

          <div className="border-b border-[var(--border)]" />
          {/* 1/30[유리] - 메인 콘텐츠 하단 구분선 추가 */}
        </main>

        {/* 1/30[유리] - 콘텐츠와 이전/다음 버튼 간 여백 추가 */}
        <div className="mt-10">
          <StepNavigation
            prevHref={prevHref}
            nextHref={`/meetings/new/step3-result?meetingUuid=${meetingUuid!}`}
            onNext={async () => {
              if (meetingData?.status === "COMPLETED") {
                return `/meetings/new/step3-result?meetingUuid=${meetingUuid!}`;
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
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid!}/participants/${myParticipantId}`,
                {
                  type: transport,
                  originAddress,
                },
                { withCredentials: true }
              );

              return `/meetings/new/step4-result?meetingUuid=${meetingUuid!}`;
            }}
          />
        </div>

        {/* 모달 (오버레이 포함) */}
        {openFetchModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 1/30[유리] - 모달 오픈 시 전체 배경 오버레이(검정 70%) 적용 */}
            <button
              type="button"
              aria-label="모달 닫기"
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpenFetchModal(false)}
            />
            <div className="relative z-10 w-[min(92vw,420px)] rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
              {/* 1/30[유리] - 오버레이 위에 모달 카드가 떠 보이도록 구성 */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text)]">출발지 가져오기</p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setOpenFetchModal(false)}
                >
                  닫기
                </Button>
              </div>

              <div className="mt-3 border-b border-[var(--border)]" />
              {/* 1/30[유리] - 타이틀/내용 구분선 추가 */}

              <div className="mt-3 text-sm text-[var(--text-subtle)]">
                현재 페이지에서는 가져오기 UI만 제공하며, 실제 가져오기 데이터 연결은 별도 구현이 필요합니다.
              </div>
            </div>
          </div>
        ) : null}
      </>
    </MeetingAccessBoundary>
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
