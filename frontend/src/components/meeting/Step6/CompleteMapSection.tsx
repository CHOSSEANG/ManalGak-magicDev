"use client";

import StepCard from "@/components/meeting/StepCard";
import KakaoMap from "@/components/map/KakaoMap";

interface Props {
  lat: number;
  lng: number;
}

export default function CompleteMapSection({ lat, lng }: Props) {
  return (
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
  );
}
