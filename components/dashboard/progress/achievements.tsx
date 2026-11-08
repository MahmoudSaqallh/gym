"use client";

import { Card } from "@/components/ui/primitives";
import { IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { MiniStatCard, PageHeader } from "../section-ui";
import { AchievementsCard, CategoryCard } from "./progress-overview";
import { RecordsCard, TrainingSplitCard } from "./progress-workouts";
import { MilestonesCard } from "./habits";

const TROPHIES = [
  { name: "Consistency", icon: "59778", date: "Nov 6" },
  { name: "Heavy Lifter", icon: "42cd9", date: "Oct 29" },
  { name: "Early Bird", icon: "c2d6f", date: "Sep 24" },
  { name: "Hydrated", icon: "158fc", date: "Oct 15" },
  { name: "Distance", icon: "fb614", date: null },
  { name: "Perfect Month", icon: "fb614", date: null },
];

function TrophyCase({ className }: { className?: string }) {
  const earned = TROPHIES.filter((t) => t.date).length;
  return (
    <Card delay={160} className={cn("p-5", className)} aria-label="Trophy case">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] leading-6 font-semibold text-ink">Trophy Case</h2>
        <span className="text-[12.5px] text-muted">
          {earned} of {TROPHIES.length} earned
        </span>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-[10px]">
        {TROPHIES.map((t, i) => (
          <li
            key={t.name}
            className={cn(
              "k-in-pop group flex h-[116.5px] flex-col items-center rounded-[16px] bg-row px-2 pt-[14px] transition-[translate,box-shadow] duration-300",
              t.date ? "hover:-translate-y-1 hover:shadow-[0_10px_24px_-14px_rgb(var(--accent-ink-rgb)/0.55)]" : "opacity-55",
            )}
            style={{ "--d": `${260 + i * 70}ms` } as React.CSSProperties}
            title={t.date ? `${t.name}, earned ${t.date}` : `${t.name}, locked`}
          >
            <IcoChip
              h={t.icon}
              size={38}
              iconSize={24}
              className={cn(
                "transition-transform duration-500",
                t.date ? "group-hover:scale-110 group-hover:rotate-[-8deg]" : "group-hover:animate-[k-bell_0.7s_ease-in-out]",
              )}
            />
            <span className="mt-2 w-full truncate text-center text-[12px] leading-[18px] font-medium text-ink">{t.name}</span>
            <span className="mt-2 text-[11px] leading-[16.5px] text-muted">{t.date ?? "Locked"}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function Achievements() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Achievements" subtitle="What you have earned, and where the work is landing." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Achievements earned" icon="37fc6" value={[{ n: 7 }]} sub="this month" bars={[0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 1]} delay={0} />
        <MiniStatCard label="Personal records" icon="f11ff" value={[{ n: 4 }]} sub="standing right now" bars={[0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 1]} delay={70} />
        <MiniStatCard label="Longest live streak" icon="b6bcc" value={[{ n: 6 }]} sub="days in a row" bars={[0.45, 0.45, 0.45, 0.67, 0.78, 0.45, 1]} delay={140} />
        <MiniStatCard label="Badges unlocked" icon="2019f" value={[{ n: 4 }]} sub="of 6 in the case" bars={[1, 0.45, 0.45, 1, 0.45, 1, 1]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <AchievementsCard />
        <RecordsCard />
        <MilestonesCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <TrophyCase />
        <TrainingSplitCard />
        <CategoryCard className="md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}
