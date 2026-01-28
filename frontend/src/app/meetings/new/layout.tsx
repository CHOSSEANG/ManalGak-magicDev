"use client";

import { Breadcrumb } from "@/components/ui/step-breadcrumb";
import { usePathname } from "next/navigation";

const stepMap: Record<string, number> = {
  "/meetings/new/step1-basic": 1,
  "/meetings/new/step2-meetingmembers": 2,
  "/meetings/new/step3-result": 3,
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
      pathname === "/meetings/new/step2-meetingmembers"
        ? "current"
        : stepMap[pathname] > stepMap["/meetings/new/step2-meetingmembers"]
          ? "complete"
          : "upcoming",
  },
  {
    id: "03",
    name: "추천장소",
    status:
      pathname === "/meetings/new/step3-result"
        ? "current"
        : stepMap[pathname] >= stepMap["/meetings/new/step3-result"]
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

  return (
    <div className="">
      {!hideProgressBar && (
        <div className="mb-8">
          <Breadcrumb steps={breadcrumbSteps(pathname)} />
        </div>
      )}
      {children}
    </div>
  );
}
