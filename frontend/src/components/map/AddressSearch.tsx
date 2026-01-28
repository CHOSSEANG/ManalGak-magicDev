// src/components/address/AddressSearch.tsx
// 주소검색 모달은 여기서만 유지합니다
"use client";

// 주소검색 모달은 여기서만 유지합니다

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    daum?: {
      Postcode?: DaumPostcodeConstructor;
    };
  }
}

interface AddressSearchProps {
  onSelect: (address: string) => void;
}

type DaumPostcodeData = {
  roadAddress?: string;
  jibunAddress?: string;
};

type DaumPostcodeConstructor = new (options: {
  oncomplete: (data: DaumPostcodeData) => void;
  width: string;
  height: string;
}) => {
  embed: (container: HTMLElement) => void;
};

export default function AddressSearch({
  onSelect,
}: AddressSearchProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isEmbeddedRef = useRef(false);

  // =====================
  // 다음 주소검색 임베드 (기존 로직 유지)
  // =====================
  const embedPostcode = useCallback((): void => {
    if (!window.daum?.Postcode) return;
    if (!containerRef.current) return;
    if (isEmbeddedRef.current) return;

    isEmbeddedRef.current = true;

    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddress = data.roadAddress;
        const jibunAddress = data.jibunAddress;
        const selectedAddress = roadAddress || jibunAddress;
        if (!selectedAddress) return;

        onSelect(selectedAddress);
      },
      width: "100%",
      height: "100%",
    }).embed(containerRef.current);
  }, [onSelect]);

  useEffect(() => {
    // SDK가 이미 로드된 경우
    if (window.daum) {
      embedPostcode();
    }
  }, [embedPostcode]);

  return (
    <>
      {/* Daum Postcode SDK (1회 로드) */}
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={embedPostcode}
      />

      <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-[var(--text)]">
            출발지 주소 검색
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            도로명 주소 또는 지번 주소를 검색해 선택하세요.
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <div className="relative">
            {/* 임베드 영역 */}
            <div
              ref={containerRef}
              className="h-[55vh] min-h-[360px] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]"
            />

            {/* 로딩 스켈레톤 (임베드 전 시각적 안정용) */}
            {!isEmbeddedRef.current && (
              <div className="absolute inset-0 rounded-xl bg-[var(--bg)] p-4">
                <Skeleton className="h-full w-full rounded-lg bg-[var(--neutral-soft)]" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
