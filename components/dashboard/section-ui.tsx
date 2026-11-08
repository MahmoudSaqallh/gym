"use client";

import { useState } from "react";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Card, CountUp } from "@/components/ui/primitives";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/cn";

/** Section title row: 30px title, muted subtitle, optional right-side control. */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 px-1">
      <div>
        <h1 className="animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_both] text-[26px] leading-[40px] font-semibold text-ink sm:text-[30px]">{title}</h1>
        {subtitle && (
          <p className="mt-[9px] animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_80ms_both] text-[15px] leading-6 text-muted sm:text-[16px]">{subtitle}</p>
        )}
      </div>
      {children && <div className="mt-1 animate-[k-fade_0.6s_ease-out_150ms_both]">{children}</div>}
    </header>
  );
}

/** Rounded-12 select ("Pick a date range" / "Last 7 Days"). */
export function RangeSelect({
  value: initial,
  options,
  onChange,
  icon = "2dd7a",
  className,
}: {
  value: string;
  options: string[];
  onChange?: (v: string) => void;
  icon?: string | null;
  className?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Popover
      offset={6}
      role="listbox"
      label="Pick a date range"
      className="min-w-[165px] py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-[41px] items-center gap-2 rounded-[12px] bg-pill ps-4 pe-4 text-[14px] leading-[21px] font-medium text-body transition-[filter,transform] duration-200 hover:brightness-95 active:scale-[0.98] dark:hover:brightness-125",
            className,
          )}
        >
          {icon && <Ico h={icon} size={16} />}
          <span className="whitespace-nowrap">{value}</span>
          <Ico h="01b73" size={16} className={cn("ms-auto ps-0 transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) =>
        options.map((o, i) => (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={o === value}
            onClick={() => {
              setValue(o);
              onChange?.(o);
              close();
            }}
            className={cn(
              "flex h-9 w-full items-center px-3 text-start text-[14px] leading-5 text-ink transition-colors hover:bg-[var(--menu-hover)]",
              o === value && "font-medium text-accent-ink",
            )}
            style={{ animation: `k-slide-right 0.3s var(--ease-out) ${i * 40}ms both` }}
          >
            {o}
          </button>
        ))
      }
    </Popover>
  );
}

/** Outlined "View All" button used in card headers. */
export function ViewAllButton({ label = "View All", href = "#", className }: { label?: string; href?: string; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-9 flex-none items-center rounded-[12px] border border-divider px-4 text-[14px] leading-[21px] text-body transition-all duration-300 hover:-translate-y-px hover:border-[var(--nav-active-border)] hover:text-accent-ink",
        className,
      )}
    >
      {label}
    </a>
  );
}

/** 96px stat card: chip, label, counted value(s) with units, sub-line, mini bar chart. */
export function MiniStatCard({
  label,
  icon,
  value,
  sub,
  bars,
  delay = 0,
  tone,
}: {
  tone?: "warm";
  label: string;
  icon: string;
  value: { n: number; unit?: string; decimals?: number; plus?: boolean }[];
  sub: React.ReactNode;
  bars: number[]; // 0..1
  delay?: number;
}) {
  const many = bars.length > 8;
  return (
    <Card delay={delay} className="flex h-24 items-center gap-[14px] ps-4 pe-[18px]" aria-label={label}>
      <IcoChip h={icon} size={40} iconSize={25} tone={tone} className="transition-transform duration-500 hover:rotate-[-8deg]" />
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap text-[11.5px] leading-[15.8px] font-semibold text-body">{label}</p>
        <p className="mt-[9px] flex items-baseline gap-[3px] whitespace-nowrap">
          {value.map((v, i) => (
            <span key={i} className="flex items-baseline gap-[3px]">
              {v.plus && <span className="-me-[3px] text-[22px] leading-[22px] font-medium text-ink">+</span>}
              <CountUp value={v.n} decimals={v.decimals} delay={delay + 200} className="text-[22px] leading-[22px] font-medium text-ink" />
              {v.unit && <span className="me-[3px] text-[16px] leading-4 text-muted">{v.unit}</span>}
            </span>
          ))}
        </p>
        <p className="mt-[11.5px] truncate text-[11.5px] leading-[15.8px] font-medium text-muted">{sub}</p>
      </div>
      <div className={cn("flex h-12 flex-none items-end justify-end self-center", many ? "w-[60px] gap-[2px]" : "gap-[3px]")} aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn(
              many ? "w-[3.2px]" : "w-1.5",
              "k-bar rounded-[3px]",
              tone === "warm"
                ? "bg-[linear-gradient(180deg,#d9a400_0%,#b8811a_55%,#3a2a06_100%)]"
                : "bg-[linear-gradient(180deg,var(--lime)_0%,var(--bar-mid)_55%,rgb(var(--lime-rgb)/0.16)_100%)] dark:bg-[linear-gradient(180deg,var(--lime)_0%,var(--bar-mid)_55%,rgb(var(--lime-rgb)/0.14)_100%)]",
            )}
            style={{ height: `${h * 100}%`, "--d": `${delay + 150 + i * 45}ms` } as React.CSSProperties}
          />
        ))}
      </div>
    </Card>
  );
}

/** Card header row: 18px semibold title + optional action. */
export function CardHead({ title, children, className }: { title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="text-[18px] leading-[27px] font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}
