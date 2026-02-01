// src/components/map/Step2Address.tsx
"use client";

import { useState } from "react";
import { Bus, Car, Bookmark } from "lucide-react";
import WireframeModal from "@/components/ui/WireframeModal";
import AddressSearch from "@/components/map/AddressSearch";
import BookmarkAddressModal from "@/components/map/BookmarkAddressModal";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AddressType = "origin" | "return";
export type TransportMode = "PUBLIC" | "CAR";

interface Step2AddressProps {
  originAddress: string;
  setOriginAddress: (address: string) => void;
  transport: TransportMode | null;
  setTransport: (mode: TransportMode) => void;
  readonly?: boolean; // ⭐ 추가
}

export default function Step2Address({
  originAddress,
  setOriginAddress,
  transport,
  setTransport,
  readonly = false, // ⭐ 추가
}: Step2AddressProps) {
  /** 현재 주소 입력 대상 */
  const [activeAddressType, setActiveAddressType] =
    useState<AddressType | null>(null);

  /** 모달 상태 */
  const [searchAddressOpen, setSearchAddressOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);

  /** 주소 적용 */
  const applyAddress = (address: string) => {
    if (readonly) return; // ⭐ readonly면 차단

    if (activeAddressType === "origin") {
      setOriginAddress(address);
    }

    // 모달 정리
    setSearchAddressOpen(false);
    setBookmarkOpen(false);
    setActiveAddressType(null);
  };

  let inputCursor = "";
  if (readonly) {
    inputCursor = "cursor-not-allowed";
  }

  const getTransportCardClass = (key: TransportMode) => {
    let base =
      "flex w-full items-center justify-center gap-2 rounded-full border py-4 text-normal transition";
    if (transport === key) {
      base += " bg-[var(--neutral-soft)] border-[var(--border)]";
    } else {
      base += " border-[var(--border)]";
    }
    if (readonly) {
      base += " cursor-not-allowed opacity-70";
    }
    return base;
  };

  return (
    <>
      <div className="space-y-4">
        {/* 출발지 */}
        <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">
              나의 출발지 입력
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!readonly && (
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveAddressType("origin");
                    setBookmarkOpen(true);
                  }}
                  className="gap-1 border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                >
                  <Bookmark className="h-3 w-3" />
                  가져오기
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--neutral-soft)] px-3 py-2">
              <input
                type="text"
                value={originAddress}
                onChange={(e) => {
                  if (!readonly) setOriginAddress(e.target.value);
                }}
                placeholder="출발지를 입력해 주세요"
                className={`flex-1 bg-transparent text-sm text-[var(--text)] outline-none ${inputCursor}`}
                disabled={readonly} // ⭐ readonly면 비활성화
              />
              {!readonly && (
                <Button
                  type="button"
                  onClick={() => {
                    setActiveAddressType("origin");
                    setSearchAddressOpen(true);
                  }}
                  variant="outline"
                  className="shrink-0 border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
                >
                  주소 검색
                </Button>
              )}
            </div>
            {/* 이미 출발지가 있고 변경 가능한 경우 안내 문구 표시 */}
            {!readonly && originAddress && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>출발지를 변경하면 추천 장소가 다시 계산됩니다</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* 교통수단 */}
        <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">
              나의 교통수단 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                if (!readonly) setTransport("CAR");
              }}
              disabled={readonly}
              className={getTransportCardClass("CAR")}
            >
              <Car className="h-6 w-6 text-[var(--primary)]" />
              자동차
            </button>

            <button
              type="button"
              onClick={() => {
                if (!readonly) setTransport("PUBLIC");
              }}
              disabled={readonly}
              className={getTransportCardClass("PUBLIC")}
            >
              <Bus className="h-6 w-6 text-[var(--primary)]" />
              대중교통
            </button>
          </CardContent>
        </Card>

        {/* 주소 검색 모달 (readonly면 열리지 않음) */}
        {!readonly && (
          <WireframeModal
            open={searchAddressOpen}
            title="주소 검색"
            onClose={() => {
              setSearchAddressOpen(false);
              setActiveAddressType(null);
            }}
          >
            {activeAddressType && (
              <AddressSearch
                key={`${activeAddressType}-search`}
                onSelect={applyAddress}
              />
            )}
          </WireframeModal>
        )}

        {/* 북마크 모달 (readonly면 열리지 않음) */}
        {!readonly && (
          <BookmarkAddressModal
            open={bookmarkOpen}
            onClose={() => {
              setBookmarkOpen(false);
              setActiveAddressType(null);
            }}
            onSelect={applyAddress}
          />
        )}
      </div>
    </>
  );
}
