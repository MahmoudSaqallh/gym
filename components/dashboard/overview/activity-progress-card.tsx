"use client";

import { Card, Chip, CountUp, DIcon, PeriodPill } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/* Ring arcs are the exact vectors exported from Figma, re-drawn with stroke animation. */
const RINGS = [
  {
    // Move — outer, 160px
    box: 160,
    at: 0,
    track: "M154 80.0005C154 120.87 120.869 154 80 154C39.131 154 6.00004 120.87 6.00004 80.0005C6.00004 39.1314 39.131 6.00046 80 6.00046C120.869 6.00046 154 39.1314 154 80.0005Z",
    arc: "M154 80.0005C154 95.8661 148.901 111.312 139.454 124.059C130.008 136.806 116.715 146.179 101.536 150.797C86.3574 155.414 70.0964 155.031 55.1519 149.703C40.2074 144.376 27.3708 134.386 18.5357 121.208C9.70059 108.03 5.33474 92.3618 6.0822 76.5138C6.82966 60.6657 12.6508 45.4775 22.6871 33.1895C32.7233 20.9016 46.4431 12.1646 61.8226 8.26732C77.2022 4.37007 93.4271 5.51894 108.104 11.5445",
    color: "var(--lime)",
  },
  {
    // Exercise — middle, 126px
    box: 126,
    at: 17,
    track: "M120 63C120 94.4802 94.4802 120 63 120C31.5198 120 6.00001 94.4802 6.00001 63C6.00001 31.5198 31.5198 6 63 6C94.4802 6 120 31.5198 120 63Z",
    arc: "M120 63C120 73.6811 116.999 84.1474 111.339 93.2055C105.679 102.264 97.5872 109.549 87.987 114.231C78.3869 118.914 67.6643 120.804 57.0417 119.688C46.4191 118.571 36.3239 114.492 27.9071 107.916C19.4903 101.34 13.0905 92.5318 9.43741 82.4948C5.78431 72.4578 5.02488 61.5963 7.24569 51.1486C9.4665 40.7009 14.5782 31.0874 21.998 23.4041C29.4178 15.7208 38.8471 10.2769 49.211 7.693",
    color: "var(--lime-2)",
  },
  {
    // Stand — inner, 92px
    box: 92,
    at: 34,
    track: "M86.0001 46.0001C86.0001 68.0914 68.0915 86.0001 46.0001 86.0001C23.9087 86.0001 6.00007 68.0914 6.00007 46.0001C6.00007 23.9087 23.9087 6.00005 46.0001 6.00005C68.0915 6.00005 86.0001 23.9087 86.0001 46.0001Z",
    arc: "M86.0001 46.0001C86.0001 54.8054 83.0946 63.3647 77.7342 70.3505C72.3738 77.3363 64.8582 82.3581 56.3528 84.6371C47.8475 86.9161 38.8278 86.3249 30.6927 82.9552C22.5576 79.5856 15.7617 73.6257 11.3591 66.0001C6.95637 58.3744 5.19294 49.5091 6.34227 40.779C7.4916 32.049 11.4895 23.9421 17.7158 17.7158C23.9421 11.4895 32.049 7.4916 40.779 6.34227C49.5091 5.19294 58.3744 6.95637 66.0001 11.3591",
    color: "var(--lime-3)",
  },
];

const STATS = [
  { icon: "flame", label: "Move", value: 812, goal: "1,000", unit: "kcal" },
  { icon: "barbell-sm", label: "Exercise", value: 64, goal: "90", unit: "min" },
  { icon: "walk", label: "Stand", value: 10, goal: "12", unit: "hrs" },
];

export function ActivityProgressCard({ className }: { className?: string }) {
  return (
    <Card delay={90} className={cn("flex min-h-[400px] flex-col px-5 pb-[21px] pt-5", className)} aria-label="Activity progress">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] leading-[27px] font-semibold whitespace-nowrap text-ink">Activity Progress</h2>
        <PeriodPill label="Today" className="w-[112px]" />
      </header>

      <div className="relative mx-auto mt-[18.45px] size-[160px]">
        <svg viewBox="0 0 160 160" width={160} height={160} className="overflow-visible" role="img" aria-label="Move 81%, Exercise 71%, Stand 83%">
          {RINGS.map((r, i) => (
            <g key={r.box} transform={`translate(${r.at} ${r.at})`}>
              <path d={r.track} strokeWidth={12} stroke="var(--ring-track)" fill="none" />
              <path
                d={r.arc}
                pathLength={1}
                strokeWidth={12}
                strokeLinecap="round"
                stroke={r.color}
                fill="none"
                className="k-draw"
                style={{ "--d": `${300 + i * 180}ms`, "--dur": "1.6s" } as React.CSSProperties}
              />
            </g>
          ))}
        </svg>
        <span className="k-in-pop absolute inset-0 grid place-items-center" style={{ "--d": "900ms" } as React.CSSProperties}>
          <DIcon name="run" size={27} />
        </span>
      </div>

      <div className="mt-auto grid grid-cols-3 pt-[18px]">
        {STATS.map((s, i) => (
          <div key={s.label} className={cn("k-in flex flex-col", i > 0 && "border-s-[0.8px] border-divider ps-[14px]")} style={{ "--d": `${500 + i * 90}ms` } as React.CSSProperties}>
            <Chip icon={s.icon} size={34} iconSize={21} />
            <span className="mt-2 text-[13px] leading-[16.25px] font-medium text-ink">{s.label}</span>
            <span className="mt-[13.25px] flex items-baseline whitespace-nowrap">
              <CountUp value={s.value} delay={500 + i * 120} className="text-[21px] leading-[21px] font-semibold text-ink" />
              <span className="ms-[3px] text-[13px] leading-[13px] text-muted">/ {s.goal}</span>
            </span>
            <span className="mt-[13.25px] text-[12.5px] leading-[18.75px] text-muted">{s.unit}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
