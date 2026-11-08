"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { TrendChart } from "../charts";
import { MiniStatCard } from "../section-ui";

const TABS = [
  { id: "data", label: "Data Display", icon: "86e4a" },
  { id: "ai", label: "AI Assistant", icon: "cc54c" },
  { id: "feedback", label: "Feedback & Alerts", icon: "7bae2" },
  { id: "map", label: "Map", icon: "b53ed" },
  { id: "layout", label: "Layout & Effects", icon: "73c02" },
  { id: "navigation", label: "Navigation", icon: "287f1" },
  { id: "overlays", label: "Overlays & Dialogs", icon: "10a3e" },
  { id: "buttons", label: "Buttons", icon: "80027" },
  { id: "inputs", label: "Form Inputs", icon: "18739" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE = [2400, 1398, 9800, 3908, 4800, 3800];
const SALES = [4000, 3000, 2000, 2780, 1890, 2390];
const PROFIT = [1600, 1200, 3800, 2000, 2400, 2200];
const GRAY = "#6b7280";
const TICKS = [0, 2500, 5000, 7500, 10000].map((v) => ({ v, label: v === 0 ? "0" : String(v) }));

const USERS = [
  { name: "John Doe", email: "john@example.com", role: "Coach", active: true },
  { name: "Jane Smith", email: "jane@example.com", role: "User", active: true },
  { name: "Bob Johnson", email: "bob@example.com", role: "Editor", active: false },
  { name: "Alice Brown", email: "alice@example.com", role: "Coach", active: true },
  { name: "Sam Lee", email: "sam@example.com", role: "User", active: false },
];
const PAGE_SIZE = 3;

const RINGS = [
  { label: "Active Users", sub: "Daily active users this month", value: 85, icon: "68632", r: 83 },
  { label: "Revenue", sub: "Monthly revenue target", value: 75, icon: "c35b7", r: 61 },
  { label: "Conversions", sub: "Sales conversions this week", value: 45, icon: "665b1", r: 39 },
];

const RADAR = [
  { label: "React", v: 0.9 },
  { label: "TypeScript", v: 0.85 },
  { label: "Node.js", v: 0.82 },
  { label: "CSS", v: 0.95 },
  { label: "GraphQL", v: 0.82 },
  { label: "Testing", v: 0.75 },
];

const CODE = {
  stat: `<MiniStatCard
  label="Total Coaches"
  icon="2163e"
  value={[{ n: 12 }]}
  sub="Every coach on the staff"
  bars={[]}
/>`,
  charts: `<TrendChart
  curve
  labels={["Jan", "Feb", "Mar"]}
  max={10000}
  ticks={[{ v: 0, label: "0" }, { v: 10000, label: "10000" }]}
  series={[{ values: [2400, 1398, 9800], color: "var(--lime)", area: true }]}
/>`,
  table: `const rows = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

<table>
  {rows.map((u) => <UserRow key={u.email} {...u} />)}
</table>`,
  avatar: `<Avatar initials="JD" />
<Avatar src="/assets/f/16dc1.png" alt="John Doe" />`,
  user: `<UserName
  name="John Doe"
  email="john.doe@example.com"
  tags={["Coach"]}
  online
/>`,
};

/* ---------- section chrome ---------- */

function CodeExample({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 overflow-hidden rounded-[12px] bg-row">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex h-14 w-full items-center gap-2 px-4 text-start">
        <span className={cn("grid size-6 place-items-center transition-transform duration-300", open && "rotate-90")}>
          <Ico h="66f46" size={16} />
        </span>
        <span className="flex-1 text-[14px] font-medium text-ink">Code Example</span>
        <span className="rounded-full bg-[rgb(var(--lime-rgb)/0.1)] px-2 py-1 text-[12px] leading-4 text-ink">tsx</span>
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden">
          <pre className="overflow-x-auto px-5 pb-5 font-mono text-[12.5px] leading-[20px] text-body">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function Section({ title, sub, code, delay, children }: { title: string; sub: string; code: string; delay: number; children: React.ReactNode }) {
  return (
    <Card delay={delay} className="p-6 pt-10" aria-label={title}>
      <h2 className="text-[18px] leading-7 font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-[14px] leading-5 text-muted">{sub}</p>
      <div className="mt-4">{children}</div>
      <CodeExample code={code} />
    </Card>
  );
}

function ChartBox({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-[14px] leading-5 font-medium text-ink">{title}</h3>
      <div className="mt-3 rounded-[8px] border border-divider p-4">{children}</div>
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string; ink?: boolean }[] }) {
  return (
    <div className="mt-3 flex justify-center gap-4 text-[12px]">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-[6px]" style={{ color: i.ink ? "var(--muted)" : i.color }}>
          <span className="size-[10px] rounded-[2px]" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- charts ---------- */

function WideTrend({ line }: { line?: boolean }) {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <div className="min-w-[640px]">
        <TrendChart
          curve
          labels={MONTHS}
          max={10000}
          ticks={TICKS}
          width={1080}
          height={200}
          plot={{ x: 44, y: 8, w: 1020, h: 160 }}
          series={[
            { values: REVENUE, color: GRAY, area: !line, dots: line ? "small" : undefined, dash: line ? "5 4" : undefined, width: 1.5, label: "Revenue" },
            { values: SALES, color: "var(--lime)", area: !line, dots: line ? "small" : undefined, label: "Sales" },
          ]}
        />
      </div>
    </div>
  );
}

function BarChart() {
  const max = 4000;
  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <div className="relative h-[212px] min-w-[520px] ps-10">
        {[0, 1000, 2000, 3000, 4000].map((t) => (
          <div key={t} className="absolute end-0 start-10 border-t border-[var(--grid-line)]" style={{ bottom: `${(t / max) * 174 + 26}px` }}>
            <span className="absolute -start-10 -translate-y-1/2 text-[12px] text-muted">{t}</span>
          </div>
        ))}
        <div className="absolute end-0 bottom-0 start-10 flex h-[200px]">
          {MONTHS.map((m, i) => (
            <div key={m} className="group/bar flex flex-1 flex-col items-center justify-end">
              <div className="flex h-[174px] items-end gap-2" role="img" aria-label={`${m}: sales ${SALES[i]}, profit ${PROFIT[i]}`}>
                <span className="k-bar w-[clamp(16px,3.4vw,44px)] rounded-t-[3px] bg-lime transition-[filter] group-hover/bar:brightness-110" style={{ height: `${(SALES[i] / max) * 100}%`, "--d": `${250 + i * 70}ms` } as React.CSSProperties} title={`Sales ${SALES[i]}`} />
                <span className="k-bar w-[clamp(16px,3.4vw,44px)] rounded-t-[3px] transition-[filter] group-hover/bar:brightness-110" style={{ height: `${(PROFIT[i] / max) * 100}%`, background: GRAY, "--d": `${320 + i * 70}ms` } as React.CSSProperties} title={`Profit ${PROFIT[i]}`} />
              </div>
              <span className="mt-[6px] h-5 text-[12px] leading-5 text-muted">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PieChart() {
  return (
    <div className="flex flex-col items-center py-2">
      <svg width={160} height={160} viewBox="0 0 160 160" role="img" aria-label="Active 65 percent, inactive 35 percent">
        <circle cx={80} cy={80} r={80} fill="var(--lime)" />
        <circle cx={80} cy={80} r={40} fill="none" stroke={GRAY} strokeWidth={80} pathLength={1} className="k-ring" style={{ "--p": 0.35, "--d": "300ms" } as React.CSSProperties} />
      </svg>
      <Legend items={[{ label: "Active", color: "var(--lime)" }, { label: "Inactive", color: GRAY, ink: true }]} />
    </div>
  );
}

function RadarChart() {
  const cx = 150;
  const cy = 105;
  const R = 75;
  const pt = (i: number, k: number) => {
    const a = (Math.PI * 2 * i) / RADAR.length - Math.PI / 2;
    return [cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * k] as const;
  };
  const poly = (fn: (i: number) => number) => RADAR.map((_, i) => pt(i, fn(i)).join(",")).join(" ");
  return (
    <svg viewBox="0 0 300 210" className="mx-auto block h-[210px] w-full max-w-[320px]" role="img" aria-label={RADAR.map((r) => `${r.label} ${Math.round(r.v * 100)}`).join(", ")}>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={poly(() => k)} fill="none" stroke="var(--grid-line)" />
      ))}
      {RADAR.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--grid-line)" />;
      })}
      <polygon points={poly((i) => RADAR[i].v)} fill="var(--lime)" fillOpacity={0.3} stroke="var(--lime)" strokeWidth={2} className="k-svg-pop origin-center" style={{ "--d": "300ms" } as React.CSSProperties} />
      {RADAR.map((r, i) => {
        const [x, y] = pt(i, 1.2);
        return (
          <text key={r.label} x={x} y={y + 4} textAnchor={Math.abs(x - cx) < 4 ? "middle" : x > cx ? "start" : "end"} fontSize={12} fill="var(--muted)">
            {r.label}
          </text>
        );
      })}
    </svg>
  );
}

function RingsChart() {
  const [active, setActive] = useState(0);
  return (
    <div className="p-2">
      <div className="relative mx-auto size-[180px]">
        <svg width={180} height={180} viewBox="0 0 180 180" aria-hidden>
          {RINGS.map((r, i) => (
            <g key={r.label}>
              <circle cx={90} cy={90} r={r.r} fill="none" stroke="var(--track)" strokeWidth={14} />
              <circle
                cx={90}
                cy={90}
                r={r.r}
                fill="none"
                stroke={i === active ? "#60a5fa" : "#d1d5db"}
                strokeWidth={14}
                strokeLinecap="round"
                pathLength={1}
                className="k-ring cursor-pointer [transition-property:stroke-dashoffset,stroke]"
                style={{ "--p": r.value / 100, "--d": `${250 + i * 120}ms` } as React.CSSProperties}
                onMouseEnter={() => setActive(i)}
              />
            </g>
          ))}
        </svg>
        <span key={active} className="pointer-events-none absolute inset-0 grid animate-[k-pop_0.3s_ease-out] place-items-center text-[24px] leading-8 font-bold text-ink">
          {RINGS[active].value}%
        </span>
      </div>
      <ul className="mt-4">
        {RINGS.map((r, i) => {
          const on = i === active;
          return (
            <li key={r.label}>
              <button type="button" onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-pressed={on} className="flex h-[61px] w-full items-center gap-2 text-start">
                <span className={cn("grid size-7 flex-none place-items-center rounded-full transition-colors duration-300", on ? "bg-[rgba(96,165,250,0.2)]" : "bg-[rgba(209,213,219,0.2)]")}>
                  <Ico h={r.icon} size={14} color={on ? "#60a5fa" : "#b8bdc5"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] leading-4 font-medium text-ink">{r.label}</span>
                  <span className="block truncate text-[10px] leading-[15px] text-muted">{r.sub}</span>
                </span>
                <span className={cn("text-[12px] leading-4 font-semibold transition-colors duration-300", on ? "text-[#60a5fa]" : "text-[#b8bdc5]")}>{r.value}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- table, avatars, names ---------- */

export function PageButton({ children, onClick, disabled, active, outline, label }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean; outline?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-9 min-w-9 rounded-[12px] px-3 text-[12px] font-medium transition-[background-color,scale] duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        active ? "bg-lime text-[var(--on-accent)]" : "text-ink hover:bg-row",
        outline && "border border-divider",
      )}
    >
      {children}
    </button>
  );
}

function DataTable() {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(USERS.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const rows = USERS.slice(start, start + PAGE_SIZE);
  return (
    <div className="overflow-hidden rounded-[8px] border border-divider">
      <div className="overflow-x-auto rounded-[16px] border border-divider">
        <table className="w-full min-w-[620px] text-start text-[14px] leading-5 text-ink">
          <thead className="bg-row">
            <tr className="border-b border-divider text-[12px] leading-4 font-semibold tracking-[0.72px] text-muted uppercase">
              <th className="h-10 ps-6 font-semibold">Name</th>
              <th className="h-10 px-4 font-semibold">Email</th>
              <th className="h-10 px-4 font-semibold">Role</th>
              <th className="h-10 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody key={page} className="animate-[k-fade_0.3s_ease-out]">
            {rows.map((u) => (
              <tr key={u.email} className="transition-colors hover:bg-row">
                <td className="h-10 ps-6">{u.name}</td>
                <td className="h-10 px-4">{u.email}</td>
                <td className="h-10 px-4">{u.role}</td>
                <td className="h-10 px-4">
                  <span className={cn("inline-block rounded-full px-2 py-1 text-[12px] leading-4", u.active ? "bg-[var(--success-bg)] text-[var(--success-ink)] dark:bg-[var(--success-bg)] dark:text-[var(--success-ink)]" : "bg-[#f3f4f6] text-[#1e2939] dark:bg-[#26282b] dark:text-[#c6c9cd]")}>{u.active ? "active" : "inactive"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-divider px-4 py-3">
        <p className="text-[14px] text-muted">
          Showing <span className="font-medium text-ink">{start + 1}</span> to <span className="font-medium text-ink">{start + rows.length}</span> of <span className="font-medium text-ink">{USERS.length}</span> results
        </p>
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <PageButton outline disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </PageButton>
          {Array.from({ length: pages }, (_, i) => (
            <PageButton key={i} active={page === i + 1} onClick={() => setPage(i + 1)} label={`Page ${i + 1}`}>
              {i + 1}
            </PageButton>
          ))}
          <PageButton outline disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </PageButton>
        </nav>
      </div>
    </div>
  );
}

function Avatars() {
  return (
    <>
      <h3 className="text-[14px] leading-5 font-medium text-ink">Fallback Avatars</h3>
      <div className="mt-2 flex gap-3">
        {["JD", "AB", "SM"].map((a, i) => (
          <span key={a} className="k-in-pop grid size-8 place-items-center rounded-full text-[16px] text-ink" style={{ "--d": `${200 + i * 70}ms` } as React.CSSProperties}>
            {a}
          </span>
        ))}
      </div>
      <h3 className="mt-6 text-[14px] leading-5 font-medium text-ink">With Images</h3>
      <div className="mt-2 flex gap-3">
        {["16dc1", "8f2ab", "eb7f8"].map((a, i) => (
          <Image key={a} src={`/assets/f/${a}.png`} alt="" width={32} height={32} className="k-in-pop size-8 rounded-full object-cover transition-transform duration-300 hover:scale-125" style={{ "--d": `${350 + i * 70}ms` } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}

function UserName({ name, email, tags, online, size }: { name: string; email?: string; tags?: string[]; online?: boolean; size: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex-none">
        <IcoChip h="b3a20" size={size} iconSize={Math.round(size * 0.625)} className="rounded-[10px]" />
        {online && <span className="absolute -top-1 -end-1 size-[10px] animate-pulse rounded-full bg-[var(--lime)]" title="Online" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[16px] leading-6 font-medium text-ink">{name}</p>
        {email && <p className="truncate text-[14px] leading-5 text-muted">{email}</p>}
        {tags && (
          <p className="mt-1 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-row px-[9px] py-[3px] text-[11px] leading-[15px] font-medium text-ink">
                {t}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function DataDisplay() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="Stat Card" sub="Statistics card with trend indicators and icons" code={CODE.stat} delay={0}>
        <div className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
          <MiniStatCard label="Total Coaches" icon="2163e" value={[{ n: 12 }]} sub="Every coach on the staff" bars={[]} delay={80} />
          <MiniStatCard label="Coaches with Roles" icon="1eeb1" value={[{ n: 10 }]} sub="Coaches who hold at least one role" bars={[]} delay={140} />
          <MiniStatCard label="Recently Added" icon="36a7f" value={[{ n: 1 }]} sub="Added in the last 7 days" bars={[]} delay={200} />
          <MiniStatCard label="Recently Updated" icon="f11ff" value={[{ n: 2 }]} sub="Updated in the last 7 days" bars={[]} delay={260} />
        </div>
      </Section>

      <Section title="Chart Components" sub="Data visualization charts built with the dashboard's chart kit" code={CODE.charts} delay={60}>
        <div className="flex flex-col gap-8">
          <ChartBox title="Area Chart">
            <WideTrend />
            <Legend items={[{ label: "Revenue", color: GRAY, ink: true }, { label: "Sales", color: "var(--lime)" }]} />
          </ChartBox>
          <ChartBox title="Bar Chart">
            <BarChart />
            <Legend items={[{ label: "Profit", color: GRAY, ink: true }, { label: "Sales", color: "var(--lime)" }]} />
          </ChartBox>
          <ChartBox title="Line Chart">
            <WideTrend line />
            <Legend items={[{ label: "Revenue", color: GRAY, ink: true }, { label: "Sales", color: "var(--lime)" }]} />
          </ChartBox>
          <div className="grid gap-4 md:grid-cols-2">
            <ChartBox title="Pie Chart">
              <PieChart />
            </ChartBox>
            <ChartBox title="Radar Chart">
              <RadarChart />
            </ChartBox>
          </div>
          <ChartBox title="Rings Chart">
            <RingsChart />
          </ChartBox>
        </div>
      </Section>

      <Section title="Table Component" sub="Flexible data table with pagination and custom cell renderers" code={CODE.table} delay={80}>
        <DataTable />
      </Section>

      <Section title="Avatar" sub="Display user profile images with fallbacks" code={CODE.avatar} delay={100}>
        <Avatars />
      </Section>

      <Section title="User Name" sub="Display user information with avatar and details" code={CODE.user} delay={120}>
        <div className="flex flex-col gap-8">
          <UserName name="John Doe" email="john.doe@example.com" tags={["Coach"]} online size={40} />
          <UserName name="Jane Smith" email="jane.smith@example.com" tags={["Developer", "Designer"]} size={48} />
          <UserName name="Mike Johnson" size={32} />
        </div>
      </Section>
    </div>
  );
}

function NoExamples({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <Card delay={0} className="flex flex-col items-center px-6 py-16 text-center" aria-label={label}>
      <span className="grid size-12 place-items-center rounded-full border border-dashed border-[rgb(var(--lime-rgb)/0.45)]">
        <span className="animate-[k-float_3s_ease-in-out_infinite]">
          <Ico h="2aec6" size={20} />
        </span>
      </span>
      <h2 className="mt-3 text-[15px] font-medium text-ink">No {label} examples yet</h2>
      <p className="mt-1 max-w-[320px] text-[13px] leading-5 text-muted">This category hasn&apos;t been documented yet. Browse the components available in Data Display.</p>
      <button type="button" onClick={onBack} className="mt-4 h-9 rounded-full bg-row px-4 text-[13px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-95 dark:hover:brightness-125">
        Open Data Display
      </button>
    </Card>
  );
}

export function UiLibrary() {
  const [tab, setTab] = useState("data");
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <div className="flex flex-col gap-3">
      <header className="px-1">
        <nav className="flex items-center gap-2 pt-2 text-[14px] leading-5" aria-label="Breadcrumb">
          <Link href="/dashboard" aria-label="Home" className="transition-opacity hover:opacity-70">
            <Ico h="94b4f" size={16} />
          </Link>
          <Ico h="9f8d7" size={16} />
          <Link href="/dashboard" className="text-[#b3b4b5] transition-colors hover:text-ink dark:text-[#6a6c6e]">
            Dashboard
          </Link>
          <Ico h="9f8d7" size={16} />
          <span className="font-medium text-ink" aria-current="page">
            UI Component
          </span>
        </nav>
        <div className="mt-[15px] flex flex-wrap items-center gap-3">
          <h1 className="text-[24px] leading-8 font-bold text-ink">UI Component Library</h1>
          <span className="k-shine relative overflow-hidden rounded-full bg-gradient-to-r from-[#0a0a0a] to-[#6d6e6e] px-[10px] py-[3px] text-[12px] leading-4 font-medium text-white dark:from-[#2a2c2e] dark:to-[#55585b]">45 Components</span>
        </div>
        <p className="mt-2 text-[16px] leading-6 text-muted">Browse and explore the UI component library with interactive examples</p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-[16px] border border-divider bg-[var(--card-bg)] p-1" role="tablist" aria-label="Component categories">
        {TABS.map((t) => {
          const on = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={cn("flex h-9 items-center gap-[6px] rounded-[8px] px-4 text-[14px] font-medium whitespace-nowrap text-ink transition-[background-color,opacity] duration-200", on ? "bg-row" : "opacity-75 hover:opacity-100")}
            >
              <Ico h={t.icon} size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div key={tab} className="animate-[k-fade_0.3s_ease-out]">
        {tab === "data" ? <DataDisplay /> : <NoExamples label={current.label} onBack={() => setTab("data")} />}
      </div>
    </div>
  );
}
