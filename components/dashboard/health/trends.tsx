"use client";

import { Card } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { MiniStatCard, PageHeader } from "../section-ui";
import { TrendChart } from "../charts";
import { EssentialsCard, TipsCard } from "./health-overview";

/* Weekly readings (newest first) — the charts plot the same eight weeks oldest → newest. */
export const WEEKLY = [
  { week: "Nov 2", rhr: 58, hrv: 68, spo2: 98, resp: 14.0, weight: 75.3 },
  { week: "Oct 26", rhr: 59, hrv: 66, spo2: 98, resp: 14.1, weight: 75.5 },
  { week: "Oct 19", rhr: 60, hrv: 64, spo2: 98, resp: 14.3, weight: 75.9 },
  { week: "Oct 12", rhr: 61, hrv: 62, spo2: 97, resp: 14.5, weight: 76.2 },
  { week: "Oct 5", rhr: 61, hrv: 59, spo2: 97, resp: 14.7, weight: 76.6 },
  { week: "Sep 28", rhr: 63, hrv: 57, spo2: 97, resp: 15.0, weight: 77.1 },
  { week: "Sep 21", rhr: 63, hrv: 55, spo2: 96, resp: 15.1, weight: 77.8 },
];
const CHRONO = [...WEEKLY].reverse();
export const WEEK_LABELS = ["9/21", "9/28", "10/5", "10/12", "10/19", "10/26", "11/2"];
const series = (k: keyof (typeof WEEKLY)[number]) => CHRONO.map((w) => w[k] as number);

const READINGS = [
  { ok: true, text: "Your resting heart rate has fallen six beats over eight weeks, which usually follows a steady block of aerobic work." },
  { ok: true, text: "Heart rate variability is up sixteen milliseconds. Recovery is keeping pace with the training load." },
  { ok: false, text: "Bedtime moved by more than an hour on three nights this week. Consistency matters more than total hours." },
];

