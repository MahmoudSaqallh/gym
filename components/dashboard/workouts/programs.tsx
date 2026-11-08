"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { MiniStatCard, PageHeader } from "../section-ui";
import { cn } from "@/lib/cn";

const STATS = [
  { label: "Program progress", icon: "39c42", value: [{ n: 62, unit: "%" }], sub: "of this block", bars: [0.3, 0.38, 0.45, 0.52, 0.6, 0.72, 0.85, 1] },
  { label: "Current week", icon: "632fb", value: [{ n: 6, unit: "/ 8" }], sub: "of your program", bars: [0.35, 0.42, 0.5, 0.58, 0.66, 0.78, 0.9, 1] },
  { label: "Sessions a week", icon: "41c3d", value: [{ n: 4 }], sub: "as prescribed", bars: [0.8, 0.85, 0.8, 0.9, 0.85, 0.8, 0.95, 0.8] },
  { label: "Programs available", icon: "c1ca9", value: [{ n: 4 }], sub: "ready to start", bars: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 1] },
];

const PROGRAMS = [
  { name: "Lean Build", level: "Advanced", img: "88978.png", text: "A twelve week hypertrophy block: higher volume, tighter rest, and a push toward visible change.", weeks: "12 weeks", freq: "5 a week", focus: "Hypertrophy" },
  { name: "First Steps", level: "Beginner", img: "d2360.png", text: "Six weeks to build the habit. Short full body sessions that teach the movements before the weight.", weeks: "6 weeks", freq: "3 a week", focus: "Full body" },
  { name: "Conditioning", level: "Intermediate", img: "d9168.png", text: "Four weeks of intervals and circuits to lift work capacity without touching your strength work.", weeks: "4 weeks", freq: "4 a week", focus: "Endurance" },
];

const WEEK = [
  { d: "Mon", s: "Push", meta: "6 moves · 55 min" },
  { d: "Tue", s: "Pull", meta: "6 moves · 50 min" },
  { d: "Wed", s: "Rest", meta: "Recovery day" },
  { d: "Thu", s: "Legs", meta: "5 moves · 60 min" },
  { d: "Fri", s: "Push", meta: "6 moves · 45 min" },
  { d: "Sat", s: "Rest", meta: "Recovery day" },
  { d: "Sun", s: "Rest", meta: "Recovery day" },
];

const INCLUDES = [
  { icon: "ccd41", title: "Structured sessions", text: "Every session written out, set by set, before you walk in." },
  { icon: "119f4", title: "Built-in progression", text: "Load and volume step up on a schedule you can hold." },
  { icon: "ec28e", title: "Exercise swaps", text: "Every movement has an alternative for the kit you actually have." },
  { icon: "3f5af", title: "Form guidance", text: "Cues and common mistakes attached to each movement." },
  { icon: "9a1ed", title: "Guided warm-ups", text: "A warm-up matched to the session, so you start ready." },
  { icon: "90c96", title: "Progress tracking", text: "Every set logged, so the next one knows what the last did." },
];

