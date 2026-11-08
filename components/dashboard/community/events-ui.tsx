"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { DIRECTORY, EVENTS, useAttending } from "./data";

export function DirectoryCard({ className, delay = 100 }: { className?: string; delay?: number }) {
  return (
    <Card delay={delay} className={cn("p-5", className)} aria-label="Directory">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">Directory</h2>
      <ul className="mt-2 max-h-[174px] overflow-y-auto pe-1 [scrollbar-width:thin]" tabIndex={0} aria-label="Member directory, scroll for more">
        {DIRECTORY.map((m, i) => (
          <li key={m.name} className="k-in-left border-b border-divider" style={{ "--d": `${delay + 100 + Math.min(i, 4) * 70}ms` } as React.CSSProperties}>
            <button type="button" aria-label={`View profile, ${m.name}`} className="group/row flex h-[57px] w-full items-center gap-3 text-start">
              <span className="relative size-9 flex-none">
                <Image src={`/assets/f/${m.avatar}.png`} alt="" width={36} height={36} className="size-9 rounded-[8.6px] object-cover transition-transform duration-300 group-hover/row:scale-105" />
                {m.online && <span className="absolute -end-0.5 -bottom-0.5 size-[10px] rounded-full border-2 border-[var(--card-bg)] bg-lime" title="Online" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] leading-5 font-medium text-ink">{m.name}</span>
                <span className="block truncate text-[12.5px] leading-[19px] text-muted">{m.role}</span>
              </span>
              <span className="flex items-center gap-[6px] text-[12.5px] whitespace-nowrap text-muted max-[420px]:hidden">
                <Ico h="408f7" size={13} />
                {m.streak} day streak
              </span>
              <span className="w-[42px] text-end text-[13.5px] font-semibold text-ink">{m.pts.toLocaleString("en-US")}</span>
              <span className="transition-transform duration-300 group-hover/row:translate-x-1 rtl:group-hover/row:-translate-x-1">
                <Ico h="28699" size={15} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function UpcomingEventsCard({ className, delay = 260 }: { className?: string; delay?: number }) {
  const { has } = useAttending();
  return (
    <Card delay={delay} className={cn("p-5", className)} aria-label="Upcoming events">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] leading-6 font-semibold text-ink">Upcoming Events</h2>
        <Link href="/dashboard/community/events" className="text-[13.5px] text-muted transition-colors hover:text-accent-ink">
          View all
        </Link>
      </div>
      <ul className="mt-2">
        {EVENTS.map((e, i) => (
          <li key={e.id} className="k-in-left" style={{ "--d": `${delay + 100 + i * 60}ms` } as React.CSSProperties}>
            <Link href="/dashboard/community/events" className="group/e -mx-2 flex h-[60px] items-center gap-3 rounded-[12px] px-2 transition-colors hover:bg-row">
              <IcoChip h="54031" size={38} iconSize={24} className="transition-transform duration-300 group-hover/e:rotate-[-8deg]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] leading-5 font-medium text-ink">{e.name}</span>
                <span className="flex items-center gap-[6px] text-[12px] leading-[18px] whitespace-nowrap text-muted">
                  <Ico h="5aacf" size={12} />
                  <span className="truncate">
                    {e.place} · {e.date}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-[6px] text-[12.5px] text-muted">
                <Ico h="4cec8" size={13} />
                {e.going + (has(e.id) ? 1 : 0)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function EventCard({ e, delay = 0 }: { e: (typeof EVENTS)[number]; delay?: number }) {
  const { has, toggle } = useAttending();
  const on = has(e.id);
  const going = e.going + (on ? 1 : 0);
  return (
    <Card delay={delay} className="group flex flex-col overflow-hidden" aria-label={e.name}>
      <div className="relative h-[132px] overflow-hidden">
        <Image
          src={`/assets/f/${e.cover}.png`}
          alt=""
          fill
          sizes="(min-width:1380px) 380px, (min-width:768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15.5px] leading-[23px] font-semibold text-ink">{e.name}</h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-[18px] gap-y-1 text-[12.5px] leading-[19px] text-muted">
          <span className="flex items-center gap-[6px]">
            <Ico h="48696" size={13} />
            {e.date}
          </span>
          <span className="flex items-center gap-[6px]">
            <Ico h="ae791" size={13} />
            {e.place}
          </span>
        </p>
        <p className="mt-[10px] flex items-center gap-[6px] text-[12.5px] leading-[19px] text-muted">
          <Ico h="4cec8" size={13} />
          {going} of {e.cap} going
        </p>
        <div className="mt-2 h-[6px] overflow-hidden rounded-[3px] bg-track-2" role="progressbar" aria-label={`${e.name} attendance`} aria-valuenow={going} aria-valuemin={0} aria-valuemax={e.cap}>
          <div className="k-fill h-full rounded-[3px] bg-lime transition-[width] duration-500" style={{ width: `${(going / e.cap) * 100}%`, "--d": `${delay + 250}ms` } as React.CSSProperties} />
        </div>
        <button
          type="button"
          onClick={() => toggle(e.id)}
          aria-pressed={on}
          aria-label={`${on ? "Cancel attendance for" : "Attend"} ${e.name}`}
          className={cn(
            "mt-4 inline-flex h-9 items-center gap-[6px] self-end rounded-[12px] px-[15px] text-[13.5px] font-semibold transition-[background-color,color,scale] duration-300 active:scale-95",
            on ? "bg-[rgb(var(--lime-rgb)/0.16)] text-accent-ink" : "bg-lime text-[var(--on-accent)] hover:brightness-105",
          )}
        >
          {on && (
            <svg viewBox="0 0 16 16" className="size-[14px] animate-[k-pop_0.4s_ease-out]" aria-hidden>
              <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {on ? "Going" : "Attend"}
        </button>
      </div>
    </Card>
  );
}
