import { FiPlus, FiUsers } from 'react-icons/fi';

const meetings = [
  { id: 1, name: '대학 동기 모임', members: 8, appointments: 3 },
  { id: 2, name: '회사 동료들', members: 5, appointments: 1 },
  { id: 3, name: '고등학교 친구들', members: 12, appointments: 5 },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] px-4 py-10">
      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <div className="rounded-b-none bg-[#1f5cff] px-6 py-8 text-white">
          <h1 className="text-[22px] font-semibold tracking-[-0.3px]">
            모임 중간 지점 찾기 - 와이어프레임
          </h1>
          <p className="mt-2 text-[14px] text-white/90">
            기능 흐름 확인용 프로토타입 - 모바일 버전
          </p>
        </div>

        <div className="border-b border-[#e3e5ea] px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold text-[#1f1f1f]">내 모임</h2>
            <button
              type="button"
              className="rounded-lg border border-[#e3e5ea] px-4 py-2 text-[14px] text-[#1f1f1f]"
            >
              마이페이지
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {meetings.map((meeting) => (
            <button
              key={meeting.id}
              type="button"
              className="w-full rounded-[18px] border-2 border-[#d3d6dd] px-5 py-5 text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[18px] font-semibold text-[#1f1f1f]">
                    {meeting.name}
                  </div>
                  <div className="mt-3 space-y-2 text-[15px] text-[#4b5563]">
                    <div>멤버 {meeting.members}명</div>
                    <div>약속 {meeting.appointments}개</div>
                  </div>
                </div>
                <FiUsers className="h-6 w-6 text-[#a6adb8]" />
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-[#e3e5ea] px-6 pb-8 pt-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#1f5cff] py-4 text-[16px] font-semibold text-white"
          >
            <FiPlus className="h-5 w-5" />
            새 모임 만들기
          </button>
        </div>
      </div>
    </main>
  );
}
