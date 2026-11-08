"use client";

import { useState } from "react";
import { Card, CountUp, DIcon } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

/* Vectors exported from Figma (recharts render), reused so the animated chart matches 1:1. */
const ECG =
  "M0 13.439H5.59352L6.73119 12.7374L8.7221 13.439H9.95457L10.9026 14.1405L12.2299 13.439H12.5143L14.5052 2.06231L17.2546 19.1842L18.4871 13.439H19.9091L21.0468 9.79844L23.1325 12.7564H24.0806L24.839 13.439H32.8975H38.491L39.6287 12.7374L41.6196 13.439H42.8521L43.8001 14.1405L45.1274 13.439H45.4118L47.4027 2.06231L50.1521 19.1842L51.3846 13.439H52.8066L53.9443 9.79844L56.03 12.7564H56.9781L57.7365 13.439H65.795H71.3885L72.5262 12.7374L74.5171 13.439H75.7496L76.6976 14.1405L78.0249 13.439H78.3093L80.3002 2.06231L83.0496 19.1842L84.2821 13.439H85.7042L86.8418 9.79844L88.9275 12.7564H89.8756L90.634 13.439H98.6925H104.286L105.424 13.1071L107.415 13.439H108.647L109.595 13.7708L110.922 13.439H111.207L113.198 8.09194L115.947 16.1409L117.18 13.439H118.602L119.739 11.7325L121.825 13.1166H122.773L123.532 13.439H131.59H137.184L138.321 13.2778L140.312 13.439H141.545L142.493 13.6001L143.82 13.439H144.104L146.095 10.8223L148.845 14.7568L150.077 13.439H151.499";
const ECG_TAIL = "M151.499 13.439L152.637 12.6047L154.723 13.2778H155.671L156.429 13.439H164.488";

const LINE =
  "M0.335 33.948C16.502 28.198 32.668 22.448 48.835 22.448C65.002 22.448 81.168 34.948 97.335 34.948C113.502 34.948 129.668 30.615 145.835 29.948C162.002 29.281 178.168 29.615 194.335 28.948C210.502 28.281 226.668 21.115 242.835 16.448C259.002 11.781 275.168 6.365 291.335 0.948";
const AREA = `${LINE}V69.948H0.335V33.948Z`;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const POINTS: [number, number][] = [
  [30, 56],
  [78.5, 44.5],
  [127, 57],
  [175.5, 52],
  [224, 51],
  [272.5, 38.5],
  [321, 23],
];
const bpm = (y: number) => Math.round((92 - y) * 2); // y=92 → 0, y=12 → 160
const GRID_X = [30.5, 79, 127.5, 176, 224.5, 273, 321.5];

