// src/components/address/AddressSearch.tsx
// 주소검색 모달은 여기서만 유지합니다
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressSearchProps {
  onSelect: (address: string) => void;
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isEmbeddedRef = useRef(false);

  const embedPostcode = () => {
    if (!window.daum?.Postcode || !containerRef.current) return;
    if (isEmbeddedRef.current) return;

    isEmbeddedRef.current = true;

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const roadAddress = data.roadAddress;
        const jibunAddress = data.jibunAddress;
        onSelect(roadAddress || jibunAddress);
      },
      width: "100%",
      height: "100%",
    }).embed(containerRef.current);
  };

  useEffect(() => {
    // SDK가 이미 로드된 경우 (대부분 여기로 들어옴)
    if (window.daum) {
      embedPostcode();
    }
  }, []);

  return (
    <>
      {/* Daum Postcode SDK (1회 로드) */}
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={embedPostcode}
      />

      <div
        ref={containerRef}
        className="h-[55vh] min-h-[360px] w-full overflow-hidden rounded-xl border border-[var(--wf-border)]"
      />
    </>
  );
}
