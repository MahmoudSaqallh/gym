"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { PageHeader, RangeSelect } from "../section-ui";
import { Ring } from "../charts";
import { cn } from "@/lib/cn";

const FOCUS = [
  { title: "Improve Sleep", text: "Quality sleep boosts recovery and energy.", icon: "3a7da", href: "/dashboard/sleep" },
  { title: "Eat Balanced", text: "Fuel your body with the right nutrients.", icon: "76973", href: "/dashboard/nutrition" },
  { title: "Stay Active", text: "Movement every day keeps you strong.", icon: "ded56", href: "/dashboard/activity" },
];
const ESSENTIALS = [
  { label: "Hydration", value: "1.8 / 2.5 L", pct: 72, icon: "18ece" },
  { label: "Sleep", value: "7h 0m / 8h", pct: 88, icon: "24eaa" },
  { label: "Steps", value: "12,845 / 15,000", pct: 86, icon: "39af7" },
  { label: "Workouts", value: "3 / 5 days", pct: 60, icon: "19cac" },
];
const TIPS = [
  { title: "Start your day with a glass of water and a short walk.", text: "A simple habit with big benefits." },
  { title: "Stretch for five minutes every time you stand up from a desk.", text: "It keeps your hips and shoulders honest." },
  { title: "Put screens away an hour before bed.", text: "Your sleep score will notice by the weekend." },
  { title: "Put protein in every meal, not just after training.", text: "Recovery happens all day, not only at the gym." },
];

export function HealthOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Health" subtitle="Take care of your body. It's the only place you have to live.">
        <div className="flex items-center gap-2">
          <LogReading />
          <RangeSelect value="Last 7 Days" options={["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"]} />
        </div>
      </PageHeader>

      <div className="grid gap-[14px] md:grid-cols-[221.8fr_428.4fr] wide:grid-cols-[221.8fr_428.4fr_485.8fr]">
        <ScoreCard />
        <FocusCard />
        <QuoteCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] lg:grid-cols-[758.4fr_391.5fr]">
        <EssentialsCard />
        <TipsCard />
      </div>
    </div>
  );
}

function LogReading() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone(true)}
      className="flex h-8 items-center gap-2 rounded-[12px] border border-divider px-3 text-[12px] font-medium text-ink transition-colors hover:border-[var(--nav-active-border)]"
    >
      <Ico h="43a81" size={14} className={cn("transition-transform duration-300", done && "rotate-45")} />
      {done ? "Reading logged" : "Log a reading"}
    </button>
  );
}

export function ScoreCard({ horizontal = false }: { horizontal?: boolean }) {
  const title = (
    <h2 className="flex items-center justify-center gap-2 text-[17px] leading-[22px] font-medium text-ink">
      Your Health Score
      <span title="Combines sleep, activity, nutrition and recovery into one number." className="cursor-help">
        <Ico h="96f46" size={16} />
      </span>
    </h2>
  );
  const ring = (
    <div className="relative size-[164px] flex-none">
      <Ring size={164} stroke={14} pct={0.87} delay={250} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp value={87} delay={250} className="text-[52px] leading-[52px] font-semibold text-ink" />
        <span className="mt-[16px] text-[17px] leading-[17px] text-muted">/100</span>
      </div>
    </div>
  );
  const copy = (
    <>
      <p className="k-in-pop text-[22px] leading-[28px] font-semibold text-accent-ink" style={{ "--d": "900ms" } as React.CSSProperties}>
        Great
      </p>
      <p className="mt-[5px] max-w-[160px] text-[14px] leading-[24px] text-muted">You&apos;re doing great! Keep maintaining your healthy habits.</p>
      <p className="mt-[7px] text-[12.5px] font-medium text-body">+3 this week</p>
    </>
  );
  if (horizontal) {
    return (
      <Card delay={0} className="flex min-h-[288px] flex-col justify-center px-8 py-7" aria-label="Your health score">
        {title}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {ring}
          <div>{copy}</div>
        </div>
      </Card>
    );
  }
  return (
    <Card delay={0} className="flex min-h-[440.75px] flex-col items-center px-5 pb-6 pt-[34px] text-center" aria-label="Your health score">
      {title}
      <div className="mt-[27px]">{ring}</div>
      <div className="mt-[16px] flex flex-col items-center">{copy}</div>
    </Card>
  );
}

