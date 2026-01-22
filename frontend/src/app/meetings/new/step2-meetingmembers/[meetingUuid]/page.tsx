// src/app/meetings/new/step3-members/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Address, { TransportMode } from "@/components/meeting/Step2/Step2Address";
import MemberList from "@/components/meeting/Step2/Step2MemberList";
import { Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import axios from "axios";

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

const sendKakaoInvite = (): void => {
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
  });
};

export default function Step3MembersPage(): JSX.Element {
  const params = useParams();
  const meetingUuidParam = params.meetingUuid;

  // ✅ Hook은 무조건 최상단에서 선언
  const [originAddress, setOriginAddress] = useState<string>("");
  const [transport, setTransport] = useState<TransportMode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myParticipantId, setMyParticipantId] = useState<number | null>(null);
  const joinedRef = useRef<boolean>(false);
  const { user } = useUser();

    // 배열 처리 + undefined 처리
    const meetingUuidSafe = Array.isArray(meetingUuidParam)
      ? meetingUuidParam[0]
      : meetingUuidParam;



  /** 모임 조회 + 없으면 participant 생성 */
  useEffect(() => {
    if (!user || joinedRef.current) return;
    joinedRef.current = true;

    const fetchMeeting = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const res = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuidSafe}`,
          { withCredentials: true }
        );

        const data = res.data.data;
        const myParticipant = data.participants.find(
          (p) => p.userId === user.id
        );

        if (myParticipant) {
          setMyParticipantId(myParticipant.participantId);
          if (myParticipant.origin?.address)
            setOriginAddress(myParticipant.origin.address);
          if (myParticipant.transportType)
            setTransport(myParticipant.transportType);
        } else {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuidSafe}/participants`,
              null,
              { withCredentials: true }
            );

            const resAfter = await axios.get<ApiResponse>(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuidSafe}`,
              { withCredentials: true }
            );

            const updatedData = resAfter.data.data;
            const newParticipant = updatedData.participants.find(
              (p) => p.userId === user.id
            );
            if (newParticipant) setMyParticipantId(newParticipant.participantId);
          } catch (err) {
            console.error("참여 생성 실패", err);
          }
        }
      } catch (e) {
        console.error("모임 조회 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMeeting();
  }, [meetingUuidSafe, user]);
 // meetingUuid 없으면 바로 return (Hook 호출 전)
    if (!meetingUuidSafe) {
      return <p>모임 정보를 불러오는 중입니다...</p>;
    }
  if (!user) return <p>로그인 정보를 불러오는 중...</p>;

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
          type="button"
          onClick={sendKakaoInvite}
          className="flex w-full items-center justify-center gap-2 rounded-2xl
          bg-[var(--wf-highlight)] py-4 text-base font-semibold text-[var(--wf-text)]
          hover:bg-[var(--wf-accent)] disabled:opacity-40"
        >
          <Send size={18} />
          참여 멤버 초대
        </button>

        {!isLoading && (
          <Address
            originAddress={originAddress}
            setOriginAddress={setOriginAddress}
            transport={transport}
            setTransport={setTransport}
          />
        )}

        {isLoading && (
          <div className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-6 text-center text-sm text-[var(--wf-subtle)]">
            정보를 불러오는 중...
          </div>
        )}

        <MemberList
          meetingUuid={meetingUuidSafe}
          userId={user.id}
          onMyParticipantResolved={(id) => {
            if (!myParticipantId) setMyParticipantId(id);
          }}
        />
      </main>

      <StepNavigation
        prevHref={`/meetings/new/step1-basic/${meetingUuidSafe}`}
        nextHref={`/meetings/new/step3-result/${meetingUuidSafe}`}
        onNext={async () => {
          if (!myParticipantId) {
            alert("참여자 정보가 아직 준비되지 않았어요.");
            throw new Error("participantId 없음");
          }

          if (!transport || !originAddress) {
            alert("출발지와 이동수단을 입력해주세요.");
            throw new Error("입력값 부족");
          }

          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuidSafe}/participants/${myParticipantId}`,
            {
              type: transport,
              originAddress,
            },
            { withCredentials: true }
          );
        }}
      />
    </>
  );
}
