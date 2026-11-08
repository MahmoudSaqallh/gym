"use client";

import { Card, CountUp } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { PageHeader } from "../section-ui";
import { Sparkline, TrendChart } from "../charts";
import { cn } from "@/lib/cn";
import { EssentialsCard, ScoreCard, TipsCard } from "./health-overview";

const X7 = [0, 57.44, 114.88, 172.33, 229.77, 287.2, 344.66];
const pts = (ys: number[]) => ys.map((y, i) => [X7[i], y] as [number, number]);

type Vital = {
  label: string;
  icon: string;
  value: number;
  decimals?: number;
  unit: string;
  status: "Optimal" | "Good";
  chart: { kind: "line"; ys: number[] } | { kind: "bars"; hs: number[] };
  display?: string;
};

const VITALS: Vital[] = [
  { label: "Resting Heart Rate", icon: "e39be", value: 58, unit: "bpm", status: "Optimal", chart: { kind: "line", ys: [5, 5, 22.6, 13.8, 5, 22.6, 13.8] } },
  { label: "Heart Rate Variability", icon: "58d22", value: 68, unit: "ms", status: "Good", chart: { kind: "line", ys: [18, 14, 5, 9, 14, 5, 10] } },
  { label: "Blood Pressure", icon: "c2f55", value: 118, unit: "mmHg", status: "Optimal", display: "118/76", chart: { kind: "line", ys: [5, 5, 22.6, 13.8, 5, 22.6, 9] } },
  { label: "Blood Oxygen", icon: "dfe9d", value: 98, unit: "%", status: "Optimal", chart: { kind: "bars", hs: [0.85, 0.95, 0.95, 0.95, 0.95, 0.95, 1] } },
  { label: "Respiratory Rate", icon: "d44bb", value: 14, unit: "br/min", status: "Good", chart: { kind: "bars", hs: [1, 1, 0.5, 0.75, 1, 0.5, 0.75] } },
  { label: "Skin Temperature", icon: "d4193", value: 36.6, decimals: 1, unit: "°C", status: "Optimal", chart: { kind: "line", ys: [14, 6, 22, 14, 6, 22, 14] } },
];

const WEEKS = ["9/21", "9/28", "10/5", "10/12", "10/19", "10/26", "11/2"];

const READINGS = [
  { ok: true, text: "Your resting heart rate has fallen six beats over eight weeks, which usually follows a steady block of aerobic work." },
  { ok: true, text: "Heart rate variability is up sixteen milliseconds. Recovery is keeping pace with the training load." },
  { ok: false, text: "Bedtime moved by more than an hour on three nights this week. Consistency matters more than total hours." },
];

export function Vitals() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Vitals" subtitle="Every reading your wearable reports, and the run behind it." />

      <div className="grid gap-[14px] md:grid-cols-2 xl:grid-cols-3">
        {VITALS.map((v, i) => (
          <VitalCard key={v.label} v={v} delay={i * 60} />
        ))}
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[458fr_339fr_339fr]">
        <Card delay={100} className="p-5 md:col-span-2 wide:col-span-1" aria-label="Heart, seven weeks">
          <ChartHead title="Heart, seven weeks" legend={[["Resting Heart Rate", "var(--lime)"], ["Heart Rate Variability", "var(--green)"]]} />
          <TrendChart
            curve
            labels={WEEKS}
            min={53}
            max={69}
            ticks={[
              { v: 55, label: "55" },
              { v: 60, label: "60" },
              { v: 65, label: "65" },
            ]}
            width={418}
            height={190}
            plot={{ x: 36, y: 20, w: 330, h: 136 }}
            series={[
              { values: [63, 63, 61, 61, 60, 59, 58], color: "var(--lime)", dots: "small", width: 1.6, label: "Resting HR" },
              { values: [55, 57, 59, 62, 64, 66, 68], color: "var(--green)", dots: "small", width: 1.6, label: "HRV" },
            ]}
          />
        </Card>
        <Card delay={160} className="p-5" aria-label="Blood oxygen, seven weeks">
          <ChartHead title="Blood oxygen, seven weeks" legend={[["Blood Oxygen", "var(--lime)"]]} />
          <TrendChart
            curve
            labels={WEEKS}
            min={95.3}
            max={98.8}
            ticks={[
              { v: 96, label: "96" },
              { v: 97, label: "97" },
              { v: 98, label: "98" },
            ]}
            width={300}
            height={190}
            plot={{ x: 32, y: 20, w: 248, h: 136 }}
            series={[{ values: [95.8, 97, 97, 97, 98, 98, 98], color: "var(--lime)", area: true, dots: "small", width: 1.6, label: "SpO2" }]}
          />
        </Card>
        <Card delay={220} className="p-5" aria-label="Breathing, seven weeks">
          <ChartHead title="Breathing, seven weeks" legend={[["Respiratory Rate", "#C9A24A"]]} />
          <BreathingBars />
        </Card>
      </div>

      <div className="grid gap-[14px] lg:grid-cols-[523fr_627fr]">
        <ScoreCard horizontal />
        <EssentialsCard />
      </div>

      <div className="grid gap-[14px] lg:grid-cols-2">
        <Card delay={120} className="p-5" aria-label="What the readings say">
          <h2 className="text-[16px] leading-6 font-semibold text-ink">What the readings say</h2>
          <ul className="mt-[19px] flex flex-col gap-[23px]">
            {READINGS.map((r, i) => (
              <li key={i} className="k-in-left flex gap-[10px]" style={{ "--d": `${200 + i * 100}ms` } as React.CSSProperties}>
                <Ico h={r.ok ? "bcbcc" : "5beaa"} size={17} className="mt-[3px]" />
                <span className="text-[13.5px] leading-[21.9px] text-body">{r.text}</span>
              </li>
            ))}
          </ul>
        </Card>
        <TipsCard />
      </div>
    </div>
  );
}

