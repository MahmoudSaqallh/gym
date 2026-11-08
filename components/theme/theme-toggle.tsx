"use client";

import { useTheme } from "./theme-provider";
import { cn } from "@/lib/cn";

/** Moon in light mode, sun in dark mode — icons rotate/scale through the switch. */
export function ThemeToggle({
  lightIcon,
  darkIcon,
  iconSize = 24,
  className,
  style,
}: {
  lightIcon: string;
  darkIcon: string;
  iconSize?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { toggle } = useTheme();
  return (
    <button
      type="button"
      aria-label="Switch between light and dark"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={cn("group relative grid place-items-center overflow-hidden transition-[filter,transform] duration-200 hover:brightness-95 active:scale-95 dark:hover:brightness-125", className)}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lightIcon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="col-start-1 row-start-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 dark:scale-0 dark:rotate-90 dark:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={darkIcon}
        alt=""
        width={iconSize}
        height={iconSize}
        className="col-start-1 row-start-1 scale-0 -rotate-90 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:scale-100 dark:rotate-0 dark:opacity-100 dark:group-hover:rotate-45"
      />
    </button>
  );
}
