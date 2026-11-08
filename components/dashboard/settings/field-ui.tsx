"use client";

import { Popover } from "@/components/ui/popover";
import { IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";

export const inputClass =
  "h-11 w-full rounded-[12px] border border-divider bg-row px-3 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-lime focus:shadow-[0_0_0_3px_rgb(var(--lime-rgb)/0.16)]";
export const primaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-cta px-5 text-[13.5px] font-semibold text-[var(--on-accent)] transition-[filter,scale] duration-200 hover:brightness-105 active:scale-[0.97]";
export const ghostButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink transition-[filter,scale,opacity] duration-200 hover:brightness-95 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:brightness-125";

/* Stroke icons that inherit the text color. */
const PATHS = {
  user: "M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2",
  shield: "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1-8.5 15a12 12 0 0 1-8.5-15a12 12 0 0 0 8.5-3",
  gear: "M10.3 4.3c.4-1.8 3-1.8 3.4 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.3.8 2.4 2.4a1.7 1.7 0 0 0 1 2.5c1.8.4 1.8 3 0 3.4a1.7 1.7 0 0 0-1 2.6c.9 1.5-.9 3.3-2.4 2.4a1.7 1.7 0 0 0-2.6 1c-.4 1.8-3 1.8-3.4 0a1.7 1.7 0 0 0-2.6-1c-1.5.9-3.3-.9-2.4-2.4a1.7 1.7 0 0 0-1-2.6c-1.8-.4-1.8-3 0-3.4a1.7 1.7 0 0 0 1-2.5c-.9-1.6.9-3.3 2.4-2.4a1.7 1.7 0 0 0 2.6-1.1M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0",
  search: "M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0M21 21l-6-6",
  refresh: "M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",
  chevron: "M6 9l6 6l6-6",
  eye: "M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0M21 12c-2.4 4-5.4 6-9 6s-6.6-2-9-6c2.4-4 5.4-6 9-6s6.6 2 9 6",
  eyeOff: "M10.6 10.6a2 2 0 0 0 2.8 2.8M16.7 16.7A9 9 0 0 1 12 18c-3.6 0-6.6-2-9-6c1.3-2.1 2.7-3.7 4.3-4.7M9.9 6.2A9 9 0 0 1 12 6c3.6 0 6.6 2 9 6c-.7 1.100-1.400 2.100-2.200 3M3 3l18 18",
  camera: "M5 7h1a2 2 0 0 0 2-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2M9 13a3 3 0 1 0 6 0a3 3 0 0 0-6 0",
} as const;

export function Glyph({ name, size = 16, className }: { name: keyof typeof PATHS; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cn("flex-none", className)} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}

export function SectionHead({ chip, title, sub, children }: { chip: React.ReactNode; title: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {chip}
      <div className="min-w-0 flex-1">
        <h2 className="text-[17px] leading-[25px] font-semibold text-ink">{title}</h2>
        <p className="text-[12.5px] leading-[19px] text-muted">{sub}</p>
      </div>
      {children}
    </div>
  );
}

export function HeadChip({ icon }: { icon: string }) {
  return <IcoChip h={icon} size={44} iconSize={26} />;
}

export function Field({ id, label, error, hint, children, className }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-[6px] block text-[13px] leading-5 font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-[5px] animate-[k-fade_0.25s_ease-out] text-[12px] leading-[18px] text-[#ef4444]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-[5px] text-[12px] leading-[18px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export type Option = { value: string; label: string };

export function Select({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  raw = false,
  compact = false,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (v: string) => void;
  raw?: boolean; // option labels are data and stay untranslated
  compact?: boolean; // the 40px page-toned field used on the coach forms
}) {
  const current = options.find((o) => o.value === value);
  return (
    <Popover
      offset={5}
      role="listbox"
      label={label}
      matchWidth
      className="max-h-[260px] overflow-y-auto py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button
          ref={ref}
          id={id}
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-[12px] border px-3 text-[14px] text-ink transition-[border-color] duration-200 hover:border-lime aria-expanded:border-lime",
            compact ? "h-10 border-divider/30 bg-[var(--field)]" : "h-11 border-divider bg-row",
          )}
        >
          <span className={cn("truncate", !current?.value && "text-muted")} translate={raw && current?.value ? "no" : undefined}>
            {current?.value ? current.label : placeholder}
          </span>
          <Glyph name="chevron" size={15} className={cn("text-muted transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) =>
        options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="option"
            aria-selected={o.value === value}
            translate={raw && o.value ? "no" : undefined}
            onClick={() => {
              onChange(o.value);
              close();
            }}
            className={cn("flex h-9 w-full items-center px-3 text-start text-[13.5px] text-ink transition-colors hover:bg-[var(--menu-hover)]", o.value === value && "font-medium text-accent-ink")}
          >
            {o.label}
          </button>
        ))
      }
    </Popover>
  );
}
