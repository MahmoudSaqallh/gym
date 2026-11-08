"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { PageHeader, RangeSelect } from "../section-ui";
import { Ring, Sparkline, TrendChart } from "../charts";
import { cn } from "@/lib/cn";

const METRICS = [
  { label: "Weight", icon: "d3770", value: "75.3", unit: "kg", delta: "0.6 kg", up: false, spark: [4, 7, 9, 11, 12, 13, 13.5] },
  { label: "Body Fat", icon: "931bf", value: "14.3", unit: "%", delta: "0.9 %", up: false, spark: [3, 9, 12, 13, 14, 14.5, 15] },
  { label: "Muscle Mass", icon: "2507f", value: "62.6", unit: "kg", delta: "0.5 kg", up: true, spark: [26, 20, 14, 10, 9, 7, 6] },
  { label: "Waist", icon: "bc82f", value: "82", unit: "cm", delta: "1.7 cm", up: false, spark: [3, 5, 6, 8, 11, 14, 17] },
];
const CATEGORIES = [
  ["Strength", 85],
  ["Endurance", 72],
  ["Flexibility", 68],
  ["Mobility", 65],
] as const;
const ACHIEVEMENTS = [
  { title: "Consistent", text: "7 runs this month", icon: "0916b" },
  { title: "Early Bird", text: "Completed an activity before 7 AM", icon: "0916b" },
  { title: "Endurance", text: "Ran 6+ km", icon: "0916b" },
  { title: "5 Workouts This Week", text: "Great consistency!", icon: "e0d7a" },
];

export function ProgressOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Progress" subtitle="Track your journey and see how far you've come.">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 items-center gap-2 rounded-[12px] border border-divider px-3 text-[12px] font-medium text-ink transition-colors hover:border-[var(--nav-active-border)]">
            <Ico h="43a81" size={14} />
            Log a reading
          </button>
          <RangeSelect value="Last 7 Days" options={["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"]} />
        </div>
      </PageHeader>

      <div className="grid gap-[14px] lg:grid-cols-[708.35fr_441.6fr]">
        <Card delay={0} className="p-5" aria-label="Performance overview">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Performance Overview</h2>
            <PeriodPill label="Week" className="w-[108.6px]" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
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
            ].map((s) => (
              <div key={s.label} className="flex gap-3">
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
          </div>
          <div className="mt-3">
            <TrendChart
              labels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
              max={800}
              ticks={[0, 200, 400, 600, 800].map((v) => ({ v, label: String(v) }))}
              width={668}
              height={150}
              plot={{ x: 40, y: 6, w: 626, h: 120 }}
              format={(v) => `${v} kcal`}
              series={[
                { values: [0, 610, 0, 480, 180, 520, 0], color: "var(--lime)", dots: "small", width: 2.4, label: "This Week" },
                { values: [500, 0, 260, 0, 380, 0, 450], color: "var(--muted)", width: 1.4, label: "Last Week" },
              ]}
            />
          </div>
          <div className="mt-1 flex justify-center gap-6 text-[12.5px]">
            <span className="flex items-center gap-2 text-body">
              <span className="size-2.5 rounded-full bg-lime" />
              This Week
            </span>
            <span className="flex items-center gap-2 text-muted">
              <span className="size-2.5 rounded-full bg-muted" />
              Last Week
            </span>
          </div>
        </Card>

        <ProgressPhotoCard />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[434fr_355.3fr_346.7fr]">
        <BodyMetricsCard />

        <CategoryCard />

        <AchievementsCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <Card delay={200} className="k-dark-card group flex min-h-[114px] flex-wrap items-center gap-6 px-6 py-5" aria-label="Recommendations">
        <div className="absolute inset-0 overflow-hidden">
          <Image src="/assets/f/1777d.png" alt="" fill sizes="100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(6,8,7,0.97)_0%,rgba(6,8,7,0.92)_38%,rgba(6,8,7,0.6)_70%,rgba(6,8,7,0.25)_100%)]" />
        <div className="relative min-w-0 flex-1 sm:ps-[288px]">
          <p className="text-[22px] leading-[33px] font-semibold text-white">You&apos;re making great progress!</p>
          <p className="mt-[2px] max-w-[392px] text-[14px] leading-[20px] text-white/72">Keep staying consistent and don&apos;t forget to rest. Your body grows stronger every day.</p>
        </div>
        <a
          href="#"
          className="group/btn relative flex h-[42px] items-center gap-2 rounded-[14px] border border-[var(--lime-bright)] px-6 text-[15px] font-semibold text-[var(--lime-bright)] transition-colors hover:bg-[var(--lime-bright)] hover:text-[var(--on-accent)]"
        >
          View Recommendations
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">›</span>
        </a>
      </Card>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-auto pt-5">
      <Link href={href} className="group flex h-10 items-center gap-2 rounded-[12px] bg-row px-4 text-[14px] font-medium text-ink transition-[filter] hover:brightness-95 dark:hover:brightness-125">
        {label}
        <Ico h="66f46" size={16} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </Link>
    </div>
  );
}

