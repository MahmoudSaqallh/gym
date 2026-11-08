"use client";

import { useState } from "react";
import { Popover } from "@/components/ui/popover";
import { Ico } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { Glyph } from "../settings/field-ui";

/** Lime 40px page action ("Add client", "Assign"). */
export const coachCta =
  "k-shine inline-flex h-10 flex-none items-center justify-center gap-2 rounded-[12px] bg-lime px-4 text-[14px] leading-5 font-medium whitespace-nowrap text-[var(--on-accent)] transition-[filter,opacity,scale] duration-200 hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100";

export const coachField =
  "w-full rounded-[12px] border border-divider/30 bg-[var(--field)] px-3 text-[14px] leading-5 text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-lime focus:shadow-[0_0_0_3px_rgb(var(--lime-rgb)/0.16)]";

/** Grey pill: "0/4 plan", "Upcoming". */
export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex h-[25.25px] flex-none items-center rounded-full bg-pill px-[10px] text-[11.5px] leading-[17.25px] font-medium whitespace-nowrap text-body", className)}>{children}</span>;
}

export function RequiredLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[14px] leading-5 font-medium text-ink">
      {children}
      <span aria-hidden className="ms-1 text-[#ef4444]">
        *
      </span>
    </label>
  );
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const DAY_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function Calendar({ value, onPick, past }: { value: Date | null; onPick: (d: Date) => void; past?: boolean }) {
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [view, setView] = useState(() => new Date((value ?? today).getFullYear(), (value ?? today).getMonth(), 1));
  const blanks = view.getDay();
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const step = (by: number) => setView(new Date(view.getFullYear(), view.getMonth() + by, 1));
  const atStart = !past && view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  return (
    <div className="w-[284px] p-3">
      <div className="flex items-center justify-between">
        <button type="button" disabled={atStart} onClick={() => step(-1)} aria-label="Previous month" className="grid size-8 place-items-center rounded-[10px] text-body transition-colors hover:bg-row disabled:opacity-30">
          <Glyph name="chevron" size={15} className="rotate-90 rtl:-rotate-90" />
        </button>
        <span className="text-[13.5px] font-medium text-ink">{MONTH_FMT.format(view)}</span>
        <button type="button" onClick={() => step(1)} aria-label="Next month" className="grid size-8 place-items-center rounded-[10px] text-body transition-colors hover:bg-row">
          <Glyph name="chevron" size={15} className="-rotate-90 rtl:rotate-90" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-[10px] leading-5 text-muted">
            {d}
          </span>
        ))}
        {Array.from({ length: blanks }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const d = new Date(view.getFullYear(), view.getMonth(), i + 1);
          const picked = value?.getTime() === d.getTime();
          return (
            <button
              key={i}
              type="button"
              disabled={!past && d < today}
              aria-pressed={picked}
              onClick={() => onPick(d)}
              className={cn(
                "mx-auto grid size-[34px] place-items-center rounded-[10px] text-[13px] tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-30",
                picked ? "bg-lime font-medium text-[var(--on-accent)]" : "text-ink hover:bg-row",
                d.getTime() === today.getTime() && !picked && "font-semibold text-accent-ink",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Day picker: 40px field that opens a month view; past days are disabled unless `past` is set. */
export function DayField({ id, value, onChange, placeholder, past, iso }: { id: string; value: Date | null; onChange: (d: Date) => void; placeholder: string; past?: boolean; iso?: boolean }) {
  return (
    <Popover
      offset={6}
      role="dialog"
      label={placeholder}
      trigger={({ ref, open, toggle }) => (
        <button ref={ref} id={id} type="button" onClick={toggle} aria-expanded={open} aria-haspopup="dialog" className="flex h-10 w-full items-center gap-2 rounded-[12px] border border-divider/30 bg-[var(--field)] px-3 text-[14px] leading-5 transition-[border-color] duration-200 hover:border-lime aria-expanded:border-lime">
          <Ico h="3d922" size={20} />
          <span className={cn("truncate", value ? "text-ink" : "text-muted")}>{value ? (iso ? isoDay(value) : DAY_FMT.format(value)) : placeholder}</span>
        </button>
      )}
    >
      {(close) => (
        <Calendar
          value={value}
          past={past}
          onPick={(d) => {
            onChange(d);
            close();
          }}
        />
      )}
    </Popover>
  );
}

export const dayLabel = (d: Date) => DAY_FMT.format(d);
