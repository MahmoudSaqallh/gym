"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/primitives";
import { IcoChip } from "@/components/ui/ico";
import { toArabic } from "@/lib/i18n/translate";
import { createValueStore } from "@/lib/set-store";
import { PageButton } from "../ui-library/ui-library";
import { Field, Glyph, inputClass, SectionHead, Select } from "./field-ui";

type Value = boolean | number | string;
type Setting = { id: string; name: string; sub: string; value: Value; category: string; icon: string };

const ICON = { Features: "c5d95", Fitness: "7efdf", Notifications: "52a09", Localization: "f4169", Security: "5e505" };

const SETTINGS: Setting[] = [
  { id: "ai-assistant", name: "Enable AI Assistant", sub: "Show the assistant to members", value: true, category: "Features", icon: ICON.Features },
  { id: "community", name: "Enable Community", sub: "Show the community section to members", value: true, category: "Features", icon: ICON.Features },
  { id: "calories", name: "Default Calorie Goal", sub: "Daily calories a new account aims for", value: 2200, category: "Fitness", icon: ICON.Fitness },
  { id: "steps", name: "Default Daily Step Goal", sub: "Steps a new account aims for each day", value: 10000, category: "Fitness", icon: ICON.Fitness },
  { id: "hydration", name: "Default Hydration Goal (L)", sub: "Liters of water a new account aims for each day", value: 2.5, category: "Fitness", icon: ICON.Fitness },
  { id: "sleep", name: "Default Sleep Goal (hours)", sub: "Hours of sleep a new account aims for each night", value: 8, category: "Fitness", icon: ICON.Fitness },
  { id: "workouts", name: "Default Weekly Workouts", sub: "Sessions a new account plans each week", value: 4, category: "Fitness", icon: ICON.Fitness },
  { id: "reminders", name: "Send Workout Reminders", sub: "Remind members before a scheduled session", value: true, category: "Notifications", icon: ICON.Notifications },
  { id: "weekly-report", name: "Send Weekly Reports", sub: "Email members a summary every week", value: true, category: "Notifications", icon: ICON.Notifications },
  { id: "lead-time", name: "Reminder Lead Time (minutes)", sub: "How long before a session the reminder goes out", value: 30, category: "Notifications", icon: ICON.Notifications },
  { id: "language", name: "Default Language", sub: "Language a new account starts in", value: "en", category: "Localization", icon: ICON.Localization },
  { id: "date-format", name: "Date Format", sub: "How dates are written across the app", value: "DD/MM/YYYY", category: "Localization", icon: ICON.Localization },
  { id: "session-timeout", name: "Session Timeout (minutes)", sub: "Idle time before a member is signed out", value: 60, category: "Security", icon: ICON.Security },
];

const CATEGORIES = [{ value: "", label: "All categories" }, ...Object.keys(ICON).map((c) => ({ value: c, label: c }))];
const TYPES = [
  { value: "", label: "Any type" },
  { value: "boolean", label: "Boolean" },
  { value: "number", label: "Number" },
  { value: "string", label: "Text" },
];
const PAGE_SIZE = 6;
const NO_FILTERS = { search: "", category: "", type: "" };

const useOverrides = createValueStore("kinora-app-settings", "{}");

function ValueCell({ setting, value, onChange }: { setting: Setting; value: Value; onChange: (v: Value) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelled = useRef(false);

  if (typeof value === "boolean") {
    return (
      <button type="button" translate="no" onClick={() => onChange(!value)} aria-label={`Edit ${setting.name}`} aria-pressed={value} className="rounded-[8px] px-2 py-1 text-[14px] font-medium text-ink transition-colors hover:bg-[var(--nav-hover)]">
        {String(value)}
      </button>
    );
  }
  if (draft === null) {
    return (
      <button type="button" translate="no" dir="ltr" onClick={() => { cancelled.current = false; setDraft(String(value)); }} aria-label={`Edit ${setting.name}`} className="rounded-[8px] px-2 py-1 text-[14px] font-medium text-ink transition-colors hover:bg-[var(--nav-hover)]">
        {value}
      </button>
    );
  }
  const commit = () => {
    if (cancelled.current) return;
    cancelled.current = true; // Enter commits, then the input's removal fires blur
    const t = draft.trim();
    if (typeof value === "number") {
      if (t !== "" && Number.isFinite(Number(t)) && Number(t) >= 0) onChange(Number(t));
    } else if (t) {
      onChange(t);
    }
    setDraft(null);
  };
  return (
    <input
      autoFocus
      dir="ltr"
      value={draft}
      aria-label={`Edit ${setting.name}`}
      inputMode={typeof value === "number" ? "decimal" : undefined}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          cancelled.current = true;
          setDraft(null);
        }
      }}
      className="h-8 w-[120px] rounded-[8px] border border-lime bg-row px-2 text-[14px] text-ink outline-none"
    />
  );
}

