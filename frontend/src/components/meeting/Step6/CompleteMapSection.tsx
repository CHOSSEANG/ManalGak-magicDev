"use client";

import KakaoMap from "@/components/map/KakaoMap";

interface Props {
  lat?: number;
  lng?: number;
}

export default function CompleteMapSection({ lat, lng }: Props) {
  const hasCoords =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);
  const center = hasCoords ? { lat, lng } : undefined;
  const markers = hasCoords ? [{ lat, lng }] : [];
  return (
    <div className="h-56 rounded-xl border border-[var(--wf-border)] overflow-hidden">
        <KakaoMap
          center={center}
          markers={markers}
          level={4}
        />
      </div>
  );
}
