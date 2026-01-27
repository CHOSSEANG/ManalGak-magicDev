// src/app/meetings/[meetingId]/option-location/page.tsx
"use client";
// import { useState } from "react";
// import { KakaoMap } from "@/components/map/KakaoMap";


export default function OptionRealtimePage() {
  // eslint: setter unused in wireframe screen
  // const [mapLevel] = useState(5);
  // 와이어프레임 단계: 옵션 1
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">지도 서비스</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          지도 서비스 추가 예정(확정된 추천장소 까지의 방향 지도)
        </p>
      </div>

      {/* <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] 
        bg-[var(--wf-muted)] px-4 py-3 hover:bg-[var(--wf-accent)]">
          <span className="text-sm font-semibold">실시간 위치 공유 동의 </span>
          <label className="flex items-center gap-2 text-xs text-[var(--wf-subtle)]">
            <input type="checkbox" className="h-4 w-4" />
            OFF
          </label>
        </div> */}

      {/* 지도 영역만 */}
      <div
        className="h-[60vh] md:h-[60vh] lg:h-[70vh]
         rounded-xl border border-[var(--wf-border)] overflow-hidden"
      >
        {/* <KakaoMap markers={middlePlaceMarkers} level={mapLevel} /> */}
      </div>

    </main>
  );
}
