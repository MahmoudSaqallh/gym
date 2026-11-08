"use client";

import { Card, CountUp, PeriodPill } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/* Donut segments: exact Figma vectors (190×190, 38px stroke). */
const SEGMENTS = [
  {
    d: "M170.982 96.658C170.647 112.014 165.667 126.907 156.699 139.376C147.731 151.845 135.196 161.305 120.745 166.507C106.293 171.71 90.605 172.412 75.7469 168.521C60.8887 164.631 47.5582 156.329 37.512 144.711",
    color: "var(--lime)",
  },
  {
    d: "M35.398 142.155C27.8799 132.652 22.7429 121.49 20.4153 109.599C18.0878 97.7075 18.6372 85.4321 22.0178 73.7963C25.3984 62.1605 31.5121 51.5016 39.849 42.7087C48.186 33.9158 58.5045 27.2438 69.944 23.249",
    color: "var(--green)",
  },
  {
    d: "M73.098 22.224C84.3145 18.8483 96.1596 18.1111 107.708 20.0697C119.257 22.0283 130.196 26.6299 139.673 33.515C149.149 40.4002 156.906 49.3826 162.337 59.7608C167.768 70.1391 170.727 81.6323 170.982 93.343",
    color: "var(--lime-4)",
  },
];

const MACROS = [
  { label: "Carbs", pct: 39, grams: "180g", dot: "var(--lime)" },
  { label: "Protein", pct: 31, grams: "143g", dot: "var(--lime-2)" },
  { label: "Fats", pct: 30, grams: "61g", dot: "var(--green)" },
];

export function CaloriesMacrosCard({ className }: { className?: string }) {
  return (
    <Card delay={180} className={cn("flex min-h-[400px] flex-col px-5 pb-[20px] pt-5", className)} aria-label="Calories and macros">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] leading-[27px] font-semibold whitespace-nowrap text-ink">Calories &amp; Macros</h2>
        <PeriodPill label="Today" className="w-[112px]" />
      </header>

      <div className="group relative mx-auto mt-[29.45px] size-[190px]">
        <svg viewBox="0 0 190 190" width={190} height={190} className="transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[8deg]" role="img" aria-label="Carbs 39%, Protein 31%, Fats 30%">
          {SEGMENTS.map((s, i) => (
            <path
              key={s.color}
              d={s.d}
              pathLength={1}
              strokeWidth={38}
              stroke={s.color}
              fill="none"
              className="k-draw"
              style={{ "--d": `${350 + i * 380}ms`, "--dur": "0.9s" } as React.CSSProperties}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[3px]">
          <CountUp value={1841} delay={350} duration={1900} className="text-[28px] leading-[28px] font-semibold text-ink" />
          <span className="mt-[10.5px] text-[15px] leading-[22.5px] text-muted">kcal</span>
        </div>
      </div>

      <ul className="mt-auto grid grid-cols-3 pt-6">
        {MACROS.map((m, i) => (
          <li key={m.label} className="k-in flex gap-[10px]" style={{ "--d": `${700 + i * 100}ms` } as React.CSSProperties}>
            <span className="mt-[2px] size-[10px] flex-none rounded-full" style={{ background: m.dot }} />
            <span className="flex flex-col">
              <span className="text-[20px] leading-[20px] font-semibold text-ink">
                <CountUp value={m.pct} delay={700 + i * 100} />%
              </span>
              <span className="mt-[8.6px] text-[14px] leading-[19.25px] text-muted">{m.label}</span>
              <span className="text-[14px] leading-[19.25px] text-muted">{m.grams}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
