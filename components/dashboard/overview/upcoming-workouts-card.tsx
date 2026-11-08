"use client";

import Image from "next/image";
import { Card, Chip } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

const WORKOUTS = [
  { title: "Upper Body Strength", duration: "45 min", when: "Today", img: "/assets/dashboard/workout-1.png", icon: "run-list" },
  { title: "HIIT Cardio Blast", duration: "30 min", when: "Tomorrow", img: "/assets/dashboard/workout-2.png", icon: "run-list" },
  { title: "Leg Day Power", duration: "50 min", when: "Tue, Nov 10", img: "/assets/dashboard/workout-3.png", icon: "barbell-list", warm: true },
  { title: "Core & Mobility", duration: "25 min", when: "Wed, Nov 11", img: "/assets/dashboard/workout-4.png", icon: "stretching" },
];

export function UpcomingWorkoutsCard({ className }: { className?: string }) {
  return (
    <Card delay={400} className={cn("flex min-h-[320.1px] flex-col px-5 pb-5 pt-5", className)} aria-label="Upcoming workouts">
      <header className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Upcoming Workouts</h2>
        <a href="#" className="group flex items-center gap-1 text-[14px] leading-[21px] text-muted transition-colors hover:text-accent-ink">
          View all
          <span className="inline-block w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100">→</span>
        </a>
      </header>

      <ul className="mt-[31.25px] flex flex-col gap-2">
        {WORKOUTS.map((w, i) => (
          <li key={w.title} className="k-in-left" style={{ "--d": `${520 + i * 90}ms` } as React.CSSProperties}>
            <a href="#" className="group flex items-center gap-[6px] rounded-[11px] outline-none focus-visible:ring-2 focus-visible:ring-lime">
              <span className="relative h-[44px] w-[58px] flex-none overflow-hidden rounded-[9px]">
                <Image src={w.img} alt="" fill sizes="58px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="flex h-[44px] min-w-0 flex-1 items-center gap-[10px] rounded-[11px] bg-row ps-1 pe-[14px] transition-[translate,filter] duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:brightness-[0.97] dark:group-hover:brightness-125">
                <Chip icon={w.icon} size={36} iconSize={22} tone={w.warm ? "warm" : undefined} className="transition-transform duration-500 group-hover:rotate-[-10deg]" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[14.5px] leading-[18.125px] font-medium text-ink">{w.title}</span>
                  <span className="mt-[1.8px] text-[12.5px] leading-[15.625px] text-muted">{w.duration}</span>
                </span>
                <span className="ms-auto text-[13.5px] leading-[20.25px] whitespace-nowrap text-muted">{w.when}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
