"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { ALL_EXERCISES, DIFF_LEVEL, findExercise, type Exercise } from "./exercises-data";
import { useSaved } from "./saved-store";

const RANGES = [
  { label: "Strength", sets: "3–5 sets", reps: "3–6 reps", icon: "aa790" },
  { label: "Hypertrophy", sets: "3–4 sets", reps: "8–12 reps", icon: "76722" },
  { label: "Endurance", sets: "2–3 sets", reps: "12–20 reps", icon: "85dc4" },
  { label: "Power", sets: "4–6 sets", reps: "1–3 reps", icon: "5711b" },
];

export function ExerciseDetailView({ slug }: { slug: string }) {
  const e = findExercise(slug)!;
  const d = e.detail;
  const alternatives = (d?.alternatives.map((s) => findExercise(s)!) ?? ALL_EXERCISES.filter((x) => x.group === e.group && x.slug !== e.slug).slice(0, 3)).filter(Boolean);

  return (
    <div className="flex flex-col gap-[14px]">
      <header className="px-1">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/workouts/exercises"
            aria-label="Back to the exercise library"
            className="grid size-8 place-items-center rounded-[12px] border border-page bg-[rgba(102,102,102,0.04)] transition-transform hover:-translate-x-0.5 dark:bg-white/5"
          >
            <Ico h="aa817" size={20} />
          </Link>
          <h1 className="animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_both] text-[26px] leading-[40px] font-semibold text-ink sm:text-[30px]">Exercise Detail</h1>
        </div>
        <p className="mt-[9px] animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_80ms_both] text-[16px] leading-6 text-muted">Learn the movement. Master the form. Build real strength.</p>
      </header>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[530.35fr_342.15fr_263.5fr]">
        <Card delay={0} className="group min-h-[320px] md:col-span-2 wide:col-span-1 wide:min-h-[470px]" aria-label={`${e.name} photo`}>
          <Image src={`/assets/f/${e.img}`} alt={e.name} fill priority sizes="(min-width:1380px) 530px, 100vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        </Card>
        <InfoCard e={e} />
        <RangesCard />
      </div>

      <div className={cn("grid gap-[14px] md:grid-cols-2", d ? "wide:grid-cols-[437.5fr_330.9fr_367.6fr]" : "")}>
        {d && (
          <Card delay={120} className="p-5" aria-label="How to perform">
            <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">How to Perform</h2>
            <ol className="mt-4 flex flex-col gap-[14px]">
              {d.steps.map((s, i) => (
                <li key={i} className="k-in-left flex gap-3" style={{ "--d": `${200 + i * 90}ms` } as React.CSSProperties}>
                  <span className="mt-px grid size-6 flex-none place-items-center rounded-full bg-[rgb(var(--lime-rgb)/0.16)] text-[12px] font-semibold text-accent-ink">{i + 1}</span>
                  <span className="text-[13.5px] leading-[21.9px] text-body">{s}</span>
                </li>
              ))}
            </ol>
          </Card>
        )}
        {d && (
          <Card delay={180} className="p-5" aria-label="Common mistakes">
            <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Common Mistakes</h2>
            <ul className="mt-4 flex flex-col gap-[20px]">
              {d.mistakes.map((m, i) => (
                <li key={m.title} className="k-in-left flex gap-3" style={{ "--d": `${240 + i * 90}ms` } as React.CSSProperties}>
                  <IcoChip h="59c26" size={34} iconSize={21} tone="warm" className="[&>*]:animate-[k-heartbeat_2.6s_ease-in-out_infinite]" />
                  <span>
                    <span className="block text-[14px] leading-[19px] font-medium text-ink">{m.title}</span>
                    <span className="mt-[2px] block text-[12.5px] leading-5 text-muted">{m.fix}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        <Card delay={240} className={cn("p-4 pb-3", !d && "md:col-span-2")} aria-label="Alternatives">
          <div className="flex items-center justify-between">
            <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Alternatives</h2>
            <Link href="/dashboard/workouts/exercises" className="text-[13px] text-muted transition-colors hover:text-accent-ink">
              View all
            </Link>
          </div>
          <ul className="mt-2 flex flex-col gap-[2px]">
            {alternatives.map((a, i) => (
              <li key={a.slug} className="k-in-left" style={{ "--d": `${280 + i * 80}ms` } as React.CSSProperties}>
                <Link href={`/dashboard/workouts/exercises/${a.slug}`} className="group -mx-2 flex h-14 items-center gap-3 rounded-[12px] px-2 transition-colors hover:bg-[var(--nav-hover)]">
                  <span className="relative h-10 w-[52px] flex-none overflow-hidden rounded-[8px]">
                    <Image src={`/assets/f/${a.thumb ?? a.img}`} alt="" fill sizes="52px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] leading-[17.5px] font-medium text-ink">{a.name}</span>
                    <span className="mt-[2px] block truncate text-[12px] leading-[18px] text-muted">{a.muscles.join(" • ")}</span>
                  </span>
                  <Ico h="2dbce" size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {d && (
        <div className="grid gap-[14px] wide:grid-cols-[782fr_368fr]">
          <PerformanceCard e={e} />
          <Card delay={300} className="min-h-[251.75px] p-5" aria-label="Pro tip">
            <div aria-hidden className="pointer-events-none absolute bottom-[2px] end-[-6px] h-[234.75px] w-[197.6px] mix-blend-multiply dark:mix-blend-screen">
              <div className="relative size-full animate-[k-float_6s_ease-in-out_infinite]">
                <Image src="/assets/f/dd18a.png" alt="" fill sizes="198px" className="object-contain" />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center gap-[10px]">
                <IcoChip h="58d22" size={36} iconSize={22} />
                <h2 className="text-[16px] leading-6 font-semibold text-ink">Pro Tip</h2>
              </div>
              <p className="mt-[11px] max-w-[176px] text-[13.5px] leading-[21.9px] text-muted">{d.tagline}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ───────── Info card ───────── */
function InfoCard({ e }: { e: Exercise }) {
  const { isSaved, toggle } = useSaved();
  const [added, setAdded] = useState(false);
  const [logged, setLogged] = useState(0);
  const lvl = DIFF_LEVEL[e.difficulty];
  const primary = e.detail?.primary ?? e.muscles[0];
  const secondary = e.detail?.secondary ?? (e.muscles.slice(1).join(", ") || "—");
  const rows = [
    { icon: "dd970", label: "Primary Muscles", value: primary, dot: true },
    { icon: "c8461", label: "Secondary Muscles", value: secondary },
    { icon: "ea35d", label: "Difficulty", value: e.difficulty, level: lvl },
    { icon: "4e12f", label: "Equipment", value: e.equipment },
  ];
  return (
    <Card delay={80} className="flex min-h-[470px] flex-col p-5" aria-label={e.name}>
      <div className="flex items-center justify-between">
        <span className="rounded-[8px] border border-[rgb(var(--lime-rgb)/0.4)] bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] py-[3.5px] text-[12px] leading-[18px] font-medium text-accent-ink">{e.group}</span>
        <button type="button" onClick={() => toggle(e.slug)} aria-pressed={isSaved(e.slug)} className="text-[12.5px] font-medium text-muted transition-colors hover:text-accent-ink">
          {isSaved(e.slug) ? "Saved ✓" : "Save"}
        </button>
      </div>
      <h2 className="mt-[11px] flex items-center gap-2 text-[26px] leading-[33px] font-semibold text-ink">
        <span className="k-in-left" style={{ "--d": "150ms" } as React.CSSProperties}>
          {e.name}
        </span>
        <Ico h="19fef" size={22} className="animate-[k-glow_1.6s_ease-in-out_infinite]" />
      </h2>
      <p className="mt-[5px] max-w-[270px] text-[13.5px] leading-[21.9px] text-muted">{e.detail?.tagline ?? `Train ${e.muscles.join(", ").toLowerCase()} with controlled, full-range reps.`}</p>
      <ul className="mt-4 flex flex-col gap-5 rounded-[16px] bg-row p-4">
        {rows.map((r, i) => (
          <li key={r.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${250 + i * 70}ms` } as React.CSSProperties}>
            <IcoChip h={r.icon} size={34} iconSize={21} />
            <span>
              <span className="block text-[12.5px] leading-[18.75px] text-muted">{r.label}</span>
              <span className="flex items-center gap-2 text-[14px] leading-[21px] font-medium text-ink">
                {r.value}
                {r.dot && <span className="size-[7px] rounded-full bg-lime" />}
                {r.level && (
                  <span className="ms-1 flex gap-1">
                    {[0, 1, 2, 3].map((j) => (
                      <span key={j} className={cn("h-[5px] w-3.5 rounded-[2.5px]", j < r.level! ? "bg-lime" : "bg-track-2")} />
                    ))}
                  </span>
                )}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-[10px] pt-4">
        <button
          type="button"
          onClick={() => setAdded((a) => !a)}
          className={cn(
            "k-shine flex h-10 flex-1 items-center justify-center gap-2 rounded-[12px] text-[14px] font-semibold transition-[filter,translate] hover:-translate-y-0.5",
            added ? "bg-pill text-accent-ink" : "bg-cta text-[var(--on-accent)] hover:brightness-105",
          )}
        >
          {added ? <Ico h="8e2d0" size={16} color="var(--accent-ink)" /> : <Ico h="8ffed" size={16} />}
          {added ? "Added to Workout" : "Add to Workout"}
        </button>
        <button
          type="button"
          onClick={() => setLogged((n) => n + 1)}
          className="flex h-10 items-center gap-2 rounded-[12px] bg-row px-4 text-[14px] font-medium text-ink transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-95 dark:hover:brightness-125"
        >
          <Ico h="46da7" size={16} />
          Log Set
          {logged > 0 && (
            <span key={logged} className="grid size-5 place-items-center rounded-full bg-lime text-[11px] font-semibold text-[var(--on-accent)] animate-[k-pop_0.35s_ease-out]">
              {logged}
            </span>
          )}
        </button>
      </div>
    </Card>
  );
}

/* ───────── Recommended set ranges ───────── */
function RangesCard() {
  return (
    <Card delay={140} className="flex min-h-[470px] flex-col p-4" aria-label="Recommended set ranges">
      <div className="flex items-center justify-between">
        <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Recommended Set Ranges</h2>
        <span title="Typical set and rep ranges by training goal" className="grid size-5 place-items-center rounded-full">
          <Ico h="96f46" size={16} />
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {RANGES.map((r, i) => (
          <li
            key={r.label}
            className="k-in-left group flex h-[62.25px] items-center gap-3 rounded-[12px] bg-row px-3 transition-transform duration-300 hover:translate-x-1 rtl:hover:-translate-x-1"
            style={{ "--d": `${220 + i * 70}ms` } as React.CSSProperties}
          >
            <IcoChip h={r.icon} size={36} iconSize={22} className="transition-transform duration-500 group-hover:rotate-[-10deg]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-[19px] font-medium text-ink">{r.label}</span>
              <span className="block text-[12.5px] leading-[18.75px] text-muted">{r.sets}</span>
            </span>
            <span className="text-[13.5px] font-semibold whitespace-nowrap text-ink">{r.reps}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto flex gap-[10px] pt-6 text-[12.5px] leading-[20.5px] text-muted">
        <Ico h="1d79e" size={16} className="mt-[3px]" />
        Rest 2 to 3 minutes between strength and power sets, 60 to 90 seconds for hypertrophy, and 30 to 45 for endurance.
      </p>
    </Card>
  );
}

/* ───────── Recent performance table ───────── */
function PerformanceCard({ e }: { e: Exercise }) {
  const h = e.detail!.history;
  return (
    <Card delay={260} className="p-5" aria-label="Your recent performance">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-[10px]">
          <IcoChip h="58d22" size={36} iconSize={22} />
          <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Your Recent Performance</h2>
        </div>
        <a href="#" className="flex h-9 items-center rounded-full bg-row px-4 text-[13px] font-medium text-ink transition-[filter] hover:brightness-95 dark:hover:brightness-125">
          View Full History
        </a>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-start">
          <thead>
            <tr className="border-b border-divider text-[12.5px] leading-[18.75px] text-muted">
              {["Date", "Sets", "Reps", "Weight (kg)", "Volume", "1RM Estimate", ""].map((c) => (
                <th key={c} className="pb-2 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {h.map((r, i) => (
              <tr key={r.date} className={cn("k-in-left text-[13.5px] text-ink transition-colors hover:bg-[var(--nav-hover)]", i < h.length - 1 && "border-b border-divider")} style={{ "--d": `${320 + i * 80}ms` } as React.CSSProperties}>
                <td className="py-[12.25px]">{r.date}</td>
                <td>{r.sets}</td>
                <td>{r.reps}</td>
                <td>{r.weight}</td>
                <td>{r.volume}</td>
                <td>{r.orm}</td>
                <td>
                  <span className="block w-[74px] animate-[k-reveal-x_1.2s_cubic-bezier(0.22,1,0.36,1)_both]" style={{ animationDelay: `${600 + i * 150}ms` }}>
                    <Ico h={r.spark} width={74} height={24} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
