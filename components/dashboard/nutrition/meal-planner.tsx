"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Popover } from "@/components/ui/popover";
import { Ring } from "../charts";
import { cn } from "@/lib/cn";
import { MEALS } from "./data";

const RECOMMENDED = [
  { name: "High Protein Veggie Wrap", kcal: 464, macros: "35g Protein • 45g Carbs • 16g Fats", img: "8c485.png" },
  { name: "Salmon Avocado Salad", kcal: 470, macros: "38g Protein • 30g Carbs • 22g Fats", img: "42dd8.png" },
  { name: "Overnight Oats", kcal: 350, macros: "20g Protein • 45g Carbs • 10g Fats", img: "abebf.png" },
];
const GROCERY = [
  { name: "Chicken Breast", qty: "500 g", icon: "95c40" },
  { name: "Quinoa", qty: "1.2 kg", icon: "36ac0" },
  { name: "Greek Yogurt", qty: "650 g", icon: "39398" },
  { name: "Avocados", qty: "4 pcs", icon: "a0eca" },
  { name: "Blueberries", qty: "250 g", icon: "72e19" },
];
const ADHERENCE = [
  { d: "Sun", h: 62.07 },
  { d: "Mon", h: 59.51 },
  { d: "Tue", h: 64 },
  { d: "Wed", h: 60.15 },
  { d: "Thu", h: 63.35 },
  { d: "Fri", h: 61.43 },
  { d: "Sat", h: 49.9 },
];
const MACRO_TARGETS = [
  { label: "Protein", got: 143, goal: 160 },
  { label: "Carbs", got: 180, goal: 200 },
  { label: "Fats", got: 61, goal: 70 },
];

