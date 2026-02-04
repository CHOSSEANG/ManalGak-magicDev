// src/app/meetings/new/step3-meeting/page.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import LoginRequired from "@/components/common/LoginRequired";
import StepNavigation from "@/components/layout/StepNavigation";
import Address, { TransportMode } from "@/components/meeting/Step3/Step2Address";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";
import { useUser } from "@/context/UserContext";
import RequireMeeting from "@/components/common/RequireMeeting";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import BookmarkAddressModal from "@/components/map/BookmarkAddressModal";


// shadcn/ui
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
  const [initialOriginAddress, setInitialOriginAddress] = useState<string | null>(null);
  const [initialTransport, setInitialTransport] = useState<TransportMode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  const joinedRef = useRef(false);

  const isReadonly = meetingData?.status === "COMPLETED";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isOrganizer = meetingData?.organizerId === user?.id;

  const prevHref = `/meetings/new/step2-members?meetingUuid=${meetingUuid}${
    readonlyParam ? "&readonly=true" : ""
  }`;

  

const [bookmarkOpen, setBookmarkOpen] = useState(false);

const applyAddress = (address: string) => {
  if (isReadonly) return;

  setOriginAddress(address);
  setBookmarkOpen(false);
};


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
          const originValue = myParticipant.origin?.address ?? "";
          setOriginAddress(originValue);
          setInitialOriginAddress(originValue);
          const transportValue = myParticipant.transportType ?? null;
          setTransport(transportValue);
          setInitialTransport(transportValue);
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
    return <RequireMeeting />;
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
    const currentUrl = `/meetings/new/step3-meeting?meetingUuid=${meetingUuid}&readonly=true`;
    localStorage.setItem("loginRedirect", currentUrl);
    return <LoginRequired />;
  }

  if (meetingData?.status === "COMPLETED") {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="
            bg-[var(--bg)]
            border-t border-[var(--border)]
            pb-[var(--bottom-cta-space2)]
          
          "> 
           <div className="mx-auto max-w-3xl space-y-6">
        {/* ===== Header ===== */}
        <section className="my-3 text-center">
          <h2 className="text-lg font-semibold"></h2>
          <p className="text-sm text-[var(--text-subtle)]">
           기본 정보를 입력하세요.
          </p>
          </section>

       

        {/* 나의 출발지 입력 / 가져오기 */}
        <div className="flex items-center justify-between">
          {/* 1/30[유리] - 한 줄(Row) 정렬 */}
          <h3 className="font-medium text-[var(--text)]">
            나의 출발지
          </h3>

          {!isReadonly && (
              <div className="flex items-center justify-end mb-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setBookmarkOpen(true);
                  }}
                  className="gap-3 py-6 px-12 rounded-full  border-[var(--border)] bg-[var(--primary)] text-[var(--primary-soft)]"
                >
                  <Bookmark className="h-3 w-3" />
                  북마크된 주소 가져오기
                </Button>
              </div>
            )}
          {/* 1/30[유리] - 모달 트리거 버튼 + rounded-full */}
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

</div>

      </main>

      {/* 콘텐츠와 이전/다음 버튼 간 여백 */}
              {/* ===== Step Navigation Fixed (하단 고정) ===== */}
      <div className="app-container fixed bottom-[var(--bottom-nav-height)] left-0 right-0 z-20 px-4 pb-safe bg-[var(--bg)]">
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

            const isAddressChanged = originAddress !== (initialOriginAddress ?? "");
            const isTransportChanged = transport !== initialTransport;

            if (isAddressChanged || isTransportChanged) {
              await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}/participants/${myParticipantId}`,
                {
                  type: transport,
                  originAddress,
                },
                { withCredentials: true }
              );
            }

            return `/meetings/new/step4-result?meetingUuid=${meetingUuid}`;
          }}
        />
      </div>

      

      {!isReadonly && (
        <BookmarkAddressModal
          open={bookmarkOpen}
          onClose={() => {
            setBookmarkOpen(false);
          }}
          onSelect={applyAddress}
        />
      )}

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
