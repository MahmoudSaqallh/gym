"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";

/* ───────── data (from Figma frame "Client – Workouts") ───────── */
const TODAY = [
  { name: "Push Up", muscle: "Chest", sets: "4 × 12-20", img: "697d2.png" },
  { name: "Pull Up", muscle: "Back", sets: "4 × 5-8", img: "06ccb.png" },
  { name: "Walking Lunge", muscle: "Legs", sets: "3 × 12-16", img: "7e243.png" },
  { name: "Plank", muscle: "Core", sets: "3 × 45-60", img: "c567f.png" },
];
const SPLIT = [
  ["Mon", "Push"],
  ["Tue", "Pull"],
  ["Wed", "Legs"],
  ["Thu", "Core"],
  ["Fri", "Push"],
  ["Sat", "Core"],
  ["Sun", "Core"],
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/* bar heights in Figma (163.5px = 12k) → kg; they sum to the 27,749 weekly total */
const VOLUME = [0, 11849, 0, 7037, 0, 6931, 1932];
const MUSCLES = [
  { label: "Chest", pct: 19, color: "var(--split-1)", d: "M128.991 72.012C128.794 83.292 125.312 94.2697 118.971 103.601C112.629 112.932 103.704 120.21 93.289 124.546" },
  { label: "Back", pct: 23, color: "var(--split-2)", d: "M91.407 125.291C78.5126 130.138 64.3142 130.237 51.3535 125.571C38.3928 120.904 27.5159 111.778 20.67 99.824" },
  { label: "Legs", pct: 28, color: "var(--split-3)", d: "M19.694 98.05C15.7919 90.6488 13.5372 82.4909 13.0848 74.1362C12.6324 65.7816 13.9929 57.4279 17.073 49.6486C20.1531 41.8693 24.8799 34.8484 30.9289 29.0679C36.9779 23.2874 44.2059 18.884 52.117 16.16" },
  { label: "Shoulders", pct: 15, color: "#0F7D6E", d: "M54.043 15.534C62.469 12.9579 71.3712 12.3354 80.0738 13.7138C88.7763 15.0922 97.0504 18.4352 104.268 23.489" },
  { label: "Arms", pct: 10, color: "#12678F", d: "M105.905 24.679C115.135 31.6345 122.077 41.1891 125.84 52.117" },
  { label: "Core", pct: 5, color: "#2F4F96", d: "M126.466 54.043C128.047 59.2143 128.897 64.5813 128.991 69.988" },
];
const SESSIONS = [
  { name: "Push Day", date: "Nov 6", muscles: "Chest, Shoulders, Triceps", min: 55, kcal: 520, img: "5e34d.png" },
  { name: "Pull Day", date: "Nov 4", muscles: "Back, Biceps", min: 50, kcal: 480, img: "3c681.png" },
  { name: "Leg Day", date: "Nov 2", muscles: "Legs, Calves", min: 60, kcal: 610, img: "77229.png" },
];
const COACH = [
  { name: "Upper Body Strength", date: "Sat, Nov 7" },
  { name: "Conditioning", date: "Sun, Nov 8" },
  { name: "Core & Mobility", date: "Tue, Nov 10" },
  { name: "Leg Day", date: "Tue, Nov 3" },
];

export function WorkoutsOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid gap-[14px] lg:grid-cols-[554.75fr_595.25fr]">
        <PlanHero />
        <TodayWorkout />
      </div>
      <div className="grid gap-[14px] sm:grid-cols-2 wide:grid-cols-[179.9fr_303fr_298.9fr_340.1fr]">
        <WeeklySplit />
        <ProgressCard />
        <MuscleFocus />
        <RecentSessions />
      </div>
      <CoachCard />
      <NextSession />
    </div>
  );
}

