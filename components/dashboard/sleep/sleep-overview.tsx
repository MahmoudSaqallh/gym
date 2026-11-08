"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Ring, Sparkline } from "../charts";
import { cn } from "@/lib/cn";

const STAGES = [
  { label: "Deep", pct: 24, dur: "1 h 41 m", color: "var(--lime-3)", d: "M144.99 80.152C144.704 96.5387 138.331 112.233 127.112 124.18C115.892 136.127 100.629 143.473 84.293 144.787" },
  { label: "Light", pct: 50, dur: "3 h 30 m", color: "var(--green)", d: "M81.994 144.932C64.7092 145.713 47.8087 139.676 34.9315 128.119C22.0542 116.563 14.23 100.412 13.1436 83.1435C12.0572 65.8751 17.7954 48.8707 29.1227 35.7915C40.45 22.7122 56.4605 14.6041 73.707 13.213" },
  { label: "REM", pct: 20, dur: "1 h 24 m", color: "var(--lime-2)", d: "M76.006 13.068C89.5366 12.4536 102.929 16.017 114.365 23.2745C125.801 30.5321 134.727 41.1325 139.932 53.637" },
  { label: "Awake", pct: 6, dur: "25 m", color: "#A49A86", d: "M140.78 55.779C143.434 62.8407 144.858 70.3051 144.99 77.848" },
];
const SCHEDULE = [
  ["Sun", "10:22 PM", "6:12 AM", 21.73, 124.62],
  ["Mon", "10:45 PM", "6:20 AM", 27.84, 120.65],
  ["Tue", "10:15 PM", "6:05 AM", 19.88, 124.62],
  ["Wed", "10:30 PM", "6:10 AM", 23.86, 121.98],
  ["Thu", "10:50 PM", "6:25 AM", 29.16, 120.65],
  ["Fri", "11:05 PM", "6:40 AM", 33.14, 120.65],
  ["Sat", "10:32 PM", "6:08 AM", 24.39, 120.92],
] as const;
const NIGHTS = [
  { day: "Today", h: 7, m: 0, score: 82 },
  { day: "Fri, Nov 6", h: 7, m: 36, score: 84 },
  { day: "Thu, Nov 5", h: 7, m: 18, score: 80 },
  { day: "Wed, Nov 4", h: 6, m: 54, score: 76 },
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function SleepOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4 wide:grid-cols-[452.6fr_repeat(4,163.85fr)]">
        <Hero />
        <MetricCard icon="e4e25" label="Sleep Duration" delay={80} value={<><Big n={7} /> <Unit>h</Unit> <Big n={24} /> <Unit>m</Unit></>} note="+12% vs last week">
          <Bars hs={[104, 75.39, 92.54, 46.79, 69.67, 86.82, 52.51]} delay={80} />
        </MetricCard>
        <MetricCard icon="79458" label="Sleep Score" delay={140} value={<><Big n={82} /> <Unit>/100</Unit></>} note="+9 pts vs last week">
          <Sparkline
            width={129.85}
            height={104}
            points={[
              [9.08, 6.34],
              [27.7, 12.7],
              [46.31, 0],
              [64.92, 57.19],
              [83.53, 31.76],
              [102.14, 6.34],
              [120.77, 19.06],
            ].map(([x, y]) => [x, y + 6.34] as [number, number])}
            delay={400}
          />
        </MetricCard>
        <MetricCard icon="8dc9c" label="Bedtime" delay={200} value={<><span className="text-[36px] leading-[45px] font-semibold text-ink">10:32</span> <Unit>PM</Unit></>} note="-5 min vs last week" compact>
          <Bars hs={[54.79, 81.1, 46.79, 63.95, 86.82, 104, 66.23]} delay={200} />
        </MetricCard>
        <MetricCard icon="1ca05" label="Wake Time" delay={260} value={<><span className="text-[36px] leading-[45px] font-semibold text-ink">6:08</span> <Unit>AM</Unit></>} note="-9 min vs last week" muted compact>
          <Bars hs={[58.23, 71.31, 46.79, 54.96, 79.48, 104, 51.68]} delay={260} />
        </MetricCard>
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[379fr_342.1fr_414.9fr]">
        <StagesCard />
        <TrendCard />
        <ScheduleCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[378.9fr_349.9fr_407.3fr]">
        <NightsCard />
        <RecoveryCard />
        <TipCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <Card delay={200} className="k-dark-card group flex min-h-24 flex-wrap items-center gap-4 px-5 py-5" aria-label="Improve your sleep">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/assets/f/00ecd.png" alt="" fill sizes="100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,6,9,0.97)_0%,rgba(4,6,9,0.9)_44%,rgba(4,6,9,0.55)_72%,rgba(4,6,9,0.2)_100%)]" />
        <IcoChip h="0364c" size={54} iconSize={33} className="relative [&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
        <div className="relative min-w-0 flex-1">
          <p className="text-[19px] leading-[28px] font-semibold text-white sm:text-[23px] sm:leading-[34.5px]">Good sleep tonight, stronger tomorrow.</p>
          <p className="text-[14px] leading-[21px] text-white/72">Prioritize rest. Maximize recovery. Achieve more.</p>
        </div>
        <a
          href="#"
          className="k-shine group/btn relative flex h-11 items-center gap-[10px] rounded-[12px] bg-[linear-gradient(180deg,var(--grad-from)_0%,var(--grad-to)_100%)] ps-6 pe-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(var(--grad-rgb)/0.9)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-110"
        >
          Improve Sleep
          <Ico h="c7855" size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
        </a>
      </Card>
    </div>
  );
}

