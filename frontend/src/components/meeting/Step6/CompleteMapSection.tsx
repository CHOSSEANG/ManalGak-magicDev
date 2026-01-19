"use client";

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
            lat,
            lng,
          }}
          markers={[
            {
              lat,
              lng,
            },
          ]}
          level={4}
        />
      </div>
  );
}
