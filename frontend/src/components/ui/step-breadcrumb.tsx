"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <nav
      className={cn(
        "p-2 sm:p-3 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 overflow-x-auto scrollbar-hide", //겉바탕
        className,
      )}
      aria-label="Progress"
    >
      <ol
        className={cn(
          "flex w-full min-w-max",
          isMobile ? "flex-col space-y-3" : "items-center justify-between",
        )}
      >
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              "relative",
              !isMobile && stepIdx !== steps.length - 1 && "pr-8 md:pr-16",
            )}
          >
            {!isMobile && stepIdx !== steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-6 left-[28px] right-[-500px] mt-0.5 h-0.5",
                  step.status === "complete"
                    ? "bg-[var(--wf-accent)] dark:bg-green-500" //밑줄
                    : "bg-gray-300 dark:bg-zinc-700",
                )}
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              onClick={() => {
                const basePath =
                  step.id === "01"
                    ? "/meetings/new/step1-basic"
                    : step.id === "02"
                      ? "/meetings/new/step2-meetingmembers"
                      : "/meetings/new/step3-result";

                router.push(
                  queryString ? `${basePath}?${queryString}` : basePath,
                );
              }}
              className={cn(
                "group flex text-left",
                isMobile ? "items-center" : "items-start",
              )}
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
                      ? "text-gray-900 dark:text-zinc-100"
                      : step.status === "current"
                        ? "text-black dark:text-green-500"
                        : "text-gray-500 dark:text-zinc-500",
                  )}
                >
                  {step.name}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
