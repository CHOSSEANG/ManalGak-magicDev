import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

// eslint: empty interface removed to satisfy lint
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "flex items-center justify-center rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] p-2 text-base font-semibold",
        className
      )}
    >
      {children}
    </button>
  );
}
