"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Popover } from "@/components/ui/popover";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { PageHeader } from "../section-ui";
import { MeasurementsCard } from "./body-metrics";

type Checkpoint = { date: string; weight: number; src: string; local?: boolean };

const INITIAL: Checkpoint[] = [
  { date: "Jul 4, 2026", weight: 78.2, src: "/assets/f/bceef.png" },
  { date: "Aug 4, 2026", weight: 77.4, src: "/assets/f/a2513.png" },
  { date: "Sep 2, 2026", weight: 76.6, src: "/assets/f/bceef.png" },
  { date: "Oct 3, 2026", weight: 75.9, src: "/assets/f/a2513.png" },
  { date: "Nov 7, 2026", weight: 75.3, src: "/assets/f/d4a8d.png" },
];

const PROGRESS_MILESTONES = [
  { label: "Weight lost", value: "2.9 kg" },
  { label: "Body fat down", value: "4.4%" },
  { label: "Chest up", value: "5 cm" },
  { label: "Waist down", value: "5 cm" },
];

const NOTE =
  "Strength is climbing week on week; the early bedtime is what made the difference. Keep protein at 160 g and the Sunday walk.";

/* ---------- comparison ---------- */

function CheckpointPicker({
  label,
  value,
  points,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  points: Checkpoint[];
  disabled: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-muted">{label}</span>
      <Popover
        offset={5}
        role="listbox"
        label={`${label} checkpoint`}
        className="w-[156px] py-[5px]"
        trigger={({ ref, open, toggle }) => (
          <button
            ref={ref}
            type="button"
            onClick={toggle}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Choose a checkpoint, ${label.toLowerCase()}: ${points[value].date}`}
            className="inline-flex h-[31px] items-center gap-[7px] rounded-full bg-row px-3 text-[12.5px] font-medium text-ink transition-[filter,scale] duration-200 hover:brightness-95 active:scale-[0.97] dark:hover:brightness-125"
          >
            <Ico h="586b6" size={14} />
            <span key={points[value].date} className="animate-[k-fade_0.35s_ease-out]">
              {points[value].date}
            </span>
            <span className={cn("transition-transform duration-300", open && "rotate-180")}>
              <Ico h="d0eed" size={13} />
            </span>
          </button>
        )}
      >
        {(close) =>
          points.map((p, i) => (
            <button
              key={p.date + i}
              type="button"
              role="option"
              aria-selected={i === value}
              disabled={i === disabled}
              onClick={() => {
                onChange(i);
                close();
              }}
              className={cn(
                "flex h-9 w-full items-center justify-between px-3 text-start text-[13px] text-ink transition-colors hover:bg-[var(--menu-hover)] disabled:cursor-not-allowed disabled:opacity-40",
                i === value && "font-medium text-accent-ink",
              )}
              style={{ animation: `k-slide-right 0.3s var(--ease-out) ${i * 40}ms both` }}
            >
              {p.date}
              <span className="text-[11.5px] text-muted">{p.weight} kg</span>
            </button>
          ))
        }
      </Popover>
    </div>
  );
}

function PhotoLabel({ p, className }: { p: Checkpoint; className?: string }) {
  return (
    <span className={cn("absolute bottom-3 rounded-[12px] bg-black/60 px-3 py-[7px] text-[12px] leading-[16.5px] backdrop-blur-[2px]", className)}>
      <span className="block font-medium text-white">{p.date}</span>
      <span className="block text-white/90">Weight: {p.weight} kg</span>
    </span>
  );
}

function Photo({ p, priority }: { p: Checkpoint; priority?: boolean }) {
  return (
    // Plain <img>: local uploads are blob: URLs that next/image cannot optimise.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={p.src + p.date}
      src={p.src}
      alt={`Progress photo, ${p.date}`}
      draggable={false}
      fetchPriority={priority ? "high" : undefined}
      className="absolute inset-0 size-full animate-[k-fade_0.5s_ease-out] object-cover select-none"
    />
  );
}

function ComparisonCard({
  points,
  before,
  after,
  setBefore,
  setAfter,
}: {
  points: Checkpoint[];
  before: number;
  after: number;
  setBefore: (i: number) => void;
  setAfter: (i: number) => void;
}) {
  const [mode, setMode] = useState<"side" | "split">("side");
  const [pos, setPos] = useState(50);
  const [spin, setSpin] = useState(0);
  const a = points[before];
  const b = points[after];
  const swap = () => {
    setBefore(after);
    setAfter(before);
    setSpin((s) => s + 180);
  };

  return (
    <Card delay={60} className="flex flex-col p-5" aria-label="Progress photo comparison">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CheckpointPicker label="Before" value={before} points={points} disabled={after} onChange={setBefore} />
        <div className="relative flex h-[39px] rounded-full bg-row p-1 max-sm:order-last max-sm:w-full" role="tablist" aria-label="Comparison layout">
          <span
            aria-hidden
            className="absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-full bg-[rgb(var(--lime-rgb)/0.16)] transition-transform duration-400 ease-[var(--ease-out)]"
            style={{ transform: `translateX(calc(${mode === "side" ? 0 : 100}% * var(--dir)))` }}
          />
          {(["side", "split"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "relative z-10 flex-1 rounded-full px-[14px] text-[12.5px] font-medium whitespace-nowrap transition-colors",
                mode === m ? "text-accent-ink" : "text-muted hover:text-ink",
              )}
            >
              {m === "side" ? "Side by Side" : "Split View"}
            </button>
          ))}
        </div>
        <CheckpointPicker label="After" value={after} points={points} disabled={before} onChange={setAfter} />
      </div>

      <div className="relative mt-5 min-h-[360px] flex-1 sm:min-h-[440px] wide:min-h-[520px]">
        {mode === "side" ? (
          <div key="side" className="absolute inset-0 grid animate-[k-fade_0.4s_ease-out] grid-cols-2 gap-3">
            <div className="k-in-pop relative overflow-hidden rounded-[16px] bg-[#1d1f1e]" style={{ "--d": "180ms" } as React.CSSProperties}>
              <Photo p={a} priority />
              <PhotoLabel p={a} className="start-3" />
            </div>
            <div className="k-in-pop relative overflow-hidden rounded-[16px] bg-[#1d1f1e]" style={{ "--d": "260ms" } as React.CSSProperties}>
              <Photo p={b} priority />
              <PhotoLabel p={b} className="start-3" />
            </div>
          </div>
        ) : (
          <div key="split" className="absolute inset-0 animate-[k-fade_0.4s_ease-out] overflow-hidden rounded-[16px] bg-[#1d1f1e]">
            <Photo p={b} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Photo p={a} />
            </div>
            <PhotoLabel p={a} className="start-3" />
            <PhotoLabel p={b} className="end-3 text-end" />
            <div className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${pos}%` }}>
              <span className="absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center rounded-full border border-white/25 bg-black/60 backdrop-blur-sm">
                <Ico h="03470" size={16} />
              </span>
            </div>
            <input
              type="range"
              dir="ltr"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(+e.target.value)}
              aria-label="Split position"
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </div>
        )}
        {mode === "side" && (
          <button
            type="button"
            onClick={swap}
            aria-label="Swap the two photos"
            className="absolute top-1/2 left-1/2 z-10 grid size-10 -translate-1/2 place-items-center rounded-full border border-white/25 bg-black/60 backdrop-blur-sm transition-[scale,background-color] duration-200 hover:scale-110 hover:bg-black/75 active:scale-95"
          >
            <span className="transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: `rotate(${spin}deg)` }}>
              <Ico h="03470" size={16} />
            </span>
          </button>
        )}
      </div>
    </Card>
  );
}

