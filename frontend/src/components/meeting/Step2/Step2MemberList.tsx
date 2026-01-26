"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import MemberStatusList from "@/components/member/MemberStatusList";

interface MemberListProps {
  meetingUuid: string;
  userId: number;
  onMyParticipantResolved?: (participantId: number) => void;
  readonly?: boolean; // ⭐ 추가
}

export interface Member {
  participantId: number;
  id: string;
  name: string;
  profileImageUrl?: string;
  nickname?: string;
}

// 서버에서 오는 participant 타입
interface ParticipantData {
  participantId: number;
  userId: number;
  nickName: string;
  profileImageUrl?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export default function MemberList({
  meetingUuid,
  userId,
  onMyParticipantResolved,
  readonly = false, // ⭐ 추가
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);

  const myMember: Member | undefined = useMemo(
    () => members.find((m) => m.id === userId.toString()),
    [members, userId],
  );

  // 닉네임 변경 (본인만 가능) - userId로 비교
  const handlePersonalChange = async (
    participantId: number,
    nickname?: string,
  ) => {
    if (readonly) return; // ⭐ readonly면 차단

    const targetMember = members.find((m) => m.participantId === participantId);
    if (!targetMember || targetMember.id !== userId.toString()) {
      console.warn("본인 정보만 변경 가능합니다.");
      return;
    }

    type PersonalUpdatePayload = {
      nickName?: string;
    };

    const payload: PersonalUpdatePayload = {};
    if (nickname !== undefined && nickname.trim() !== "")
      payload.nickName = nickname;

    if (Object.keys(payload).length === 0) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/v1/meetings/${meetingUuid}/participants/${participantId}`,
        payload,
        { withCredentials: true },
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.participantId === participantId
            ? { ...m, ...payload, nickname: payload.nickName ?? m.nickname }
            : m,
        ),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) console.error("본인 변경 실패", err);
    }
  };

  // ✅ 초기 로드 - POST 요청 제거, 조회만 수행
  useEffect(() => {
    if (!meetingUuid || !userId) return;

    const fetchMeeting = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}`,
          { withCredentials: true },
        );
        const data = res.data.data;

        const mapped: Member[] = (
          (data.participants as ParticipantData[]) || []
        ).map((p) => ({
          participantId: p.participantId,
          id: p.userId.toString(),
          name: p.nickName,
          profileImageUrl: p.profileImageUrl,
          nickname: "",
        }));

        const sorted = mapped.sort((a, b) =>
          a.id === userId.toString() ? -1 : b.id === userId.toString() ? 1 : 0,
        );

        setMembers(sorted);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.error("모임 조회 실패", err);
      }
    };

    void fetchMeeting();
  }, [meetingUuid, userId]);

  // 웹소켓 연결 및 실시간 업데이트 (readonly면 연결하지 않음)
  useEffect(() => {
    if (!meetingUuid || readonly) return; // ⭐ readonly면 웹소켓 연결 안 함

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      debug: (msg) => console.log("STOMP:", msg),
      onConnect: () => {
        console.log("웹소켓 연결 성공");

        // 참여자 업데이트 구독
        client.subscribe(
          `/topic/meeting/${meetingUuid}/participants`,
          (message) => {
            if (!message.body) return;

            try {
              const data: ParticipantData = JSON.parse(message.body);
              console.log("참여자 업데이트 수신:", data);

              setMembers((prev) => {
                const exists = prev.find(
                  (m) => m.participantId === data.participantId,
                );

                if (exists) {
                  // 기존 참여자 업데이트 (닉네임 변경)
                  const updated = prev.map((m) =>
                    m.participantId === data.participantId
                      ? {
                          ...m,
                          name: data.nickName,
                          profileImageUrl:
                            data.profileImageUrl ?? m.profileImageUrl,
                        }
                      : m,
                  );

                  // 내 정보 맨 위 유지
                  return updated.sort((a, b) =>
                    a.id === userId.toString()
                      ? -1
                      : b.id === userId.toString()
                        ? 1
                        : 0,
                  );
                } else {
                  // ✅ userId 중복 체크 추가 (같은 userId가 있으면 추가하지 않음)
                  const duplicateByUserId = prev.find(
                    (m) => m.id === data.userId.toString(),
                  );
                  if (duplicateByUserId) {
                    console.log(
                      "이미 존재하는 userId, 추가하지 않음:",
                      data.userId,
                    );
                    return prev;
                  }

                  // 새 참여자 추가
                  const newMember: Member = {
                    participantId: data.participantId,
                    id: data.userId.toString(),
                    name: data.nickName,
                    profileImageUrl: data.profileImageUrl,
                    nickname: "",
                  };

                  return [...prev, newMember].sort((a, b) =>
                    a.id === userId.toString()
                      ? -1
                      : b.id === userId.toString()
                        ? 1
                        : 0,
                  );
                }
              });
            } catch (err) {
              console.error("웹소켓 메시지 파싱 실패:", err);
            }
          },
        );
      },
      onStompError: (frame) => {
        console.error("STOMP 에러:", frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [meetingUuid, userId, readonly]); // ⭐ readonly 의존성 추가

  useEffect(() => {
    if (!myMember?.participantId) return;

    onMyParticipantResolved?.(myMember.participantId);
  }, [myMember, onMyParticipantResolved]);

  const otherMembers = useMemo(
    () => members.filter((m) => m.id !== myMember?.id),
    [members, myMember],
  );

  return (
    <div className="space-y-2">
      <MemberStatusList
        members={myMember ? [myMember, ...otherMembers] : members}
        onPersonalChange={handlePersonalChange}
        currentUserId={userId}
      />
    </div>
  );
}
