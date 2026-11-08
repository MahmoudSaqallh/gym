"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BodyGlow } from "@/components/ui/body-glow";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { PageHeader } from "../section-ui";

type Option = { label: string; sub: string; icon?: string };

const GOALS: Option[] = [
  { label: "Build Muscle", sub: "Increase strength and size", icon: "bd5d9" },
  { label: "Lose Weight", sub: "Burn fat and tone up", icon: "3dbaa" },
  { label: "Improve Health", sub: "Boost energy and wellness", icon: "21207" },
  { label: "Stay Fit", sub: "Maintain and stay active", icon: "89f36" },
];
const LEVELS: Option[] = [
  { label: "Beginner", sub: "New to working out" },
  { label: "Intermediate", sub: "Work out regularly" },
  { label: "Advanced", sub: "Train hard and often" },
  { label: "Elite", sub: "Athlete level training" },
];
const WORKOUTS = [
  { label: "Strength Training", icon: "8d880" },
  { label: "HIIT", icon: "b170c" },
  { label: "Cardio", icon: "a9eca" },
  { label: "Yoga / Mobility", icon: "72972" },
  { label: "Sports", icon: "e6168" },
];
const NUTRITION: Option[] = [
  { label: "High Protein", sub: "Build and recover", icon: "abbda" },
  { label: "Balanced", sub: "Well-rounded nutrition", icon: "4b4c5" },
  { label: "Low Carb", sub: "Manage carbs and weight", icon: "3dbaa" },
  { label: "Plant Based", sub: "Whole food plant nutrition", icon: "2a6c4" },
];
const PROMISES = [
  { icon: "2fe9d", title: "Science-backed plans", sub: "Proven methods that work" },
  { icon: "b3a40", title: "Adaptive & personalized", sub: "Evolves with your progress" },
  { icon: "5e505", title: "Privacy first", sub: "Your data stays yours" },
];
const STEPS = 4;

