"use client";

import { useState } from "react";
import { Card } from "@/components/ui/primitives";
import { IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { MiniStatCard, PageHeader } from "../section-ui";
import { AchievementsCard, CategoryCard } from "./progress-overview";
import { PerformanceCard, RecentSessionsCard, RecordsCard } from "./progress-workouts";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Four weeks, Monday-first, 1 = kept.
const HABITS = [
  {
    name: "Training",
    icon: "7efdf",
    target: 5,
    grid: "0010101" + "0101010" + "1010101" + "0101010",
  },
  {
    name: "Hydration",
    icon: "dfe9d",
    target: 7,
    grid: "1101110" + "1011110" + "0000100" + "1100010",
  },
  {
    name: "Sleep",
    icon: "5124e",
    target: 7,
    grid: "1101110" + "1110110" + "0010100" + "1110111",
  },
];

const MILESTONES = [
  { label: "Sessions this month", icon: "d3788", value: 18, goal: 24, unit: "sessions" },
  { label: "Volume lifted", icon: "7efdf", value: 42800, goal: 50000, unit: "kg" },
  { label: "Training streak", icon: "6f113", value: 5, goal: 14, unit: "days" },
  { label: "Active minutes", icon: "ee9ad", value: 320, goal: 500, unit: "m" },
];

function streaks(days: boolean[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return { current: run, best };
}

function HabitCard({ habit, delay }: { habit: (typeof HABITS)[number]; delay: number }) {
  const [days, setDays] = useState(() => [...habit.grid].map((c) => c === "1"));
  const { current, best } = streaks(days);
  const toggle = (i: number) => setDays((d) => d.map((v, j) => (j === i ? !v : v)));

  return (
    <Card delay={delay} className="p-4" aria-label={`${habit.name} habit`}>
      <div className="flex items-center gap-3">
        <IcoChip h={habit.icon} size={36} iconSize={22} />
        <div className="min-w-0">
          <h2 className="truncate text-[14.5px] leading-[21.75px] font-medium text-ink">{habit.name}</h2>
          <p className="text-[12px] leading-[18px] text-muted">Target: {habit.target} days a week</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-x-[6px] gap-y-[6px]" role="group" aria-label={`${habit.name}, last four weeks`}>
        {DAYS.map((d) => (
          <span key={d} className="pb-[2px] text-center text-[12px] leading-[18px] text-muted" aria-hidden>
            {d}
          </span>
        ))}
        {days.map((kept, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={kept}
            aria-label={`Week ${Math.floor(i / 7) + 1}, ${DAYS[i % 7]}: ${kept ? "kept" : "missed"}`}
            onClick={() => toggle(i)}
            className={cn(
              "k-in-pop h-[26px] rounded-[8px] transition-[background-color,scale,box-shadow] duration-300 hover:scale-[1.06] active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
              kept ? "bg-lime shadow-[0_2px_8px_-3px_rgb(var(--lime-rgb)/0.7)]" : "bg-track hover:bg-track-2",
            )}
            style={{ "--d": `${delay + 150 + (Math.floor(i / 7) + (i % 7)) * 35}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11.5px] leading-[17.25px] text-muted">
        <span className="flex items-center gap-[6px]">
          <span className="size-[10px] rounded-[3px] bg-lime" /> Kept
        </span>
        <span className="flex items-center gap-[6px]">
          <span className="size-[10px] rounded-[3px] bg-track" /> Missed
        </span>
      </div>

      <p className="mt-5 flex items-baseline gap-[6px] text-[12px] leading-[18px] text-muted" aria-live="polite">
        Current
        <span key={`c${current}`} className="k-in-pop me-4 text-[18px] font-semibold text-ink" style={{ "--d": "0ms" } as React.CSSProperties}>
          {current}
        </span>
        Best
        <span key={`b${best}`} className="k-in-pop text-[18px] font-semibold text-accent-ink" style={{ "--d": "0ms" } as React.CSSProperties}>
          {best}
        </span>
      </p>
    </Card>
  );
}

export function MilestonesCard({ className }: { className?: string }) {
  return (
    <Card delay={120} className={cn("p-5", className)} aria-label="Next milestones">
      <h2 className="text-[17px] leading-6 font-semibold text-ink">Next Milestones</h2>
      <p className="mt-[3px] text-[12.5px] leading-[19px] text-muted">The goals still running, and how close each one is.</p>
      <ul className="mt-[18px] flex flex-col gap-5">
        {MILESTONES.map((m, i) => {
          const pct = Math.min(1, m.value / m.goal);
          return (
            <li key={m.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${200 + i * 80}ms` } as React.CSSProperties}>
              <IcoChip h={m.icon} size={36} iconSize={22} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13.5px] leading-[20.25px] font-medium text-ink">{m.label}</span>
                  <span className="whitespace-nowrap text-[12.5px] text-muted">
                    <span className="font-semibold text-ink">{m.value.toLocaleString("en-US")}</span> / {m.goal.toLocaleString("en-US")} {m.unit}
                  </span>
                </div>
                <div
                  className="mt-[6px] h-[6px] overflow-hidden rounded-[3px] bg-track"
                  role="progressbar"
                  aria-label={m.label}
                  aria-valuemin={0}
                  aria-valuemax={m.goal}
                  aria-valuenow={m.value}
                >
                  <div className="k-fill h-full rounded-[3px] bg-lime" style={{ width: `${pct * 100}%`, "--d": `${350 + i * 90}ms` } as React.CSSProperties} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function Habits() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Habits" subtitle="Four weeks of kept and missed, and the streaks that came out of it." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Adherence" icon="71ba5" value={[{ n: 51, unit: "%" }]} sub="72 of 140 days kept" bars={[0.46, 0.5, 0.5, 0.88, 0.85, 0.69, 1]} delay={0} />
        <MiniStatCard label="Best streak" icon="c1b41" value={[{ n: 6 }]} sub="days in a row" bars={[0.46, 0.46, 0.46, 0.67, 0.77, 0.46, 1]} delay={70} />
        <MiniStatCard label="Streaks running" icon="39c42" value={[{ n: 2, unit: "/ 5" }]} sub="alive right now" bars={[0.46, 0.73, 0.73, 1, 0.46, 1, 1]} delay={140} />
        <MiniStatCard label="Days tracked" icon="9e110" value={[{ n: 140 }]} sub="across every habit" bars={[0.46, 0.5, 0.5, 0.88, 0.85, 0.69, 1]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        {HABITS.map((h, i) => (
          <HabitCard key={h.name} habit={h} delay={60 + i * 70} />
        ))}
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <MilestonesCard />
        <CategoryCard />
        <AchievementsCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <PerformanceCard />
        <RecordsCard />
        <RecentSessionsCard className="md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}
