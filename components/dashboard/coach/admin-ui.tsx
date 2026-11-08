"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Popover } from "@/components/ui/popover";
import { Ico } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { Select } from "../settings/field-ui";
import { coachField, DayField } from "./coach-ui";

/** Small 32px lime action used in the admin page headers and filter bars. */
export const smallCta =
  "k-shine inline-flex h-8 flex-none items-center justify-center gap-2 rounded-[12px] bg-lime px-3 text-[12px] leading-4 font-medium whitespace-nowrap text-[var(--on-accent)] transition-[filter,scale] duration-200 hover:brightness-105 active:scale-[0.97]";
export const smallGhost =
  "inline-flex h-8 flex-none items-center justify-center gap-2 rounded-[12px] border border-divider px-3 text-[12px] leading-4 font-medium whitespace-nowrap text-ink transition-[background-color,scale] duration-200 hover:bg-row active:scale-[0.97]";

export type Crumb = { label: string; href?: string };

export function AdminHeader({ crumbs, title, subtitle, children }: { crumbs: Crumb[]; title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <header className="px-1 pt-2">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[14px] leading-5">
          <li>
            <Link href="/coach" aria-label="Dashboard" className="transition-opacity hover:opacity-70">
              <Ico h="94b4f" size={16} />
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              <Ico h="9f8d7" size={16} className="rtl:rotate-180" />
              {c.href ? (
                <Link href={c.href} className="text-[#b3b4b5] transition-colors hover:text-ink dark:text-[#6d6e6e]">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={i === crumbs.length - 1 ? "page" : undefined} className="font-medium text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3 pb-6">
        <div className="min-w-0">
          <h1 className="animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_both] text-[24px] leading-8 font-bold text-ink">{title}</h1>
          <p className="mt-2 animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_80ms_both] text-[16px] leading-6 text-muted">{subtitle}</p>
        </div>
        {children && <div className="flex animate-[k-fade_0.6s_ease-out_150ms_both] items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}

export function FilterLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[14px] leading-5 font-medium text-ink">
      {children}
    </label>
  );
}

export function FilterInput({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <FilterLabel htmlFor={id}>{label}</FilterLabel>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(coachField, "h-10")} />
    </div>
  );
}

export function FilterButtons({ onReset, resetLabel = "Reset Filters" }: { onReset: () => void; resetLabel?: string }) {
  return (
    <div className="flex items-end justify-end gap-2 pb-1">
      <button type="submit" className={smallCta}>
        <Ico h="9196b" size={16} />
        Filter
      </button>
      <button type="button" onClick={onReset} className={smallGhost}>
        <Ico h="88052" size={16} />
        {resetLabel}
      </button>
    </div>
  );
}

export function Pager({ page, pages, from, to, total, onPage }: { page: number; pages: number; from: number; to: number; total: number; onPage: (p: number) => void }) {
  const nav = "grid h-9 place-items-center rounded-[12px] border border-divider px-3 text-[12px] leading-4 font-medium text-ink transition-colors hover:bg-row disabled:pointer-events-none disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-divider px-4 py-3">
      <p className="flex flex-wrap items-center gap-x-1 text-[14px] leading-5 text-muted">
        <span>Showing</span> <b className="font-medium text-ink">{from}</b> <span>to</span> <b className="font-medium text-ink">{to}</b> <span>of</span> <b className="font-medium text-ink">{total}</b> <span>results</span>
      </p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className={cn(nav, "me-1")}>
          Previous
        </button>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-current={page === i + 1 ? "page" : undefined}
            onClick={() => onPage(i + 1)}
            className={cn("grid size-9 place-items-center rounded-[12px] text-[12px] leading-4 font-medium transition-colors", page === i + 1 ? "bg-lime text-[var(--on-accent)]" : "text-ink hover:bg-row")}
          >
            {i + 1}
          </button>
        ))}
        <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className={cn(nav, "ms-1")}>
          Next
        </button>
      </div>
    </div>
  );
}

export type MenuItem = { label: string; danger?: boolean; href?: string; onSelect?: () => void };

