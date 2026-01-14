"use client";

import StepCard from "@/components/meeting/StepCard";
import KakaoMap from "@/components/map/KakaoMap";

interface Props {
  lat: number;
  lng: number;
}

export default function CompleteMapSection({ lat, lng }: Props) {
  return (
    <StepCard className="space-y-3">
      <p className="text-sm font-semibold">확정된 모임 장소</p>
      <div className="h-56 rounded-xl border border-[var(--wf-border)] overflow-hidden">
        <KakaoMap
          center={{
            lat: 37.5489,
            lng: 126.9238,
          }}
          markers={[
            {
              lat: 37.5489,
              lng: 126.9238,
            },
          ]}
          level={4}
        />
      </div>
      {/* 업체 정보 (와이어프레임) */}
      <div className="rounded-xl border border-[var(--wf-border)] p-3 space-y-1 text-sm">
        <p className="font-semibold">이리카페</p>
        <p className="text-[var(--wf-text-secondary)]">
          서울 마포구 와우산로3길 27
        </p>
        <p className="text-[var(--wf-text-secondary)]">02-323-7861</p>
      </div>
    </StepCard>
  );
}
