"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface StepBreadcrumbProps {
  className?: string;
  steps?: Array<{
    id: string;
    name: string;
    status: "complete" | "current" | "upcoming";
  }>;
}

export function Breadcrumb({
  className,
  steps = [
    { id: "01", name: "Cart", status: "complete" },
    { id: "02", name: "Shipping", status: "current" },
    { id: "03", name: "Payment", status: "upcoming" },
    { id: "04", name: "Confirmation", status: "upcoming" },
  ],
}: StepBreadcrumbProps) {
  const router = useRouter();

  return (
    <nav
      className={cn(
        //겉바탕
        "relative p-2 sm:p-3 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100",
        className,
      )}
      aria-label="Progress"
    >
      <div className="absolute left-6 right-1 top-[38px] h-0.5 bg-gray-300" />
      <div
        className="absolute left-4 top-[38px] h-0.5 bg-[var(--wf-accent)]"
        style={{
          width: (() => {
            const currentIndex = steps.findIndex((s) => s.status === "current");
            const safeIndex =
              currentIndex === -1 ? steps.length - 1 : currentIndex;
            const ratio = safeIndex / (steps.length - 1);
            return `calc(${ratio * 100}% - 20px)`;
          })(),
        }}
      />
      <ol className="relative z-10 flex w-full items-start justify-between">
        {steps.map((step) => (
          <li key={step.id} className="relative flex items-start">
            <button
              type="button"
              onClick={() => {
                const basePath =
                  step.id === "01"
                    ? "/meetings/new/step1-basic"
                    : step.id === "02"
                      ? "/meetings/new/step2-members"
                        : step.id === "03"
                           ? "/meetings/new/step3-meeting"
                              : "/meetings/new/step4-result";

                const query =
                  typeof window !== "undefined" ? window.location.search : "";
                router.push(`${basePath}${query}`);
              }}
              className={cn("group flex text-left items-start shrink-0")}
            >
              <span className="flex items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full",
                    step.status === "complete"
                      ? "bg-[var(--wf-accent)] dark:bg-green-500 text-white" //체크
                      : step.status === "current"
                        ? "border-2 border-[var(--wf-accent)] dark:border-green-500 bg-white dark:bg-zinc-900" //동그라미
                        : "border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
                  )}
                >
                  {step.status === "complete" ? (
                    <Check
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <span //숫자
                      className={cn(
                        "text-xs sm:text-sm",
                        step.status === "current"
                          ? "text-black dark:text-green-500"
                          : "text-gray-500 dark:text-zinc-500",
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </span>
              </span>
              <span className="ml-2 mt-0.5 text-xs sm:text-sm">
                <span //내용
                  className={cn(
                    "font-medium",
                    step.status === "complete"
                      ? "text-[var(--wf-accent)] dark:text-zinc-100"
                      : step.status === "current"
                        ? "text-black dark:text-green-500"
                        : "text-gray-500 dark:text-zinc-500",
                  )}
                >
                  {step.name}
                </span>
              </span>
            </button>
            {/* (per-step underline removed) */}
          </li>
        ))}
      </ol>
    </nav>
  );
}
