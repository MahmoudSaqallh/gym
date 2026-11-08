"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { MiniStatCard, PageHeader } from "../section-ui";
import { cn } from "@/lib/cn";
import { coachCta, Pill } from "./coach-ui";
import { CLIENTS } from "./data";

const STATS = [
  { label: "Clients", icon: "2163e", value: 6, sub: "on your roster", bars: [0.45, 0.725, 0.725, 0.725, 0.725, 1, 1] },
  { label: "Trained this week", icon: "c1b41", value: 3, sub: "a session or more", bars: [0.45, 1, 1, 1, 1, 1, 0.45] },
  { label: "Sessions", icon: "566e4", value: 6, sub: "finished this week", bars: [0.45, 0.725, 0.86, 1, 0.93, 1, 0.45] },
  { label: "Gone quiet", icon: "505f2", value: 3, sub: "nothing in 7 days", bars: [0.45, 0.45, 0.45, 0.45, 0.45, 0.725, 1] },
];

export function CoachClients() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="My Clients" subtitle="The members you look after, and how their week is going.">
        <Link href="/coach/members" className={coachCta}>
          <Ico h="b1737" size={18} />
          Add client
        </Link>
      </PageHeader>

      <div className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <MiniStatCard key={s.label} label={s.label} icon={s.icon} value={[{ n: s.value }]} sub={s.sub} bars={s.bars} delay={i * 60} />
        ))}
      </div>

      <Card delay={240} className="px-2 pt-4 pb-4" aria-label="Roster">
        <div className="flex items-center gap-[10px] ps-2">
          <IcoChip h="2ff15" size={36} iconSize={22} />
          <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Roster</h2>
        </div>
        <ul className="mt-2">
          {CLIENTS.map((c, i) => (
            <li key={c.slug} className="k-in-left" style={{ "--d": `${300 + i * 60}ms` } as React.CSSProperties}>
              <Link href={`/coach/clients/${c.slug}`} className="group flex h-[68px] items-center gap-3 rounded-[12px] px-2 transition-colors duration-200 hover:bg-row">
                <Image src={`/assets/f/${c.avatar}.png`} alt="" width={44} height={44} className="size-11 flex-none rounded-[10.56px] object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] leading-[21.75px] font-medium text-ink" translate="no">
                    {c.name}
                  </span>
                  <span className={cn("mt-[2px] block truncate text-[12.5px] leading-[18.75px]", c.danger ? "text-[#ef4444]" : "text-muted")}>{c.note}</span>
                </span>
                <Pill className="max-sm:hidden">{`${c.plan}/4 plan`}</Pill>
                <span className="w-[84px] flex-none text-end">
                  <span className="block text-[14px] leading-[21px] font-medium whitespace-nowrap text-ink">{`${c.sessions} sessions`}</span>
                  <span className="block text-[12px] leading-[18px] whitespace-nowrap text-muted">{`${c.minutes} min`}</span>
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">
                  <Ico h="2dbce" size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
