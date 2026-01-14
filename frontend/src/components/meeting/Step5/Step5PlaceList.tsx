// src/components/meeting/Step5PlaceList.tsx
"use client";

import { useState } from "react";
import StepCard from "@/components/meeting/StepCard";
import { Hand, Expand, ZoomIn, ChevronDown } from "lucide-react";
import WireframeModal from "@/components/ui/WireframeModal";
import MapRangeModal from "@/components/meeting/MapRangeModal";
import MoreRecommendModal from "@/components/meeting/MoreRecommendModal";
import KakaoMap from "@/components/map/KakaoMap";

const isLeader = true; //모임장여부

const members = [
  { id: "u1", name: "이름각", status: "confirmed", handicap: true },
  { id: "u2", name: "이름각", status: "pending", handicap: false },
  { id: "u3", name: "이름각", status: "confirmed", handicap: false },
  { id: "u4", name: "이름각", status: "invited", handicap: true },
  { id: "u5", name: "이름각", status: "pending", handicap: false },
];

const middlePlaces = [
  { id: "p1", name: "중간지점 1", detail: "서울시 중구 어쩌구 저쩌동 12-34" },
  { id: "p2", name: "중간지점 2", detail: "서울시 중구 어쩌구 저쩌동 12-34" },
  { id: "p3", name: "중간지점 3", detail: "서울시 중구 어쩌구 저쩌동 12-34" },
];

const recommendedPlaces = [
  { id: "p1", name: "중간지점 카페", detail: "도보 5분 / 1,200원" },
  { id: "p2", name: "추천 식당 A", detail: "도보 7분 / 2,400원" },
  { id: "p3", name: "추천 식당 B", detail: "도보 10분 / 3,000원" },
  { id: "p4", name: "추천 식당 C", detail: "도보 12분 / 3,500원" },
];

// ✅ Step5용 임시 중간지점 좌표 (백엔드 연결 전)
const middlePlaceMarkers = [{ lat: 37.563617, lng: 126.997628 }];

export default function Step5PlaceList() {
  /** 중간지점 */
  const [confirmedMiddle, setConfirmedMiddle] = useState<string | null>(null);
  const [showMiddleModal, setShowMiddleModal] = useState(false);

  /** 추천장소 */
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({
    r1: 3,
    r2: 2,
    r3: 1,
    r4: 0,
  });
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ================= 지도 + 멤버 ================= */}
      <StepCard className="space-y-3 lg:col-span-2">
        <p className="text-sm font-semibold">지도 영역</p>

        <div className="h-48 rounded-xl border overflow-hidden">
          <KakaoMap markers={middlePlaceMarkers} level={5} />
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex h-16 w-16 flex-col items-center justify-center rounded-xl border bg-[var(--wf-surface)]"
            >
              <div className="relative">
                {m.handicap && (
                  <span className="absolute -top-1 -left-2 flex items-center gap-0.5 rounded-xl bg-yellow-300 px-1.5 py-0.5 text-[9px] font-semibold">
                    <Hand className="h-3 w-3" />
                    핸디캡
                  </span>
                )}
                <div className="h-12 w-12 rounded-xl bg-[var(--wf-muted)]" />
              </div>
              <span className="text-[10px]">{m.name}</span>
            </div>
          ))}
        </div>
      </StepCard>

      {/* ================= 중간지점 ================= */}
      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">중간지점</h2>
          {isLeader && (
            <button
              onClick={() => setShowMiddleModal(true)}
              className="rounded-lg border px-3 py-1 text-xs"
            >
              중간지점 선택
            </button>
          )}
        </div>

        {confirmedMiddle ? (
          <p className="text-sm">
            확정된 중간지점: <strong>{confirmedMiddle}</strong>
          </p>
        ) : (
          <p className="text-xs text-[var(--wf-subtle)]">
            모임장이 중간지점을 선택하면 여기에 표시됩니다.
          </p>
        )}
      </StepCard>

      {/* ================= 추천장소 ================= */}
      <StepCard className="space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천 장소 TOP 3</h2>
          {isLeader && (
            <button
              onClick={() => setShowVoteModal(true)}
              className="rounded-lg border px-3 py-1 text-xs"
            >
              추천장소 투표 열기
            </button>
          )}
        </div>

        <div className="space-y-1">
          {Object.entries(votes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([id, count]) => {
              const place = recommendedPlaces.find((p) => p.id === id);
              if (!place) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-xl border px-4 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold">{place.name}</p>
                    <p className="text-xs text-[var(--wf-subtle)]">
                      {place.detail}
                    </p>
                  </div>
                  <span className="text-xs font-semibold">{count}표</span>
                </div>
              );
            })}
        </div>
      </StepCard>

      {/* ================= 중간지점 선택 모달 ================= */}
      <WireframeModal
        open={showMiddleModal}
        title="중간지점 선택"
        onClose={() => setShowMiddleModal(false)}
      >
        <div className="space-y-2">
          {middlePlaces.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setConfirmedMiddle(p.name);
                setShowMiddleModal(false);
              }}
              className="w-full rounded-xl border px-4 py-2 text-left"
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-[var(--wf-subtle)]">{p.detail}</p>
            </button>
          ))}
        </div>
      </WireframeModal>

      {/* ================= 추천 투표 모달 ================= */}
      <WireframeModal
        open={showVoteModal}
        title="추천 장소 투표"
        onClose={() => setShowVoteModal(false)}
      >
        <div className="space-y-2">
          {recommendedPlaces.map((p) => (
            <button
              key={p.id}
              className="flex w-full justify-between rounded-xl border px-4 py-2"
            >
              <span>{p.name}</span>
              <span className="text-xs">투표</span>
            </button>
          ))}

          <p className="pt-2 text-xs text-[var(--wf-subtle)]">
            ※ 동률 / 재투표 판정은 백엔드에서 처리 예정
          </p>
        </div>
      </WireframeModal>
    </div>
  );
}
