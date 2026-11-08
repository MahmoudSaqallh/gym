"use client";

import { useId, useState } from "react";
import { useShown } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/** Monotone cubic interpolation (same family as recharts' "monotone" curve). */
export function monotonePath(p: [number, number][]) {
  const n = p.length;
  if (n < 3) return p.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  const dx = p.slice(1).map((q, i) => q[0] - p[i][0]);
  const m = p.slice(1).map((q, i) => (q[1] - p[i][1]) / dx[i]);
  const t = p.map((_, i) => {
    if (i === 0) return m[0];
    if (i === n - 1) return m[n - 2];
    return m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  });
  let d = `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${(p[i][0] + h).toFixed(2)} ${(p[i][1] + h * t[i]).toFixed(2)} ${(p[i + 1][0] - h).toFixed(2)} ${(p[i + 1][1] - h * t[i + 1]).toFixed(2)} ${p[i + 1][0].toFixed(2)} ${p[i + 1][1].toFixed(2)}`;
  }
  return d;
}

/* ───────── Trend line chart (recharts-style, as exported from Figma) ───────── */
type Series = { values: number[]; color: string; area?: boolean; dots?: "ring" | "small"; width?: number; label?: string; dash?: string };

export function TrendChart({
  labels,
  max,
  min = 0,
  ticks,
  series,
  width = 419,
  height = 135,
  plot = { x: 44, y: 10.5, w: 363, h: 95 },
  format = (v: number) => v.toLocaleString("en-US"),
  curve = false,
  className,
}: {
  curve?: boolean; // monotone smoothing (recharts "monotone")
  labels: string[];
  max: number;
  min?: number;
  ticks: { v: number; label: string }[];
  series: Series[];
  width?: number;
  height?: number;
  plot?: { x: number; y: number; w: number; h: number };
  format?: (v: number) => string;
  className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;
  const X = (i: number) => plot.x + (n === 1 ? plot.w / 2 : (i * plot.w) / (n - 1));
  const Y = (v: number) => plot.y + plot.h - ((v - min) / (max - min)) * plot.h;
  const path = (vals: number[]) => (curve ? monotonePath(vals.map((v, i) => [X(i), Y(v)])) : vals.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join(""));
  const step = n > 1 ? plot.w / (n - 1) : plot.w;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("block h-auto w-full overflow-visible", className)} role="img" aria-label={series.map((s) => `${s.label ?? ""} ${s.values.map(format).join(", ")}`).join("; ")}>
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`${gid}-a${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={s.color} stopOpacity={0.24} />
            <stop offset="1" stopColor={s.color} stopOpacity={0.02} />
          </linearGradient>
        ))}
      </defs>
      <g stroke="var(--grid-line)">
        {ticks.map((t) => (
          <line key={t.v} x1={plot.x} x2={plot.x + plot.w} y1={Y(t.v)} y2={Y(t.v)} />
        ))}
      </g>
      <g fontSize={12} fill="var(--muted)">
        {ticks.map((t) => (
          <text key={t.v} x={plot.x - 8} y={Y(t.v) + 4} textAnchor="end">
            {t.label}
          </text>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={X(i)} y={plot.y + plot.h + 24} textAnchor="middle" className={cn("transition-[fill]", hover === i && "fill-[var(--ink)]")}>
            {l}
          </text>
        ))}
      </g>
      {hover !== null && <line x1={X(hover)} x2={X(hover)} y1={plot.y} y2={plot.y + plot.h} stroke="var(--lime)" strokeOpacity={0.45} strokeDasharray="3 3" />}
      {series.map((s, si) => (
        <g key={si}>
          {s.area && (
            <path
              d={`${path(s.values)}L${X(n - 1)} ${plot.y + plot.h}L${X(0)} ${plot.y + plot.h}Z`}
              fill={`url(#${gid}-a${si})`}
              fillOpacity={0.6}
              className="k-in-fade"
              style={{ "--d": "900ms" } as React.CSSProperties}
            />
          )}
          {s.dash ? (
            <path d={path(s.values)} stroke={s.color} strokeWidth={s.width ?? 2} strokeDasharray={s.dash} fill="none" className="k-in-fade" style={{ "--d": `${300 + si * 200}ms` } as React.CSSProperties} />
          ) : (
            <path d={path(s.values)} pathLength={1} stroke={s.color} strokeWidth={s.width ?? 2} fill="none" className="k-draw" style={{ "--d": `${300 + si * 200}ms`, "--dur": "1.4s" } as React.CSSProperties} />
          )}
        </g>
      ))}
      {series.map((s, si) =>
        s.dots
          ? s.values.map((v, i) => {
              const delay = 600 + i * 80 + si * 60;
              return (
                <g key={`${si}-${i}`}>
                  {s.dots === "ring" && <PopDot cx={X(i)} cy={Y(v)} r={hover === i ? 10 : 8.5} fill={s.color} fillOpacity={0.16} delay={delay} />}
                  <PopDot cx={X(i)} cy={Y(v)} r={s.dots === "ring" ? 4.5 : 3.5} fill={s.color} delay={delay} />
                </g>
              );
            })
          : null,
      )}
      {labels.map((_, i) => (
        <rect key={i} x={X(i) - step / 2} y={plot.y - 6} width={step} height={plot.h + 12} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
      ))}
      {hover !== null && (
        <g transform={`translate(${Math.min(Math.max(X(hover), plot.x + 40), plot.x + plot.w - 40)} ${Math.max(Y(Math.max(...series.map((s) => s.values[hover]))) - 14, 22)})`} className="pointer-events-none animate-[k-pop_0.25s_ease-out_both]">
          <rect x={-42} y={-24} width={84} height={22} rx={7} fill="#313334" />
          <text x={0} y={-9} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="#fff">
            {format(series[0].values[hover])}
          </text>
        </g>
      )}
    </svg>
  );
}

