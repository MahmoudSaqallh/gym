"use client";

import Image from "next/image";
import { Card, CountUp, useShown } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { PeriodPill } from "@/components/ui/primitives";
import { CardHead, MiniStatCard, PageHeader, RangeSelect, ViewAllButton } from "../section-ui";
import { Ring, TrendChart } from "../charts";
import { cn } from "@/lib/cn";
import { ACTIVITY, BREAKDOWN, HOURLY, RECENT, type ActivityPeriod } from "./data";

export function ActivityView({ period }: { period: ActivityPeriod["key"] }) {
  const d = ACTIVITY[period];
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Activity" subtitle="Track your daily movement and keep the momentum going.">
        <RangeSelect value="Last 7 Days" options={["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"]} />
      </PageHeader>

      <div className="mt-[-2px] grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        {d.stats.map((s, i) => (
          <MiniStatCard
            key={`${period}-${s.label}`}
            label={s.label}
            icon={s.icon}
            value={s.value}
            bars={s.bars}
            delay={i * 70}
            sub={
              <>
                <span className="text-accent-ink">{s.delta}</span> {d.vsLabel}
              </>
            }
          />
        ))}
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[461.4fr_239.8fr_434.8fr]">
        <OverviewCard key={period} d={d} />
        <InsightCard />
        <RingsCard />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[346.5fr_344.1fr_445.3fr]">
        <BreakdownCard />
        <HourlyCard />
        <RecentCard className="md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}

