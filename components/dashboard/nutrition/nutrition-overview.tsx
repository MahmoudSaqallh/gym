"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Ring } from "../charts";
import { cn } from "@/lib/cn";
import { MACROS, MEALS } from "./data";

const DONUT = [
  { label: "Carbs", pct: 39, kcal: 720, color: "var(--lime-bright)", d: "M150.99 85.169C150.753 98.7571 146.389 111.952 138.478 123.002C130.567 134.052 119.483 142.436 106.696 147.039C93.9091 151.643 80.0247 152.249 66.8854 148.777C53.7461 145.306 41.9731 137.921 33.129 127.602" },
  { label: "Protein", pct: 31, kcal: 572, color: "var(--green)", d: "M31.638 125.8C24.9428 117.413 20.3602 107.541 18.2757 97.0137C16.1913 86.4866 16.6661 75.6128 19.6601 65.3074C22.654 55.002 28.0797 45.5666 35.4803 37.7952C42.881 30.0238 52.0402 24.1438 62.187 20.65" },
  { label: "Fats", pct: 30, kcal: 549, color: "var(--lime-2)", d: "M64.411 19.928C74.3334 16.8944 84.8247 16.2067 95.0582 17.9192C105.292 19.6316 114.988 23.6974 123.382 29.7961C131.776 35.8948 138.639 43.8597 143.43 53.0631C148.221 62.2665 150.809 72.4568 150.99 82.831" },
];
const WEEK = [
  { d: "Sun", v: 2290 },
  { d: "Mon", v: 2180 },
  { d: "Tue", v: 2410 },
  { d: "Wed", v: 2205 },
  { d: "Thu", v: 2330 },
  { d: "Fri", v: 2260 },
  { d: "Sat", v: 1841 },
];
const CHOICES = [
  { name: "Avocado & Egg Toast", note: "High in healthy fats and fiber", kcal: 350, img: "be764.png" },
  { name: "Quinoa Power Bowl", note: "Balanced carbs and protein", kcal: 450, img: "537d7.png" },
  { name: "Berry & Nut Smoothie", note: "Antioxidant rich and refreshing", kcal: 280, img: "c79ce.png" },
];

export function NutritionOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid gap-[14px] lg:grid-cols-[673fr_477fr]">
        <Hero />
        <MacrosCard />
      </div>
      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[426.5fr_288.7fr_420.4fr]">
        <MealsCard />
        <HydrationCard />
        <WeeklyCard className="md:col-span-2 wide:col-span-1" />
      </div>
      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[368fr_350.2fr_417.4fr]">
        <MacroBalance />
        <Choices />
        <PlanProgress className="md:col-span-2 wide:col-span-1" />
      </div>
      <Banner />
    </div>
  );
}