export function HeartRateCard({ className }: { className?: string }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <Card delay={320} className={cn("flex min-h-[320.1px] flex-col px-5 pb-[20px] pt-5", className)} aria-label="Heart rate weekly">
      <header className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Heart Rate (Weekly)</h2>
        <span className="text-[14px] leading-[21px] text-muted">BPM</span>
      </header>

      <div className="mt-[19.3px] flex items-start">
        <div className="w-[81.6px] flex-none">
          <CountUp value={72} delay={400} className="block text-[28px] leading-[28px] font-semibold text-ink" />
          <p className="mt-[12.5px] text-[13.5px] leading-[20.25px] text-muted">
            Avg.
            <br />
            BPM
          </p>
        </div>
        <div className="flex-none pt-[40.5px]">
          <p className="flex items-center gap-1 text-[15px] leading-[22.5px] font-medium text-accent-ink">
            <span className="animate-[k-float_2.4s_ease-in-out_infinite]">
              <DIcon name="arrow-down" size={16} />
            </span>
            <span>
              <CountUp value={5} delay={500} />%
            </span>
          </p>
          <p className="mt-[2.3px] text-[13px] leading-[19.5px] text-muted">
            vs last
            <br />
            week
          </p>
        </div>

        <div className="ms-auto flex flex-col items-end pt-[8px]">
          {/* live ECG: gray trace draws in, a lime pulse keeps scanning along it */}
          <svg viewBox="0 0 164.488 21" width={164.5} height={21} className="max-w-full overflow-visible" aria-hidden>
            <path d={ECG} pathLength={1} className="k-draw" style={{ "--dur": "1.8s", "--d": "400ms", stroke: "var(--muted)", strokeOpacity: 0.32 } as React.CSSProperties} strokeWidth={0.948} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <g className="k-in-fade" style={{ "--d": "1600ms" } as React.CSSProperties}>
              <path
                d={ECG}
                pathLength={1}
                stroke="var(--lime)"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="0.09 0.91"
                className="animate-[k-ecg_2.6s_linear_infinite] drop-shadow-[0_0_3px_rgb(var(--lime-rgb)/0.8)]"
              />
              <path d={ECG_TAIL} stroke="var(--lime)" strokeWidth={1.185} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </svg>
          <span className="mt-[8px] text-[12px] leading-[12px] font-semibold text-ink">58–148</span>
          <span className="mt-[2.4px] text-[10px] leading-[10px] text-muted">Weekly range</span>
        </div>
      </div>

      <div className="mt-auto pt-[25px]">
        <svg viewBox="0 0 333 122" className="block h-auto w-full max-w-[333px] overflow-visible" role="img" aria-label={`Weekly heart rate: ${POINTS.map((p, i) => `${DAYS[i]} ${bpm(p[1])}`).join(", ")}`}>
          <defs>
            <linearGradient id="hr-area" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="var(--lime)" stopOpacity={0.28} />
              <stop offset="1" stopColor="var(--lime)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* dashed grid */}
          <g stroke="var(--grid-line)" strokeDasharray="4 4">
            {[12.5, 52.5, 92.5].map((y) => (
              <line key={y} x1={30} x2={321} y1={y} y2={y} />
            ))}
            {GRID_X.map((x) => (
              <line key={x} x1={x} x2={x} y1={12} y2={92} />
            ))}
          </g>

          {/* axes */}
          <g fontSize={11} fill="var(--muted)">
            {[
              ["160", 15],
              ["80", 55],
              ["0", 95],
            ].map(([t, y]) => (
              <text key={t} x={22} y={y as number} textAnchor="end">
                {t}
              </text>
            ))}
            {DAYS.map((d, i) => (
              <text key={d} x={POINTS[i][0]} y={115} textAnchor="middle" className={cn("transition-[fill] duration-200", hover === i && "fill-[var(--ink)]")}>
                {d}
              </text>
            ))}
          </g>

          <g transform="translate(29.665 22.05)">
            <path d={AREA} fill="url(#hr-area)" fillOpacity={0.6} className="k-in-fade" style={{ "--d": "900ms" } as React.CSSProperties} />
            <path d={LINE} pathLength={1} stroke="var(--lime)" strokeWidth={2} fill="none" className="k-draw" style={{ "--d": "450ms", "--dur": "1.5s" } as React.CSSProperties} />
          </g>

          {hover !== null && <line x1={POINTS[hover][0]} x2={POINTS[hover][0]} y1={12} y2={92} stroke="var(--lime)" strokeOpacity={0.5} strokeDasharray="3 3" />}

          {POINTS.map(([x, y], i) => {
            const last = i === POINTS.length - 1;
            return (
              <g key={i} className="k-svg-pop" style={{ "--d": `${600 + i * 120}ms`, transformOrigin: `${x}px ${y}px` } as React.CSSProperties}>
                {last && <circle cx={x} cy={y} r={10} fill="var(--lime)" className="origin-center animate-[k-ping_2s_ease-out_1.8s_infinite]" style={{ transformBox: "fill-box" }} />}
                <circle cx={x} cy={y} r={last ? 10 : 7.5} fill="var(--lime)" fillOpacity={0.16} />
                <circle cx={x} cy={y} r={last ? 5.5 : hover === i ? 5.5 : 4} fill="var(--lime)" className="transition-[r] duration-200" />
              </g>
            );
          })}

          {/* hover hit-areas + tooltip */}
          {POINTS.map(([x], i) => (
            <rect key={i} x={x - 24} y={0} width={48} height={100} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          ))}
          {hover !== null && (
            <g transform={`translate(${Math.min(Math.max(POINTS[hover][0], 52), 300)} ${POINTS[hover][1] - 18})`} className="pointer-events-none animate-[k-pop_0.3s_ease-out_both]">
              <rect x={-26} y={-24} width={52} height={22} rx={7} fill="#313334" />
              <text x={0} y={-9} textAnchor="middle" fontSize={11.5} fontWeight={600} fill="#fff">
                {bpm(POINTS[hover][1])} bpm
              </text>
            </g>
          )}
        </svg>
      </div>
    </Card>
  );
}