export function Programs() {
  const [started, setStarted] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Training Programs" subtitle="Follow a structured plan, week by week, and let the sessions build on each other." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <MiniStatCard key={s.label} label={s.label} icon={s.icon} value={s.value} sub={s.sub} bars={s.bars} delay={i * 70} />
        ))}
      </div>

      {/* currently running */}
      <Card delay={150} className="group flex min-h-[170px] flex-col sm:flex-row" aria-label="Currently running">
        <div className="relative h-[168px] flex-none overflow-hidden sm:w-[260px]">
          <Image src="/assets/f/304ea.png" alt="" fill priority sizes="260px" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-6 px-5 py-6">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] leading-[18px] font-medium tracking-[1.2px] text-accent-ink uppercase">Currently running</p>
            <p className="mt-[5.75px] text-[22px] leading-[30px] font-semibold text-ink">{started ?? "Strength Foundation"}</p>
            <p className="mt-[2px] text-[13.5px] leading-[20.25px] text-muted">8 weeks, 4 sessions a week</p>
            <div className="mt-[20px] flex items-center gap-3">
              <span className="h-2 flex-1 overflow-hidden rounded-[4px] bg-track-2">
                <span key={started ?? "sf"} className="k-fill block h-full rounded-[4px] bg-lime" style={{ width: started ? "4%" : "62%", "--d": "400ms" } as React.CSSProperties} />
              </span>
              <span className="w-[42px] text-[15px] font-semibold text-ink">
                <CountUp key={started ?? "sf"} value={started ? 4 : 62} delay={400} />%
              </span>
            </div>
          </div>
          <a
            href="#"
            className="k-shine group/btn flex h-[41px] items-center gap-[10px] rounded-[12px] bg-cta ps-5 pe-4 text-[14px] font-semibold text-[var(--on-accent)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-105"
          >
            Continue
            <Ico h="e3e93" size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
          </a>
        </div>
      </Card>

      <div className="grid gap-[14px] md:grid-cols-2 xl:grid-cols-3">
        {PROGRAMS.map((p, i) => (
          <Card key={p.name} delay={200 + i * 80} className="group flex min-h-[337px] flex-col" aria-label={p.name}>
            <div className="relative h-[150px] flex-none overflow-hidden">
              <Image src={`/assets/f/${p.img}`} alt="" fill sizes="(min-width:1280px) 380px, 50vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 start-3 rounded-full bg-black/60 px-[10px] py-[3px] text-[11.5px] font-medium text-white/90 backdrop-blur-[2px]">{p.level}</span>
            </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
              <h3 className="text-[16px] leading-6 font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-[13px] leading-[21px] text-muted">{p.text}</p>
              <div className="mt-[11px] flex flex-wrap items-center gap-x-[19px] gap-y-1 text-[12.5px] leading-[18.75px] text-muted">
                <span className="flex items-center gap-[6px]">
                  <Ico h="ea217" size={13} />
                  {p.weeks}
                </span>
                <span className="flex items-center gap-[6px]">
                  <Ico h="5a4ed" size={13} />
                  {p.freq}
                </span>
                <span className="flex items-center gap-[6px]">
                  <Ico h="5177d" size={13} />
                  {p.focus}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStarted(p.name)}
                className={cn(
                  "k-shine mt-auto ms-auto flex h-9 items-center rounded-[12px] px-4 text-[13.5px] font-semibold transition-[filter,translate] hover:-translate-y-0.5",
                  started === p.name ? "bg-pill text-accent-ink" : "bg-lime text-[var(--on-accent)] hover:brightness-105",
                )}
              >
                {started === p.name ? "Started ✓" : "Start program"}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-[14px] lg:grid-cols-2">
        <Card delay={260} className="p-5" aria-label="This week">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] leading-6 font-semibold text-ink">This Week</h2>
            <span className="text-[12.5px] text-muted">Week 6 of 8</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {WEEK.map((w, i) => {
              const rest = w.s === "Rest";
              return (
                <li
                  key={w.d}
                  className={cn(
                    "k-in-left flex h-[40.25px] items-center rounded-[12px] px-[14px] transition-transform duration-300 hover:translate-x-1 rtl:hover:-translate-x-1",
                    rest ? "bg-row" : "bg-[rgb(var(--lime-rgb)/0.16)]",
                  )}
                  style={{ "--d": `${300 + i * 60}ms` } as React.CSSProperties}
                >
                  <span className="w-[52px] text-[12.5px] font-medium tracking-[0.75px] text-muted uppercase">{w.d}</span>
                  <span className={cn("flex-1 text-[13.5px] font-medium", rest ? "text-muted" : "text-ink")}>{w.s}</span>
                  <span className="text-[12.5px] text-muted">{w.meta}</span>
                  <span className={cn("ms-[14px] size-2 rounded-full", rest ? "bg-[#d9a400]" : "bg-lime")} />
                </li>
              );
            })}
          </ul>
        </Card>
        <Card delay={320} className="p-5" aria-label="What every program includes">
          <h2 className="text-[16px] leading-6 font-semibold text-ink">What every program includes</h2>
          <ul className="mt-5 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {INCLUDES.map((f, i) => (
              <li key={f.title} className="k-in group flex gap-3" style={{ "--d": `${350 + i * 70}ms` } as React.CSSProperties}>
                <IcoChip h={f.icon} size={38} iconSize={24} className="transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110" />
                <span>
                  <span className="block text-[13.5px] leading-[20.25px] font-medium text-ink">{f.title}</span>
                  <span className="mt-[2px] block max-w-[200px] text-[12.5px] leading-[20px] text-muted">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