/* ───────── Activity overview (line chart) ───────── */
function OverviewCard({ d }: { d: ActivityPeriod }) {
  const c = d.chart;
  const fmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v >= 100000 ? 0 : 1)}K` : String(v));
  return (
    <Card delay={120} className="flex min-h-[368px] flex-col p-5 md:col-span-2 wide:col-span-1" aria-label="Activity overview">
      <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Activity Overview</h2>
      <div className="mt-2 flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
        <span className="flex items-center gap-2 text-[14px] leading-[21px] text-body">
          <span className="size-2 rounded-full bg-lime" />
          {c.legend[0]}
        </span>
        <span className="flex items-center gap-2 text-[14px] leading-[21px] text-muted">
          <span className="size-2 rounded-full bg-muted" />
          {c.legend[1]}
        </span>
        <PeriodPill label={c.unit} options={["Days", "Weeks", "Months"]} icon={false} className="min-w-[89.4px] justify-center" />
      </div>
      <div className="mt-4">
        <TrendChart
          labels={c.labels}
          max={c.max}
          ticks={c.ticks}
          format={fmt}
          series={[
            { values: c.current, color: "var(--lime)", area: true, dots: "ring", label: c.legend[0] },
            { values: c.previous, color: "var(--muted)", width: 1.5, dots: "small", label: c.legend[1] },
          ]}
        />
      </div>
      <div className="k-in mt-auto flex flex-wrap items-center gap-3 rounded-[12px] bg-row py-3 ps-3 pe-3 sm:flex-nowrap" style={{ "--d": "500ms" } as React.CSSProperties}>
        <IcoChip h="3e4ae" size={40} iconSize={25} />
        <div className="min-w-0 flex-1">
          <p className="max-w-[190px] text-[14px] leading-[21px] font-medium text-ink">
            You are more active than <CountUp value={d.percentile} delay={600} />% of Kinora users
          </p>
          <p className="mt-[2px] truncate text-[12.5px] leading-[18.75px] text-muted">Keep it up! You&apos;re building a strong habit.</p>
        </div>
        <a
          href="#"
          className="group flex h-10 flex-none items-center gap-2 rounded-[12px] border border-divider ps-[14px] pe-[14px] text-[14px] leading-[21px] text-body transition-colors hover:border-[var(--nav-active-border)] hover:text-accent-ink"
        >
          View Insights
          <Ico h="5b866" size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </a>
      </div>
    </Card>
  );
}

/* ───────── Performance insight (photo card) ───────── */
function InsightCard() {
  return (
    <Card delay={200} className="group min-h-[368px] p-5" aria-label="Performance insight">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/assets/f/9ab28.png" alt="" fill priority sizes="(min-width:1380px) 240px, 50vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,7,0.92)_0%,rgba(6,8,7,0.62)_45%,rgba(6,8,7,0.12)_75%)]" />
      <div className="relative flex h-full flex-col">
        <span className="k-in-left flex h-[35.5px] w-fit items-center gap-2 rounded-full bg-black/45 ps-[14px] pe-[14px] text-[13px] font-medium text-white backdrop-blur-[2px]" style={{ "--d": "300ms" } as React.CSSProperties}>
          <Ico h="1918d" size={15} className="animate-[k-spin_8s_linear_infinite]" />
          Performance Insight
        </span>
        <h3 className="mt-[23px] max-w-[190px] text-[21px] leading-[28.4px] font-semibold text-white">
          <span className="k-in-left block" style={{ "--d": "380ms" } as React.CSSProperties}>
            Consistency is
          </span>
          <span className="k-in-left block" style={{ "--d": "460ms" } as React.CSSProperties}>
            your <span className="text-lime">superpower</span>
          </span>
        </h3>
        <p className="k-in mt-[11px] max-w-[136px] text-[13.5px] leading-[22px] text-white/72" style={{ "--d": "540ms" } as React.CSSProperties}>
          Great job staying active! Keep pushing to beat your best week.
        </p>
        <a
          href="#"
          className="k-in k-shine group/btn mt-auto flex h-10 w-fit items-center gap-[10px] rounded-[16px] bg-lime ps-6 pe-6 text-[15px] font-semibold text-[var(--on-accent)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-105"
          style={{ "--d": "620ms" } as React.CSSProperties}
        >
          Keep Going
          <Ico h="e3e93" size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
        </a>
      </div>
    </Card>
  );
}

/* ───────── Activity rings ───────── */
const RING_ROWS = [
  { label: "Move", value: "2,450 / 3,000 kcal", icon: "ff857" },
  { label: "Exercise", value: "105 / 120 min", icon: "9f424" },
  { label: "Stand", value: "10 / 12 hr", icon: "35d54" },
];

function RingsCard() {
  return (
    <Card delay={280} className="flex min-h-[368px] flex-col p-5" aria-label="Activity rings">
      <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Activity Rings</h2>
      <div className="mt-[35.5px] flex flex-wrap items-center gap-x-3 gap-y-6 sm:flex-nowrap">
        <div className="relative mx-auto size-[192px] flex-none sm:mx-0">
          <Ring size={192} stroke={16} pct={0.817} delay={350} className="absolute inset-0" />
          <Ring size={156} stroke={16} pct={0.875} delay={550} className="absolute start-[18px] top-[18px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[14px] leading-[21px] text-muted">Today</span>
            <span className="mt-[8px] flex items-baseline">
              <CountUp value={84} delay={400} className="text-[34px] leading-[34px] font-semibold text-ink" />
              <span className="ms-0.5 text-[16px] text-body">%</span>
            </span>
            <span className="mt-[12px] text-[14px] leading-[21px] text-muted">Great job!</span>
          </div>
        </div>
        <ul className="min-w-0 flex-1 basis-[180px]">
          {RING_ROWS.map((r, i) => (
            <li
              key={r.label}
              className={cn("k-in-left flex items-center gap-[10px] py-[13px]", i > 0 && "border-t border-divider")}
              style={{ "--d": `${450 + i * 100}ms` } as React.CSSProperties}
            >
              <IcoChip h={r.icon} size={32} iconSize={20} />
              <span>
                <span className="block text-[14px] leading-[18.9px] font-medium text-ink">{r.label}</span>
                <span className="block text-[12.5px] leading-[18.75px] text-muted">{r.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="k-in mt-auto flex h-11 items-center gap-2 rounded-[12px] border border-divider px-[10px] text-[12px] leading-[18px] font-medium tracking-[-0.3px] text-ink" style={{ "--d": "700ms" } as React.CSSProperties}>
        <Ico h="1ecf7" size={18} className="animate-[k-heartbeat_2.4s_ease-in-out_infinite]" />
        You closed all your rings 3 times this week!
      </p>
    </Card>
  );
}

/* ───────── Activity breakdown ───────── */
function BreakdownCard() {
  return (
    <Card delay={160} className="flex min-h-[377px] flex-col px-5 pb-5 pt-5" aria-label="Activity breakdown">
      <CardHead title="Activity Breakdown">
        <ViewAllButton />
      </CardHead>
      <ul className="mt-5 flex flex-1 flex-col justify-between gap-4">
        {BREAKDOWN.map((b, i) => (
          <li key={b.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${250 + i * 90}ms` } as React.CSSProperties}>
            <IcoChip h={b.icon} size={42} iconSize={26} className="transition-transform duration-300 hover:scale-110" />
            <span className="w-[76px] flex-none text-[16px] leading-6 font-medium text-ink">{b.label}</span>
            <span className="min-w-0 flex-1 pt-[17px]">
              <span className="block h-2 overflow-hidden rounded-[4px] bg-track">
                {b.fill > 0 && <span className="k-fill block h-full rounded-[4px] bg-lime" style={{ width: `${b.fill * 100}%`, "--d": `${350 + i * 90}ms` } as React.CSSProperties} />}
              </span>
              <span className="mt-[7px] block h-[19.5px] text-[13px] leading-[19.5px] text-muted">{b.detail}</span>
            </span>
            <span className="flex-none pb-[6px] text-end text-[17px] leading-[25.5px] font-semibold whitespace-nowrap text-accent-ink">
              <CountUp value={b.pct} delay={350 + i * 90} /> %
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Hourly heat map ───────── */
const ROW_LABELS = ["12 AM", "", "6 AM", "", "12 PM", "", "6 PM", ""];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const intensity = (hex: string) => (hex ? Math.max(0, Math.min(1, (239 - parseInt(hex.slice(1, 3), 16)) / 85)) : 0);