const Big = ({ n }: { n: number }) => <CountUp value={n} delay={300} className="text-[36px] leading-[45px] font-semibold text-ink" />;
const Unit = ({ children }: { children: React.ReactNode }) => <span className="text-[17px] font-medium text-muted">{children}</span>;

/* ───────── Hero (always dark) ───────── */
function Hero() {
  const stats: { icon: string; label: string; value: { n: number; u?: string }[]; note: string; good: boolean }[] = [
    { icon: "748a9", label: "Avg. Sleep", value: [{ n: 7, u: "h" }, { n: 24, u: "m" }], note: "This week", good: false },
    { icon: "cb4ab", label: "Sleep Score", value: [{ n: 82 }], note: "Good", good: true },
    { icon: "c784f", label: "Recovery", value: [{ n: 91, u: "%" }], note: "Optimal", good: true },
  ];
  return (
    <Card delay={0} className="k-dark-card group min-h-[356.4px] p-5 sm:col-span-2 lg:col-span-4 wide:col-span-1" aria-label="Sleep overview">
      <div className="absolute inset-y-0 end-0 w-[48%] overflow-hidden">
        <Image src="/assets/f/04449.png" alt="" fill priority sizes="220px" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105 animate-[k-kenburns_2.4s_cubic-bezier(0.22,1,0.36,1)_both]" />
        <span className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d0e_0%,rgba(11,13,14,0.7)_34%,rgba(9,14,14,0.22)_68%,rgba(9,14,14,0)_100%)]" />
      </div>
      <div className="relative">
        <p className="k-in-left text-[15px] leading-[22.5px] text-[#b2b4b6]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Good night, Demo
        </p>
        <div className="mt-[11px] flex items-center gap-3">
          <h1 className="k-in-left text-[29px] leading-[36px] font-medium text-white" style={{ "--d": "160ms" } as React.CSSProperties}>
            Sleep Overview
          </h1>
          <IcoChip h="d9174" size={34} iconSize={21} tone="onDark" className="k-in-pop [&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
        </div>
        <p className="k-in-left mt-[13px] max-w-[176px] text-[14.5px] leading-[23px] text-[#b2b4b6]" style={{ "--d": "220ms" } as React.CSSProperties}>
          Rest well. Recover better. Quality sleep fuels your progress.
        </p>
      </div>
      <div
        className="k-in relative mt-[13px] grid w-full max-w-[310px] grid-cols-[101.6fr_104.8fr_88.6fr] rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,13,0.3),rgba(5,6,7,0.34))] py-[13px] ps-[13px] pe-2 shadow-[inset_0_0_22px_rgba(200,205,210,0.04)] backdrop-blur-[4px]"
        style={{ "--d": "300ms" } as React.CSSProperties}
      >
        {stats.map((s, i) => (
          <div key={s.label} className={cn("flex flex-col", i > 0 && "border-s border-white/10 ps-4")}>
            <IcoChip h={s.icon} size={30} iconSize={19} tone="onDark" />
            <span className="mt-[7.7px] text-[12.5px] leading-[18.75px] font-medium whitespace-nowrap text-[#8e8e8e]">{s.label}</span>
            <span className="mt-[10px] flex items-baseline gap-[3px] whitespace-nowrap">
              {s.value.map((v, j) => (
                <span key={j} className="flex items-baseline gap-[3px]">
                  <CountUp value={v.n} delay={450 + i * 120} className="text-[22px] leading-[22px] font-medium text-white" />
                  {v.u && <span className="me-[2px] text-[12px] font-medium text-[#8e8e8e]">{v.u}</span>}
                </span>
              ))}
            </span>
            <span className={cn("mt-[12px] text-[13px] leading-[19.5px] font-medium", s.good ? "text-lime" : "text-[#d5d8d7]")}>{s.note}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
  muted,
  compact,
  delay,
  children,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  note: string;
  muted?: boolean;
  compact?: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Card delay={delay} className="flex min-h-[356.4px] flex-col p-4 pb-[22px]" aria-label={label}>
      <p className="mt-1 flex items-center gap-[6px] text-[13px] leading-[19.5px] font-medium text-ink">
        <Ico h={icon} size={16} />
        {label}
      </p>
      <p className={cn("flex items-baseline gap-[2px] whitespace-nowrap", compact ? "mt-[22px]" : "mt-[31px]")}>{value}</p>
      <p className={cn("mt-[9px] text-[13px] leading-[19.5px] font-medium", muted ? "text-muted" : "text-accent-ink")}>{note}</p>
      <div className="mt-auto">{children}</div>
    </Card>
  );
}

function Bars({ hs, delay }: { hs: number[]; delay: number }) {
  return (
    <div className="flex h-[104px] items-end justify-between" aria-hidden>
      {hs.map((h, i) => (
        <span
          key={i}
          className="k-bar block w-[16px] rounded-[2px] bg-[linear-gradient(180deg,var(--lime-bright)_0%,rgb(var(--lime-rgb)/0.16)_100%)] transition-[filter] hover:brightness-110"
          style={{ height: h, "--d": `${delay + 200 + i * 60}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ───────── Sleep stages donut ───────── */
function StagesCard() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Card delay={120} className="flex min-h-[304.75px] flex-col p-5" aria-label="Sleep stages">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Sleep Stages</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="my-auto flex flex-wrap items-center gap-x-4 gap-y-5 pt-4">
        <div className="relative size-[158px] flex-none">
          <svg viewBox="0 0 158 158" className="size-full" role="img" aria-label={STAGES.map((s) => `${s.label} ${s.pct}%`).join(", ")}>
            {STAGES.map((s, i) => (
              <path
                key={s.label}
                d={s.d}
                pathLength={1}
                strokeWidth={hover === i ? 30 : 26}
                stroke={s.color}
                fill="none"
                className="k-draw transition-[stroke-width,opacity] duration-300"
                style={{ "--d": `${300 + i * 280}ms`, "--dur": "0.7s", opacity: hover === null || hover === i ? 1 : 0.45 } as React.CSSProperties}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {hover === null ? (
              <span className="flex items-baseline gap-[2px]">
                <span className="text-[22px] font-semibold text-ink">7</span>
                <span className="text-[12px] font-medium text-muted">h</span>
                <span className="ms-1 text-[22px] font-semibold text-ink">0</span>
                <span className="text-[12px] font-medium text-muted">m</span>
              </span>
            ) : (
              <span className="text-[22px] font-semibold text-ink">{STAGES[hover].pct}%</span>
            )}
            <span className="mt-1 text-[12px] text-muted">{hover === null ? "Total Sleep" : STAGES[hover].label}</span>
          </div>
        </div>
        <ul className="flex min-w-[150px] flex-1 flex-col gap-[14px]">
          {STAGES.map((s, i) => (
            <li
              key={s.label}
              className={cn("k-in-left flex items-start gap-[10px] transition-opacity", hover !== null && hover !== i && "opacity-50")}
              style={{ "--d": `${350 + i * 80}ms` } as React.CSSProperties}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="mt-[4px] size-2.5 flex-none rounded-full" style={{ background: s.color }} />
              <span className="flex-1">
                <span className="block text-[14.5px] leading-[18px] font-medium text-ink">{s.label}</span>
                <span className="mt-[3px] block text-[12.5px] text-muted">{s.dur}</span>
              </span>
              <span className="text-[14px] font-semibold text-ink">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ───────── Weekly sleep trend ───────── */
function TrendCard() {
  const PX_PER_H = 111 / 9;
  const pts: [number, number][] = [69.2, 108.81, 148.42, 188.03, 227.64, 267.25, 306.86].map((x, i) => [x - 56, [162.31, 168.47, 164.78, 174.64, 169.7, 166.02, 173.41][i] - 148.75]);
  return (
    <Card delay={180} className="flex min-h-[304.75px] flex-col p-5" aria-label="Weekly sleep trend">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Weekly Sleep Trend</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="mt-[18px] flex items-start justify-between">
        <div>
          <p className="flex items-baseline gap-[2px]">
            <CountUp value={7} delay={300} className="text-[26px] leading-[30px] font-semibold text-ink" />
            <span className="text-[13px] font-medium text-muted">h</span>
            <CountUp value={24} delay={300} className="ms-1 text-[26px] leading-[30px] font-semibold text-ink" />
            <span className="text-[13px] font-medium text-muted">m</span>
          </p>
          <p className="mt-[6px] text-[12.5px] text-muted">Avg. Sleep</p>
        </div>
        <p className="pt-[7px] text-[13px]">
          <span className="font-medium text-accent-ink">+12%</span> <span className="text-muted">vs last week</span>
        </p>
      </div>
      <div className="relative mt-auto">
        <div className="relative ms-9 h-[111px]">
          {[9, 7, 5, 3, 0].map((h) => (
            <div key={h} className="absolute inset-x-0 flex items-center" style={{ top: 111 - h * PX_PER_H }}>
              <span className="absolute -start-9 w-[26px] -translate-y-1/2 text-[11px] leading-[11px] text-muted">{h}h</span>
              <span className="h-0 w-full border-t-[0.8px] border-dashed" style={{ borderColor: "var(--grid-line)" }} />
            </div>
          ))}
          <div className="absolute inset-0">
            <Sparkline width={264.06} height={111} points={pts} stroke={3.4} dot={3.5} delay={350} />
          </div>
        </div>
        <div className="ms-9 mt-[9px] flex justify-between px-[6px] text-[12px] text-muted">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────── Sleep schedule ───────── */
function ScheduleCard({ className }: { className?: string }) {
  return (
    <Card delay={240} className={cn("flex min-h-[304.75px] flex-col p-5", className)} aria-label="Sleep schedule">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Sleep Schedule</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="mt-3 flex justify-center gap-5 text-[12.5px] text-body">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-lime" />
          Bedtime
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-lime" />
          Wake Time
        </span>
      </div>
      <ul className="mt-[10px] flex flex-1 flex-col justify-between">
        {SCHEDULE.map(([d, bed, wake, x, w], i) => (
          <li key={d} className="k-in-left group flex items-center gap-3 text-[12.5px] leading-[18.75px]" style={{ "--d": `${300 + i * 60}ms` } as React.CSSProperties}>
            <span className="w-[30px] text-muted">{d}</span>
            <span className="w-[60px] text-body">{bed}</span>
            <span className="relative mx-2 h-[7px] flex-1">
              <span className="absolute inset-x-0 top-[3px] h-px bg-track-2" />
              <span className="k-fill absolute top-[2px] h-[3px] rounded-[1.5px] bg-lime" style={{ left: `${(x / 190.93) * 100}%`, width: `${(w / 190.93) * 100}%`, "--d": `${400 + i * 60}ms` } as React.CSSProperties} />
              <span className="absolute top-0 size-[7px] -translate-x-1/2 rounded-full bg-lime transition-transform group-hover:scale-150" style={{ left: `${(x / 190.93) * 100}%` }} />
              <span className="absolute top-0 size-[7px] -translate-x-1/2 rounded-full bg-lime transition-transform group-hover:scale-150" style={{ left: `${((x + w) / 190.93) * 100}%` }} />
            </span>
            <span className="w-[60px] text-end text-body">{wake}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Recent nights ───────── */
function NightsCard() {
  const [logged, setLogged] = useState(false);
  return (
    <Card delay={160} className="p-5" aria-label="Recent nights">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Recent Nights</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLogged(true)}
            className="flex h-8 items-center gap-2 rounded-[12px] border border-divider px-3 text-[12px] font-medium text-ink transition-colors hover:border-[var(--nav-active-border)]"
          >
            <Ico h="43a81" size={14} />
            {logged ? "Logged ✓" : "Log a night"}
          </button>
          <a href="#" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
            View all
          </a>
        </div>
      </div>
      <ul className="mt-[16px] flex flex-col gap-2">
        {NIGHTS.map((n, i) => (
          <li key={n.day} className="k-in-left" style={{ "--d": `${250 + i * 80}ms` } as React.CSSProperties}>
            <a href="#" className="group flex h-[54px] items-center gap-[10px] rounded-[12px] bg-row ps-[10px] pe-3 transition-[filter,translate] hover:translate-x-1 rtl:hover:-translate-x-1 hover:brightness-[0.98] dark:hover:brightness-125">
              <Ico h="e4e25" size={16} />
              <span className="flex-1 text-[13.5px] font-medium text-ink">{n.day}</span>
              <span className="relative grid size-[38px] place-items-center">
                <Ring size={38} stroke={3} pct={n.score / 100} delay={350 + i * 80} className="absolute inset-0" />
                <span className="text-[12px] font-semibold text-ink">{n.score}</span>
              </span>
              <span className="w-[50px]">
                <span className="block text-[13px] leading-[19px] font-medium text-ink">
                  {n.h}
                  <span className="text-[11px] text-muted">h</span> {n.m}
                  <span className="text-[11px] text-muted">m</span>
                </span>
                <span className="block text-[11.5px] leading-[17px] text-accent-ink">Good</span>
              </span>
              <Ico h="28699" size={15} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Recovery & readiness ───────── */
function RecoveryCard() {
  const factors = [
    ["Sleep Quality", 82],
    ["HRV Balance", 91],
    ["Resting HR", 88],
  ] as const;
  return (
    <Card delay={220} className="flex flex-col p-5" aria-label="Recovery and readiness">
      <div className="flex items-center justify-between gap-2">
        <h2 className="truncate text-[18px] leading-[27px] font-semibold text-ink">Recovery &amp; Readiness</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="relative mx-auto mt-4 size-[128px]">
        <Ring size={128} stroke={10} pct={0.91} delay={300} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="flex items-baseline">
            <CountUp value={91} delay={300} className="text-[26px] leading-[30px] font-semibold text-ink" />
            <span className="text-[14px] text-body">%</span>
          </span>
          <span className="mt-[6px] text-[12px] text-muted">Ready</span>
        </div>
      </div>
      <p className="mt-[19px] max-w-[273px] text-[13px] leading-[19.5px] text-body">Your body is well recovered. You&apos;re ready to perform.</p>
      <p className="mt-[14px] text-[11.5px] font-medium tracking-[0.28px] text-muted uppercase">Key Factors</p>
      <ul className="mt-[12px] flex flex-col gap-[17px]">
        {factors.map(([l, v], i) => (
          <li key={l}>
            <span className="flex justify-between text-[12.5px]">
              <span className="text-body">{l}</span>
              <span className="font-semibold text-ink">{v}%</span>
            </span>
            <span className="mt-[6px] block h-[5px] overflow-hidden rounded-[2.5px] bg-track-2">
              <span className="k-fill block h-full rounded-[2.5px] bg-lime" style={{ width: `${v}%`, "--d": `${400 + i * 90}ms` } as React.CSSProperties} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Sleep tip (photo card) ───────── */
function TipCard({ className }: { className?: string }) {
  return (
    <Card delay={280} className={cn("k-dark-card group min-h-[433.6px] p-5", className)} aria-label="Sleep tip">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/assets/f/a0cae.png" alt="" fill sizes="(min-width:1380px) 408px, 100vw" className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.94)_0%,rgba(6,8,10,0.8)_38%,rgba(6,8,10,0.42)_72%,rgba(6,8,10,0.2)_100%)]" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <IcoChip h="9b238" size={38} iconSize={24} className="[&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
          <h2 className="text-[17px] font-semibold text-white">Sleep Tip</h2>
        </div>
        <p className="k-in mt-[11px] max-w-[366px] text-[14px] leading-[23px] text-white/78" style={{ "--d": "400ms" } as React.CSSProperties}>
          Keep a consistent bedtime and limit screen time before sleep for deeper rest.
        </p>
      </div>
    </Card>
  );
}