function OptionCards({ label, options, value, onChange, delay }: { label: string; options: Option[]; value: number; onChange: (i: number) => void; delay: number }) {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-4" role="radiogroup" aria-label={label}>
      {options.map((o, i) => {
        const on = i === value;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(i)}
            className={cn(
              "k-in-pop flex flex-col items-center rounded-[12px] border px-[10px] py-[13px] text-center transition-[background-color,border-color,translate,box-shadow] duration-300 hover:-translate-y-0.5",
              on ? "border-[rgb(var(--lime-rgb)/0.55)] bg-[var(--selected-bg)] shadow-[0_8px_18px_-14px_rgb(var(--grad-rgb)/0.9)] dark:bg-[var(--selected-bg)]" : "border-divider bg-row hover:border-[rgb(var(--lime-rgb)/0.45)]",
            )}
            style={{ "--d": `${delay + i * 60}ms` } as React.CSSProperties}
          >
            {o.icon && (
              <span className={cn("mb-[6px] transition-transform duration-300", on && "scale-110")}>
                <Ico h={o.icon} size={20} color={on ? "var(--accent-ink)" : "var(--subtle)"} />
              </span>
            )}
            <span className="text-[13px] leading-[16.25px] font-semibold text-ink">{o.label}</span>
            <span className="mt-[6px] text-[11px] leading-[15.1px] text-muted">{o.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function OnboardingForm() {
  const [goal, setGoal] = useState(0);
  const [level, setLevel] = useState(0);
  const [workouts, setWorkouts] = useState<string[]>(["Strength Training"]);
  const [food, setFood] = useState(0);
  const [step, setStep] = useState(1);
  const sections = useRef<(HTMLElement | null)[]>([]);

  const toggleWorkout = (w: string) => setWorkouts((list) => (list.includes(w) ? list.filter((x) => x !== w) : [...list, w]));
  const next = () => {
    const n = Math.min(STEPS, step + 1);
    setStep(n);
    sections.current[n - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const titles = ["What's your primary goal?", "What's your fitness level?", "What type of workouts do you enjoy?", "What's your nutrition focus?"];
  const heading = (i: number) => <h2 className="text-[14px] leading-[21px] font-medium text-ink">{titles[i]}</h2>;

  return (
    <Card delay={40} className="relative overflow-hidden p-6" aria-label="Onboarding">
      <div aria-hidden className="pointer-events-none absolute top-[72px] -end-[38px] hidden h-[832px] w-[362px] mix-blend-multiply sm:block dark:mix-blend-screen">
        <div className="k-in-fade k-hue absolute inset-0" style={{ "--d": "250ms" } as React.CSSProperties}>
          <Image src="/assets/f/7b056.png" alt="" fill sizes="362px" className="object-contain" />
          <BodyGlow src="/assets/f/7b056-glow.png" sizes="362px" />
        </div>
      </div>

      <div className="relative sm:max-w-[402px]">
        <p key={step} className="animate-[k-fade_0.35s_ease-out] text-[12.5px] leading-[19px] font-medium text-accent-ink">
          Step {step} of {STEPS}
        </p>
        <h1 className="mt-[6px] text-[26px] leading-[32.5px] font-semibold text-ink">Welcome to Kinora</h1>
        <p className="mt-[6px] text-[13.5px] leading-[22px] text-muted">Tell us a bit about yourself so we can build a plan that&apos;s just right for you.</p>

        <section ref={(n) => { sections.current[0] = n; }} className="mt-[21px]">
          {heading(0)}
          <div className="mt-[10px]">
            <OptionCards label={titles[0]} options={GOALS} value={goal} onChange={setGoal} delay={150} />
          </div>
        </section>

        <section ref={(n) => { sections.current[1] = n; }} className="mt-5">
          {heading(1)}
          <div className="mt-[10px]">
            <OptionCards label={titles[1]} options={LEVELS} value={level} onChange={setLevel} delay={260} />
          </div>
        </section>

        <section ref={(n) => { sections.current[2] = n; }} className="mt-5">
          {heading(2)}
          <div className="mt-[10px] flex flex-wrap gap-2" role="group" aria-label={titles[2]}>
            {WORKOUTS.map((w, i) => {
              const on = workouts.includes(w.label);
              return (
                <button
                  key={w.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleWorkout(w.label)}
                  className={cn(
                    "k-in-pop inline-flex h-[37px] items-center gap-2 rounded-[12px] border px-[14px] text-[12.5px] font-medium transition-[background-color,border-color,color,scale] duration-300 active:scale-95",
                    on ? "border-[rgb(var(--lime-rgb)/0.55)] bg-[var(--selected-bg)] text-ink dark:bg-[var(--selected-bg)]" : "border-divider bg-row text-body hover:border-[rgb(var(--lime-rgb)/0.45)]",
                  )}
                  style={{ "--d": `${360 + i * 50}ms` } as React.CSSProperties}
                >
                  <Ico h={w.icon} size={15} color={on ? "var(--accent-ink)" : "var(--subtle)"} />
                  {w.label}
                </button>
              );
            })}
          </div>
        </section>

        <section ref={(n) => { sections.current[3] = n; }} className="mt-5">
          {heading(3)}
          <div className="mt-[10px]">
            <OptionCards label={titles[3]} options={NUTRITION} value={food} onChange={setFood} delay={480} />
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 max-w-[245px] gap-[6px]" role="progressbar" aria-label="Onboarding progress" aria-valuenow={step} aria-valuemin={1} aria-valuemax={STEPS}>
            {Array.from({ length: STEPS }, (_, i) => (
              <span key={i} className="h-[5px] flex-1 overflow-hidden rounded-full bg-track-2">
                <span className="block h-full rounded-full bg-lime transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: i < step ? "100%" : "0%" }} />
              </span>
            ))}
          </div>
          {step < STEPS ? (
            <button type="button" onClick={next} className="group/btn k-shine inline-flex h-11 flex-none items-center gap-2 rounded-full bg-[var(--cta)] px-[17px] text-[14.5px] font-semibold text-[var(--on-accent)] transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-105">
              Next Step
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                <Ico h="44b38" size={17} />
              </span>
            </button>
          ) : (
            <Link href="/dashboard" className="group/btn k-shine inline-flex h-11 flex-none animate-[k-pop_0.4s_ease-out] items-center gap-2 rounded-full bg-[var(--cta)] px-[17px] text-[14.5px] font-semibold text-[var(--on-accent)] transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-105">
              Finish Setup
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                <Ico h="44b38" size={17} />
              </span>
            </Link>
          )}
        </div>
        <p className="mt-4 flex items-center gap-[6px] text-[12px] leading-[18px] text-muted">
          <Ico h="03f9c" size={14} />
          Your data is secure and never shared.
        </p>
      </div>
    </Card>
  );
}

function StateCard({ icon, title, text, delay, children, chipClass }: { icon: string; title: string; text: string; delay: number; children: React.ReactNode; chipClass?: string }) {
  return (
    <Card delay={delay} className="grid items-center gap-3 p-4 sm:grid-cols-[minmax(0,175px)_minmax(0,1fr)] sm:gap-4" aria-label={title}>
      <div className="flex items-start gap-3">
        <IcoChip h={icon} size={32} iconSize={20} className={chipClass} />
        <div className="min-w-0">
          <h3 className="text-[14px] leading-[17.5px] font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-[12px] leading-[16.5px] text-muted">{text}</p>
        </div>
      </div>
      <div className="rounded-[12px] bg-row p-4">{children}</div>
    </Card>
  );
}

function ErrorDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const retry = () => {
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1200);
  };
  return (
    <div className="flex items-center gap-[14px]">
      <span className="grid size-11 flex-none place-items-center rounded-full border border-[rgba(240,67,67,0.4)]">
        <span className="animate-[k-heartbeat_2.4s_ease-in-out_infinite]">
          <Ico h="3b189" size={20} />
        </span>
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[19.5px] font-medium text-ink">Something went wrong</p>
        <p className="mt-[2px] text-[11.5px] leading-[15.8px] text-muted">We couldn&apos;t load your data. Please try again.</p>
        <button type="button" onClick={retry} disabled={loading} className="mt-2 inline-flex h-8 min-w-[85px] items-center justify-center gap-[6px] rounded-full border border-[rgba(240,67,67,0.4)] px-3 text-[12px] font-medium text-[#ef4444] transition-colors hover:bg-[rgba(240,67,67,0.08)] disabled:opacity-70">
          {loading && <span className="size-3 animate-[k-spin_0.8s_linear_infinite] rounded-full border-2 border-[#ef4444] border-t-transparent" />}
          {loading ? "Retrying" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

function StatesColumn() {
  const skeleton = "animate-pulse bg-[rgba(179,179,181,0.5)]";
  return (
    <div className="flex flex-col gap-[14px]">
      <div>
        <h2 className="text-[17px] leading-[25.5px] font-semibold text-ink">See every state in action</h2>
        <p className="mt-[2px] text-[13px] leading-[19.5px] text-muted">A glimpse of how the app communicates every step of the way.</p>
      </div>

      <StateCard icon="500a9" title="Empty State" text="When there's nothing here yet, we keep it motivating." delay={120}>
        <div className="flex flex-col items-center py-2 text-center">
          <span className="grid size-12 place-items-center rounded-full border border-dashed border-[rgb(var(--lime-rgb)/0.45)]">
            <span className="animate-[k-float_3s_ease-in-out_infinite]">
              <Ico h="2aec6" size={20} />
            </span>
          </span>
          <p className="mt-[10px] text-[13px] leading-[19.5px] font-medium text-ink">No data to show yet</p>
          <p className="mt-[6px] max-w-[171px] text-[11.5px] leading-[17.25px] text-muted">Complete your profile and start your journey to see your progress here.</p>
        </div>
      </StateCard>

      <StateCard icon="bf655" title="Loading State" text="Smooth, elegant loading that keeps users engaged." delay={190} chipClass="[&>*]:animate-[k-spin_1.4s_linear_infinite]">
        <div aria-hidden>
          <div className="flex items-center gap-3">
            <span className={cn("size-9 flex-none rounded-full", skeleton)} />
            <span className="flex-1">
              <span className={cn("block h-[10px] w-[60%] rounded-[5px]", skeleton)} />
              <span className={cn("mt-[22px] block h-[10px] w-[38%] rounded-[5px]", skeleton)} />
            </span>
          </div>
          <div className="mt-[34px] grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={cn("h-7 rounded-[6px]", skeleton)} style={{ animationDelay: `${i * 90}ms` }} />
            ))}
          </div>
        </div>
      </StateCard>

      <StateCard icon="7e98a" title="Error State" text="Clear, helpful messages that guide users forward." delay={260}>
        <ErrorDemo />
      </StateCard>
    </div>
  );
}

export function Onboarding() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Basic Onboarding" subtitle="Let's personalize your experience to help you achieve your best." />

      <div className="grid items-start gap-[14px] wide:grid-cols-[minmax(0,699fr)_minmax(0,451fr)]">
        <OnboardingForm />
        <StatesColumn />
      </div>

      <Card delay={320} className="grid items-center gap-5 p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.65fr)_repeat(3,minmax(0,1fr))]" aria-label="Built for you">
        <div className="flex items-start gap-3">
          <IcoChip h="1eeb1" size={40} iconSize={25} />
          <div>
            <h2 className="text-[15.5px] leading-[19.4px] font-semibold text-ink">Built for you. Backed by science.</h2>
            <p className="mt-1 max-w-[304px] text-[12.5px] leading-[17.2px] text-muted">Every recommendation, every plan, every insight is designed to help you become your best.</p>
          </div>
        </div>
        {PROMISES.map((p, i) => (
          <div key={p.title} className="k-in-left flex items-center gap-[10px]" style={{ "--d": `${400 + i * 80}ms` } as React.CSSProperties}>
            <IcoChip h={p.icon} size={34} iconSize={21} />
            <div className="min-w-0">
              <p className="text-[13.5px] leading-[16.9px] font-medium text-ink">{p.title}</p>
              <p className="mt-[2px] text-[12px] leading-[16.5px] text-muted">{p.sub}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
