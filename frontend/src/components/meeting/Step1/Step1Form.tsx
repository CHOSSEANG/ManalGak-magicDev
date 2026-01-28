"use client";

import { useMemo, useState, useImperativeHandle, forwardRef, useEffect } from "react";
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

// function formatKoreanDate(date: Date) {
//   const y = date.getFullYear();
//   const m = date.getMonth() + 1;
//   const d = date.getDate();
//   const days = ["일", "월", "화", "수", "목", "금", "토"];
//   const day = days[date.getDay()];
//   return `${y}. ${m}. ${d}. ${day}요일`;
// }

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
  meetingUuid?: string; // optional: 있으면 수정 모드, 없으면 생성 모드
  readonly?: boolean;
}

const Step1Form = forwardRef<Step1FormRef, Step1FormProps>(({ meetingUuid , readonly = false}, ref) => {
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
        console.log("📥 모임 정보 조회 중... meetingUuid:", meetingUuid);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
          { withCredentials: true }
        );

        const data = response.data.data;
        console.log("✅ 조회된 모임 정보:", data);

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
          alert(`모임 정보를 불러오는데 실패했습니다.\n${err.response?.data?.error?.message || err.message}`);
        } else {
          alert("모임 정보를 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingData();
  }, [meetingUuid]);

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
    return minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft)
      ? "종료 시간은 시작 시간보다 늦어야 해요"
      : null;
  }, [startDraft, endDraft]);

  const canShowWeather = !!selectedDate && !!startTime;

  // --- 핸들러 함수 ---
  const openCalendar = () => {
      if(readonly) return;
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
       if(readonly) return;
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

  // --- 폼 유효성 검사 ---
  const isValid = () => {
    return !!(meetingName && selectedDate && startTime && selectedPurpose);
  };

  // --- 모임 생성 OR 수정 API ---
  const createOrUpdateMeeting = async (): Promise<string | null> => {
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

        endDateFormatted = formatToLocalISO(endDate); // ✅ 수정
      }


    const payload = {
      meetingName,
      meetingTime: formatToLocalISO(meetingDate), // ✅ 수정
           endTime: endDateFormatted,              // ⭐ 여기!!
      purpose: purposeToApiMap[selectedPurpose!],
    };

      let resultMeetingUuid: string;

      // meetingUuid가 있으면 수정(PATCH), 없으면 생성(POST)
      if (meetingUuid) {
        // 수정 모드
        console.log("📝 모임 수정 중... meetingUuid:", meetingUuid);
        console.log("📤 수정 payload:", JSON.stringify(payload, null, 2));

        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings/${meetingUuid}`,
          payload,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log("✅ 수정 성공:", response.data);
        resultMeetingUuid = meetingUuid; // 수정 시에는 기존 meetingUuid 사용

      } else {
        // 생성 모드
        console.log("✨ 모임 생성 중...");
        console.log("📤 생성 payload:", JSON.stringify(payload, null, 2));

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/meetings`,
          payload,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log("✅ 생성 성공:", response.data);
        resultMeetingUuid = response.data.data.meetingUuid;
      }

      return resultMeetingUuid;

    } catch (err) {
      const action = meetingUuid ? "수정" : "생성";
      console.error(`❌ 모임 ${action} 실패:`, err);

      if (axios.isAxiosError(err)) {
        console.error("❌ 에러 응답:", err.response?.data);
        console.error("❌ 에러 상태:", err.response?.status);
        alert(`모임 ${action}에 실패했습니다.\n${err.response?.data?.error?.message || err.message}`);
      } else {
        console.error("❌ 예상치 못한 에러:", err);
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
        <div className="text-sm text-gray-500">모임 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 1. 모임 정보 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-black">모임 정보</p>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => !readonly && setMeetingName(e.target.value)}
            placeholder="모임명을 입력해 주세요"
            className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-gray-400"
            disabled={readonly}
          />
        </div>

        {/* 2. 모임 목적 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-black">모임 목적</p>
          <div className="space-y-3 pt-1">
            {purposeGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                  {group.items.map((item) => {
                    const isSelected = selectedPurpose === item;
                    return (
                      <button
                        key={item}
                        type="button"
                         onClick={() => !readonly && setSelectedPurpose(item)}
                        className={`flex items-center justify-center gap-2 border py-3 rounded-full transition-all ${
                          selectedPurpose === item ? "bg-[var(--wf-highlight)] text-black" : "border-[var(--wf-border)] bg-white text-gray-600 hover:bg-gray-50"
                        } ${readonly ? "cursor-not-allowed opacity-70" : ""}`}
                        disabled={readonly}
                      >
                        <div className={isSelected ? "text-[var(--wf-accent)]" : "text-gray-400"}>
                          {purposeIconMap[item]}
                        </div>
                        <span className="text-[16px] font-medium leading-none">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* 3. 날짜 및 시간 */}
        <p className="text-sm font-semibold text-black">날짜 및 시간</p>
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openCalendar}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500">날짜</span>
              <span className={`text-sm font-medium ${!selectedDate ? "text-gray-400" : ""}`}>{dateLabel}</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={openTimeModal}
              className="flex w-full flex-col items-start gap-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500">시간</span>
              <span className={`text-sm font-medium ${!startTime ? "text-gray-400" : ""}`}>{timeLabel}</span>
            </button>
          </div>
        </div>

      {/* 4. 예상 날씨 */}
        <p className="text-sm font-semibold text-black">예상 날씨</p>
        <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4">
          {!canShowWeather ? (
            <div className="flex h-16 items-center justify-center text-xs text-gray-400">
              날짜와 시작 시간을 선택하면 날씨를 보여드려요
            </div>
          ) : (
            <div className="text-center">
              {/* <p className="text-sm font-medium">
                {formatKoreanDate(selectedDate!)} · {startTime}
              </p> */}
              <p className="mt-1 text-xs text-gray-500">서울 예상 날씨: 맑음</p>
            </div>
          )}
        </div>


      {/* 모달: 달력 */}
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

      {/* 모달: 시간 */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md animate-in rounded-2xl bg-white p-5 shadow-lg sm:zoom-in-95">
            <h3 className="text-base font-semibold">시간 선택</h3>
            <p className="mt-1 text-xs text-black">시작 시간은 필수, 종료 시간은 선택입니다.</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">시작 시간</label>
                <input
                  type="time"
                  value={startDraft}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStartDraft(next);
                    if (endDraft && minutesFromHHMM(endDraft) <= minutesFromHHMM(next)) {
                      setEndDraft("");
                    }
                  }}
                  className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm outline-none focus:border-black"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-xs font-medium text-gray-500">종료 시간</label>
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
                {endTimeError && <p className="text-xs text-red-500">{endTimeError}</p>}
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
});

Step1Form.displayName = "Step1Form";

export default Step1Form;