/** Line + soft area + dots in a fixed pixel box (points in box coordinates). */
export function Sparkline({
  points,
  width,
  height,
  stroke = 2.3,
  dot = 3,
  className,
  delay = 300,
}: {
  points: [number, number][];
  width: number;
  height: number;
  stroke?: number;
  dot?: number;
  className?: string;
  delay?: number;
}) {
  const gid = useId().replace(/:/g, "");
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  const area = `${line}L${points[points.length - 1][0]} ${height}L${points[0][0]} ${height}Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("block h-auto w-full overflow-visible", className)} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--lime)" stopOpacity={0.35} />
          <stop offset="1" stopColor="var(--lime)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} className="k-in-fade" style={{ "--d": `${delay + 500}ms` } as React.CSSProperties} />
      <path d={line} pathLength={1} stroke="var(--lime)" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" fill="none" className="k-draw" style={{ "--d": `${delay}ms`, "--dur": "1.2s" } as React.CSSProperties} />
      {points.map(([x, y], i) => (
        <PopDot key={i} cx={x} cy={y} r={dot} fill="var(--lime)" delay={delay + 300 + i * 90} />
      ))}
    </svg>
  );
}

/** SVG dot that grows in (CSS transition on `r` — keyframe animations on SVG shapes proved flaky in Chromium). */
export function PopDot({ cx, cy, r, fill, fillOpacity, delay = 0 }: { cx: number; cy: number; r: number; fill: string; fillOpacity?: number; delay?: number }) {
  const shown = useShown();
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      fillOpacity={fillOpacity}
      style={{ r: shown ? r : 0, transition: `r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${shown ? delay : 0}ms` } as React.CSSProperties}
    />
  );
}

/* ───────── Progress ring (circle starts at 3 o'clock, clockwise — same as Figma's arcs) ───────── */
export function Ring({
  size,
  stroke,
  pct,
  color = "var(--lime)",
  track = "var(--track-2)",
  delay = 0,
  className,
}: {
  size: number;
  stroke: number;
  pct: number; // 0..1
  color?: string;
  track?: string;
  delay?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("overflow-visible", className)} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        className="k-ring"
        style={{ "--p": pct, "--d": `${delay}ms` } as React.CSSProperties}
      />
    </svg>
  );
}