function HourlyCard() {
  return (
    <Card delay={240} className="flex min-h-[377px] flex-col p-5" aria-label="Hourly activity">
      <CardHead title="Hourly Activity">
        <ViewAllButton />
      </CardHead>
      <HeatGrid />
    </Card>
  );
}

function HeatGrid() {
  const shown = useShown();
  return (
    <div className="mt-4 grid grid-cols-[44px_repeat(7,minmax(0,1fr))] gap-x-[6px] gap-y-[6px]" role="grid" aria-label="Activity by hour and day">
      {HOURLY.map((row, r) => (
        <div key={r} className="contents" role="row">
          <span className="text-[13px] leading-[27px] text-muted">{ROW_LABELS[r]}</span>
          {row.map((hex, c) => {
            const t = intensity(hex);
            return (
              <span
                key={c}
                role="gridcell"
                aria-label={`${DAYS[c]} ${ROW_LABELS[r - (r % 2)] || ""}: ${Math.round(t * 100)}%`}
                title={`${DAYS[c]} · ${Math.round(t * 100)}% active`}
                className={cn(
                  "h-[27px] rounded-[8px] transition-[scale,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:scale-110 hover:shadow-[0_0_0_2px_var(--lime)]",
                  hex ? "k-heat bg-[var(--c)] dark:bg-[color-mix(in_oklab,var(--lime)_calc(var(--t)*100%),var(--track))]" : "bg-track",
                  shown ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                style={{ "--c": hex, "--t": t, transitionDelay: shown ? `${200 + (r + c) * 35}ms` : "0ms" } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
      <span />
      {DAYS.map((d) => (
        <span key={d} className="pt-[4px] text-center text-[12px] leading-[18px] text-muted">
          {d}
        </span>
      ))}
    </div>
  );
}

/* ───────── Recent activities ───────── */
function RecentCard({ className }: { className?: string }) {
  return (
    <Card delay={320} className={cn("flex min-h-[377px] flex-col px-5 pb-4 pt-5", className)} aria-label="Recent activities">
      <CardHead title="Recent Activities">
        <ViewAllButton />
      </CardHead>
      <ul className="mt-2">
        {RECENT.map((r, i) => (
          <li key={r.title} className={cn("k-in-left", i > 0 && "border-t border-divider")} style={{ "--d": `${380 + i * 90}ms` } as React.CSSProperties}>
            <a href="#" className="group -mx-2 flex h-[72px] items-center gap-[14px] rounded-[12px] px-2 transition-colors hover:bg-[var(--nav-hover)]">
              <IcoChip h={r.icon} size={42} iconSize={26} />
              <span className="relative h-12 w-[58px] flex-none overflow-hidden rounded-[12px]">
                <Image src={`/assets/f/${r.img}`} alt="" fill sizes="58px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] leading-5 font-medium text-ink">{r.title}</span>
                <span className="mt-1 block truncate text-[13.5px] leading-[20.25px] text-muted">{r.when}</span>
              </span>
              <span className="text-end">
                <span className="block text-[15px] leading-[22.5px] font-medium whitespace-nowrap text-ink">{r.dist}</span>
                <span className="block text-[13.5px] leading-[20.25px] whitespace-nowrap text-muted">{r.time}</span>
              </span>
              <Ico h="b6a60" size={18} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
