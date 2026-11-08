"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { Select } from "../settings/field-ui";
import { ActionsMenu, AdminHeader, FilterButtons, FilterInput, FilterLabel, FormDialog, Pager, smallCta, StatusBadge, type DialogField, type MenuItem } from "./admin-ui";
import { CONTENT, type ContentConfig, type ContentRow, type ContentTab } from "./content-data";

const PAGE = 15;
const PLACEHOLDER = "Select an option";
type Values = Record<string, string>;

function matches(row: ContentRow, values: Values, config: ContentConfig) {
  const q = (values.search ?? "").trim().toLowerCase();
  if (q && !`${row.title} ${row.sub}`.toLowerCase().includes(q)) return false;
  return config.filters.every((f) => {
    const want = values[f.key];
    if (!want || f.sort) return true;
    if (f.test) return f.test(row, want);
    if (f.key.startsWith("flag:")) return (row.cells.flags === f.key.slice(5)) === (want === "Yes");
    if (f.key === "featured") return (row.cells.featured === "Featured") === (want === "Featured");
    return row.cells[f.key] === want;
  });
}

function sorted(rows: ContentRow[], how?: string) {
  if (how === "Name A to Z") return [...rows].sort((a, b) => a.title.localeCompare(b.title));
  if (how === "Name Z to A") return [...rows].sort((a, b) => b.title.localeCompare(a.title));
  return rows;
}

