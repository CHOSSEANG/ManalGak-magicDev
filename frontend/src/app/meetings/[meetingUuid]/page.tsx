// 
"use client";

import {
  FiArrowLeft,
  FiBookmark,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

const bookmarkedLocations = [
  { id: 1, name: "우리집", address: "서울 강남구 역삼동 123-45" },
  { id: 2, name: "회사", address: "서울 강남구 테헤란로 521" },
  { id: 3, name: "자주 가는 카페", address: "서울 마포구 연남동 567-89" },
];

const recentAppointments = [
  {
    id: 1,
    title: "강남 저녁 약속",
    date: "2025-01-05",
    location: "서울 용산구",
  },
  {
    id: 2,
    title: "주말 브런치",
    date: "2024-12-28",
    location: "서울 마포구",
  },
  {
    id: 3,
    title: "연말 모임",
    date: "2024-12-31",
    location: "서울 강남구",
  },
];

export default function Page() {
  return (
    <div className="mx-auto h-[600px] w-full max-w-[420px] overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
      <div className="p-4 border-b">
        <button type="button" className="mb-3">
          <FiArrowLeft className="h-6 w-6" />
        </button>
        <h2>마이페이지</h2>
      </div>

      <div className="border-b bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl text-white">
            김
          </div>
          <div>
            <h3>김철수</h3>
            <p className="text-sm text-gray-600">kim@example.com</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FiBookmark className="h-5 w-5 text-blue-600" />
            <h3>북마크한 출발지</h3>
          </div>
          <div className="space-y-2">
            {bookmarkedLocations.map((location) => (
              <div
                key={location.id}
                className="rounded-lg border-2 border-gray-300 p-3"
              >
                <div className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div>
                    <h4 className="mb-1 text-sm">{location.name}</h4>
                    <p className="text-xs text-gray-600">
                      {location.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-lg border-2 border-dashed border-gray-400 py-2 text-sm text-gray-600"
          >
            + 새 장소 추가
          </button>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <FiClock className="h-5 w-5 text-blue-600" />
            <h3>최근 약속 내역</h3>
          </div>
          <div className="space-y-2">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-lg border-2 border-gray-300 p-3"
              >
                <h4 className="mb-2 text-sm">{appointment.title}</h4>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{appointment.date}</span>
                  <span>•</span>
                  <span>{appointment.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3">설정</h3>
          <div className="space-y-2">
            <button
              type="button"
              className="w-full rounded-lg border-2 border-gray-300 p-3 text-left text-sm"
            >
              알림 설정
            </button>
            <button
              type="button"
              className="w-full rounded-lg border-2 border-gray-300 p-3 text-left text-sm"
            >
              개인정보 설정
            </button>
            <button
              type="button"
              className="w-full rounded-lg border-2 border-gray-300 p-3 text-left text-sm text-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