/* ---------- side cards ---------- */

function GoalCard() {
  const start = 78.2;
  const target = 72;
  const current = 75.3;
  const pct = Math.round(((start - current) / (start - target)) * 100);
  return (
    <Card delay={160} className="p-4" aria-label="Goal progress">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15.5px] leading-[23px] font-semibold text-ink">Goal Progress</h2>
        <button type="button" className="h-8 rounded-full bg-row px-[14px] text-[12.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-95 dark:hover:brightness-125">
          Edit Goal
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <IcoChip h="cf802" size={38} iconSize={24} className="[&>*]:animate-[k-heartbeat_2.8s_ease-in-out_infinite]" />
        <div>
          <p className="text-[14px] leading-[17.5px] font-medium text-ink">
            {start} kg to {target.toFixed(1)} kg
          </p>
          <p className="mt-[2px] text-[12px] leading-[18px] text-muted">Target date: Feb 9, 2027</p>
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-3">
        <span className="flex items-baseline">
          <CountUp value={pct} delay={300} className="text-[32px] leading-8 font-semibold text-ink" />
          <span className="text-[16px] font-semibold text-ink">%</span>
        </span>
        <span className="flex items-center gap-[6px] text-[12.5px] text-accent-ink">
          <span className="relative size-[7px] rounded-full bg-lime">
            <span className="absolute inset-0 animate-[k-ping_1.8s_ease-out_infinite] rounded-full bg-lime" />
          </span>
          On Track
        </span>
      </div>
      <div className="mt-[14px] h-2 overflow-hidden rounded-[4px] bg-track-2" role="progressbar" aria-label="Goal progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="k-fill k-shine relative h-full overflow-hidden rounded-[4px] bg-lime" style={{ width: `${pct}%`, "--d": "350ms" } as React.CSSProperties} />
      </div>
      <dl className="mt-[14px] grid grid-cols-3 divide-x divide-divider">
        {[
          ["Target Weight", `${target.toFixed(1)} kg`],
          ["Current Weight", `${current} kg`],
          ["Remaining", `${(target - current).toFixed(1)} kg`],
        ].map(([l, v], i) => (
          <div key={l} className={cn("min-w-0", i > 0 && "ps-3")}>
            <dt className="truncate text-[11.5px] leading-[17px] text-muted">{l}</dt>
            <dd className="text-[14.5px] leading-[22px] font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function PhotoMilestonesCard() {
  return (
    <Card delay={220} className="relative overflow-hidden p-5" aria-label="Progress milestones">
      <div className="flex items-center gap-4">
        <h2 className="text-[15.5px] leading-[23px] font-semibold text-ink">Progress Milestones</h2>
        <Link href="/dashboard/progress/achievements" className="text-[13px] font-medium text-[#b3b4b5] transition-colors hover:text-accent-ink dark:text-[#5f6162]">
          View All
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ul className="flex min-w-0 flex-1 flex-col gap-3">
          {PROGRESS_MILESTONES.map((m, i) => (
            <li key={m.label} className="k-in-left flex items-center gap-[10px]" style={{ "--d": `${300 + i * 80}ms` } as React.CSSProperties}>
              <span className="k-in-pop grid size-5 flex-none place-items-center rounded-full bg-lime" style={{ "--d": `${420 + i * 80}ms` } as React.CSSProperties}>
                <Ico h="eb92d" size={12} />
              </span>
              <span className="min-w-0 flex-1 text-[13.5px] leading-[18.5px] text-body">
                {m.label} <span className="font-medium whitespace-nowrap text-ink">{m.value}</span>
              </span>
              <span className="text-[11.5px] whitespace-nowrap text-muted">Nov 7, 2026</span>
            </li>
          ))}
        </ul>
        <span className="k-in-pop hidden flex-none sm:block" style={{ "--d": "500ms" } as React.CSSProperties}>
          <span className="block animate-[k-float_5s_ease-in-out_infinite]">
            <Ico h="a5e47" size={72} />
          </span>
        </span>
      </div>
    </Card>
  );
}

function NotesCard() {
  const [note, setNote] = useState(NOTE);
  const [draft, setDraft] = useState(NOTE);
  const [editing, setEditing] = useState(false);
  const [updated, setUpdated] = useState("Nov 7, 2026");
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) area.current?.focus();
  }, [editing]);

  const save = () => {
    setNote(draft.trim() || NOTE);
    setEditing(false);
    setUpdated(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  };

  return (
    <Card delay={260} className="flex flex-col p-5" aria-label="Your notes">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15.5px] leading-[23px] font-semibold text-ink">Your Notes</h2>
        {editing ? (
          <div className="flex gap-[6px]">
            <button
              type="button"
              onClick={() => {
                setDraft(note);
                setEditing(false);
              }}
              className="h-8 rounded-full px-3 text-[12.5px] font-medium text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button type="button" onClick={save} className="h-8 rounded-full bg-lime px-[14px] text-[12.5px] font-medium text-[var(--on-accent)] transition-[scale] active:scale-95">
              Save note
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex h-8 items-center gap-[7px] rounded-full bg-row px-[14px] text-[12.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-95 dark:hover:brightness-125"
          >
            <Ico h="5d917" size={13} />
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <label className="mt-3 block flex-1">
          <span className="sr-only">Your notes</span>
          <textarea
            ref={area}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
              if (e.key === "Escape") {
                setDraft(note);
                setEditing(false);
              }
            }}
            rows={4}
            className="w-full animate-[k-fade_0.25s_ease-out] resize-none rounded-[12px] border border-divider bg-row p-3 text-[13.5px] leading-[22px] text-ink outline-none focus:border-lime"
          />
        </label>
      ) : (
        <p className="mt-3 flex-1 text-[13.5px] leading-[22px] text-muted">{note}</p>
      )}
      <p className="mt-4 flex items-center gap-[6px] text-[12px] text-muted">
        <Ico h="b456c" size={13} />
        Updated: {updated}
      </p>
    </Card>
  );
}

