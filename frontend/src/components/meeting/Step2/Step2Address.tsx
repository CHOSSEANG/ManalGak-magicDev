"use client";

import { useState } from "react";
import { PersonStanding, Bus, Car, Bookmark } from "lucide-react";
import StepCard from "@/components/meeting/StepCard";
import WireframeModal from "@/components/ui/WireframeModal";
import AddressSearch from "@/components/map/AddressSearch";
import BookmarkAddressModal from "@/components/map/BookmarkAddressModal";

type AddressType = "origin" | "return";
type TransportMode = "walk" | "bus" | "car";

export default function Step2Address() {
  /** 현재 주소 입력 대상 */
  const [activeAddressType, setActiveAddressType] =
    useState<AddressType | null>(null);

  /** 주소 값 */
  const [originAddress, setOriginAddress] = useState("");

  /** 교통수단 */
  // eslint: narrow transport mode type to avoid any
  const [transport, setTransport] = useState<TransportMode | null>(null);

  /** 모달 상태 */
  const [searchAddressOpen, setSearchAddressOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);

  /** 주소 적용 */
  const applyAddress = (address: string) => {
    if (activeAddressType === "origin") {
      setOriginAddress(address);
    }

    // 모달 정리
    setSearchAddressOpen(false);
    setBookmarkOpen(false);
    setActiveAddressType(null);
  };

  return (
    <>
      <div className="space-y-2">
        {/* 출발지 */}
        <StepCard className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">출발지 입력</p>
              <button
                type="button"
                onClick={() => {
                  setActiveAddressType("origin");
                  setBookmarkOpen(true);
                }}
                className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
              >
                <Bookmark className="h-3 w-3" />
                가져오기 &gt;
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-3 py-2">
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="출발지를 입력해 주세요"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setActiveAddressType("origin");
                  setSearchAddressOpen(true);
                }}
                className="shrink-0 rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1.5 text-xs"
              >
                주소 검색
              </button>
            </div>
          </div>

          {/* 교통수단 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">교통수단 선택</p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "walk", label: "도보", icon: PersonStanding },
                { key: "car", label: "자동차", icon: Car },
                { key: "bus", label: "대중교통", icon: Bus },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTransport(key as TransportMode)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-normal transition
                  ${
                    transport === key
                      ? "bg-[var(--wf-highlight)] border-[var(--wf-highlight)]"
                      : "bg-[var(--wf-muted)] border-[var(--wf-border)]"
                  }`}
                >
                  <Icon className="h-6 w-6 text-[var(--wf-accent)]" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </StepCard>

        {/* 주소 검색 모달 (단일 인스턴스) */}
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

        {/* 북마크 모달 */}
        <BookmarkAddressModal
          open={bookmarkOpen}
          onClose={() => {
            setBookmarkOpen(false);
            setActiveAddressType(null);
          }}
          onSelect={applyAddress}
        />
      </div>
    </>
  );
}
