// src/app/meetings/new/step3-members/page.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Address, { TransportMode } from "@/components/meeting/Step2/Step2Address";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import { Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginRequired from "@/components/common/LoginRequired";

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
  const date = new Date(iso)
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
const sendKakaoInvite = (  meetingUuid: string,
                           meetingName: string,
                           meetingTime: string): void => {
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
function Step2Content(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const { user, loading } = useUser();
  const readonlyParam = searchParams.get("readonly") === "true";
  const prevHref = `/meetings/new/step1-basic?meetingUuid=${meetingUuid}${readonlyParam ? "&readonly=true" : ""}`;

  const [originAddress, setOriginAddress] = useState<string>("");
  const [transport, setTransport] = useState<TransportMode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false); // ⭐ 만료 상태 추가
  const joinedRef = useRef<boolean>(false);

  const isReadonly = meetingData?.status === 'COMPLETED';
  const isOrganizer = meetingData?.organizerId === user?.id;

  /** 모임 조회 + 없으면 participant 생성 */
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
          // ⭐ 이미 참여한 사람은 만료 여부와 관계없이 접근 가능
          setMyParticipantId(myParticipant.participantId);
          if (myParticipant.origin?.address)
            setOriginAddress(myParticipant.origin.address);
          if (myParticipant.transportType)
            setTransport(myParticipant.transportType);
        } else {
          // ⭐ 새로운 참여자의 경우에만 만료 체크
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
            if (newParticipant) setMyParticipantId(newParticipant.participantId);
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
      } catch (e) {
        console.error("모임 조회 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMeeting();
  }, [meetingUuid, user]);

  if (!meetingUuid) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            👋 아직 모임이 없어요
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            먼저 Step1에서 모임을 생성해야 <br />
            Step2/Step3 페이지를 사용할 수 있습니다.
          </p>
          <button
            onClick={() => router.push("/meetings/new/step1-basic")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            Step1로 이동
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    // ⭐ 쿼리 파라미터 전체 포함하여 저장
    const currentUrl = `/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}&readonly=true`;
    localStorage.setItem("loginRedirect", currentUrl);
    return <LoginRequired />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-gray-500">모임 정보를 불러오는 중...</div>
      </div>
    );
  }

  // ⭐ 만료된 모임 카드 UI
  if (isExpired) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            ⏰ 이미 만료된 모임입니다
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            이 모임은 참여 기한이 지나 <br />
            새로운 참여자를 받을 수 없습니다.
          </p>
          <button
            onClick={() => router.push("/meetings/new")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            모임 리스트로 이동
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">참여자 설정</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            멤버를 초대하고, 나의 출발지와 교통정보 & 참석여부를 설정하세요.
          </p>
        </div>

        {/* ⭐ 모임장만 초대 버튼 사용 가능 */}
        <button
          type="button"
          onClick={() => {
            if (!meetingData) return;

            sendKakaoInvite(
              meetingUuid!,
              meetingData.meetingName,
              meetingData.meetingTime
            );
          }}

          disabled={isReadonly || !isOrganizer}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl
            py-4 text-base font-semibold transition-colors
            ${isReadonly || !isOrganizer
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[var(--wf-highlight)] text-[var(--wf-text)] hover:bg-[var(--wf-accent)]'
            }`}
        >
          <Send size={18} />
          {isOrganizer ? '참여 멤버 초대' : '모임장만 멤버를 초대할 수 있어요'}
        </button>

        {!isLoading && (
          <Address
            originAddress={originAddress}
            setOriginAddress={setOriginAddress}
            transport={transport}
            setTransport={setTransport}
            readonly={isReadonly}
          />
        )}

        {isLoading && (
          <div className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-6 text-center text-sm text-[var(--wf-subtle)]">
            정보를 불러오는 중...
          </div>
        )}

        <MemberList
          meetingUuid={meetingUuid}
          userId={user.id}
          onMyParticipantResolved={(id) => {
            if (!myParticipantId) setMyParticipantId(id);
          }}
          readonly={isReadonly}
        />
      </main>

      <StepNavigation
        prevHref={prevHref}
        nextHref={`/meetings/new/step3-result?meetingUuid=${meetingUuid}${readonlyParam ? "&readonly=true" : ""}`}
        onNext={async () => {
          if (meetingData?.status === 'COMPLETED') {
            return `/meetings/new/step3-result?meetingUuid=${meetingUuid}${readonlyParam ? "&readonly=true" : ""}`;
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

          return `/meetings/new/step3-result?meetingUuid=${meetingUuid}${readonlyParam ? "&readonly=true" : ""}`;
        }}
      />
    </>
  );
}

export default function Step2MembersPage(): JSX.Element {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    }>
      <Step2Content />
    </Suspense>
  );
}