const BASE = new Date(2026, 10, 7); // "Today, Nov 7" in the design
const fmtDay = (offset: number) => {
  const d = new Date(BASE);
  d.setDate(d.getDate() + offset);
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return offset === 0 ? `Today, ${label}` : offset === -1 ? `Yesterday, ${label}` : offset === 1 ? `Tomorrow, ${label}` : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

export function MealPlanner() {
  const [day, setDay] = useState(0);
  const [meals, setMeals] = useState(MEALS);
  const logged = meals.reduce((s, m) => s + m.kcal, 0);

  return (
    <div className="flex flex-col gap-[14px]">
      <header className="flex flex-wrap items-start justify-between gap-4 px-1">
        <div>
          <h1 className="animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_both] text-[24px] leading-[34px] font-semibold text-ink sm:text-[30px] sm:leading-[40px]">Meal Planner / Daily Nutrition Log</h1>
          <p className="mt-[9px] animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_80ms_both] text-[16px] leading-6 text-muted">Plan your meals, track your intake, and stay on track with your goals.</p>
        </div>
        <div className="mt-1 flex items-center gap-2 animate-[k-fade_0.6s_ease-out_150ms_both]">
          <span className="flex h-10 items-center gap-2 rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink">
            <Ico h="b043b" size={16} />
            <span key={day} className="animate-[k-fade_0.3s_ease-out]">
              {fmtDay(day)}
            </span>
          </span>
          <button type="button" aria-label="Previous day" onClick={() => setDay((d) => d - 1)} className="grid size-10 place-items-center rounded-[12px] bg-row transition-transform hover:-translate-x-0.5 active:scale-95">
            <Ico h="0d861" size={16} />
          </button>
          <button type="button" aria-label="Next day" onClick={() => setDay((d) => d + 1)} className="grid size-10 place-items-center rounded-[12px] bg-row transition-transform hover:translate-x-0.5 rtl:hover:-translate-x-0.5 active:scale-95">
            <Ico h="2dbce" size={16} />
          </button>
        </div>
      </header>

      <div className="grid items-start gap-[14px] wide:grid-cols-[minmax(0,1fr)_310.8px]">
        <div className="flex flex-col gap-[14px]">
          <div className="grid gap-[14px] md:grid-cols-[251.5fr_364.7fr_195fr]">
            <Card delay={0} className="min-h-[216.75px] p-5" aria-label="Calorie target">
              <h2 className="text-[16px] leading-6 font-semibold text-ink">Calorie Target</h2>
              <div className="mt-[29px] flex items-center gap-4">
                <Ring size={104} stroke={10} pct={logged / 2350} delay={200} />
                <div>
                  <CountUp value={logged} delay={200} className="block text-[30px] leading-[36px] font-semibold text-ink" />
                  <p className="mt-[6px] text-[13.5px] text-muted">/ 2,350 kcal</p>
                  <p className="mt-[5px] text-[13px] font-medium text-accent-ink">{Math.max(0, 2350 - logged).toLocaleString("en-US")} kcal left</p>
                </div>
              </div>
            </Card>
            <Card delay={70} className="min-h-[216.75px] p-5" aria-label="Macros progress">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] leading-6 font-semibold text-ink">Macros Progress</h2>
                <a href="#" className="text-[13px] font-medium text-[#b3b4b5] hover:text-accent-ink">
                  View Details
                </a>
              </div>
              <div className="mt-[39px] grid grid-cols-3 gap-5">
                {MACRO_TARGETS.map((m, i) => {
                  const pct = Math.round((m.got / m.goal) * 100);
                  return (
                    <div key={m.label}>
                      <p className="text-[13.5px] text-body">{m.label}</p>
                      <p className="mt-[3px] text-[15px] font-semibold text-ink">
                        {m.got} <span className="text-[12.5px] font-normal text-muted">/ {m.goal}g</span>
                      </p>
                      <span className="mt-[12px] block h-[7px] overflow-hidden rounded-[3.5px] bg-track-2">
                        <span className="k-fill block h-full rounded-[3.5px] bg-lime" style={{ width: `${pct}%`, "--d": `${250 + i * 80}ms` } as React.CSSProperties} />
                      </span>
                      <p className="mt-[5px] text-[12.5px] font-medium text-accent-ink">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card delay={140} className="min-h-[216.75px] p-5" aria-label="Nutrient balance">
              <div className="flex items-start justify-between">
                <h2 className="max-w-[80px] text-[16px] leading-6 font-semibold text-ink">Nutrient Balance</h2>
                <IcoChip h="7a03f" size={44} iconSize={27} className="[&>*]:animate-[k-float_3s_ease-in-out_infinite]" />
              </div>
              <p className="mt-[6px] text-[21px] font-semibold text-accent-ink">Good</p>
              <p className="mt-[8px] max-w-[150px] text-[12.5px] leading-[20.5px] text-muted">You&apos;re hitting your macros and micronutrients within the ideal range.</p>
            </Card>
          </div>

          <Card delay={120} className="p-5" aria-label="Today's meals">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-baseline gap-3 text-[17px] font-semibold text-ink">
                Today&apos;s Meals
                <span className="text-[13px] font-normal text-muted">
                  <span className="font-medium text-accent-ink">{logged.toLocaleString("en-US")}</span> logged
                </span>
              </h2>
              <button type="button" className="k-shine flex h-10 items-center gap-2 rounded-[12px] bg-cta px-4 text-[13.5px] font-semibold text-[var(--on-accent)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-105">
                <Ico h="8ffed" size={16} />
                Log Food / Add Meal
              </button>
            </div>
            <ol className="mt-4 flex flex-col gap-[14px]">
              {meals.map((m, i) => (
                <li key={m.name} className="k-in-left grid grid-cols-[90px_minmax(0,1fr)] gap-0" style={{ "--d": `${200 + i * 90}ms` } as React.CSSProperties}>
                  <div className="relative pt-[5px]">
                    <span className="flex items-center gap-2 text-[12.5px] text-body">
                      <span className="size-[9px] rounded-full bg-lime" />
                      {m.time}
                    </span>
                    {i < meals.length - 1 && <span className="absolute bottom-[-14px] start-1 top-[30px] w-px bg-divider" />}
                  </div>
                  <div className="group flex min-h-[108px] flex-wrap items-center gap-4 rounded-[16px] bg-row p-3 transition-[filter] hover:brightness-[0.98] dark:hover:brightness-125">
                    <span className="relative h-[84px] w-[132px] flex-none overflow-hidden rounded-[12px]">
                      <Image src={`/assets/f/${m.img}`} alt="" fill sizes="132px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    </span>
                    <span className="min-w-[180px] flex-1">
                      <span className="block text-[15.5px] leading-[23px] font-semibold text-ink">{m.name}</span>
                      <span className="mt-[2px] block max-w-[257px] text-[12.5px] leading-[17.5px] text-muted">{m.desc}</span>
                    </span>
                    <span className="flex gap-5">
                      {[
                        ["Protein", m.p],
                        ["Carbs", m.c],
                        ["Fats", m.f],
                      ].map(([l, v]) => (
                        <span key={l} className="text-center">
                          <span className="block text-[12px] text-muted">{l}</span>
                          <span className="mt-[2px] flex items-center gap-1 text-[13.5px] font-semibold text-ink">
                            {v}g <span className="size-[5px] rounded-full bg-lime" />
                          </span>
                        </span>
                      ))}
                    </span>
                    <span className="w-[56px] text-end">
                      <span className="block text-[22px] leading-[24px] font-semibold text-ink">{m.kcal}</span>
                      <span className="text-[12px] text-muted">kcal</span>
                    </span>
                    <Popover
                      offset={4}
                      role="menu"
                      label={`Options for ${m.name}`}
                      className="w-[160px] py-1"
                      trigger={({ ref, open, toggle }) => (
                        <button ref={ref} type="button" onClick={toggle} aria-expanded={open} aria-label={`Options for ${m.name}`} className="grid size-8 place-items-center rounded-full transition-colors hover:bg-[var(--nav-hover)]">
                          <Ico h="b6ee4" size={16} />
                        </button>
                      )}
                    >
                      {(close) => (
                        <>
                          <button type="button" onClick={close} className="flex h-9 w-full items-center px-3 text-start text-[14px] text-ink hover:bg-[var(--menu-hover)]">
                            Edit meal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMeals((ms) => ms.filter((x) => x.name !== m.name));
                              close();
                            }}
                            className="flex h-9 w-full items-center px-3 text-start text-[14px] text-[#d94a38] hover:bg-[var(--menu-hover)]"
                          >
                            Remove from today
                          </button>
                        </>
                      )}
                    </Popover>
                  </div>
                </li>
              ))}
              {meals.length === 0 && (
                <li className="grid min-h-[140px] place-items-center rounded-[16px] border border-dashed border-divider text-center">
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">No meals logged</span>
                    <button type="button" onClick={() => setMeals(MEALS)} className="mt-1 text-[13px] font-medium text-accent-ink hover:underline">
                      Restore today&apos;s plan
                    </button>
                  </span>
                </li>
              )}
            </ol>
          </Card>

          <WaterCard />
        </div>

        <aside className="flex flex-col gap-[14px] sm:grid sm:grid-cols-2 wide:flex">
          <Card delay={160} className="p-4" aria-label="Recommended for you">
            <div className="flex items-center justify-between">
              <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Recommended for You</h2>
              <a href="#" className="text-[13px] font-medium text-[#b3b4b5] hover:text-accent-ink">
                View all
              </a>
            </div>
            <ul className="mt-4 flex flex-col gap-[22px]">
              {RECOMMENDED.map((r, i) => (
                <li key={r.name} className="k-in-left group flex gap-3" style={{ "--d": `${240 + i * 80}ms` } as React.CSSProperties}>
                  <span className="relative h-[52px] w-[68px] flex-none overflow-hidden rounded-[12px]">
                    <Image src={`/assets/f/${r.img}`} alt="" fill sizes="68px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="text-[13px] leading-[19.5px] font-medium text-ink">{r.name}</span>
                      <span className="text-[11.5px] leading-[19.5px] font-medium whitespace-nowrap text-accent-ink">{r.kcal} kcal</span>
                    </span>
                    <span className="mt-[3px] block text-[11.5px] leading-[17.25px] text-muted">{r.macros}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <GroceryCard />
          <Card delay={300} className="p-4 sm:col-span-2 wide:col-span-1" aria-label="Weekly nutrition adherence">
            <div className="flex items-start justify-between">
              <h2 className="max-w-[130px] text-[15.5px] leading-[23.25px] font-semibold text-ink">Weekly Nutrition Adherence</h2>
              <a href="#" className="mt-[13.5px] text-[13px] font-medium text-[#b3b4b5] hover:text-accent-ink">
                View full report
              </a>
            </div>
            <div className="mt-3 flex items-end gap-4">
              <div className="pb-[6px]">
                <p className="flex items-baseline">
                  <CountUp value={86} delay={350} className="text-[34px] leading-[38px] font-semibold text-ink" />
                  <span className="text-[17px] font-semibold text-ink">%</span>
                </p>
                <p className="mt-1 text-[12.5px] text-accent-ink">Great job!</p>
              </div>
              <ul className="flex flex-1 justify-between">
                {ADHERENCE.map((a, i) => (
                  <li key={a.d} className="flex flex-col items-center gap-[5px]">
                    <span className="flex h-16 items-end">
                      <span className="k-bar block w-3 rounded-[6px] bg-[linear-gradient(0deg,rgb(var(--lime-rgb)/0.16)_0%,var(--lime)_100%)]" style={{ height: a.h, "--d": `${380 + i * 60}ms` } as React.CSSProperties} />
                    </span>
                    <span className="text-[10px] text-muted">{a.d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 flex items-center gap-[10px] rounded-[12px] bg-row px-3 py-[11px] text-[12px] leading-[17px] text-muted">
              <IcoChip h="4236b" size={30} iconSize={19} />
              You&apos;ve stayed on track 6 of 7 days this week.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function GroceryCard() {
  const [got, setGot] = useState<Set<string>>(new Set());
  return (
    <Card delay={230} className="p-4" aria-label="Grocery highlights">
      <div className="flex items-center justify-between">
        <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Grocery Highlights</h2>
        <a href="#" className="text-[13px] font-medium text-[#b3b4b5] hover:text-accent-ink">
          View all
        </a>
      </div>
      <ul className="mt-4 flex flex-col gap-5">
        {GROCERY.map((g, i) => {
          const on = got.has(g.name);
          return (
            <li key={g.name} className="k-in-left" style={{ "--d": `${280 + i * 60}ms` } as React.CSSProperties}>
              <button
                type="button"
                onClick={() =>
                  setGot((s) => {
                    const n = new Set(s);
                    if (n.has(g.name)) n.delete(g.name);
                    else n.add(g.name);
                    return n;
                  })
                }
                aria-pressed={on}
                className="flex w-full items-center gap-3 text-start"
              >
                <IcoChip h={g.icon} size={34} iconSize={21} className={cn("transition-transform duration-300", on && "scale-90 opacity-60")} />
                <span className={cn("flex-1 text-[13.5px] text-body transition-opacity", on && "line-through opacity-50")}>{g.name}</span>
                <span className="text-[13px] text-muted">{g.qty}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function WaterCard() {
  const [glasses, setGlasses] = useState(7);
  const litres = Math.round(glasses * 2.5) / 10; // 10 glasses = 2.5 L, rounded to 0.1 L
  return (
    <Card delay={200} className="flex min-h-[116.5px] flex-wrap items-center gap-x-6 gap-y-4 p-5" aria-label="Water intake">
      <div className="flex items-center gap-3">
        <IcoChip h="6aa2b" size={40} iconSize={25} className="[&>*]:animate-[k-float_2.4s_ease-in-out_infinite]" />
        <div>
          <p className="text-[15px] font-semibold text-ink">Water Intake</p>
          <p className="flex items-baseline gap-1">
            <span className="text-[20px] font-semibold text-ink">{litres.toFixed(1)} L</span>
            <span className="text-[13px] text-muted">/ 2.5 L</span>
          </p>
          <p className="text-[12px] text-accent-ink">{Math.round((litres / 2.5) * 100)}% of your goal</p>
        </div>
      </div>
      <div className="flex flex-1 flex-wrap gap-[6px]" role="group" aria-label="Glasses of water">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Glass ${i + 1}`}
            aria-pressed={i < glasses}
            onClick={() => setGlasses(i + 1 === glasses ? i : i + 1)}
            className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1"
          >
            {i < glasses ? <Ico h="150dd" size={30} className="animate-[k-pop_0.35s_ease-out]" /> : <Ico h="4f0c3" size={30} color="var(--track-2)" />}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setGlasses((g) => Math.min(10, g + 1))}
        className="flex h-10 items-center gap-2 rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-95 dark:hover:brightness-125"
      >
        <Ico h="57b57" size={16} />
        Add Water
      </button>
    </Card>
  );
}