function Filters({ config, onApply }: { config: ContentConfig; onApply: (v: Values) => void }) {
  const [values, setValues] = useState<Values>({});
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));
  return (
    <Card delay={60} className="!rounded-[16px] p-4" aria-label="Filter">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onApply(values);
        }}
      >
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", config.filters.length > 2 && "xl:grid-cols-5")}>
          <FilterInput id="c-search" label="Search" value={values.search ?? ""} onChange={(v) => set("search", v)} placeholder={config.search} />
          {config.filters.map((f) => (
            <div key={f.key}>
              <FilterLabel htmlFor={`c-${f.key}`}>{f.label}</FilterLabel>
              <Select compact id={`c-${f.key}`} label={f.label} value={values[f.key] ?? ""} placeholder={PLACEHOLDER} options={[{ value: "", label: PLACEHOLDER }, ...(f.options ?? []).map((o) => ({ value: o, label: o }))]} onChange={(v) => set(f.key, v)} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <FilterButtons
            onReset={() => {
              setValues({});
              onApply({});
            }}
          />
        </div>
      </form>
    </Card>
  );
}

function Cell({ value, muted, badge, small }: { value: string; muted?: boolean; badge?: boolean; small?: boolean }) {
  if (badge) return value ? <StatusBadge ok tone={value === "Healthy choice" ? "blue" : undefined}>{value}</StatusBadge> : null;
  return <span translate={small ? "no" : undefined} className={cn("leading-5 whitespace-nowrap", small ? "text-[12px]" : "text-[14px]", muted ? "text-muted" : "text-ink")}>{value}</span>;
}

export function CoachContent({ tab }: { tab: ContentTab }) {
  const config: ContentConfig = CONTENT[tab];
  const [rows, setRows] = useState(config.rows);
  const [applied, setApplied] = useState<Values>({});
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<ContentRow | null>(null);

  const visible = sorted(rows.filter((r) => matches(r, applied, config)), applied.sort);
  const pages = Math.max(1, Math.ceil(visible.length / PAGE));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * PAGE, current * PAGE);

  const total = config.first.width + config.columns.reduce((n, c) => n + c.width, 0) + config.actionsWidth;
  const pct = (w: number) => `${(w / total) * 100}%`;

  const menu = (r: ContentRow): MenuItem[] => [
    ...(tab === "exercises"
      ? [{ label: r.cells.featured ? "Remove from featured" : "Mark as featured", onSelect: () => setRows((all) => all.map((x) => (x.id === r.id ? { ...x, cells: { ...x.cells, featured: x.cells.featured ? "" : "Featured" } } : x))) }]
      : []),
    { label: "Duplicate", onSelect: () => setRows((all) => [{ ...r, id: `${r.id}-${Date.now()}`, title: `${r.title} (copy)` }, ...all]) },
    { label: "Delete", danger: true, onSelect: () => setRemoving(r) },
  ];

  const addFields: DialogField[] = [
    { name: "title", label: "Name", required: true },
    { name: "sub", label: "Description" },
    ...config.filters.filter((f) => !f.sort && f.key !== "featured" && config.columns.some((c) => c.key === f.key)).map((f) => ({ name: f.key, label: f.label, options: f.options, placeholder: PLACEHOLDER })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="-mb-1">
        <AdminHeader crumbs={[{ label: "Dashboard", href: "/coach" }, { label: "Content", href: config.root ?? "/coach/content" }, { label: config.crumb }]} title={config.title} subtitle={config.subtitle}>
          <button type="button" onClick={() => setAdding(true)} className={smallCta}>
            <Ico h="8ffed" size={16} />
            Add new
          </button>
        </AdminHeader>
      </div>

      <Filters
        config={config}
        onApply={(v) => {
          setApplied(v);
          setPage(1);
        }}
      />

      <Card delay={120} className="!rounded-[16px] overflow-hidden" aria-label={config.title}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full table-fixed border-collapse" style={{ minWidth: config.minWidth ?? 1100 }}>
            <colgroup>
              <col style={{ width: pct(config.first.width) }} />
              {config.columns.map((c) => (
                <col key={c.key} style={{ width: pct(c.width) }} />
              ))}
              <col style={{ width: pct(config.actionsWidth) }} />
            </colgroup>
            <thead>
              <tr className="border-b border-divider bg-[var(--thead)] text-[12px] leading-4 font-semibold tracking-[0.72px] text-muted uppercase">
                <th scope="col" className="h-10 ps-6 pe-2 text-start font-semibold">{config.first.label}</th>
                {config.columns.map((c) => (
                  <th key={c.key} scope="col" className="ps-4 text-start font-semibold">{c.label}</th>
                ))}
                <th scope="col" className="ps-4 text-start font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 2} className="h-40 text-center text-[14px] text-muted">
                    Nothing matches these filters.
                  </td>
                </tr>
              )}
              {shown.map((r, i) => (
                <tr key={r.id} className="k-in-fade transition-colors hover:bg-row" style={{ height: config.rowHeight ?? 61, "--d": `${160 + i * 35}ms` } as React.CSSProperties}>
                  <td className="ps-6 pe-4">
                    <span className="flex items-center gap-3">
                      {r.image.startsWith("chip:") ? (
                        <IcoChip h={r.image.slice(5)} size={40} iconSize={25} />
                      ) : (
                        <span className="relative size-10 flex-none overflow-hidden rounded-[12px] bg-[var(--field)]">
                          {r.image && <Image src={`/assets/f/${r.image}`} alt="" fill sizes="40px" className="object-cover" />}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] leading-5 font-medium text-ink">{r.title}</span>
                        <span className="block truncate text-[12px] leading-4 text-muted">{r.sub}</span>
                      </span>
                    </span>
                  </td>
                  {config.columns.map((c) => (
                    <td key={c.key} className="ps-4">
                      <Cell value={r.cells[c.key] ?? ""} muted={c.muted} badge={c.badge} small={c.small} />
                    </td>
                  ))}
                  <td className="ps-4">
                    <ActionsMenu label={`Open actions menu for ${r.title}`} items={menu(r)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {pages > 1 && <Pager page={current} pages={pages} from={(current - 1) * PAGE + 1} to={Math.min(current * PAGE, visible.length)} total={visible.length} onPage={setPage} />}

      {adding && (
        <FormDialog
          title={`Add to ${config.title}`}
          submit="Add new"
          fields={addFields}
          onClose={() => setAdding(false)}
          onSubmit={(v) => {
            const cells: Values = { updated: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date()) };
            config.columns.forEach((c) => (cells[c.key] = v[c.key] ?? (c.key === "updated" ? cells.updated : "")));
            setRows((all) => [{ id: `new-${Date.now()}`, title: v.title.trim(), sub: (v.sub ?? "").trim(), image: "", cells }, ...all]);
          }}
        />
      )}
      {removing && (
        <FormDialog
          title={`Delete ${removing.title}?`}
          submit="Delete"
          fields={[]}
          onClose={() => setRemoving(null)}
          onSubmit={() => setRows((all) => all.filter((x) => x.id !== removing.id))}
        />
      )}
    </div>
  );
}