export function ActionsMenu({ items, label }: { items: MenuItem[]; label: string }) {
  return (
    <Popover
      offset={5}
      role="menu"
      label={label}
      className="min-w-[170px] py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button ref={ref} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={label} className="inline-flex h-8 items-center gap-2 rounded-[12px] bg-pill ps-3 pe-3 text-[12px] leading-4 font-medium whitespace-nowrap text-ink transition-[filter] hover:brightness-95 dark:hover:brightness-125">
          Actions
          <Ico h="f64b2" size={16} className={cn("transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) =>
        items.map((m) => {
          const cls = cn("flex h-9 w-full items-center px-3 text-start text-[13.5px] transition-colors hover:bg-[var(--menu-hover)]", m.danger ? "text-[#ef4444]" : "text-ink");
          return m.href ? (
            <Link key={m.label} href={m.href} role="menuitem" onClick={close} className={cls}>
              {m.label}
            </Link>
          ) : (
            <button
              key={m.label}
              type="button"
              role="menuitem"
              onClick={() => {
                m.onSelect?.();
                close();
              }}
              className={cls}
            >
              {m.label}
            </button>
          );
        })
      }
    </Popover>
  );
}

export function StatusBadge({ ok, tone, children }: { ok?: boolean; tone?: "blue"; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-[26px] items-center rounded-full border px-[10px] text-[12px] leading-4 font-medium whitespace-nowrap", tone === "blue" ? "border-[#bedbff] bg-[#eff6ff] text-[#1447e6] dark:border-[#1e3a8a] dark:bg-[#0d1b3a] dark:text-[#60a5fa]" : ok ? "border-[#b9f8cf] bg-[#f0fdf4] text-[#008236] dark:border-[#14532d] dark:bg-[#0c2a17] dark:text-[#4ade80]" : "border-[#fff085] bg-[#fefce8] text-[#a65f00] dark:border-[#713f12] dark:bg-[#2a2208] dark:text-[#facc15]")}>
      {children}
    </span>
  );
}

export type DialogField = { name: string; label: string; placeholder?: string; required?: boolean; type?: "text" | "email" | "number"; options?: string[]; area?: boolean };

/** Small create form used by the "Create ..." buttons. Closes on Escape and on backdrop click. */
export function FormDialog({ title, submit, fields, onClose, onSubmit }: { title: string; submit: string; fields: DialogField[]; onClose: () => void; onSubmit: (values: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [tried, setTried] = useState(false);
  const panelRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("input,textarea,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>("input,textarea,button")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      before?.focus();
    };
  }, [onClose]);

  const missing = (f: DialogField) => f.required && !values[f.name]?.trim();
  const set = (name: string, v: string) => setValues((s) => ({ ...s, [name]: v }));

  return createPortal(
    <div className="fixed inset-0 z-[80] grid animate-[k-fade_0.2s_ease-out] place-items-center bg-black/40 p-4" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (fields.some(missing)) {
            setTried(true);
            return;
          }
          onSubmit(values);
          onClose();
        }}
        className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[20px] border border-divider bg-[var(--panel)] p-5"
      >
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">{title}</h2>
        <div className="mt-4 space-y-3">
          {fields.map((f) => {
            const id = `dialog-${f.name}`;
            const bad = tried && missing(f);
            return (
              <div key={f.name}>
                <FilterLabel htmlFor={id}>
                  {f.label}
                  {f.required && <span aria-hidden className="ms-1 text-[#ef4444]">*</span>}
                </FilterLabel>
                {f.options ? (
                  <Select compact id={id} label={f.label} value={values[f.name] ?? ""} placeholder={f.placeholder ?? f.label} options={f.options.map((o) => ({ value: o, label: o }))} onChange={(v) => set(f.name, v)} />
                ) : f.area ? (
                  <textarea id={id} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} className={cn(coachField, "block h-24 resize-none py-2")} />
                ) : (
                  <input id={id} type={f.type ?? "text"} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} aria-invalid={bad || undefined} className={cn(coachField, "h-10")} />
                )}
                {bad && <p role="alert" className="mt-1 text-[12px] leading-[18px] text-[#ef4444]">{`Enter ${f.label.toLowerCase()} to continue.`}</p>}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={cn(smallGhost, "h-10 px-4 text-[14px]")}>
            Cancel
          </button>
          <button type="submit" className={cn(smallCta, "h-10 px-4 text-[14px]")}>
            {submit}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

export { DayField };
