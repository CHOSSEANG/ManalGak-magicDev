export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          만날각
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          모임 목적에 맞는 중간 만남 장소를 추천해드립니다
        </p>
        <div className="space-x-4">
          <a
            href="/meetings/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            새 모임 만들기
          </a>
        </div>
      </div>
    </main>
  )
}
