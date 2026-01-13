import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "flex w-full items-center justify-center rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-4 text-base font-semibold",
        className
      )}
    >
      {children}
    </button>
  );
}
