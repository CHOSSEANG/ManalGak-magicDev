// src/components/common/LoginRequired.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginRequired() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">🔒 로그인이 필요해요</h1>
        <p className="text-gray-600 mb-6">
          서비스를 이용하기 위해 먼저 로그인해야 합니다.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
        >
          로그인하러 가기
        </button>
      </div>
    </main>
  );
}
