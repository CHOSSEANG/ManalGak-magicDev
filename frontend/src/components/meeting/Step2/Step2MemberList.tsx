'use client';

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import MemberStatusList from "@/components/member/MemberStatusList";

interface MemberListProps {
  meetingUuid: string;
  userId: number;
  onMyParticipantResolved?: (participantId: number) => void;
}

export type MemberStatus = "CONFIRMED" | "INVITED" | "DECLINED";

export interface Member {
  participantId: number;
  id: string;
  name: string;
  status: MemberStatus;
  profileImageUrl?: string;
  handicap?: boolean;
  nickname?: string;
}

// 서버에서 오는 participant 타입
interface ParticipantData {
  participantId: number;
  userId: number;
  nickName: string;
  status: MemberStatus;
  profileImageUrl?: string;
  handicap?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export default function MemberList({
  meetingUuid,
  userId,
  onMyParticipantResolved,
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [organizerId, setOrganizerId] = useState<number | null>(null);

  const myMember: Member | undefined = useMemo(
    () => members.find(m => m.id === userId.toString()),
    [members, userId]
  );

  const isOrganizer = useMemo(() => organizerId === userId, [organizerId, userId]);

  // 상태 변경 권한 체크 함수
  const canChangeStatus = (targetMemberId: string) => {
    return isOrganizer || targetMemberId === userId.toString();
  };

  // 핸디캡 변경 권한 체크 함수
  const canChangeHandicap = (targetMemberId: string) => {
    return targetMemberId === userId.toString();
  };

  // 참여자 상태 변경 - id(userId)로 participantId 찾아서 전송
  const handleStatusChange = async (id: string, status: MemberStatus) => {
    // 권한 체크
    if (!canChangeStatus(id)) {
      console.warn("상태 변경 권한이 없습니다.");
      return;
    }

    const member = members.find(m => m.id === id);
    if (!member) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/v1/meetings/${meetingUuid}/participants/${member.participantId}`,
        { status },
        { withCredentials: true }
      );
      setMembers(prev =>
        prev.map(m => m.id === id ? { ...m, status } : m)
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) console.error("상태 변경 실패", err);
    }
  };

  // 핸디캡/닉네임 변경 (본인만 가능) - userId로 비교
  const handlePersonalChange = async (
    participantId: number,
    handicap?: boolean,
    nickname?: string
  ) => {
    const targetMember = members.find(m => m.participantId === participantId);
    if (!targetMember || targetMember.id !== userId.toString()) {
      console.warn("본인 정보만 변경 가능합니다.");
      return;
    }

    type PersonalUpdatePayload = {
      handicap?: boolean;
      nickName?: string;
    };

    const payload: PersonalUpdatePayload = {};
    if (handicap !== undefined) payload.handicap = handicap;
    if (nickname !== undefined && nickname.trim() !== "") payload.nickName = nickname;

    if (Object.keys(payload).length === 0) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/v1/meetings/${meetingUuid}/participants/${participantId}`,
        payload,
        { withCredentials: true }
      );

      setMembers(prev =>
        prev.map(m =>
          m.participantId === participantId
            ? { ...m, ...payload, nickname: payload.nickName ?? m.nickname }
            : m
        )
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
        const res = await axios.get(`${API_BASE_URL}/v1/meetings/${meetingUuid}`, { withCredentials: true });
        const data = res.data.data;

        setOrganizerId(data.organizerId);

        const mapped: Member[] = (data.participants as ParticipantData[] || []).map(p => ({
          participantId: p.participantId,
          id: p.userId.toString(),
          name: p.nickName,
          status: p.status,
          profileImageUrl: p.profileImageUrl,
          handicap: p.handicap,
          nickname: ""
        }));

        const sorted = mapped.sort((a, b) =>
          a.id === userId.toString() ? -1 : b.id === userId.toString() ? 1 : 0
        );

        setMembers(sorted);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.error("모임 조회 실패", err);
      }
    };

    void fetchMeeting();
  }, [meetingUuid, userId]);

  // 웹소켓 연결 및 실시간 업데이트
  useEffect(() => {
    if (!meetingUuid) return;

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
                const exists = prev.find((m) => m.participantId === data.participantId);

                if (exists) {
                  // 기존 참여자 업데이트 (상태, 핸디캡, 닉네임 변경)
                  const updated = prev.map((m) =>
                    m.participantId === data.participantId
                      ? {
                          ...m,
                          name: data.nickName,
                          status: data.status,
                          profileImageUrl: data.profileImageUrl ?? m.profileImageUrl,
                          handicap: data.handicap ?? m.handicap,
                        }
                      : m
                  );

                  // 내 정보 맨 위 유지
                  return updated.sort((a, b) =>
                    a.id === userId.toString() ? -1 : b.id === userId.toString() ? 1 : 0
                  );
                } else {
                  // ✅ userId 중복 체크 추가 (같은 userId가 있으면 추가하지 않음)
                  const duplicateByUserId = prev.find((m) => m.id === data.userId.toString());
                  if (duplicateByUserId) {
                    console.log("이미 존재하는 userId, 추가하지 않음:", data.userId);
                    return prev;
                  }

                  // 새 참여자 추가
                  const newMember: Member = {
                    participantId: data.participantId,
                    id: data.userId.toString(),
                    name: data.nickName,
                    status: data.status,
                    profileImageUrl: data.profileImageUrl,
                    handicap: data.handicap ?? false,
                    nickname: ""
                  };

                  return [...prev, newMember].sort((a, b) =>
                    a.id === userId.toString() ? -1 : b.id === userId.toString() ? 1 : 0
                  );
                }
              });
            } catch (err) {
              console.error("웹소켓 메시지 파싱 실패:", err);
            }
          }
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
  }, [meetingUuid, userId]);

  useEffect(() => {
    if (!myMember?.participantId) return;

    onMyParticipantResolved?.(myMember.participantId);
  }, [myMember, onMyParticipantResolved]);

  const otherMembers = useMemo(() => members.filter(m => m.id !== myMember?.id), [members, myMember]);

  return (
    <div className="space-y-2">
      <MemberStatusList
        members={myMember ? [myMember, ...otherMembers] : members}
        onStatusChange={handleStatusChange}
        onPersonalChange={handlePersonalChange}
        currentUserId={userId}
        organizerId={organizerId}
        canChangeStatus={canChangeStatus}
        canChangeHandicap={canChangeHandicap}
      />
    </div>
  );
}