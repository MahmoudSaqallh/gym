"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Popover } from "@/components/ui/popover";
import { PageHeader } from "../section-ui";
import { cn } from "@/lib/cn";
import { DIFF_LEVEL, EXERCISES, FEATURED, RECENT_VIEWS, SAVED_ORDER, findExercise, type Exercise } from "./exercises-data";
import { useSaved } from "./saved-store";

const MUSCLES = ["All Muscles", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
const EQUIPMENT = ["All Equipment", "Barbell", "Dumbbell", "Bodyweight", "Cable"];
const DIFFICULTY = ["All Difficulty", "Beginner", "Intermediate", "Advanced"];

export function ExerciseLibrary() {
  const [muscle, setMuscle] = useState(MUSCLES[0]);
  const [equip, setEquip] = useState(EQUIPMENT[0]);
  const [diff, setDiff] = useState(DIFFICULTY[0]);

  const list = useMemo(
    () =>
      EXERCISES.filter(
        (e) => (muscle === MUSCLES[0] || e.group === muscle) && (equip === EQUIPMENT[0] || e.equipment === equip) && (diff === DIFFICULTY[0] || e.difficulty === diff),
      ),
    [muscle, equip, diff],
  );
  const filtered = muscle !== MUSCLES[0] || equip !== EQUIPMENT[0] || diff !== DIFFICULTY[0];
  const key = `${muscle}|${equip}|${diff}`;

  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Exercise Library" subtitle="Discover and learn from 1,200+ exercises to build your perfect workout." />

      <div className="flex flex-wrap items-center gap-3 px-1 animate-[k-fade_0.6s_ease-out_120ms_both]">
        <FilterSelect icon="10278" value={muscle} options={MUSCLES} onChange={setMuscle} />
        <FilterSelect icon="32204" value={equip} options={EQUIPMENT} onChange={setEquip} />
        <FilterSelect icon="19e01" value={diff} options={DIFFICULTY} onChange={setDiff} />
        <span key={list.length} className="ms-1 text-[14px] text-muted animate-[k-fade_0.4s_ease-out]">
          {list.length} exercises found
        </span>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setMuscle(MUSCLES[0]);
              setEquip(EQUIPMENT[0]);
              setDiff(DIFFICULTY[0]);
            }}
            className="text-[13px] font-medium text-accent-ink hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid items-start gap-[14px] wide:grid-cols-[minmax(0,1fr)_317.7px]">
        <div key={key} className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[14px]">
          {!filtered && <FeaturedCard />}
          {list.map((e, i) => (
            <ExerciseCard key={e.slug} e={e} delay={Math.min(i, 12) * 50} />
          ))}
          {list.length === 0 && (
            <div className="col-span-full grid min-h-[240px] place-items-center rounded-[20px] border border-dashed border-divider text-center">
              <div>
                <p className="text-[16px] font-semibold text-ink">No exercises match these filters</p>
                <p className="mt-1 text-[13.5px] text-muted">Try another muscle group or equipment.</p>
              </div>
            </div>
          )}
        </div>
        <Aside />
      </div>
    </div>
  );
}

function FilterSelect({ icon, value, options, onChange }: { icon: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Popover
      offset={6}
      role="listbox"
      label={options[0]}
      className="min-w-[180px] py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-11 items-center gap-[10px] rounded-[12px] border bg-row ps-4 pe-4 text-[14.5px] font-medium text-body transition-all duration-200 hover:brightness-95 dark:hover:brightness-125",
            value !== options[0] ? "border-[var(--nav-active-border)] text-accent-ink" : "border-divider",
          )}
        >
          <Ico h={icon} size={18} />
          {value}
          <Ico h="834d0" size={16} className={cn("transition-transform duration-300", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) =>
        options.map((o, i) => (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={o === value}
            onClick={() => {
              onChange(o);
              close();
            }}
            className={cn("flex h-9 w-full items-center px-3 text-start text-[14px] text-ink transition-colors hover:bg-[var(--menu-hover)]", o === value && "font-medium text-accent-ink")}
            style={{ animation: `k-slide-right 0.3s var(--ease-out) ${i * 30}ms both` }}
          >
            {o}
          </button>
        ))
      }
    </Popover>
  );
}

