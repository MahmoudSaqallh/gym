"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { MiniStatCard, PageHeader } from "../section-ui";
import { TrendChart } from "../charts";
import { cn } from "@/lib/cn";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VOLUME = [0, 11849, 0, 7037, 0, 6931, 1932];
const SPLIT = [
  ["Chest", 19, "var(--split-1)"],
  ["Back", 23, "var(--split-2)"],
  ["Legs", 28, "var(--split-3)"],
  ["Shoulders", 15, "#0F7D6E"],
  ["Arms", 10, "#12678F"],
  ["Core", 5, "#2F4F96"],
] as const;
const RECORDS = [
  { label: "Farthest run", date: "Nov 7", value: "6.81 km", icon: "34ab6" },
  { label: "Longest session", date: "Nov 2", value: "60 min", icon: "ca648" },
  { label: "Bench press", date: "Nov 6", value: "90.0 kg", icon: "12b7c" },
  { label: "Most steps in a day", date: "Nov 3", value: "13,000 steps", icon: "79e9c" },
];
const SESSIONS = [
  { name: "Push Day", date: "Nov 6", min: 55, kcal: 520, img: "5e34d.png" },
  { name: "Pull Day", date: "Nov 4", min: 50, kcal: 480, img: "3c681.png" },
  { name: "Leg Day", date: "Nov 2", min: 60, kcal: 610, img: "77229.png" },
  { name: "Upper Body Strength", date: "Oct 31", min: 48, kcal: 445, img: "d0240.png" },
];

