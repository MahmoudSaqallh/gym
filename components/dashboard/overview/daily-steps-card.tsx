"use client";

import { Card, Chip, CountUp, useShown } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/* Sparkline vectors from Figma (recharts area). */
const SPARK =
  "M0.745 27.364C6.537 20.902 12.328 14.44 18.12 14.44C23.912 14.44 29.703 18.059 35.495 18.059C41.287 18.059 47.078 11.597 52.87 8.754C58.662 5.911 64.453 1 70.245 1C76.037 1 81.828 7.979 87.62 10.305C93.412 12.631 99.203 14.957 104.995 14.957C110.787 14.957 116.578 9.396 122.37 7.203C128.162 5.011 133.953 3.406 139.745 1.801";
const SPARK_AREA = `${SPARK}V43.182H0.745V27.364Z`;
const SPARK_DOTS: [number, number][] = [
  [2.5, 36.56],
  [19.875, 23.64],
  [37.25, 27.26],
  [54.625, 17.95],
  [72, 10.2],
  [89.375, 19.5],
  [106.75, 24.16],
  [124.125, 16.4],
];

const STEPS = 12845;
const GOAL = 15000;
const PCT = Math.floor((STEPS / GOAL) * 100); // 85.6 → 85, as in the design

const STATS = [
  { label: "Distance", value: 8.6, decimals: 1, unit: " km" },
  { label: "Active Calories", value: 680, unit: " kcal" },
  { label: "Floors Climbed", value: 22, unit: "" },
];

function Dot({
  cx,
  cy,
  r,
  delay,
  fill = "var(--lime)",
  fillOpacity,
}: {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  fill?: string;
  fillOpacity?: number;
}) {
  const shown = useShown();
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      fillOpacity={fillOpacity}
      style={{ r: shown ? r : 0, transition: `r 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms` } as React.CSSProperties}
    />
  );
}

/** Looping "live" halo behind the latest point — mounted only once the card is revealed. */
function PingHalo({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const shown = useShown();
  if (!shown) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="var(--lime)"
      fillOpacity={0.16}
      className="animate-[k-ping_2s_ease-out_2s_infinite]"
      style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0 }}
    />
  );
}

export function DailyStepsCard({ className }: { className?: string }) {
  return (
    <Card delay={460} className={cn("flex min-h-[285.9px] flex-col px-6 pb-6 pt-6", className)} aria-label="Daily steps">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px]">
            <Chip icon="shoe" size={36} iconSize={22} className="[&>*]:animate-[k-float_1.6s_ease-in-out_infinite]" />
            <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Daily Steps</h2>
          </div>
          <p className="mt-[24px] flex flex-wrap items-baseline gap-x-[6px]">
            <CountUp value={STEPS} delay={500} duration={2000} className="text-[48px] leading-[48px] font-semibold tracking-[-0.5px] text-ink" />
            <span className="text-[15px] leading-[22.5px] text-muted">/ {GOAL.toLocaleString("en-US")} steps</span>
          </p>
        </div>

        <svg viewBox="0 0 155 74" width={155} height={74} className="hidden flex-none overflow-visible sm:block" aria-hidden>
          <defs>
            <linearGradient id="steps-area" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="var(--lime)" stopOpacity={0.1} />
              <stop offset="1" stopColor="var(--lime)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g transform="translate(3.255 26.8)">
            <path d={SPARK_AREA} fill="url(#steps-area)" fillOpacity={0.6} className="k-in-fade" style={{ "--d": "1100ms" } as React.CSSProperties} />
            <path d={SPARK} pathLength={1} stroke="var(--lime)" strokeWidth={2} fill="none" className="k-draw" style={{ "--d": "550ms", "--dur": "1.3s" } as React.CSSProperties} />
          </g>
          {/* Dots (Figma group offset 1.5, 17.62 baked in). They grow via a CSS transition on `r`:
              keyframe animations on these shapes left them unpainted in Chromium. */}
          {SPARK_DOTS.map(([x, y], i) => (
            <Dot key={i} cx={x + 1.5} cy={y + 17.62} r={2.5} delay={650 + i * 110} />
          ))}
          <PingHalo cx={143} cy={28.62} r={11} />
          <Dot cx={143} cy={28.62} r={11} fill="var(--lime)" fillOpacity={0.16} delay={1550} />
          <Dot cx={143} cy={28.62} r={6} fill="var(--lime-bright)" delay={1600} />
        </svg>
      </div>

      <div className="mt-[35.15px] flex items-center gap-4">
        <div className="h-3 flex-1 overflow-hidden rounded-[6px] bg-track" role="progressbar" aria-valuenow={PCT} aria-valuemin={0} aria-valuemax={100} aria-label="Daily step goal">
          <div className="k-fill relative h-full overflow-hidden rounded-[6px] bg-lime" style={{ width: `${PCT}%`, "--d": "600ms" } as React.CSSProperties}>
            <span aria-hidden className="absolute inset-y-0 w-1/3 animate-[k-shimmer_2.8s_ease-in-out_2.2s_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </div>
        </div>
        <span className="flex-none text-[18px] leading-[18px] font-semibold text-accent-ink">
          <CountUp value={PCT} delay={600} duration={1300} />%
        </span>
      </div>

      <div className="mt-[23px] grid grid-cols-3">
        {STATS.map((s, i) => (
          <div key={s.label} className={cn("k-in flex flex-col", i > 0 && "border-s border-divider ps-[25px]")} style={{ "--d": `${700 + i * 90}ms` } as React.CSSProperties}>
            <span className="text-[14px] leading-[21px] text-muted">{s.label}</span>
            <span className="mt-[11.5px] pb-[16px] text-[20px] leading-[20px] font-medium whitespace-nowrap text-ink">
              <CountUp value={s.value} decimals={s.decimals} delay={700 + i * 100} />
              {s.unit}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