/* ───────── Hero (always dark) ───────── */
function Hero() {
  const stats = [
    { icon: "2be87", label: "Daily Calories", value: 1841, unit: "kcal", note: "78% of goal" },
    { icon: "8e33c", label: "Water Intake", value: 1.8, decimals: 1, unit: "L", note: "72% of goal" },
    { icon: "3e001", label: "Nutrition Score", value: 84, unit: "/100", note: "Good" },
  ];
  return (
    <Card delay={0} className="k-dark-card group min-h-[394.7px] p-6" aria-label="Nutrition overview">
      <div className="absolute inset-y-0 end-0 w-[46%] overflow-hidden">
        <Image src="/assets/f/7f8c8.png" alt="" fill priority sizes="310px" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105 animate-[k-kenburns_2.4s_cubic-bezier(0.22,1,0.36,1)_both]" />
        <span className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d0e_0%,rgba(11,13,14,0.7)_34%,rgba(9,14,14,0.22)_68%,rgba(9,14,14,0)_100%)]" />
      </div>
      <div className="relative">
        <p className="k-in-left text-[16px] leading-6 text-[#b2b4b6]" style={{ "--d": "100ms" } as React.CSSProperties}>
          Good choices, Demo
        </p>
        <div className="mt-[19px] flex items-center gap-3">
          <h1 className="k-in-left text-[28px] leading-10 font-medium text-white sm:text-[32px]" style={{ "--d": "160ms" } as React.CSSProperties}>
            Nutrition Overview
          </h1>
          <IcoChip h="91887" size={38} iconSize={24} tone="onDark" className="k-in-pop [&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
        </div>
        <p className="k-in-left mt-[19px] max-w-[330px] text-[15px] leading-[25.5px] text-[#b2b4b6]" style={{ "--d": "220ms" } as React.CSSProperties}>
          Fuel your body. Nourish your goals. Eat smart, feel strong, perform better.
        </p>
      </div>
      <div
        className="k-in relative mt-[15px] grid w-full max-w-[355px] grid-cols-[105.7fr_105.7fr_106.3fr] rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,13,0.3),rgba(5,6,7,0.34))] py-[18px] ps-[18px] pe-2 shadow-[inset_0_0_22px_rgba(200,205,210,0.04)] backdrop-blur-[4px]"
        style={{ "--d": "300ms" } as React.CSSProperties}
      >
        {stats.map((s, i) => (
          <div key={s.label} className={cn("flex flex-col", i > 0 && "border-s-[0.8px] border-white/10 ps-3")}>
            <IcoChip h={s.icon} size={34} iconSize={21} tone="onDark" />
            <span className="mt-[9.9px] text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-[#8e8e8e]">{s.label}</span>
            <span className="mt-[13px] flex items-baseline gap-[3px] whitespace-nowrap">
              <CountUp value={s.value} decimals={s.decimals} delay={450 + i * 120} className="text-[25px] leading-[25px] font-medium text-white" />
              <span className="text-[12px] font-medium text-[#8e8e8e]">{s.unit}</span>
            </span>
            <span className="mt-[15.7px] text-[13.5px] leading-[20.25px] font-medium text-lime">{s.note}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────── Calories & macros donut ───────── */
function MacrosCard() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <Card delay={90} className="flex min-h-[394.7px] flex-col p-5" aria-label="Calories and macros">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Calories &amp; Macros</h2>
        <PeriodPill label="Today" className="w-[112px]" />
      </div>
      <div className="my-auto flex flex-wrap items-center gap-x-5 gap-y-6 pt-6">
        <div className="relative size-[168px] flex-none">
          <svg viewBox="0 0 168 168" className="size-full transition-transform duration-700 hover:rotate-6" role="img" aria-label="Carbs 39%, Protein 31%, Fats 30%">
            {DONUT.map((s, i) => (
              <path
                key={s.label}
                d={s.d}
                pathLength={1}
                strokeWidth={hover === i ? 38 : 34}
                stroke={s.color}
                fill="none"
                className="k-draw transition-[stroke-width,opacity] duration-300"
                style={{ "--d": `${300 + i * 350}ms`, "--dur": "0.8s", opacity: hover === null || hover === i ? 1 : 0.45 } as React.CSSProperties}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CountUp value={hover === null ? 1841 : DONUT[hover].kcal} duration={hover === null ? 1800 : 400} delay={hover === null ? 300 : 0} className="text-[26px] leading-[33px] font-semibold text-ink" />
            <span className="text-[14px] leading-[21px] text-muted">{hover === null ? "kcal" : DONUT[hover].label}</span>
          </div>
        </div>
        <ul className="flex min-w-[180px] flex-1 flex-col gap-[38px]">
          {DONUT.map((s, i) => (
            <li
              key={s.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn("k-in-left flex cursor-default items-start gap-[10px] transition-opacity", hover !== null && hover !== i && "opacity-50")}
              style={{ "--d": `${400 + i * 90}ms` } as React.CSSProperties}
            >
              <span className="mt-[5px] size-2.5 flex-none rounded-full" style={{ background: s.color }} />
              <span className="flex-1">
                <span className="block text-[15px] leading-[18.75px] font-medium text-ink">{s.label}</span>
                <span className="mt-[4px] block text-[13px] text-muted">{s.kcal} kcal</span>
              </span>
              <span className="text-[15px] font-semibold text-ink">{s.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ───────── Today's meals ───────── */
function MealsCard() {
  return (
    <Card delay={140} className="flex min-h-[340.6px] flex-col p-5" aria-label="Today's meals">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Today&apos;s Meals</h2>
        <Link href="/dashboard/nutrition/planner" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
          View all
        </Link>
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-2">
        {MEALS.map((m, i) => (
          <li key={m.slot} className="k-in-left" style={{ "--d": `${220 + i * 80}ms` } as React.CSSProperties}>
            <Link
              href="/dashboard/nutrition/planner"
              aria-label="Open this meal in the planner"
              className="group flex h-[58px] items-center gap-3 rounded-[12px] bg-row p-1.5 pe-3 transition-[filter,translate] hover:translate-x-1 rtl:hover:-translate-x-1 hover:brightness-[0.98] dark:hover:brightness-125"
            >
              <span className="relative h-[46px] w-[62px] flex-none overflow-hidden rounded-[10px]">
                <Image src={`/assets/f/${m.img}`} alt="" fill sizes="62px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] leading-[18px] font-medium text-ink">{m.slot}</span>
                <span className="mt-[3px] block truncate text-[13px] leading-[16.25px] text-muted">{m.name}</span>
              </span>
              <span className="text-[13px] whitespace-nowrap text-muted">{m.time}</span>
              <span className="grid size-6 flex-none place-items-center rounded-full bg-lime" aria-label="Logged">
                <Ico h="c7606" size={15} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ───────── Hydration (tap glasses to log) ───────── */
function HydrationCard() {
  const [glasses, setGlasses] = useState(7);
  const l = Math.round(glasses * 2.5) / 10; // 10 glasses = 2.5 L
  const pct = l / 2.5;
  const litres = l.toFixed(1);
  return (
    <Card delay={200} className="flex min-h-[340.6px] flex-col p-5" aria-label="Hydration">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Hydration</h2>
        <PeriodPill label="Today" className="w-[112px]" />
      </div>
      <div className="relative mx-auto mt-[23px] size-[158px]">
        <Ring key={glasses} size={158} stroke={11} pct={pct} delay={150} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Ico h="732f2" size={20} className="animate-[k-float_2.4s_ease-in-out_infinite]" />
          <span className="mt-[15px] flex items-baseline gap-1">
            <span className="text-[28px] leading-[28px] font-semibold text-ink">{litres}</span>
            <span className="text-[15px] font-medium text-body">L</span>
          </span>
          <span className="mt-[12px] text-[13px] text-muted">of 2.5 L</span>
        </div>
      </div>
      <p className="mt-auto text-[13.5px] font-medium text-accent-ink">{Math.round(pct * 100)}% of daily goal</p>
      <div className="mt-[13px] flex justify-between" role="group" aria-label="Glasses of water">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
            aria-label={`Glass ${i + 1} of 10`}
            aria-pressed={i < glasses}
            className={cn(
              "relative h-[26px] w-[19px] overflow-hidden rounded-b-[5px] rounded-t-[3px] border transition-transform duration-200 hover:-translate-y-0.5",
              i < glasses ? "border-lime" : "border-track-2",
            )}
          >
            <span
              className="absolute inset-x-0 bottom-0 bg-lime transition-[height] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ height: i < glasses ? "72%" : "0%", transitionDelay: `${i * 30}ms` }}
            />
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ───────── Weekly calorie intake ───────── */
function WeeklyCard({ className }: { className?: string }) {
  const [active, setActive] = useState(2);
  const MAX = 3000;
  const H = 170;
  return (
    <Card delay={260} className={cn("flex min-h-[340.6px] flex-col p-5", className)} aria-label="Weekly calorie intake">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Weekly Calorie Intake</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <p className="mt-[19px] flex flex-wrap items-baseline gap-x-2">
        <CountUp value={15516} delay={300} className="text-[28px] leading-[28px] font-semibold text-ink" />
        <span className="text-[15px] font-medium text-muted">kcal</span>
        <span className="ms-2 text-[14px] font-medium text-accent-ink">+9%</span>
        <span className="text-[14px] text-muted">vs last week</span>
      </p>
      <div className="relative mt-auto h-[200px] pt-3">
        {["3k", "2k", "1k", "0"].map((l, i) => (
          <div key={l} className="absolute inset-x-0 flex items-center gap-[14px]" style={{ top: 12 + (i * H) / 3 - 6 }}>
            <span className="w-[26px] text-[11px] leading-[11px] text-muted">{l}</span>
            <span className="h-0 flex-1 border-t-[0.8px] border-dashed" style={{ borderColor: "var(--grid-line)" }} />
          </div>
        ))}
        <ul className="absolute bottom-[24px] start-[40px] end-0 flex items-end justify-between px-[4px]" style={{ height: H }}>
          {WEEK.map((w, i) => {
            const h = (w.v / MAX) * H;
            const on = i === active;
            return (
              <li key={w.d} className="relative flex w-4 cursor-pointer justify-center" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0} aria-label={`${w.d}: ${w.v.toLocaleString("en-US")} kcal`}>
                {on && (
                  <span key={i} className="absolute z-10 flex h-[30px] items-center rounded-[8px] bg-[#313334] px-[10px] text-[12px] font-medium whitespace-nowrap text-white animate-[k-pop_0.3s_ease-out_both]" style={{ bottom: Math.min(h + 10, H - 26) }}>
                    {(i === 2 ? 15516 : w.v).toLocaleString("en-US")}
                    <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#313334]" />
                  </span>
                )}
                <span className="k-bar block w-4 rounded-[6px]" style={{ height: h, "--d": `${300 + i * 70}ms`, background: `linear-gradient(180deg, ${on ? "var(--lime-bright)" : "var(--lime)"} 0%, var(--bar-to) 100%)` } as React.CSSProperties} />
              </li>
            );
          })}
        </ul>
        <div className="absolute bottom-0 start-[40px] end-0 flex justify-between px-[4px]">
          {WEEK.map((w, i) => (
            <span key={w.d} className={cn("flex w-4 justify-center text-[12px] leading-[18px]", i === active ? "font-medium text-ink" : "text-muted")}>
              {w.d}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────── Macro balance ───────── */
function MacroBalance() {
  return (
    <Card delay={160} className="flex min-h-[276.6px] flex-col p-5" aria-label="Macro balance">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Macro Balance</h2>
        <PeriodPill label="Today" className="w-[112px]" />
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {MACROS.map((m, i) => {
          const pct = Math.round((m.got / m.goal) * 100);
          return (
            <li key={m.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${220 + i * 80}ms` } as React.CSSProperties}>
              <IcoChip h={m.icon} size={30} iconSize={19} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between text-[14px] font-medium text-ink">
                  {m.label}
                  <span className="text-[13px]">
                    {m.got} <span className="font-normal text-muted">/ {m.goal}g</span>
                  </span>
                </span>
                <span className="mt-[7px] block h-[7px] overflow-hidden rounded-[3.5px] bg-track-2">
                  <span className="k-fill block h-full rounded-[3.5px] bg-lime" style={{ width: `${pct}%`, "--d": `${300 + i * 80}ms` } as React.CSSProperties} />
                </span>
              </span>
              <span className="w-[38px] text-end text-[13.5px] font-semibold text-accent-ink">
                <CountUp value={pct} delay={300 + i * 80} /> %
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ───────── Healthy choices ───────── */
function Choices() {
  const [added, setAdded] = useState<Set<string>>(new Set());
  return (
    <Card delay={220} className="flex min-h-[276.6px] flex-col p-5" aria-label="Healthy choices for you">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Healthy Choices For You</h2>
        <a href="#" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
          View all
        </a>
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {CHOICES.map((c, i) => {
          const on = added.has(c.name);
          return (
            <li key={c.name} className="k-in-left group flex h-14 items-center gap-[10px] rounded-[12px] bg-row p-1.5 pe-2" style={{ "--d": `${280 + i * 80}ms` } as React.CSSProperties}>
              <span className="relative h-11 w-[58px] flex-none overflow-hidden rounded-[10px]">
                <Image src={`/assets/f/${c.img}`} alt="" fill sizes="58px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] leading-[18px] font-medium text-ink">{c.name}</span>
                <span className="mt-[2px] block truncate text-[12.5px] leading-[15.6px] text-muted">{c.note}</span>
              </span>
              <span className="text-[13px] whitespace-nowrap text-muted">{c.kcal} kcal</span>
              <button
                type="button"
                onClick={() =>
                  setAdded((s) => {
                    const n = new Set(s);
                    if (n.has(c.name)) n.delete(c.name);
                    else n.add(c.name);
                    return n;
                  })
                }
                aria-label={`${on ? "Remove" : "Add"} ${c.name} ${on ? "from" : "to"} today`}
                className={cn("grid size-7 flex-none place-items-center rounded-full bg-lime transition-transform duration-300 hover:scale-110", on && "rotate-[135deg]")}
              >
                <Ico h="ad1eb" size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ───────── Meal plan progress ───────── */
function PlanProgress({ className }: { className?: string }) {
  return (
    <Card delay={280} className={cn("flex min-h-[276.6px] flex-col p-5", className)} aria-label="Meal plan progress">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Meal Plan Progress</h2>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </div>
      <div className="my-auto flex flex-wrap items-center gap-x-4 gap-y-5 pt-4">
        <div className="relative size-[152px] flex-none">
          <Ring size={152} stroke={10} pct={0.86} delay={300} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Ico h="3e202" size={18} />
            <span className="mt-[9px] flex items-baseline">
              <CountUp value={86} delay={300} className="text-[24px] leading-[24px] font-semibold text-ink" />
              <span className="text-[15px] text-body">%</span>
            </span>
            <span className="mt-[6px] max-w-[62px] text-center text-[11.5px] leading-[11.5px] text-muted">Plan Adherence</span>
          </div>
        </div>
        <div className="min-w-[160px] flex-1">
          {[
            { label: "Meals Completed", v: 28, of: 28 },
            { label: "On Track Days", v: 6, of: 7 },
          ].map((r, i) => (
            <div key={r.label} className={cn(i > 0 && "mt-[14px]")}>
              <p className="text-[13.5px] leading-[20.25px] text-muted">{r.label}</p>
              <p className="mt-[6px] flex items-baseline gap-1">
                <CountUp value={r.v} delay={350 + i * 100} className="text-[22px] leading-[22px] font-semibold text-ink" />
                <span className="text-[14px] text-muted">/ {r.of}</span>
              </p>
              <span className="mt-[13px] block h-[7px] overflow-hidden rounded-[3.5px] bg-track-2">
                <span className="k-fill block h-full rounded-[3.5px] bg-lime" style={{ width: `${(r.v / r.of) * 100}%`, "--d": `${400 + i * 100}ms` } as React.CSSProperties} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────── Banner ───────── */
function Banner() {
  return (
    <Card delay={200} className="k-dark-card group flex min-h-[95.6px] flex-wrap items-center gap-4 px-5 py-5" aria-label="Plan your meals">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/assets/f/38a62.png" alt="" fill sizes="100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,7,0.97)_0%,rgba(6,8,7,0.9)_44%,rgba(6,8,7,0.55)_72%,rgba(6,8,7,0.2)_100%)]" />
      <IcoChip h="8b206" size={54} iconSize={33} className="relative [&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
      <div className="relative min-w-0 flex-1">
        <p className="text-[19px] leading-[28px] font-semibold text-white sm:text-[23px] sm:leading-[34.5px]">Good nutrition today, stronger tomorrow.</p>
        <p className="text-[14px] leading-[21px] text-white/72">Small choices, big impact. Keep fueling your best self.</p>
      </div>
      <Link
        href="/dashboard/nutrition/planner"
        className="k-shine group/btn relative flex h-11 items-center gap-[10px] rounded-[12px] bg-[linear-gradient(180deg,var(--grad-from)_0%,var(--grad-to)_100%)] ps-6 pe-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(var(--grad-rgb)/0.9)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-110"
      >
        Plan My Meals
        <Ico h="c7855" size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
      </Link>
    </Card>
  );
}
