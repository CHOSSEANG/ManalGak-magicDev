// src/app/meetings/new/layout.tsx
"use client";

import { Breadcrumb } from "@/components/ui/step-breadcrumb";
import { usePathname } from "next/navigation";

const stepMap: Record<string, number> = {
  "/meetings/new/step1-basic": 1,
  "/meetings/new/step2-members": 2,
  "/meetings/new/step3-meeting": 3,
  "/meetings/new/step4-result": 4,
};

const breadcrumbSteps = (
  pathname: string,
): {
  id: string;
  name: string;
  status: "current" | "complete" | "upcoming";
}[] => [
  {
    id: "01",
    name: "모임생성",
    status:
      pathname === "/meetings/new/step1-basic"
        ? "current"
        : stepMap[pathname] > stepMap["/meetings/new/step1-basic"]
          ? "complete"
          : "upcoming",
  },
  {
    id: "02",
    name: "참여자",
    status:
      pathname === "/meetings/new/step2-members"
        ? "current"
        : stepMap[pathname] > stepMap["/meetings/new/step2-members"]
          ? "complete"
          : "upcoming",
    },
    {
    id: "03",
    name: "출발지",
    status:
      pathname === "/meetings/new/step3-meeting"
        ? "current"
        : stepMap[pathname] > stepMap["/meetings/new/step3-meeting"]
          ? "complete"
          : "upcoming",
  },
  {
    id: "04",
    name: "추천장소",
    status:
      pathname === "/meetings/new/step4-result"
        ? "current"
        : stepMap[pathname] >= stepMap["/meetings/new/step4-result"]
          ? "complete"
          : "upcoming",
  },
];

export default function MeetingsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideProgressBar = pathname === "/meetings/new";

  let progressSection: React.ReactNode = null;
  if (!hideProgressBar) {
    progressSection = (
      <div className="">
          {}

      </div>
    );
  }

  return (
    <div className="space-y-6">
      {progressSection}

     <div className="">
      {!hideProgressBar && (
        <div className="mb-8">
          <Breadcrumb steps={breadcrumbSteps(pathname)} />
        </div>
      )}
        {children}
        </div>
    </div>
  );
}



