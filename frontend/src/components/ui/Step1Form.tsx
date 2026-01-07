"use client";

import { useMemo, useState } from "react";

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

function minutesFromHHMM(t: string) {
  const [hh, mm] = t.split(":").map((v) => parseInt(v, 10));
  return hh * 60 + mm;
}

export default function Step1Form() {
  // 모임명
  const [meetingTitle, setMeetingTitle] = useState("모일각이 처음으로 모임");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(meetingTitle);

  // 날짜
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 시간
  const [startTime, setStartTime] = useState<string | null>(null); // 필수
  const [endTime, setEndTime] = useState<string | null>(null); // 선택
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const dateLabel = useMemo(() => {
    if (!selectedDate) return "날짜를 선택해 주세요";
    return formatKoreanDate(selectedDate);
  }, [selectedDate]);

  const timeLabel = useMemo(() => {
    if (!startTime) return "시작 시간을 선택해 주세요";
    if (!endTime) return `${startTime} ~ 종료 미정`;

    const durMin = minutesFromHHMM(endTime) - minutesFromHHMM(startTime);
    if (durMin > 0) {
      const h = Math.floor(durMin / 60);
      const m = durMin % 60;
      const durText =
        h > 0 && m > 0 ? `${h}시간 ${m}분` : h > 0 ? `${h}시간` : `${m}분`;
      return `${startTime} ~ ${endTime} (${durText})`;
    }
    return `${startTime} ~ ${endTime}`;
  }, [startTime, endTime]);

  const canShowWeather = !!selectedDate && !!startTime;

  // 달력 모달 draft
  const [dateDraft, setDateDraft] = useState<string>(() => {
    const d = selectedDate ?? new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  });

  // 시간 모달 draft
  const [startDraft, setStartDraft] = useState<string>(
    () => startTime ?? "11:30"
  );
  const [endDraft, setEndDraft] = useState<string>(() => endTime ?? "");

  const openCalendar = () => {
    const d = selectedDate ?? new Date();
    setDateDraft(
      `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    );
    setIsCalendarOpen(true);
  };

  const confirmCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [yy, mm, dd] = dateDraft.split("-").map((v) => parseInt(v, 10));
    const picked = new Date(yy, mm - 1, dd);
    picked.setHours(0, 0, 0, 0);

    if (picked < today) return; // 과거 선택 방지
    setSelectedDate(picked);
    setIsCalendarOpen(false);
  };

  const openTimeModal = () => {
    setStartDraft(startTime ?? "11:30");
    setEndDraft(endTime ?? "");
    setIsTimeModalOpen(true);
  };

  const endTimeError = useMemo(() => {
    if (!startDraft || !endDraft) return null;
    return minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft)
      ? "끝 시간은 시작 시간보다 이후여야 해요"
      : null;
  }, [startDraft, endDraft]);

  const confirmTime = () => {
    if (!startDraft) return;
    if (endDraft && minutesFromHHMM(endDraft) <= minutesFromHHMM(startDraft))
      return;

    setStartTime(startDraft);
    setEndTime(endDraft ? endDraft : null);
    setIsTimeModalOpen(false);
  };

  const cancelTitleEdit = () => {
    setTitleDraft(meetingTitle);
    setIsEditingTitle(false);
  };

  const confirmTitleEdit = () => {
    const next = titleDraft.trim();
    if (next.length) setMeetingTitle(next);
    setIsEditingTitle(false);
  };

  return (
    <div className="space-y-6">
      {/* 모임 정보 */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold">모임 정보</h2>

        <div className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4">
          <p className="mb-2 text-sm font-medium">모임명</p>

          {!isEditingTitle ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 rounded-xl bg-white px-4 py-3 text-sm">
                {meetingTitle}
              </div>
              <button
                type="button"
                className="rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white"
                onClick={() => {
                  setTitleDraft(meetingTitle);
                  setIsEditingTitle(true);
                }}
              >
                수정
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                className="flex-1 rounded-xl border border-[var(--wf-border)] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--wf-accent)]"
                placeholder="예) 대학 동기 정기 모임"
                autoFocus
              />
              <button
                type="button"
                className="rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white"
                onClick={confirmTitleEdit}
              >
                완료
              </button>
              <button
                type="button"
                className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-[var(--wf-subtle)]"
                onClick={cancelTitleEdit}
              >
                취소
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 날짜/시간 */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold">만날 날짜와 시간</h2>
        <p className="text-xs text-[var(--wf-subtle)]">
          선택한 날짜 기준으로 서울의 예상 날씨를 보여드려요.
        </p>

        <div className="space-y-4 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4">
          {/* 날짜 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">날짜</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 rounded-xl bg-white px-4 py-3 text-sm">
                {dateLabel}
              </div>
              <button
                type="button"
                className="rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white"
                onClick={openCalendar}
              >
                달력
              </button>
            </div>
          </div>

          {/* 시간 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">시간</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 rounded-xl bg-white px-4 py-3 text-sm">
                {timeLabel}
              </div>
              <button
                type="button"
                className="rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white"
                onClick={openTimeModal}
              >
                시계
              </button>
            </div>
            <p className="text-[11px] text-[var(--wf-subtle)]">
              시작 시간은 필수, 끝 시간은 선택이에요.
            </p>
          </div>
        </div>
      </section>

      {/* 날씨 */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold">
          선택한 날짜의 예상 날씨 (서울)
        </h2>

        <div className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4">
          {!canShowWeather ? (
            <div className="rounded-xl bg-white px-4 py-6 text-center text-sm text-[var(--wf-subtle)]">
              날짜와 시작 시간을 선택하면
              <br />
              해당 날짜의 서울 날씨를 보여드려요.
            </div>
          ) : (
            <div className="rounded-xl bg-white px-4 py-4">
              <p className="text-sm font-medium">
                {selectedDate ? formatKoreanDate(selectedDate) : ""} ·{" "}
                {startTime}
              </p>

              <div className="mt-4 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-4 text-sm text-[var(--wf-subtle)]">
                약속 날짜의 서울 날씨 예보
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 달력 모달 */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold">날짜 선택</h3>
            <p className="mt-1 text-xs text-[var(--wf-subtle)]">
              과거 날짜는 선택할 수 없어요.
            </p>

            <div className="mt-4">
              <input
                type="date"
                value={dateDraft}
                min={`${new Date().getFullYear()}-${pad2(new Date().getMonth() + 1)}-${pad2(
                  new Date().getDate()
                )}`}
                onChange={(e) => setDateDraft(e.target.value)}
                className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[var(--wf-subtle)]"
                onClick={() => setIsCalendarOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white"
                onClick={confirmCalendar}
              >
                선택
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시간 모달 */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold">시간 선택</h3>
            <p className="mt-1 text-xs text-[var(--wf-subtle)]">
              시작 시간은 필수이고, 끝 시간은 선택이에요.
            </p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">시작 시간 (필수)</label>
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
                  className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">끝 시간 (선택)</label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[var(--wf-accent)]"
                    onClick={() => setEndDraft("")}
                  >
                    미정으로 두기
                  </button>
                </div>
                <input
                  type="time"
                  value={endDraft}
                  min={startDraft}
                  onChange={(e) => setEndDraft(e.target.value)}
                  className="w-full rounded-xl border border-[var(--wf-border)] px-4 py-3 text-sm"
                  disabled={!startDraft}
                />
                {endTimeError && (
                  <p className="text-xs text-red-600">{endTimeError}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[var(--wf-subtle)]"
                onClick={() => setIsTimeModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--wf-accent)] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
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