function ChartHead({ title, legend }: { title: string; legend: [string, string][] }) {
  return (
    <>
      <h2 className="text-[16px] leading-6 font-semibold text-ink">{title}</h2>
      <div className="mt-2 flex flex-wrap justify-end gap-x-4 gap-y-1">
        {legend.map(([l, c]) => (
          <span key={l} className="flex items-center gap-2 text-[12px] text-body">
            <span className="size-2 rounded-full" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </>
  );
}

function VitalCard({ v, delay }: { v: Vital; delay: number }) {
  return (
    <Card delay={delay} className="group flex min-h-[199px] flex-col p-4" aria-label={v.label}>
      <div className="flex items-start justify-between">
        <IcoChip h={v.icon} size={36} iconSize={22} className="transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110" />
        <span className="rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] py-[3.4px] text-[11.5px] leading-[17.25px] font-medium text-accent-ink">{v.status}</span>
      </div>
      <p className="mt-3 text-[13.5px] leading-[20.25px] text-body">{v.label}</p>
      <p className="mt-[10px] flex items-baseline gap-1">
        {v.display ? (
          <span className="text-[26px] leading-[26px] font-semibold text-ink">{v.display}</span>
        ) : (
          <CountUp value={v.value} decimals={v.decimals} delay={delay + 200} className="text-[26px] leading-[26px] font-semibold text-ink" />
        )}
        <span className="text-[14px] text-muted">{v.unit}</span>
      </p>
      <div className="mt-auto pt-3">
        {v.chart.kind === "line" ? (
          <Sparkline width={344.66} height={42} points={pts(v.chart.ys)} stroke={1.8} dot={2.5} delay={delay + 300} />
        ) : (
          <div className="flex h-[30px] items-end justify-between" aria-hidden>
            {v.chart.hs.map((h, i, all) => (
              <span
                key={i}
                className={cn("k-bar block rounded-[2px]", i === all.length - 1 ? "w-[14px] bg-lime" : "w-[26px] bg-[rgb(var(--lime-rgb)/0.5)]")}
                style={{ height: `${h * 100}%`, "--d": `${delay + 300 + i * 50}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function BreathingBars() {
  const vals = [15.2, 15.1, 14.8, 14.6, 14.4, 14.2, 14.1];
  const min = 13.9;
  const max = 15.3;
  const H = 136;
  return (
    <div className="relative mt-3 h-[170px]">
      {[15, 14.5, 14].map((t) => (
        <div key={t} className="absolute inset-x-0 flex items-center gap-2" style={{ top: ((max - t) / (max - min)) * H }}>
          <span className="w-8 -translate-y-1/2 text-end text-[11px] text-muted">{t}</span>
          <span className="h-0 flex-1 border-t border-[var(--grid-line)]" />
        </div>
      ))}
      <ul className="absolute bottom-[24px] start-10 end-0 flex items-end justify-between gap-[6px]" style={{ height: H }}>
        {vals.map((v, i) => (
          <li key={i} className="flex flex-1 justify-center" title={`${WEEKS[i]}: ${v} br/min`}>
            <span className="k-bar block w-full max-w-[24px] rounded-t-[2px] bg-[#C9A24A] transition-[filter] hover:brightness-110" style={{ height: ((v - min) / (max - min)) * H, "--d": `${300 + i * 60}ms` } as React.CSSProperties} />
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 start-10 end-0 flex justify-between text-[11px] text-muted">
        {WEEKS.map((w) => (
          <span key={w} className="flex-1 text-center">
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
