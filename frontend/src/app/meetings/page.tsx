// @/frontend/src/app/meetings/page.tsx
"use client"

import { Bell, Home, Plus, Settings, User, Users } from "lucide-react"

const desktopMeetings = [
  {
    id: 1,
    name: "대학 동기 모임",
    memberCount: 8,
    appointmentCount: 3,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: 2,
    name: "직장 동료",
    memberCount: 5,
    appointmentCount: 2,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    id: 3,
    name: "축구 동호회",
    memberCount: 12,
    appointmentCount: 5,
    gradient: "from-rose-500 to-rose-600",
  },
  {
    id: 4,
    name: "독서 모임",
    memberCount: 6,
    appointmentCount: 1,
    gradient: "from-blue-500 to-blue-600",
  },
]

const desktopAppointments = [
  {
    id: 1,
    title: "주말 저녁 식사",
    date: "2026-01-10",
    participants: 5,
    status: "진행중",
  },
  {
    id: 2,
    title: "스터디 모임",
    date: "2026-01-15",
    participants: 4,
    status: "계획중",
  },
  {
    id: 3,
    title: "송년회",
    date: "2025-12-30",
    participants: 8,
    status: "완료",
  },
]

const mobileMeetings = [
  { id: 1, name: "대학 동기 모임", memberCount: 8, appointmentCount: 3 },
  { id: 2, name: "회사 동료들", memberCount: 5, appointmentCount: 1 },
  { id: 3, name: "고등학교 친구들", memberCount: 12, appointmentCount: 5 },
]

export default function MeetingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
              <button className="flex items-center gap-3 hover:opacity-80 transition">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl">MeetHub</h1>
                  <p className="text-xs text-purple-100">모임 중간 지점 찾기</p>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="max-w-7xl mx-auto p-8">
              <div className="mb-8">
                <h2 className="text-gray-800 mb-2">내 모임</h2>
                <p className="text-gray-600">
                  참여 중인 모임과 약속을 확인하세요
                </p>
              </div>

              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-700">모임 목록</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    새 모임 만들기
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {desktopMeetings.map((meeting) => (
                    <button
                      key={meeting.id}
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-left"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${meeting.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="mb-3 text-gray-800">{meeting.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>👥 {meeting.memberCount}명</span>
                        <span>📅 {meeting.appointmentCount}건</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-700 mb-6">최근 약속</h3>
                <div className="grid grid-cols-3 gap-4">
                  {desktopAppointments.map((appt) => (
                    <button
                      key={appt.id}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-800">{appt.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            appt.status === "완료"
                              ? "bg-gray-200 text-gray-700"
                              : appt.status === "진행중"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {appt.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        참여자 {appt.participants}명
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-center">
              <h1>모임 중간 지점 찾기 - 와이어프레임</h1>
              <p className="text-xs mt-1 opacity-90">
                기능 흐름 확인용 프로토타입 - 모바일 버전
              </p>
            </div>

            <div className="h-[600px] flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2>내 모임</h2>
                <button className="px-3 py-1 border rounded">
                  마이페이지
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mobileMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-left hover:border-blue-500 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3>{meeting.name}</h3>
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>멤버 {meeting.memberCount}명</div>
                      <div>약속 {meeting.appointmentCount}개</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  새 모임 만들기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