export function AppSettings() {
  const [raw, setRaw] = useOverrides();
  const [draft, setDraft] = useState(NO_FILTERS);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);

  let overrides: Record<string, Value> = {};
  try {
    overrides = JSON.parse(raw) as Record<string, Value>;
  } catch {
    /* corrupted entry: show the defaults */
  }
  const valueOf = (s: Setting) => (typeof overrides[s.id] === typeof s.value ? overrides[s.id] : s.value);

  const q = filters.search.trim().toLowerCase();
  const rows = SETTINGS.filter(
    (s) =>
      // Names are authored in English, so an Arabic search has to look at the translation too.
      (!q || `${s.name} ${s.sub} ${toArabic(s.name)} ${toArabic(s.sub)}`.toLowerCase().includes(q)) &&
      (!filters.category || s.category === filters.category) &&
      (!filters.type || typeof s.value === filters.type),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const shown = rows.slice(start, start + PAGE_SIZE);

  const apply = (next = draft) => {
    setFilters(next);
    setPage(1);
  };
  const reset = () => {
    setDraft(NO_FILTERS);
    apply(NO_FILTERS);
  };

  return (
    <Card delay={0} className="p-5 sm:p-6" aria-label="App Settings">
      <SectionHead
        chip={
          <span className="grid size-[54px] flex-none place-items-center rounded-full bg-row text-accent-ink">
            <Glyph name="gear" size={25} />
          </span>
        }
        title="App Settings"
        sub="Configure and manage application settings and general preferences"
      />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
        className="mt-5 grid items-end gap-3 rounded-[16px] border border-divider p-4 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
      >
        <Field id="app-search" label="Search">
          <input id="app-search" type="search" value={draft.search} placeholder="Search settings..." onChange={(e) => setDraft({ ...draft, search: e.target.value })} className={inputClass} />
        </Field>
        <Field id="app-category" label="Category">
          <Select id="app-category" label="Category" raw value={draft.category} options={CATEGORIES} placeholder="Choose a category" onChange={(v) => setDraft({ ...draft, category: v })} />
        </Field>
        <Field id="app-type" label="Value Type">
          <Select id="app-type" label="Value Type" value={draft.type} options={TYPES} placeholder="Any type" onChange={(v) => setDraft({ ...draft, type: v })} />
        </Field>
        <div className="flex gap-2 pb-[5px]">
          <button type="submit" className="inline-flex h-[34px] items-center gap-[6px] rounded-[10px] bg-lime px-3 text-[12.5px] font-semibold whitespace-nowrap text-[var(--on-accent)] transition-[filter,scale] hover:brightness-105 active:scale-95">
            <Glyph name="search" size={15} />
            Filter
          </button>
          <button type="button" onClick={reset} className="group/r inline-flex h-[34px] items-center gap-[6px] rounded-[10px] border border-divider px-3 text-[12.5px] font-medium whitespace-nowrap text-ink transition-colors hover:bg-[var(--nav-hover)]">
            <Glyph name="refresh" size={15} className="transition-transform duration-500 group-hover/r:rotate-180" />
            Reset
          </button>
        </div>
      </form>

      <div className="mt-[14px] overflow-x-auto rounded-[16px] border border-divider">
        <table className="w-full min-w-[640px] text-start">
          <thead className="bg-row">
            <tr className="text-[12px] leading-4 font-medium text-muted">
              <th scope="col" className="h-10 px-5 text-start font-medium">Setting Name</th>
              <th scope="col" className="h-10 w-[20%] px-3 text-start font-medium">Value</th>
              <th scope="col" className="h-10 w-[24%] px-5 text-start font-medium">Category</th>
            </tr>
          </thead>
          <tbody key={`${current}-${JSON.stringify(filters)}`} className="animate-[k-fade_0.3s_ease-out] divide-y divide-divider">
            {shown.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-row">
                <td className="px-5 py-[6px]">
                  <span className="flex items-center gap-3">
                    <IcoChip h={s.icon} size={34} iconSize={20} />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] leading-5 font-medium text-ink">{s.name}</span>
                      <span className="block text-[12px] leading-[17px] text-muted">{s.sub}</span>
                    </span>
                  </span>
                </td>
                <td className="px-3 py-[6px]">
                  <ValueCell
                    setting={s}
                    value={valueOf(s)}
                    onChange={(v) => setRaw(JSON.stringify({ ...overrides, [s.id]: v }))}
                  />
                </td>
                <td className="px-5 py-[6px]">
                  <span translate="no" className="inline-block rounded-full bg-row px-[10px] py-[3px] text-[11.5px] leading-[17px] font-medium text-accent-ink">
                    {s.category}
                  </span>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center">
                  <p className="text-[14px] font-medium text-ink">No settings match these filters</p>
                  <button type="button" onClick={reset} className="mt-3 h-9 rounded-full bg-row px-4 text-[13px] font-medium text-ink transition-[filter] hover:brightness-95 dark:hover:brightness-125">
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-3">
          <p className="text-[14px] text-muted">
            Showing <span className="font-medium text-ink">{start + 1}</span> to <span className="font-medium text-ink">{start + shown.length}</span> of <span className="font-medium text-ink">{rows.length}</span> results
          </p>
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <PageButton outline disabled={current === 1} onClick={() => setPage(current - 1)}>
              Previous
            </PageButton>
            {Array.from({ length: pages }, (_, i) => (
              <PageButton key={i} active={current === i + 1} onClick={() => setPage(i + 1)} label={`Page ${i + 1}`}>
                {i + 1}
              </PageButton>
            ))}
            <PageButton outline disabled={current === pages} onClick={() => setPage(current + 1)}>
              Next
            </PageButton>
          </nav>
        </div>
      )}
    </Card>
  );
}
