"use client";

import { useState } from "react";
import { Card, Chip, CountUp, PeriodPill } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = [7.9, 7.4, 7.7, 6.9, 7.3, 7.6, 7.0]; // matches bar heights in Figma (110px = 12h)
const PX_PER_HOUR = 110 / 12;

const fmt = (h: number) => `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`;

export function SleepCard({ className }: { className?: string }) {
  const [active, setActive] = useState(6);

  return (
    <Card delay={240} className={cn("flex min-h-[320.1px] flex-col px-5 pb-[20px] pt-5", className)} aria-label="Sleep tracking">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-[10px]">
          <Chip icon="moon-filled" size={36} iconSize={22} className="[&>*]:animate-[k-float_4s_ease-in-out_infinite]" />
          <h2 className="text-[18px] leading-[27px] font-semibold whitespace-nowrap text-ink">Sleep Tracking</h2>
        </div>
        <PeriodPill label="Week" className="w-[108.6px]" />
      </header>

      <div className="mt-[19px] flex items-start justify-between">
        <div className="pt-[0px]">
          <p className="flex items-baseline">
            <CountUp value={7} delay={350} className="text-[28px] leading-[28px] font-semibold text-ink" />
            <span className="ms-[3px] text-[16px] leading-4 text-muted">h</span>
            <CountUp value={24} delay={350} className="ms-[4px] text-[28px] leading-[28px] font-semibold text-ink" />
            <span className="ms-[4px] text-[16px] leading-4 text-muted">m</span>
          </p>
          <p className="mt-[12.5px] text-[13.5px] leading-[20.25px] text-muted">Avg. Sleep</p>
        </div>
        <div className="flex">
          <span className="h-[81.5px] w-px bg-divider" />
          <div className="w-[50px] ps-[20px] box-content">
            <p className="-mt-[0.5px] text-[13.5px] leading-[20.25px] text-muted">Quality</p>
            <p className="mt-[10px] text-[22px] leading-[22px] font-semibold text-ink">
              <CountUp value={82} delay={420} />
            </p>
            <p className="mt-[9px] flex items-center gap-[6px] text-[13.5px] leading-[20.25px] text-accent-ink">
              <span className="size-2 rounded-full bg-lime" />
              Good
            </p>
          </div>
        </div>
      </div>

      {/* chart */}
      <div className="relative mt-[10px] flex-1">
        <div className="absolute start-0 top-0 flex h-[110px] flex-col justify-between">
          {["12h", "8h", "4h", "0h"].map((l) => (
            <span key={l} className="-translate-y-[5px] text-[11px] leading-[11px] text-muted first:translate-y-[-6px] last:translate-y-[-5.5px]">
              {l}
            </span>
          ))}
        </div>
        <div className="relative ms-[36px] h-[110px]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} aria-hidden className="absolute inset-x-0 border-t-[0.8px] border-dashed" style={{ top: `${(i * 110) / 3}px`, borderColor: "var(--grid-line)" }} />
          ))}
          <ul className="absolute inset-0 flex items-end justify-between px-[6px]" role="list">
            {HOURS.map((h, i) => {
              const isActive = i === active;
              const height = h * PX_PER_HOUR;
              return (
                <li
                  key={DAYS[i]}
                  className="relative flex w-[18px] cursor-pointer justify-center"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  aria-label={`${DAYS[i]}: ${fmt(h)}`}
                >
                  {isActive && (
                    <span
                      key={i}
                      className="absolute z-10 flex h-[30px] items-center rounded-[8px] bg-[#313334] px-[10px] text-[12px] leading-[18px] font-medium whitespace-nowrap text-white animate-[k-pop_0.35s_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={{ bottom: height + 10 }}
                    >
                      {fmt(h)}
                      <span aria-hidden className="absolute -bottom-[4px] left-1/2 size-[8px] -translate-x-1/2 rotate-45 bg-[#313334]" />
                    </span>
                  )}
                  <span
                    className="k-bar block w-[18px] rounded-[9px] transition-[filter] duration-300 hover:brightness-110"
                    style={{
                      height,
                      "--d": `${450 + i * 70}ms`,
                      background: `linear-gradient(180deg, ${isActive ? "var(--lime)" : "var(--lime-2)"} 0%, var(--bar-to) 100%)`,
                    } as React.CSSProperties}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="ms-[36px] mt-[10px] flex justify-between px-[6px]">
          {DAYS.map((d, i) => (
            <span
              key={d}
              className={cn("w-[18px] text-center text-[12px] leading-[12px] transition-colors duration-300", i === active ? "font-medium text-ink" : "text-muted")}
            >
              <span className="inline-block w-[30px] -translate-x-[6px]">{d}</span>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
