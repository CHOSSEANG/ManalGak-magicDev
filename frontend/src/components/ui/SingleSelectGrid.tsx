"use client";

import { useState } from "react";

interface SingleSelectGridProps {
  items: string[];
  selectedItem?: string | null;
  onSelect?: (item: string) => void;
  iconMap?: Record<string, JSX.Element>;
  helperText?: string;
}

export default function SingleSelectGrid({
  items,
  selectedItem,
  onSelect,
  iconMap,
  helperText,
}: SingleSelectGridProps) {
  // uncontrolled fallback (다른 페이지 대비)
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  const currentSelected =
    selectedItem !== undefined ? selectedItem : internalSelected;

  const handleSelect = (item: string) => {
    if (onSelect) {
      onSelect(item);
    } else {
      setInternalSelected(item);
    }
  };

  return (
    <div className="space-y-3">
      {helperText && (
        <p className="text-sm text-[var(--wf-subtle)]">{helperText}</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const isActive = currentSelected === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => handleSelect(item)}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition
                ${
                  isActive
                    ? "border-[var(--wf-accent)] bg-[var(--wf-accent)] text-white"
                    : "border-[var(--wf-border)] bg-white text-gray-700"
                }`}
            >
              {iconMap?.[item] && (
                <div className={isActive ? "text-white" : "text-gray-500"}>
                  {iconMap[item]}
                </div>
              )}
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