function CheckpointsCard({
  points,
  after,
  onPick,
  onAdd,
}: {
  points: Checkpoint[];
  after: number;
  onPick: (i: number) => void;
  onAdd: (file: File) => void;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const scroll = (dir: number) => strip.current?.scrollBy({ left: dir * 192 * (document.documentElement.dir === "rtl" ? -1 : 1), behavior: "smooth" });
  const latest = points.length - 1;

  return (
    <Card delay={300} className="p-5" aria-label="Earlier checkpoints">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15.5px] leading-[23px] font-semibold text-ink">Earlier Checkpoints</h2>
        <button
          type="button"
          onClick={() => file.current?.click()}
          className="inline-flex h-8 items-center gap-[7px] rounded-full bg-row px-[14px] text-[12.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-95 dark:hover:brightness-125"
        >
          <Ico h="e43ff" size={13} />
          Add photo
        </button>
        <input
          ref={file}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onAdd(f);
            e.target.value = "";
          }}
        />
      </div>
      <div className="mt-3 flex items-center gap-[10px]">
        <button type="button" onClick={() => scroll(-1)} aria-label="Earlier checkpoints" className="grid size-8 flex-none place-items-center rounded-full bg-row transition-[scale] hover:scale-110 active:scale-95">
          <Ico h="c3bc6" size={15} />
        </button>
        <div ref={strip} className="flex min-w-0 flex-1 snap-x gap-[10px] overflow-x-auto scroll-smooth p-[6px] [scrollbar-width:none]">
          {points.map((p, i) => (
            <button
              key={p.date + i}
              type="button"
              onClick={() => onPick(i)}
              aria-label={`Compare with this checkpoint, ${p.date}`}
              aria-pressed={i === after}
              className="k-in-pop group w-[86px] flex-none snap-start text-center"
              style={{ "--d": `${350 + i * 70}ms` } as React.CSSProperties}
            >
              <span
                className={cn(
                  "relative block h-[115px] overflow-hidden rounded-[12px] bg-[#1d1f1e] transition-shadow duration-300",
                  i === after ? "shadow-[0_0_0_2px_var(--lime)]" : "group-hover:shadow-[0_0_0_2px_rgb(var(--lime-rgb)/0.4)]",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {i === latest && (
                  <span className="absolute top-[6px] start-[6px] rounded-full bg-[rgba(6,8,7,0.72)] px-2 py-[2px] text-[10px] leading-[15px] font-medium text-[var(--lime-bright)] backdrop-blur-[4px]">
                    Latest
                  </span>
                )}
              </span>
              <span className="mt-[6px] block text-[10.5px] leading-[15.75px] text-muted">{p.date}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => scroll(1)} aria-label="Later checkpoints" className="grid size-8 flex-none place-items-center rounded-full bg-row transition-[scale] hover:scale-110 active:scale-95">
          <Ico h="28699" size={15} />
        </button>
      </div>
    </Card>
  );
}

/* ---------- page ---------- */

export function Photos() {
  const [points, setPoints] = useState(INITIAL);
  const [before, setBefore] = useState(0);
  const [after, setAfter] = useState(INITIAL.length - 1);

  // Revoke blob URLs for uploaded photos when leaving the page.
  const pointsRef = useRef(points);
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);
  useEffect(() => () => pointsRef.current.forEach((p) => p.local && URL.revokeObjectURL(p.src)), []);

  const add = (file: File) => {
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const last = points[points.length - 1];
    setPoints([...points, { date, weight: last.weight, src: URL.createObjectURL(file), local: true }]);
    setAfter(points.length);
  };

  const pick = (i: number) => {
    if (i === before) setBefore(after);
    setAfter(i);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Progress Photo Comparison" subtitle="Track your transformation. See your progress. Stay motivated." />

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,1fr)_371px]">
        <ComparisonCard points={points} before={before} after={after} setBefore={setBefore} setAfter={setAfter} />
        <aside className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-1 wide:content-start">
          <MeasurementsCard legend />
          <GoalCard />
        </aside>
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[minmax(0,349fr)_minmax(0,287fr)_minmax(0,500fr)]">
        <PhotoMilestonesCard />
        <NotesCard />
        <div className="min-w-0 md:col-span-2 wide:col-span-1">
          <CheckpointsCard points={points} after={after} onPick={pick} onAdd={add} />
        </div>
      </div>
    </div>
  );
}
