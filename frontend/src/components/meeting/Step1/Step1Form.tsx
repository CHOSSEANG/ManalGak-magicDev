// src/components/meeting/Step1/Step1Form.tsx
"use client";

import {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Utensils, Coffee, Film, Landmark } from "lucide-react";
import axios from "axios";

// -------------------- 유틸리티 함수 --------------------
function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatToLocalISO(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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

// -------------------- 상수 데이터 --------------------
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

// purpose를 API 형식으로 변환 (저장용)
const purposeToApiMap: Record<string, string> = {
  음식점: "DINING",
  카페: "CAFE",
  문화시설: "CULTURE",
  관광명소: "TOUR",
};

// API 형식을 화면 표시용으로 변환 (조회용)
const apiToPurposeMap: Record<string, string> = {
  DINING: "음식점",
  CAFE: "카페",
  CULTURE: "문화시설",
  TOUR: "관광명소",
};

export interface Step1FormRef {
  createOrUpdateMeeting: () => Promise<string | null>;
  isValid: () => boolean;
}

interface Step1FormProps {
  meetingUuid?: string;
  readonly?: boolean;
  onStatusLoaded?: (status: string) => void;
  isCopied?: boolean;
}

const Step1Form = forwardRef<Step1FormRef, Step1FormProps>(
  ({ meetingUuid, readonly = false, onStatusLoaded, isCopied = false }, ref): JSX.Element => {
    // --- 상태 관리 ---
    const [meetingName, setMeetingName] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateDraft, setDateDraft] = useState(() => {
      const d = new Date();
      return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    });
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [startDraft, setStartDraft] = useState<string>("11:30");
    const [endDraft, setEndDraft] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // --- meetingUuid로 모임 정보 조회 (수정 모드) ---
    useEffect(() => {
      if (!meetingUuid) return;

      const fetchMeetingData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
            { withCredentials: true }
          );

          const data = response.data.data;

          if (data.status && onStatusLoaded) {
            onStatusLoaded(data.status);
          }

          // 모임명
          setMeetingName(data.meetingName || "");

          // 모임 목적 (API 형식 → 화면 표시 형식)
          if (data.purpose && apiToPurposeMap[data.purpose]) {
            setSelectedPurpose(apiToPurposeMap[data.purpose]);
          }

          // 날짜 및 시간
          if (data.meetingTime) {
            const meetingDate = new Date(data.meetingTime);

            // 날짜 설정
            const dateOnly = new Date(meetingDate);
            dateOnly.setHours(0, 0, 0, 0);
            setSelectedDate(dateOnly);

            // 시작 시간 설정
            const hours = pad2(meetingDate.getHours());
            const minutes = pad2(meetingDate.getMinutes());
            setStartTime(`${hours}:${minutes}`);
          }

          if (data.endTime) {
            const endDate = new Date(data.endTime);
            setEndTime(`${pad2(endDate.getHours())}:${pad2(endDate.getMinutes())}`);
          } else {
            setEndTime(null);
          }
        } catch (err) {
          console.error("❌ 모임 정보 조회 실패:", err);
          if (axios.isAxiosError(err)) {
            alert(
              `모임 정보를 불러오는데 실패했습니다.\n${
                err.response?.data?.error?.message || err.message
              }`
            );
          } else {
            alert("모임 정보를 불러오는데 실패했습니다.");
          }
        } finally {
          setIsLoading(false);
        }
      };

      void fetchMeetingData();
    }, [meetingUuid, onStatusLoaded]);

    // --- 메모이제이션 ---
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
      if (minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft)) {
        return "종료 시간은 시작 시간보다 늦어야 해요";
      }
      return null;
    }, [startDraft, endDraft]);

    const canShowWeather = !!selectedDate && !!startTime;

    // --- 핸들러 함수 ---
    const openCalendar = () => {
      if (readonly && !isCopied) return;
      const d = selectedDate ?? new Date();
      setDateDraft(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`);
      setIsCalendarOpen(true);
    };

    const confirmCalendar = () => {
      const [yy, mm, dd] = dateDraft.split("-").map((v) => parseInt(v, 10));
      const picked = new Date(yy, mm - 1, dd);
      picked.setHours(0, 0, 0, 0);

      setSelectedDate(picked);
      setIsCalendarOpen(false);
    };

    const openTimeModal = () => {
      if (readonly && !isCopied) return;
      setStartDraft(startTime ?? "11:30");
      setEndDraft(endTime ?? "");
      setIsTimeModalOpen(true);
    };

    const confirmTime = () => {
      if (!startDraft) return;

      if (endDraft && minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft)) {
        return;
      }

      setStartTime(startDraft);
      setEndTime(endDraft || null);
      setIsTimeModalOpen(false);
    };

    // --- 폼 유효성 검사 ---
    const isValid = () => {
      return !!(meetingName && selectedDate && startTime && selectedPurpose);
    };

    // --- 모임 생성 OR 수정 API ---
    const createOrUpdateMeeting = async (): Promise<string | null> => {

      if (meetingUuid && !isCopied) {
        return meetingUuid;
      }

      if (!isValid()) {
        alert("모든 필수 정보를 입력해주세요.");
        return null;
      }

      try {
        const [hh, mm] = startTime!.split(":");
        const meetingDate = new Date(selectedDate!);
        meetingDate.setHours(parseInt(hh, 10));
        meetingDate.setMinutes(parseInt(mm, 10));
        meetingDate.setSeconds(0);
        meetingDate.setMilliseconds(0);

        let endDateFormatted: string | null = null;

        if (endTime) {
          const [eh, em] = endTime.split(":");
          const endDate = new Date(selectedDate!);
          endDate.setHours(parseInt(eh, 10));
          endDate.setMinutes(parseInt(em, 10));
          endDate.setSeconds(0);
          endDate.setMilliseconds(0);

          endDateFormatted = formatToLocalISO(endDate);
        }

        const payload = {
          meetingName,
          meetingTime: formatToLocalISO(meetingDate),
          endTime: endDateFormatted,
          purpose: purposeToApiMap[selectedPurpose!],
        };

        let response;
        if (isCopied && meetingUuid) {
          response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
            payload,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings`,
            payload,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        const resultUuid = response.data.data?.meetingUuid || meetingUuid;
        return resultUuid;
      } catch (err) {
        const action = isCopied ? "수정" : "생성";
        console.error(`❌ 모임 ${action} 실패:`, err);

        if (axios.isAxiosError(err)) {
          alert(
            `모임 ${action}에 실패했습니다.\n${
              err.response?.data?.error?.message || err.message
            }`
          );
        } else {
          alert(`모임 ${action}에 실패했습니다.`);
        }
        return null;
      }
    };

    // ref를 통해 부모 컴포넌트에서 호출 가능하도록 노출
    useImperativeHandle(ref, () => ({
      createOrUpdateMeeting,
      isValid,
    }));

    // 로딩 중일 때
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className=" text-gray-500">모임 정보를 불러오는 중...</div>
        </div>
      );
    }

    const isInputDisabled = readonly && !isCopied;

    return (
      <div className="space-y-2">
        {/* 1. 모임 정보 */}
        <div className="space-y-2">
          <p className="font-semibold text-[var(--text)] pt-3">
            모임 이름{" "}
            <span className="text-[var(--text-subtle)] pl-5 text-xs">
              모임명을 반드시 입력하세요!
            </span>
          </p>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => {
              if (!isInputDisabled) setMeetingName(e.target.value);
            }}
            placeholder="모임명을 입력해 주세요"
            className="w-full font-bold rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 outline-none transition-colors placeholder:text-[var(--text-subtle)] focus:border-[var(--primary)]"
            disabled={isInputDisabled}
          />
        </div>

        {/* 2. 모임 목적 */}
        <div className="space-y-2">
          <p className="font-semibold text-[var(--text)] pt-3">
            모임 목적{" "}
            <span className="text-[var(--text-subtle)] pl-5 text-xs">
              아래 4개의 목적 중 하나를 반드시 선택하세요!
            </span>
          </p>

          <div className="space-y-3 pt-1">
            {purposeGroups.map((group, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map((item) => {
                    const isSelected = selectedPurpose === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (!isInputDisabled) setSelectedPurpose(item);
                        }}
                        disabled={isInputDisabled}
                        className={`
                          flex flex-col items-center justify-center gap-1
                          rounded-xl border px-2 py-3
                          transition-all
                          md:flex-row md:gap-2 md:rounded-full md:px-4
                          ${
                            isSelected
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                              : "bg-[var(--bg)] text-[var(--text-subtle)] border-[var(--border)] hover:bg-[var(--bg-soft)]"
                          }
                          ${isInputDisabled ? "cursor-not-allowed opacity-70" : ""}
                        `}
                      >
                        {/* 아이콘 */}
                        <span
                          className={
                            isSelected
                              ? "text-[var(--primary-foreground)]"
                              : "text-[var(--text-subtle)]"
                          }
                        >
                          {purposeIconMap[item]}
                        </span>

                        {/* 텍스트 */}
                        <span className=" font-medium leading-tight md:text-sm md:leading-none">
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

        {/* 3. 날짜 및 시간 */}
        <p className="font-semibold text-[var(--text)] pt-3">모임 일시</p>
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openCalendar}
              disabled={isInputDisabled}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-left transition-colors hover:bg-[var(--neutral-soft)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`font-medium ${
                  !selectedDate ? "text-[var(--text-subtle)]" : "text-[var(--text)]"
                }`}
              >
                {dateLabel}
              </span>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openTimeModal}
              disabled={isInputDisabled}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-left transition-colors hover:bg-[var(--neutral-soft)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`font-medium ${
                  !startTime ? "text-[var(--text-subtle)]" : "text-[var(--text)]"
                }`}
              >
                {timeLabel}
              </span>
            </button>
          </div>
        </div>

        {/* 4. 예상 날씨 */}
        <p className="font-semibold text-[var(--text)] pt-3">예상 날씨</p>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
          {!canShowWeather ? (
            <div className="flex h-16 items-center justify-center text-xs text-[var(--text-subtle)]">
              날짜와 시작 시간을 선택하면 날씨를 보여드려요
            </div>
          ) : (
            <div className="text-center">
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                서울 예상 날씨: 맑음
              </p>
            </div>
          )}
        </div>

        {/* 모달: 달력 */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--neutral)]/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--bg)] p-5 shadow-lg">
              <h3 className="text-base font-semibold text-[var(--text)]">날짜 선택</h3>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                만날 날짜를 선택해주세요.
              </p>

              <div className="mt-4">
                <input
                  type="date"
                  value={dateDraft}
                  onChange={(e) => setDateDraft(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-[var(--neutral-soft)] px-4 py-3 text-sm font-medium text-[var(--text)]"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)]"
                  onClick={confirmCalendar}
                >
                  선택
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 모달: 시간 */}
        {isTimeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--neutral)]/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-[var(--bg)] p-5 shadow-lg">
              <h3 className="text-base font-semibold text-[var(--text)]">시간 선택</h3>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                시작 시간은 필수, 종료 시간은 선택입니다.
              </p>

              <div className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-subtle)]">
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
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-[var(--text-subtle)]">
                      종료 시간
                    </label>
                    <button
                      type="button"
                      onClick={() => setEndDraft("")}
                      className="text-xs text-[var(--primary)]"
                    >
                      미정으로 설정
                    </button>
                  </div>

                  <input
                    type="time"
                    value={endDraft}
                    min={startDraft}
                    onChange={(e) => setEndDraft(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none disabled:bg-[var(--neutral-soft)]"
                    disabled={!startDraft}
                  />

                  {endTimeError && (
                    <p className="text-xs text-[var(--danger)]">{endTimeError}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-[var(--neutral-soft)] px-4 py-3 text-sm font-medium text-[var(--text)]"
                  onClick={() => setIsTimeModalOpen(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50"
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
);

Step1Form.displayName = "Step1Form";

export default Step1Form;