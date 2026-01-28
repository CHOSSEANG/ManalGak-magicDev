// src/components/meeting/StepCard.tsx
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface StepCardProps {
  children: ReactNode;
  className?: string;
}

export default function StepCard({ children, className = "" }: StepCardProps) {
  return (
    <Card
      className={[
        "border border-[var(--border)] bg-[var(--bg)]",
        "rounded-2xl",
        className,
      ].join(" ")}
    >
      <CardContent className="p-4 md:p-6">{children}</CardContent>
    </Card>
  );
}