/* ───────── Workout plan hero (always dark) ───────── */
function PlanHero() {
  const stats: { icon: string; label: string[]; value: { n: number; u?: string }[]; note: string; good?: boolean }[] = [
    { icon: "da4e8", label: ["Workouts", "Completed"], value: [{ n: 3 }], note: "This Month" },
    { icon: "04a5b", label: ["Training", "Time"], value: [{ n: 2, u: "h" }, { n: 45, u: "m" }], note: "This Month" },
    { icon: "5844d", label: ["Recovery", "Readiness"], value: [{ n: 91, u: "%" }], note: "Good", good: true },
  ];
  return (
    <Card delay={0} className="k-dark-card min-h-[419px] p-6" aria-label="Workout plan">
      <div aria-hidden className="pointer-events-none absolute end-[-40px] top-[41px] h-[406px] w-[309.5px] mix-blend-screen max-sm:end-[-140px] max-sm:opacity-60">
        <div className="relative size-full animate-[k-float_7s_ease-in-out_infinite]">
          <Image src="/assets/f/46db4.png" alt="" fill priority sizes="310px" className="object-cover" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,7,0.97)_0%,rgba(6,8,7,0.9)_34%,rgba(6,8,7,0.4)_58%,rgba(6,8,7,0.05)_78%)]" />
      <div className="relative">
        <p className="k-in-left text-[16px] leading-6 text-[#b2b4b6]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Let&apos;s train, Demo
        </p>
        <div className="mt-[19px] flex items-center gap-3">
          <h1 className="k-in-left text-[30px] leading-[42.5px] font-medium text-white sm:text-[34px]" style={{ "--d": "160ms" } as React.CSSProperties}>
            Workout Plan
          </h1>
          <IcoChip h="f7ac6" size={38} iconSize={24} tone="onDark" className="k-in-pop [&>*]:animate-[k-heartbeat_2s_ease-in-out_infinite]" />
        </div>
        <p className="k-in-left mt-[18px] max-w-[243px] text-[15px] leading-[25.5px] text-[#b2b4b6]" style={{ "--d": "220ms" } as React.CSSProperties}>
          Stay consistent. Train smart. Build strength that lasts.
        </p>
      </div>
      <div
        className="k-in relative mt-[15px] grid w-full max-w-[323px] grid-cols-[94.4fr_96.2fr_94.4fr] rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,13,0.3),rgba(5,6,7,0.34))] py-[19px] ps-[18px] pe-2 shadow-[inset_0_0_22px_rgba(200,205,210,0.04)] backdrop-blur-[4px]"
        style={{ "--d": "300ms" } as React.CSSProperties}
      >
        {stats.map((s, i) => (
          <div key={s.note + i} className={cn("flex flex-col", i > 0 && "border-s border-white/10 ps-[10px]")}>
            <IcoChip h={s.icon} size={36} iconSize={22} tone="onDark" />
            <span className="mt-[9.9px] text-[13px] leading-[16.25px] font-medium text-[#8e8e8e]">
              {s.label[0]}
              <br />
              {s.label[1]}
            </span>
            <span className="mt-[16.6px] flex items-baseline gap-[2px] whitespace-nowrap">
              {s.value.map((v, j) => (
                <span key={j} className="flex items-baseline gap-[2px]">
                  <CountUp value={v.n} delay={450 + i * 120} className="text-[25px] leading-[25px] font-medium text-white" />
                  {v.u && <span className="me-[3px] text-[12px] font-medium text-[#8e8e8e]">{v.u}</span>}
                </span>
              ))}
            </span>
            <span className={cn("mt-[16.25px] text-[14px] leading-[21px] font-medium", s.good ? "text-lime" : "text-[#d5d8d7]")}>{s.note}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────── Today's workout (tap a row to mark it done) ───────── */
function TodayWorkout() {
  const [done, setDone] = useState<boolean[]>(TODAY.map(() => false));
  return (
    <Card delay={90} className="flex min-h-[419px] flex-col p-5" aria-label="Today's workout">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Today&apos;s Workout</h2>
        <a href="#" className="text-[14px] leading-[21px] text-muted transition-colors hover:text-accent-ink">
          View full plan
        </a>
      </div>
      <ul className="mt-3 flex flex-1 flex-col justify-between gap-3 pb-[21px]">
        {TODAY.map((t, i) => (
          <li key={t.name} className="k-in-left" style={{ "--d": `${200 + i * 80}ms` } as React.CSSProperties}>
            <button
              type="button"
              onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={done[i]}
              className="group flex h-[52px] w-full items-center gap-[10px] rounded-[12px] bg-row p-1 pe-[10px] text-start transition-[filter] hover:brightness-[0.98] dark:hover:brightness-125"
            >
              <span className="relative h-11 w-[86px] flex-none overflow-hidden rounded-[10px]">
                <Image src={`/assets/f/${t.img}`} alt="" fill sizes="86px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[15px] leading-[18.75px] font-medium text-ink transition-opacity", done[i] && "line-through opacity-60")}>{t.name}</span>
                <span className="mt-[2px] block text-[13px] leading-[16.25px] text-accent-ink">{t.muscle}</span>
              </span>
              <span className="text-[15px] leading-[22.5px] whitespace-nowrap text-body">{t.sets}</span>
              <ProgressDot pct={done[i] ? 100 : 0} />
            </button>
          </li>
        ))}
      </ul>
      <div className="k-in flex h-[38px] items-center rounded-[12px] bg-row px-4" style={{ "--d": "520ms" } as React.CSSProperties}>
        <IcoChip h="edc4b" size={26} iconSize={16} />
        <span className="ms-[10px] text-[14px] text-muted">Est. Duration</span>
        <span className="ms-auto flex items-baseline gap-1 text-[15px] font-medium text-ink">
          <CountUp value={35} delay={500} />
          <span className="text-[13px] text-muted">min</span>
        </span>
        <span className="mx-[25px] h-6 w-px bg-divider" />
        <IcoChip h="67e62" size={26} iconSize={16} />
        <span className="ms-[10px] text-[14px] text-muted">Est. Calories</span>
        <span className="ms-auto flex items-baseline gap-1 text-[15px] font-medium text-ink">
          <CountUp value={390} delay={550} />
          <span className="text-[13px] text-muted">kcal</span>
        </span>
      </div>
    </Card>
  );
}

function ProgressDot({ pct }: { pct: number }) {
  return (
    <span className="relative grid size-[26px] flex-none place-items-center">
      <svg viewBox="0 0 26 26" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={13} cy={13} r={11.5} stroke="var(--track-2)" strokeWidth={3} fill="none" />
        <circle
          cx={13}
          cy={13}
          r={11.5}
          stroke="var(--lime)"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100 100"
          style={{ strokeDashoffset: 100 - pct, transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="text-[7px] font-semibold text-ink">{pct}%</span>
    </span>
  );
}

/* ───────── Weekly split ───────── */
function WeeklySplit() {
  const today = 1; // Mon
  return (
    <Card delay={120} className="flex min-h-[388px] flex-col p-5" aria-label="Weekly split">
      <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Weekly Split</h2>
      <ul className="mt-3 flex flex-1 flex-col justify-between gap-2">
        {SPLIT.map(([d, t], i) => (
          <li
            key={d}
            className={cn(
              "k-in-left flex h-[37px] items-center rounded-e-[8px] border-s-[3px] border-lime bg-row ps-3 text-[14px] leading-[21px] transition-transform duration-300 hover:translate-x-1 rtl:hover:-translate-x-1",
              i === today - 1 && "shadow-[inset_0_0_0_1px_rgb(var(--lime-rgb)/0.35)]",
            )}
            style={{ "--d": `${180 + i * 55}ms` } as React.CSSProperties}
          >
            <span className="w-[46px] text-body">{d}</span>
            <span className="size-2 rounded-full bg-lime" />
            <span className="ms-[10px] font-medium text-ink">{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Workout progress (bars) ───────── */
function ProgressCard() {
  const [active, setActive] = useState(1);
  const MAX = 12000;
  const H = 163.5;
  return (
    <Card delay={180} className="flex min-h-[388px] flex-col p-5" aria-label="Workout progress">
      <div className="flex items-center justify-between gap-2">
        <h2 className="truncate text-[18px] leading-[27px] font-semibold text-ink">Workout Progress</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <p className="mt-[11px] text-[13px] leading-[19.5px] text-muted">Total Volume (kg)</p>
      <p className="mt-[14px] flex items-baseline gap-2">
        <CountUp value={27749} delay={300} className="text-[30px] leading-[30px] font-semibold text-ink" />
        <span className="text-[16px] font-medium text-muted">kg</span>
      </p>
      <p className="mt-[11.5px] text-[14px] leading-[21px]">
        <span className="font-medium text-accent-ink">+109%</span> <span className="text-muted">vs last week</span>
      </p>
      <div className="relative mt-auto h-[188px] pt-[10px]">
        {["12k", "9k", "6k", "3k", "0"].map((l, i) => (
          <div key={l} className="absolute inset-x-0 flex items-center gap-[14px]" style={{ top: 10 + (i * H) / 4 - 6 }}>
            <span className="w-[26px] text-[11px] leading-[11px] text-muted">{l}</span>
            <span className="h-0 flex-1 border-t-[0.8px] border-dashed" style={{ borderColor: "var(--grid-line)" }} />
          </div>
        ))}
        <ul className="absolute bottom-[24px] start-[40px] end-0 flex h-[163.5px] items-end justify-between px-[4px]">
          {VOLUME.map((v, i) => {
            const h = Math.max(4, (v / MAX) * H);
            const on = i === active;
            return (
              <li key={i} className="relative flex w-4 cursor-pointer justify-center" onMouseEnter={() => setActive(i)} tabIndex={0} onFocus={() => setActive(i)} aria-label={`${DAYS[i]}: ${v.toLocaleString("en-US")} kg`}>
                {on && (
                  <span key={i} className="absolute z-10 flex h-[30px] items-center rounded-[8px] bg-[#313334] px-[10px] text-[12px] font-medium whitespace-nowrap text-white animate-[k-pop_0.3s_ease-out_both]" style={{ bottom: Math.min(h + 10, H - 30) }}>
                    {v.toLocaleString("en-US")}
                    <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#313334]" />
                  </span>
                )}
                <span
                  className={cn("k-bar block w-4", v ? "rounded-[6px]" : "rounded-[2px]")}
                  style={{ height: h, "--d": `${300 + i * 70}ms`, background: `linear-gradient(180deg, ${on ? "var(--lime-bright)" : "var(--lime)"} 0%, var(--bar-to) 100%)` } as React.CSSProperties}
                />
              </li>
            );
          })}
        </ul>
        <div className="absolute bottom-0 start-[40px] end-0 flex justify-between px-[4px]">
          {DAYS.map((d, i) => (
            <span key={d} className={cn("flex w-4 justify-center text-[12px] leading-[18px]", i === active ? "font-medium text-ink" : "text-muted")}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────── Muscle focus donut ───────── */
function MuscleFocus() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Card delay={240} className="flex min-h-[388px] flex-col p-5" aria-label="Muscle focus">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Muscle Focus</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="my-auto flex items-center gap-3 pt-4">
        <div className="relative size-[142px] flex-none">
          <svg viewBox="0 0 142 142" className="size-full" role="img" aria-label={MUSCLES.map((m) => `${m.label} ${m.pct}%`).join(", ")}>
            {MUSCLES.map((m, i) => (
              <path
                key={m.label}
                d={m.d}
                pathLength={1}
                strokeWidth={hover === i ? 30 : 26}
                stroke={m.color}
                fill="none"
                className="k-draw cursor-pointer transition-[stroke-width,opacity] duration-300"
                style={{ "--d": `${300 + i * 160}ms`, "--dur": "0.6s", opacity: hover === null || hover === i ? 1 : 0.45 } as React.CSSProperties}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11.5px] leading-[17px] text-muted">{hover === null ? "Focus" : MUSCLES[hover].label}</span>
            <span className="text-[14.5px] leading-[21.75px] font-semibold text-ink">{hover === null ? "Balanced" : `${MUSCLES[hover].pct}%`}</span>
          </div>
        </div>
        <ul className="flex flex-col gap-[14px]">
          {MUSCLES.map((m, i) => (
            <li
              key={m.label}
              className={cn("k-in-left flex items-center gap-2 transition-opacity", hover !== null && hover !== i && "opacity-50")}
              style={{ "--d": `${400 + i * 60}ms` } as React.CSSProperties}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="size-2.5 flex-none rounded-full" style={{ background: m.color }} />
              <span className="w-[34px] text-[13.5px] leading-[18px] font-semibold text-ink">{m.pct}%</span>
              <span className="truncate text-[13px] leading-[13px] text-muted">{m.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ───────── Recent sessions ───────── */
function RecentSessions() {
  return (
    <Card delay={300} className="flex min-h-[388px] flex-col p-5" aria-label="Recent sessions">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Recent Sessions</h2>
        <a href="#" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
          View all
        </a>
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {SESSIONS.map((s, i) => (
          <li key={s.name} className="k-in-left group flex h-[76px] items-center gap-3 rounded-[12px] bg-row p-[6px] pe-3" style={{ "--d": `${360 + i * 90}ms` } as React.CSSProperties}>
            <span className="relative h-16 w-[76px] flex-none overflow-hidden rounded-[10px]">
              <Image src={`/assets/f/${s.img}`} alt="" fill sizes="76px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[15px] leading-[18.75px] font-medium text-ink">{s.name}</span>
                <span className="text-[13px] whitespace-nowrap text-muted">{s.date}</span>
              </span>
              <span className="mt-[3px] block truncate text-[13px] leading-[16.25px] text-muted">{s.muscles}</span>
              <span className="mt-[6px] flex items-center gap-1 text-[12.5px] leading-[18.75px] text-muted">
                <Ico h="9f2f0" size={14} />
                {s.min} min
                <Ico h="f2bc2" size={14} className="ms-3" />
                {s.kcal} kcal
              </span>
            </span>
            <span className="grid size-[26px] flex-none place-items-center rounded-full bg-lime transition-transform duration-500 group-hover:rotate-[360deg]" aria-label="Completed">
              <Ico h="8e2d0" size={16} />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── From your coach ───────── */
function CoachCard() {
  const [done, setDone] = useState<Set<number>>(new Set());
  return (
    <Card delay={160} className="p-5" aria-label="From your coach">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-[10px]">
          <IcoChip h="5f41a" size={36} iconSize={22} />
          <h2 className="text-[18px] leading-[27px] font-semibold text-ink">From your coach</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative size-7 overflow-hidden rounded-[6.72px]">
            <Image src="/assets/f/d50bb.png" alt="" fill sizes="28px" className="object-cover" />
          </span>
          <span className="text-[13px] text-body">Demo Trainer</span>
          <button type="button" className="ms-2 flex h-8 items-center gap-2 rounded-[12px] border border-divider px-3 text-[12px] font-medium text-ink transition-colors hover:border-[var(--nav-active-border)]">
            <Ico h="ba02f" size={15} />
            Message
          </button>
        </div>
      </div>
      <ul className="mt-[14px] flex flex-col gap-[23px]">
        {COACH.map((c, i) => {
          const isDone = done.has(i);
          return (
            <li key={c.name} className="k-in-left flex items-center gap-3" style={{ "--d": `${250 + i * 80}ms` } as React.CSSProperties}>
              {isDone ? (
                <span className="grid size-[38px] flex-none place-items-center rounded-full bg-lime animate-[k-pop_0.4s_ease-out]">
                  <Ico h="8e2d0" size={20} />
                </span>
              ) : (
                <IcoChip h="1cb8b" size={38} iconSize={24} tone="warm" />
              )}
              <span className="min-w-0 flex-1">
                <span className={cn("block text-[14px] leading-[21px] font-medium text-ink", isDone && "line-through opacity-60")}>{c.name}</span>
                <span className="block text-[12px] leading-[18px] text-muted">{c.date}</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setDone((s) => {
                    const n = new Set(s);
                    if (n.has(i)) n.delete(i);
                    else n.add(i);
                    return n;
                  })
                }
                className={cn(
                  "h-[25px] rounded-full px-[10px] text-[11.5px] font-medium transition-colors",
                  isDone ? "bg-lime text-[var(--on-accent)]" : "bg-pill text-body hover:brightness-95 dark:hover:brightness-125",
                )}
              >
                {isDone ? "Done" : "To do"}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ───────── Next session banner ───────── */
function NextSession() {
  return (
    <Card delay={220} className="k-dark-card group flex min-h-[116px] flex-wrap items-center gap-x-6 gap-y-4 px-5 py-5" aria-label="Next session">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/assets/f/ae7d0.png" alt="" fill sizes="100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,7,0.97)_0%,rgba(6,8,7,0.92)_46%,rgba(6,8,7,0.6)_70%,rgba(6,8,7,0.25)_100%)]" />
      <div className="relative flex min-w-0 flex-1 items-center gap-4">
        <IcoChip h="ded56" size={56} iconSize={35} className="flex-none [&>*]:animate-[k-float_1.8s_ease-in-out_infinite]" />
        <div className="min-w-0">
          <p className="text-[13px] leading-[19.5px] text-white/66">Next Session</p>
          <p className="text-[22px] leading-[33px] font-semibold text-white sm:text-[26px] sm:leading-[39px]">Core &amp; Mobility is Tomorrow</p>
          <p className="text-[14px] leading-[21px] text-white/72">Build power. Build confidence.</p>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-[10px]">
          <IcoChip h="28f33" size={36} iconSize={22} />
          <span>
            <span className="block text-[12.5px] leading-[18.75px] text-white/66">Duration</span>
            <span className="text-[16px] font-medium text-white">
              30 <span className="text-[12.5px] text-white/66">min</span>
            </span>
          </span>
        </div>
        <span className="h-9 w-px bg-white/14" />
        <div className="flex items-center gap-[10px]">
          <IcoChip h="5711b" size={36} iconSize={22} />
          <span>
            <span className="block text-[12.5px] leading-[18.75px] text-white/66">Est. Calories</span>
            <span className="text-[16px] font-medium text-white">
              260 <span className="text-[12.5px] text-white/66">kcal</span>
            </span>
          </span>
        </div>
        <span className="hidden h-9 w-px bg-white/14 sm:block" />
        <a
          href="#"
          className="k-shine group/btn flex h-11 items-center gap-[10px] rounded-[12px] bg-[linear-gradient(180deg,var(--grad-from)_0%,var(--grad-to)_100%)] ps-6 pe-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(var(--grad-rgb)/0.9)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-110"
        >
          Start Session
          <Ico h="a5c04" size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
        </a>
      </div>
    </Card>
  );
}