export function ProgressPhotoCard({ className }: { className?: string }) {
  return (
    <Card delay={80} className={cn("flex flex-col p-5", className)} aria-label="Progress photo">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Progress Photo</h2>
            <Link href="/dashboard/progress/photos" aria-label="Add a progress photo" className="grid size-8 place-items-center rounded-full transition-colors hover:bg-[var(--nav-hover)]">
              <Ico h="d73aa" size={18} />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["bceef.png", "Jul 4, 2026"],
              ["d4a8d.png", "Nov 7, 2026"],
            ].map(([img, date], i) => (
              <figure key={date} className="k-in group" style={{ "--d": `${200 + i * 120}ms` } as React.CSSProperties}>
                <span className="relative block aspect-square overflow-hidden rounded-[12px]">
                  <Image src={`/assets/f/${img}`} alt={`Progress photo, ${date}`} fill sizes="(min-width:1024px) 194px, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <figcaption className="mt-[10px] text-center text-[12.5px] text-accent-ink">{date}</figcaption>
              </figure>
            ))}
          </div>
          <FooterLink href="/dashboard/progress/photos" label="View All Progress Photos" />
        </Card>
  );
}

export function BodyMetricsCard({ className }: { className?: string }) {
  return (
    <Card delay={120} className={cn("flex flex-col p-5", className)} aria-label="Body metrics">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Body Metrics</h2>
            <PeriodPill label="Week" className="w-[108.6px]" />
          </div>
          <ul className="mt-5 flex flex-col gap-[18px]">
            {METRICS.map((m, i) => (
              <li key={m.label} className="k-in-left flex items-center gap-3" style={{ "--d": `${200 + i * 80}ms` } as React.CSSProperties}>
                <IcoChip h={m.icon} size={30} iconSize={20} />
                <span className="flex-1 text-[14px] text-ink">{m.label}</span>
                <span className="w-[62px] text-end">
                  <span className="text-[15px] font-semibold text-ink">{m.value}</span> <span className="text-[11.5px] text-muted">{m.unit}</span>
                </span>
                <span className="flex w-[62px] items-center gap-1 text-[12.5px] text-accent-ink">
                  <Ico h={m.up ? "dda7c" : "3f75d"} size={13} />
                  {m.delta}
                </span>
                <span className="w-[78px]">
                  <Sparkline width={78} height={30} points={m.spark.map((y, j) => [j * 13, y] as [number, number])} stroke={1.8} dot={0} delay={300 + i * 80} />
                </span>
              </li>
            ))}
          </ul>
          <FooterLink href="/dashboard/progress/body-metrics" label="View All Metrics" />
        </Card>
  );
}

export function CategoryCard({ className }: { className?: string }) {
  return (
    <Card delay={180} className={cn("flex flex-col p-5", className)} aria-label="Progress by category">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Progress by Category</h2>
            <PeriodPill label="Week" className="w-[108.6px]" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div className="relative size-[166px] flex-none">
              <Ring size={166} stroke={20} pct={0.73} delay={250} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[12px] text-muted">Total</span>
                <span className="mt-1 flex items-baseline">
                  <CountUp value={73} delay={250} className="text-[26px] leading-[30px] font-semibold text-ink" />
                  <span className="text-[15px] text-body">%</span>
                </span>
                <span className="mt-2 text-[11.5px] text-muted">Improvement</span>
              </div>
            </div>
            <ul className="flex min-w-[120px] flex-1 flex-col gap-6">
              {CATEGORIES.map(([l, v], i) => (
                <li key={l} className="k-in-left flex items-center gap-2 text-[13.5px]" style={{ "--d": `${300 + i * 80}ms` } as React.CSSProperties}>
                  <span className="size-2 rounded-full bg-lime" />
                  <span className="flex-1 truncate text-body">{l}</span>
                  <span className="font-semibold text-ink">{v}%</span>
                </li>
              ))}
            </ul>
          </div>
          <FooterLink href="/dashboard/progress/workouts" label="View Detailed Analysis" />
        </Card>
  );
}

export function AchievementsCard({ className }: { className?: string }) {
  return (
    <Card delay={240} className={cn("p-5", className)} aria-label="Recent achievements">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Recent Achievements</h2>
            <Link href="/dashboard/progress/achievements" className="text-[14px] text-muted transition-colors hover:text-accent-ink">
              View All
            </Link>
          </div>
          <ul className="mt-3">
            {ACHIEVEMENTS.map((a, i) => (
              <li key={a.title} className={cn("k-in-left flex items-center gap-3 py-[13px]", i > 0 && "border-t border-divider")} style={{ "--d": `${300 + i * 80}ms` } as React.CSSProperties}>
                <IcoChip h={a.icon} size={40} iconSize={25} className="[&>*]:animate-[k-heartbeat_2.6s_ease-in-out_infinite]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-ink">{a.title}</span>
                  <span className="mt-[3px] block truncate text-[12.5px] text-muted">{a.text}</span>
                </span>
                <span className="self-start pt-[2px] text-[12.5px] text-muted">Nov 7</span>
              </li>
            ))}
          </ul>
        </Card>
  );
}