export function Trends() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Trends" subtitle="The figures that move slowly enough to tell you something." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Resting heart rate" icon="e39be" value={[{ n: -5, unit: "bpm" }]} sub="over 7 weeks" bars={[1, 1, 0.85, 0.85, 0.7, 0.62, 0.55]} delay={0} />
        <MiniStatCard label="Heart rate variability" icon="58d22" value={[{ n: 13, unit: "ms", plus: true }]} sub="over 7 weeks" bars={[0.5, 0.58, 0.66, 0.74, 0.84, 0.92, 1]} delay={70} />
        <MiniStatCard label="Blood oxygen" icon="d44bb" value={[{ n: 2, decimals: 1, unit: "%", plus: true }]} sub="over 7 weeks" bars={[0.78, 0.86, 0.86, 0.86, 1, 1, 1]} delay={140} />
        <MiniStatCard label="Weight" icon="dacb7" value={[{ n: -2.5, decimals: 1, unit: "kg" }]} sub="over 7 weeks" bars={[1, 0.92, 0.85, 0.78, 0.7, 0.62, 0.55]} delay={210} />
      </div>

      <div className="grid gap-[14px] lg:grid-cols-[544fr_406fr]">
        <ChartCard title="Heart, seven weeks" legend={[["Resting Heart Rate", "var(--lime)"], ["Heart Rate Variability", "var(--green)"]]} delay={80}>
          <TrendChart
            curve
            labels={WEEK_LABELS}
            min={53}
            max={69}
            ticks={[
              { v: 55, label: "55" },
              { v: 60, label: "60" },
              { v: 65, label: "65" },
            ]}
            width={520}
            height={170}
            plot={{ x: 36, y: 12, w: 460, h: 124 }}
            series={[
              { values: series("rhr"), color: "var(--lime)", dots: "small", width: 1.8, label: "Resting HR" },
              { values: series("hrv"), color: "var(--green)", dots: "small", width: 1.8, label: "HRV" },
            ]}
          />
        </ChartCard>
        <ChartCard title="Weight, seven weeks" legend={[["Weight", "#C9A24A"]]} delay={140}>
          <TrendChart
            curve
            labels={WEEK_LABELS}
            min={74.6}
            max={78.3}
            ticks={[75, 76, 77, 78].map((v) => ({ v, label: String(v) }))}
            width={380}
            height={170}
            plot={{ x: 32, y: 12, w: 330, h: 124 }}
            format={(v) => `${v} kg`}
            series={[{ values: series("weight"), color: "#C9A24A", dots: "small", width: 1.8, label: "Weight" }]}
          />
        </ChartCard>
      </div>

      <div className="grid gap-[14px] lg:grid-cols-2">
        <ChartCard title="Blood oxygen, seven weeks" legend={[["Blood Oxygen", "var(--lime)"]]} delay={100}>
          <TrendChart
            curve
            labels={WEEK_LABELS}
            min={95.6}
            max={98.6}
            ticks={[96, 97, 98].map((v) => ({ v, label: String(v) }))}
            width={540}
            height={170}
            plot={{ x: 32, y: 12, w: 490, h: 124 }}
            format={(v) => `${v}%`}
            series={[{ values: series("spo2"), color: "var(--lime)", dots: "small", width: 1.8, label: "SpO2" }]}
          />
        </ChartCard>
        <ChartCard title="Breathing, seven weeks" legend={[["Respiratory Rate", "#C9A24A"]]} delay={160}>
          <TrendChart
            curve
            labels={WEEK_LABELS}
            min={13.85}
            max={15.25}
            ticks={[14, 14.5, 15].map((v) => ({ v, label: String(v) }))}
            width={540}
            height={170}
            plot={{ x: 36, y: 12, w: 486, h: 124 }}
            format={(v) => `${v} br/min`}
            series={[{ values: series("resp"), color: "#C9A24A", dots: "small", width: 1.8, label: "Respiratory rate" }]}
          />
        </ChartCard>
      </div>

      <Card delay={120} className="overflow-hidden" aria-label="Weekly readings">
        <div className="px-5 pt-5">
          <h2 className="text-[16px] leading-6 font-semibold text-ink">Weekly readings</h2>
          <p className="mt-[2px] text-[12.5px] text-muted">The same eight weeks as figures, newest first.</p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-start">
            <thead>
              <tr className="text-[11px] font-medium tracking-[0.6px] text-muted uppercase">
                <th className="py-3 ps-6 font-medium">Week</th>
                <th className="py-3 pe-6 text-end font-medium">Resting heart rate</th>
                <th className="py-3 pe-6 text-end font-medium">Heart rate variability</th>
                <th className="py-3 pe-6 text-end font-medium">Blood oxygen</th>
                <th className="py-3 pe-6 text-end font-medium">Respiratory rate</th>
                <th className="py-3 pe-6 text-end font-medium">Weight</th>
              </tr>
            </thead>
            <tbody>
              {WEEKLY.map((w, i) => (
                <tr
                  key={w.week}
                  className="k-in-left transition-colors hover:bg-[var(--nav-hover)] [&:first-child]:bg-[rgba(13,13,13,0.03)] dark:[&:first-child]:bg-white/[0.03]"
                  style={{ "--d": `${200 + i * 50}ms` } as React.CSSProperties}
                >
                  <td className="py-2 ps-6">
                    <span className="flex items-center gap-3 text-[13.5px] text-body">
                      <IcoChip h="632fb" size={40} iconSize={25} />
                      Week of {w.week}
                    </span>
                  </td>
                  <Cell v={w.rhr} u="bpm" />
                  <Cell v={w.hrv} u="ms" />
                  <Cell v={w.spo2} u="%" />
                  <Cell v={w.resp.toFixed(1)} u="br/min" />
                  <Cell v={w.weight.toFixed(1)} u="kg" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-[14px] lg:grid-cols-[575fr_627fr]">
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
        <EssentialsCard />
      </div>
      <TipsCard />
    </div>
  );
}

function Cell({ v, u }: { v: number | string; u: string }) {
  return (
    <td className="py-2 pe-6 text-end whitespace-nowrap">
      <span className="text-[13.5px] font-medium text-ink">{v}</span> <span className="text-[11.5px] text-muted">{u}</span>
    </td>
  );
}

function ChartCard({ title, legend, delay, children }: { title: string; legend: [string, string][]; delay: number; children: React.ReactNode }) {
  return (
    <Card delay={delay} className="p-5" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[16px] leading-6 font-semibold text-ink">{title}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {legend.map(([l, c]) => (
            <span key={l} className="flex items-center gap-2 text-[12px] text-body">
              <span className="size-2 rounded-full" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