/* ───────── Featured (always dark) ───────── */
function FeaturedCard() {
  return (
    <Card delay={0} className="k-dark-card group col-span-2 min-h-[329.75px] p-5" aria-label="Featured exercise">
      <div className="absolute inset-y-0 end-0 w-[62%] overflow-hidden">
        <Image src={`/assets/f/${FEATURED.img}`} alt="" fill priority sizes="260px" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
        <span className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d0e_0%,rgba(11,14,14,0.35)_50%,rgba(11,14,14,0)_100%)]" />
      </div>
      <div className="relative flex h-full flex-col">
        <p className="text-[12px] leading-[18px] font-semibold tracking-[1.68px] text-lime uppercase">Featured</p>
        <h2 className="mt-2 max-w-[150px] text-[24px] leading-[30px] font-semibold text-white">{FEATURED.name}</h2>
        <p className="mt-2 max-w-[178px] text-[14px] leading-[22.75px] text-[#8e8e8e]">Build lower body strength and power with the king of compound movements.</p>
        <Link
          href={`/dashboard/workouts/exercises/${FEATURED.slug}`}
          className="k-shine group/btn mt-4 flex h-10 w-fit items-center gap-2 rounded-[12px] bg-cta ps-4 pe-4 text-[14px] font-semibold text-[var(--on-accent)] transition-[filter,translate] hover:-translate-y-0.5 hover:brightness-105"
        >
          View Exercise
          <Ico h="e3e93" size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
        </Link>
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-4 pt-4 text-[12.5px] leading-[18.75px] text-[#d5d8d7]">
          {["Compound", "Strength", "Lower Body"].map((t) => (
            <span key={t} className="flex min-w-[80px] items-center gap-[6px] whitespace-nowrap">
              <span className="size-1.5 rounded-full bg-lime" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────── Exercise card ───────── */
function ExerciseCard({ e, delay }: { e: Exercise; delay: number }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(e.slug);
  const lvl = DIFF_LEVEL[e.difficulty];
  return (
    <Card delay={delay} className="group flex min-h-[300px] flex-col" aria-label={e.name}>
      <div className="relative h-[122.2px] flex-none overflow-hidden">
        <Image src={`/assets/f/${e.img}`} alt="" fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <button
          type="button"
          onClick={() => toggle(e.slug)}
          aria-pressed={saved}
          aria-label={`${saved ? "Remove" : "Save"} ${e.name}`}
          className="absolute end-[10px] top-[10px] z-10 grid size-9 place-items-center rounded-full bg-black/45 backdrop-blur-[2px] transition-transform duration-300 hover:scale-110 active:scale-90"
        >
          <span key={String(saved)} className="animate-[k-pop_0.35s_ease-out]">
            <Ico h={saved ? "99b59" : "2b9ea"} size={17} />
          </span>
        </button>
      </div>
      <div className="flex flex-1 flex-col px-[14px] pb-[14px] pt-[13px]">
        <Link href={`/dashboard/workouts/exercises/${e.slug}`} className="text-[15.5px] leading-[19.4px] font-semibold text-ink after:absolute after:inset-0 hover:text-accent-ink">
          {e.name}
        </Link>
        <p className="mt-[9px] flex gap-2 text-[13px] leading-[19.5px] text-muted">
          <span className="mt-[6.5px] size-[7px] flex-none rounded-full bg-lime" />
          <span className="max-w-[140px]">{e.muscles.join(" • ")}</span>
        </p>
        <p className="mt-[6px] flex items-center gap-2 text-[13px] leading-[19.5px] text-muted">
          <Ico h="10665" size={14} />
          {e.equipment}
        </p>
        <p className="mt-[6px] flex items-center gap-2 text-[13px] leading-[19.5px] text-muted">
          <Ico h="37268" size={14} />
          {e.difficulty}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="flex gap-1" aria-label={`Difficulty ${lvl} of 4`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-[5px] w-3.5 rounded-[2.5px]", i < lvl ? "bg-lime" : "bg-track-2")} />
            ))}
          </span>
          <span className="relative z-10 grid size-9 place-items-center rounded-full bg-row transition-all duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:bg-lime" aria-hidden>
            <Ico h="2b1f7" size={17} />
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ───────── Aside: saved, recent, request ───────── */
function Aside() {
  const { saved, toggle } = useSaved();
  const [recent, setRecent] = useState(RECENT_VIEWS);
  const [requested, setRequested] = useState(false);
  const savedList = [...SAVED_ORDER.filter((s) => saved.includes(s)), ...saved.filter((s) => !SAVED_ORDER.includes(s))]
    .map((s) => findExercise(s))
    .filter(Boolean) as Exercise[];

  return (
    <aside className="flex flex-col gap-[14px] sm:grid sm:grid-cols-2 wide:flex">
      <Card delay={150} className="p-4" aria-label="Saved exercises">
        <div className="flex items-center justify-between">
          <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Saved Exercises</h2>
          <a href="#" className="text-[13px] font-medium text-[#b3b4b5] transition-colors hover:text-accent-ink">
            View all
          </a>
        </div>
        <ul className="mt-2 flex max-h-[262px] flex-col gap-4 overflow-y-auto pb-1 pt-2 [scrollbar-width:thin]">
          {savedList.map((e) => (
            <li key={e.slug} className="flex items-center gap-3 animate-[k-slide-right_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
              <Thumb e={e} />
              <Link href={`/dashboard/workouts/exercises/${e.slug}`} className="min-w-0 flex-1">
                <span className="block truncate text-[14px] leading-[17.5px] font-medium text-ink hover:text-accent-ink">{e.name}</span>
                <span className="mt-[2px] block truncate text-[12.5px] leading-[18.75px] text-muted">{e.muscles.join(" • ")}</span>
              </Link>
              <button type="button" onClick={() => toggle(e.slug)} aria-label={`Remove ${e.name}`} className="transition-transform hover:scale-125">
                <Ico h="2da9d" size={16} />
              </button>
            </li>
          ))}
          {savedList.length === 0 && <li className="py-6 text-center text-[13px] text-muted">Tap the bookmark on any exercise to save it.</li>}
        </ul>
      </Card>

      <Card delay={220} className="p-4" aria-label="Recent views">
        <div className="flex items-center justify-between">
          <h2 className="text-[15.5px] leading-[23.25px] font-semibold text-ink">Recent Views</h2>
          <button type="button" onClick={() => setRecent([])} className="text-[13px] font-medium text-[#b3b4b5] transition-colors hover:text-accent-ink">
            Clear
          </button>
        </div>
        <ul className="mt-2 flex flex-col gap-4 pt-2">
          {recent.map((r) => {
            const e = findExercise(r.slug)!;
            return (
              <li key={r.slug} className="flex items-center gap-3">
                <Thumb e={e} />
                <Link href={`/dashboard/workouts/exercises/${e.slug}`} className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] leading-[17.5px] font-medium text-ink hover:text-accent-ink">{e.name}</span>
                  <span className="mt-[2px] block text-[12.5px] leading-[18.75px] text-muted">{r.ago}</span>
                </Link>
                <Ico h="9fdd4" size={16} />
              </li>
            );
          })}
          {recent.length === 0 && <li className="py-6 text-center text-[13px] text-muted animate-[k-fade_0.4s_ease-out]">No recent views.</li>}
        </ul>
      </Card>

      <Card delay={290} className="flex flex-col items-center px-6 pb-6 pt-6 text-center sm:col-span-2 wide:col-span-1" aria-label="Request an exercise">
        <IcoChip h="2cf70" size={48} iconSize={30} className="[&>*]:animate-[k-heartbeat_2.4s_ease-in-out_infinite]" />
        <p className="mt-4 text-[16px] leading-6 font-semibold text-ink">Can&apos;t find an exercise?</p>
        <p className="mt-[5px] max-w-[241px] text-[13.5px] leading-[21.9px] text-muted">Request a new exercise and we&apos;ll add it to the library.</p>
        <button
          type="button"
          onClick={() => setRequested(true)}
          disabled={requested}
          className={cn(
            "k-shine mt-5 flex h-10 items-center rounded-[12px] px-5 text-[14px] font-semibold transition-[filter,translate]",
            requested ? "bg-pill text-accent-ink" : "bg-cta text-[var(--on-accent)] hover:-translate-y-0.5 hover:brightness-105",
          )}
        >
          {requested ? "Request sent ✓" : "Request Exercise"}
        </button>
      </Card>
    </aside>
  );
}

function Thumb({ e }: { e: Exercise }) {
  return (
    <span className="relative h-10 w-[52px] flex-none overflow-hidden rounded-[8px]">
      <Image src={`/assets/f/${e.thumb ?? e.img}`} alt="" fill sizes="52px" className="object-cover" />
    </span>
  );
}