function FocusCard() {
  return (
    <Card delay={80} className="px-8 pb-6 pt-[35px]" aria-label="Focus on what matters">
      <h2 className="text-[18px] leading-[22px] font-semibold text-ink">Focus on What Matters</h2>
      <ul className="mt-4">
        {FOCUS.map((f, i) => (
          <li key={f.title} className={cn("k-in-left", i > 0 && "border-t border-divider")} style={{ "--d": `${200 + i * 100}ms` } as React.CSSProperties}>
            <Link href={f.href} className="group -mx-2 flex h-[111.6px] items-center gap-4 rounded-[12px] px-2 transition-colors hover:bg-[var(--nav-hover)]">
              <IcoChip h={f.icon} size={57} iconSize={35} className="transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-105" />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] leading-[21.25px] font-medium text-ink">{f.title}</span>
                <span className="mt-[6px] block text-[13.5px] leading-[16.9px] text-muted">{f.text}</span>
              </span>
              <Ico h="20392" size={20} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function QuoteCard({ className }: { className?: string }) {
  return (
    <Card delay={160} className={cn("k-dark-card group min-h-[440.75px]", className)} aria-label="Quote">
      <div className="absolute inset-x-0 top-[-110px] h-[548px]">
        <Image src="/assets/f/58b66.png" alt="" fill sizes="(min-width:1380px) 486px, 100vw" className="object-cover transition-transform duration-[2s] group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,9,8,0.1)_0%,rgba(6,9,8,0.45)_38%,rgba(6,9,8,0.965)_58%,rgba(6,9,8,0.984)_100%)]" />
      <div className="relative ms-auto flex h-full w-[45%] min-w-[200px] flex-col justify-center pe-8">
        <Ico h="124b8" size={24} className="k-in-pop" />
        <p className="k-in mt-3 max-w-[182px] text-[19px] leading-[29px] text-white" style={{ "--d": "300ms" } as React.CSSProperties}>
          Health is not just about what you&apos;re eating. It&apos;s also about what you&apos;re thinking and saying.
        </p>
        <p className="k-in mt-[19px] text-[15px] text-[var(--lime-bright)]" style={{ "--d": "450ms" } as React.CSSProperties}>
          Unknown
        </p>
      </div>
    </Card>
  );
}

export function EssentialsCard() {
  return (
    <Card delay={120} className="px-7 pb-8 pt-7" aria-label="Daily health essentials">
      <h2 className="text-[18px] leading-[22px] font-semibold text-ink">Daily Health Essentials</h2>
      <div className="mt-[34px] grid grid-cols-2 gap-y-8 sm:grid-cols-4">
        {ESSENTIALS.map((e, i) => (
          <div key={e.label} className={cn("k-in flex flex-col items-center px-4 text-center", i > 0 && "sm:border-s sm:border-divider")} style={{ "--d": `${200 + i * 100}ms` } as React.CSSProperties}>
            <IcoChip h={e.icon} size={53} iconSize={33} className="transition-transform duration-500 hover:-translate-y-1" />
            <span className="mt-5 text-[16px] leading-5 font-medium text-ink">{e.label}</span>
            <span className="mt-3 text-[17px] leading-[17px] whitespace-nowrap text-body">{e.value}</span>
            <span className="mt-[18px] block h-[10px] w-full max-w-[142px] overflow-hidden rounded-[5px] bg-track-2">
              <span className="k-fill block h-full rounded-[5px] bg-lime" style={{ width: `${e.pct}%`, "--d": `${350 + i * 100}ms` } as React.CSSProperties} />
            </span>
            <span className="mt-5 text-[16px] font-medium text-accent-ink">
              <CountUp value={e.pct} delay={350 + i * 100} /> %
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TipsCard() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % TIPS.length), 5000);
    return () => window.clearInterval(t);
  }, [paused]);
  return (
    <Card delay={180} className="flex min-h-[335px] flex-col px-[26px] pb-6 pt-7" aria-label="Health tips">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[22px] font-semibold text-ink">Health Tips</h2>
        <a href="#" className="text-[14px] text-lime transition-opacity hover:opacity-75">
          View more
        </a>
      </div>
      <div className="mt-11 overflow-hidden rounded-[16px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-live="polite">
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(calc(-1% * ${i * 100} * var(--dir)))` }}>
          {TIPS.map((t, j) => (
            <div key={j} className="flex min-h-[175px] w-full flex-none items-center gap-[22px] rounded-[16px] bg-row px-5 py-5" aria-hidden={i !== j}>
              <IcoChip h="7a03f" size={44} iconSize={27} className="self-start mt-[2px]" />
              <div>
                <p className="text-[17px] leading-[26px] font-medium text-ink">{t.title}</p>
                <p className="mt-3 text-[13.5px] leading-[18.6px] text-muted">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto flex justify-center gap-[14px] pt-6">
        {TIPS.map((_, j) => (
          <button
            key={j}
            type="button"
            onClick={() => setI(j)}
            aria-label={`Go to slide ${j + 1}`}
            aria-current={i === j}
            className={cn("h-2 rounded-full transition-all duration-500", i === j ? "w-5 bg-lime" : "w-2 bg-track-2 hover:bg-lime/50")}
          />
        ))}
      </div>
    </Card>
  );
}