export function ProgressWorkouts() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Workout Performance" subtitle="Sessions, duration and intensity, this week against the last." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Sessions" icon="9e110" value={[{ n: 6 }]} sub="in your recent log" bars={[0.6, 0.7, 0.75, 0.8, 0.8, 0.85, 0.85]} delay={0} />
        <MiniStatCard label="Volume lifted" icon="566e4" value={[{ n: 27749 }]} sub="kg this week" bars={[0.4, 1, 0.4, 0.7, 0.4, 0.7, 0.55]} delay={70} />
        <MiniStatCard label="Personal records" icon="37fc6" value={[{ n: 4 }]} sub="standing right now" bars={[0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 1]} delay={140} />
        <MiniStatCard label="Muscle groups" icon="71ba5" value={[{ n: 6 }]} sub="trained this week" bars={[0.6, 1, 1, 1, 1, 1, 1]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[379fr_379fr_378fr]">
        <PerformanceCard />

        <VolumeCard />

        <TrainingSplitCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[379fr_379fr_378fr]">
        <RecordsCard />

        <RecentSessionsCard />

        <BodyCompositionCard className="md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}

function VolumeCard() {
  const [active, setActive] = useState(1);
  const MAX = 15000;
  const H = 280;
  return (
    <Card delay={140} className="flex flex-col p-5" aria-label="Weekly volume">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] leading-6 font-semibold text-ink">Weekly Volume</h2>
          <p className="mt-1 text-[13px] font-medium text-accent-ink">+109% on last week</p>
        </div>
        <p className="flex items-baseline gap-1">
          <span className="text-[18px] font-semibold text-ink">27.7K</span>
          <span className="text-[13px] text-muted">kg lifted</span>
        </p>
      </div>
      <div className="relative mt-auto pt-6" style={{ height: H + 50 }}>
        {[15000, 10000, 5000, 0].map((t) => (
          <div key={t} className="absolute inset-x-0 flex items-center gap-3" style={{ top: 24 + ((MAX - t) / MAX) * H - 6 }}>
            <span className="w-[26px] text-[11px] text-muted">{t ? `${t / 1000}K` : "0"}</span>
            <span className="h-0 flex-1 border-t border-dashed" style={{ borderColor: "var(--grid-line)" }} />
          </div>
        ))}
        <ul className="absolute bottom-[26px] start-10 end-0 flex items-end justify-between px-1" style={{ height: H }}>
          {VOLUME.map((v, i) => {
            const h = Math.max(4, (v / MAX) * H);
            const on = i === active;
            return (
              <li key={i} className="relative flex flex-1 cursor-pointer justify-center" onMouseEnter={() => setActive(i)} tabIndex={0} onFocus={() => setActive(i)} aria-label={`${DAYS[i]}: ${v.toLocaleString("en-US")} kg`}>
                {on && v > 0 && (
                  <span key={i} className="absolute z-10 rounded-[8px] bg-[#313334] px-[10px] py-[6px] text-[12px] font-medium whitespace-nowrap text-white animate-[k-pop_0.3s_ease-out_both]" style={{ bottom: Math.min(h + 8, H - 26) }}>
                    {v.toLocaleString("en-US")} kg
                  </span>
                )}
                <span
                  className="k-bar block w-[34px] rounded-[6px]"
                  style={{ height: h, "--d": `${300 + i * 70}ms`, background: `linear-gradient(180deg, ${on ? "var(--lime-bright)" : "var(--lime)"} 0%, var(--bar-to) 100%)` } as React.CSSProperties}
                />
              </li>
            );
          })}
        </ul>
        <div className="absolute bottom-0 start-10 end-0 flex justify-between px-1 text-[12px]">
          {DAYS.map((d, i) => (
            <span key={d} className={cn("flex-1 text-center", i === active ? "font-medium text-ink" : "text-muted")}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function TrainingSplitCard({ className }: { className?: string }) {
  return (
    <Card delay={200} className={cn("flex flex-col p-5", className)} aria-label="Training split">
          <h2 className="text-[16px] leading-6 font-semibold text-ink">Training Split</h2>
          <p className="mt-[2px] text-[13px] text-muted">Where the volume went this week.</p>
          <div className="mt-5 flex h-2 overflow-hidden rounded-full" aria-hidden>
            {SPLIT.map(([l, v, c], i) => (
              <span key={l} className="k-fill h-full" style={{ width: `${v}%`, background: c, "--d": `${300 + i * 90}ms` } as React.CSSProperties} />
            ))}
          </div>
          <ul className="mt-[14px] flex flex-1 flex-col justify-between">
            {SPLIT.map(([l, v, c], i) => (
              <li key={l} className={cn("k-in-left flex items-center gap-2 py-[15px] text-[13.5px]", i > 0 && "border-t border-divider")} style={{ "--d": `${300 + i * 60}ms` } as React.CSSProperties}>
                <span className="size-2.5 rounded-full" style={{ background: c }} />
                <span className="flex-1 text-body">{l}</span>
                <span className="font-semibold text-ink">{v}%</span>
              </li>
            ))}
          </ul>
        </Card>
  );
}

export function RecentSessionsCard({ className }: { className?: string }) {
  return (
    <Card delay={160} className={cn("p-5", className)} aria-label="Recent sessions">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-ink">Recent Sessions</h2>
            <a href="#" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
              View all
            </a>
          </div>
          <ul className="mt-4 flex flex-col gap-[14px]">
            {SESSIONS.map((s, i) => (
              <li key={s.name} className="k-in-left group flex items-center gap-3" style={{ "--d": `${220 + i * 80}ms` } as React.CSSProperties}>
                <span className="relative size-[42px] flex-none overflow-hidden rounded-[8px]">
                  <Image src={`/assets/f/${s.img}`} alt="" fill sizes="42px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-ink">{s.name}</span>
                  <span className="text-[12.5px] text-muted">{s.date}</span>
                </span>
                <span className="flex items-center gap-1 text-[12.5px] text-muted">
                  <Ico h="54625" size={13} />
                  {s.min} min
                </span>
                <span className="flex items-center gap-1 text-[12.5px] text-accent-ink">
                  <Ico h="408f7" size={13} />
                  {s.kcal} kcal
                </span>
              </li>
            ))}
          </ul>
        </Card>
  );
}

export function BodyCompositionCard({ className }: { className?: string }) {
  return (
    <Card delay={220} className={cn("flex flex-col p-5", className)} aria-label="Body composition">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[17px] font-semibold text-ink">Body Composition</h2>
            <div className="flex gap-3 text-[13px] text-body">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-lime" />
                Weight
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green" />
                Muscle mass
              </span>
            </div>
          </div>
          <div className="mt-auto pt-5">
            <TrendChart
              curve
              labels={["Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov"]}
              min={59.5}
              max={77}
              ticks={[60, 65, 70, 75].map((v) => ({ v, label: String(v) }))}
              width={340}
              height={230}
              plot={{ x: 36, y: 8, w: 298, h: 196 }}
              format={(v) => `${v} kg`}
              series={[
                { values: [76.1, 75.9, 75.7, 75.5, 75.4, 75.3, 75.3, 75.3], color: "var(--lime)", area: true, width: 1.8, label: "Weight" },
                { values: [61, 61.4, 61.8, 62.1, 62.2, 62.4, 62.5, 62.6], color: "var(--green)", area: true, width: 1.8, label: "Muscle mass" },
              ]}
            />
          </div>
        </Card>
  );
}

export function PerformanceCard({ className }: { className?: string }) {
  return (
    <Card delay={80} className={cn("flex flex-col p-5", className)} aria-label="Performance overview">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Performance Overview</h2>
            <PeriodPill label="Week" className="w-[108.6px]" />
          </div>
          {[
            { icon: "3a8ee", label: "Workouts", value: <CountUp value={3} delay={200} className="text-[22px] font-semibold text-ink" />, delta: "-1" },
            {
              icon: "11737",
              label: "Duration",
              value: (
                <span className="flex items-baseline gap-[2px]">
                  <CountUp value={2} delay={200} className="text-[22px] font-semibold text-ink" />
                  <span className="text-[12px] font-medium text-muted">h</span>
                  <CountUp value={45} delay={200} className="ms-1 text-[22px] font-semibold text-ink" />
                  <span className="text-[12px] font-medium text-muted">m</span>
                </span>
              ),
              delta: "-2m",
            },
          ].map((s, i) => (
            <div key={s.label} className={cn("flex gap-3", i === 0 ? "mt-5" : "mt-4")}>
              <IcoChip h={s.icon} size={32} iconSize={21} />
              <div>
                <p className="text-[13px] text-muted">{s.label}</p>
                <div className="mt-[6px] leading-[22px]">{s.value}</div>
                <p className="mt-[6px] text-[11.5px]">
                  <span className="font-medium text-accent-ink">{s.delta}</span> <span className="text-muted">vs last week</span>
                </p>
              </div>
            </div>
          ))}
          <div className="mt-auto pt-3">
            <TrendChart
              labels={DAYS}
              max={800}
              ticks={[0, 200, 400, 600, 800].map((v) => ({ v, label: String(v) }))}
              width={340}
              height={128}
              plot={{ x: 40, y: 6, w: 296, h: 100 }}
              format={(v) => `${v} kcal`}
              series={[
                { values: [0, 610, 0, 480, 180, 520, 0], color: "var(--lime)", dots: "small", width: 2.2, label: "This Week" },
                { values: [500, 0, 260, 0, 380, 0, 450], color: "var(--muted)", width: 1.3, label: "Last Week" },
              ]}
            />
            <div className="mt-1 flex justify-center gap-5 text-[12.5px]">
              <span className="flex items-center gap-2 text-body">
                <span className="size-2.5 rounded-full bg-lime" />
                This Week
              </span>
              <span className="flex items-center gap-2 text-muted">
                <span className="size-2.5 rounded-full bg-muted" />
                Last Week
              </span>
            </div>
          </div>
        </Card>
  );
}

export function RecordsCard({ className }: { className?: string }) {
  return (
    <Card delay={100} className={cn("p-5", className)} aria-label="Personal records">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <Ico h="c6ea9" size={16} className="animate-[k-heartbeat_2.4s_ease-in-out_infinite]" />
            Personal Records
          </h2>
          <ul className="mt-4 flex flex-col gap-[22px]">
            {RECORDS.map((r, i) => (
              <li key={r.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${200 + i * 80}ms` } as React.CSSProperties}>
                <IcoChip h={r.icon} size={30} iconSize={19} />
                <span className="flex-1 text-[14px] text-body">{r.label}</span>
                <span className="text-[12px] text-muted">{r.date}</span>
                <span className="w-[80px] text-end text-[14px] font-semibold text-ink">{r.value}</span>
              </li>
            ))}
          </ul>
        </Card>
  );
}
