// 1/20 회의내용 반영

"use client";

import { useMemo, useState } from "react";
import StepCard from "@/components/meeting/StepCard";


// 아이콘 불러오기 1/20: 율 루시드 아이콘으로 변경 
import { Utensils, Coffee, Film, Landmark } from "lucide-react";


// -------------------- 유틸리티 함수 (기존 로직 이식) --------------------
function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatKoreanDate(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[date.getDay()];
  return `${y}. ${m}. ${d}. ${day}요일`;
}

function formatSimpleDate(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[date.getDay()];
  return `${date.getFullYear()}. ${m}. ${d} (${day})`;
}

function minutesFromHHMM(t: string) {
  const [hh, mm] = t.split(":").map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

// -------------------- 상수 데이터 (모임 목적) --------------------
const purposeGroups = [
  {
    items: ["음식점", "카페", "문화시설", "관광명소"],
  },
];

const purposeIconMap: Record<string, JSX.Element> = {
  음식점: <Utensils size={18} />,
  카페: <Coffee size={18} />,
  문화시설: <Film size={18} />,
  관광명소: <Landmark size={18} />,
};

export default function Step1Form() {
  // --- 상태 관리 ---
  // 1. 모임 정보
  const [meetingName, setMeetingName] = useState("");

  // 2. 모임 목적
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  // 3. 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateDraft, setDateDraft] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  });

  // 4. 시간
  const [startTime, setStartTime] = useState<string | null>(null); // 필수
  const [endTime, setEndTime] = useState<string | null>(null); // 선택
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [startDraft, setStartDraft] = useState<string>("11:30");
  const [endDraft, setEndDraft] = useState<string>("");

  // --- 메모이제이션 (표시 텍스트 계산) ---
  const dateLabel = useMemo(() => {
    if (!selectedDate) return "날짜 선택";
    return formatSimpleDate(selectedDate);
  }, [selectedDate]);

  const timeLabel = useMemo(() => {
    if (!startTime) return "시간 선택";
    if (!endTime) return `${startTime} ~ 종료 미정`;
    return `${startTime} ~ ${endTime}`;
  }, [startTime, endTime]);

  const endTimeError = useMemo(() => {
    if (!startDraft || !endDraft) return null;
    return minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft)
      ? "종료 시간은 시작 시간보다 늦어야 해요"
      : null;
  }, [startDraft, endDraft]);

  const canShowWeather = !!selectedDate && !!startTime;

  // --- 핸들러 함수 ---
  const openCalendar = () => {
    const d = selectedDate ?? new Date();
    setDateDraft(
      `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    );
    setIsCalendarOpen(true);
  };

  const confirmCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [yy, mm, dd] = dateDraft.split("-").map((v) => parseInt(v, 10));
    const picked = new Date(yy, mm - 1, dd);
    picked.setHours(0, 0, 0, 0);

    // if (picked < today) return; // (옵션) 과거 날짜 방지 필요 시 주석 해제
    setSelectedDate(picked);
    setIsCalendarOpen(false);
  };

  const openTimeModal = () => {
    setStartDraft(startTime ?? "11:30");
    setEndDraft(endTime ?? "");
    setIsTimeModalOpen(true);
  };

  const confirmTime = () => {
    if (!startDraft) return;
    if (endDraft && minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft))
      return;

    setStartTime(startDraft);
    setEndTime(endDraft || null);
    setIsTimeModalOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* 1. 모임 정보 (모임명 입력) */}
      <StepCard className="space-y-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-black">모임 정보</p>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="모임명을 입력해 주세요"
            className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-400"
          />
        </div>


      {/* 2. 모임 목적 (컴팩트 버전) */}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-black">모임 목적</p>
          <div className="space-y-3 pt-1">
            {purposeGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {/* 직접 그리드 구현으로 높이/패딩 최소화 */}
                <div className="grid gap-2  grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                  {group.items.map((item) => {
                    const isSelected = selectedPurpose === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedPurpose(item)}
                        className={`flex items-center justify-center gap-2 border py-3 rounded-full  transition-all ${
                          isSelected
                            ? "bg-[var(--wf-highlight)] text-black "
                            : "border-[var(--wf-border)] bg-white text-gray-600 hover:bg-gray-50"

                        }`}
                      >
                        <div
                          className={
                            isSelected
                              ? "text-[var(--wf-accent)]"
                              : "text-gray-400"
                          }
                        >
                          {purposeIconMap[item]}
                        </div>
                        <span className="text-[16px] font-medium leading-none">
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </StepCard>

      {/* 3. 날짜 및 시간 (가로 배치 & 로직 연결) */}
      <StepCard className="space-y-2">
        <p className="text-sm font-semibold text-black">날짜 및 시간</p>

        <div className="flex gap-2">
          {/* 날짜 버튼 */}
          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openCalendar}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500">날짜</span>
              <span
                className={`text-sm font-medium ${!selectedDate ? "text-gray-400" : ""}`}
              >
                {dateLabel}
              </span>
            </button>
          </div>

          {/* 시간 버튼 */}
          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openTimeModal}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500">시간</span>
              <span
                className={`text-sm font-medium ${!startTime ? "text-gray-400" : ""}`}
              >
                {timeLabel}
              </span>
            </button>
          </div>
        </div>
      </StepCard>

      {/* 4. 예상 날씨 */}
      <StepCard className="space-y-2">
        <p className="text-sm font-semibold text-black">예상 날씨</p>
        <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4">
          {!canShowWeather ? (
            <div className="flex h-16 items-center justify-center text-xs text-gray-400">
              날짜와 시작 시간을 선택하면 날씨를 보여드려요
            </div>
          ) : (
            // 날씨 정보가 있을 때 (더미 표시)
            <div className="text-center">
              <p className="text-sm font-medium">
                {formatKoreanDate(selectedDate!)} · {startTime}
              </p>
              <p className="mt-1 text-xs text-gray-500">서울 예상 날씨: 맑음</p>
            </div>
          )}
        </div>
      </StepCard>

      {/* --- 모달 구현부 (직접 구현하여 WireframeModal 의존성 제거 및 커스텀 로직 적용) --- */}

      {/* 1. 달력 모달 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-in rounded-2xl bg-white p-5 shadow-lg sm:zoom-in-95">
            <h3 className="text-base font-semibold">날짜 선택</h3>
            <p className="mt-1 text-xs text-black">만날 날짜를 선택해주세요.</p>

            <div className="mt-4">
              <input
                type="date"
                value={dateDraft}
                onChange={(e) => setDateDraft(e.target.value)}
                className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200"
                onClick={() => setIsCalendarOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white hover:opacity-90"
                onClick={confirmCalendar}
              >
                선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 시간 모달 */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-in rounded-2xl bg-white p-5 shadow-lg sm:zoom-in-95">
            <h3 className="text-base font-semibold">시간 선택</h3>
            <p className="mt-1 text-xs text-black">
              시작 시간은 필수, 종료 시간은 선택입니다.
            </p>

            <div className="mt-4 space-y-4">
              {/* 시작 시간 */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={startDraft}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStartDraft(next);
                    if (
                      endDraft &&
                      minutesFromHHMM(endDraft) <= minutesFromHHMM(next)
                    ) {
                      setEndDraft("");
                    }
                  }}
                  className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm outline-none focus:border-black"
                  required
                />
              </div>

              {/* 종료 시간 */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-medium text-gray-500">
                    종료 시간
                  </label>
                  <button
                    type="button"
                    onClick={() => setEndDraft("")}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    미정으로 설정
                  </button>
                </div>
                <input
                  type="time"
                  value={endDraft}
                  min={startDraft}
                  onChange={(e) => setEndDraft(e.target.value)}
                  className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-100"
                  disabled={!startDraft}
                />
                {endTimeError && (
                  <p className="text-xs text-red-500">{endTimeError}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200"
                onClick={() => setIsTimeModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                onClick={confirmTime}
                disabled={!startDraft || !!endTimeError}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
