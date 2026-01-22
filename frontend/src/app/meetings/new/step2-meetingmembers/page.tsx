// src/app/meetings/new/step3-members/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function Step3MembersNoUuid() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          👋 아직 모임이 없어요
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          먼저 Step1에서 모임을 생성해야 <br />
          Step2/Step3 페이지를 사용할 수 있습니다.
        </p>
        <button
          onClick={() => router.push("/meetings/new/step1-basic")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
        >
          Step1로 이동
        </button>
      </div>
    </main>
  );
}
