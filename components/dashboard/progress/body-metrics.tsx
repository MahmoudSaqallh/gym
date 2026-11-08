"use client";

import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { IcoChip } from "@/components/ui/ico";
import { MiniStatCard, PageHeader } from "../section-ui";
import { cn } from "@/lib/cn";
import { BodyMetricsCard, ProgressPhotoCard } from "./progress-overview";
import { BodyCompositionCard, RecentSessionsCard, TrainingSplitCard } from "./progress-workouts";

const MEASUREMENTS = [
  { label: "Weight", icon: "d3770", from: "78.2 kg", to: "75.3 kg", delta: "-2.9 kg" },
  { label: "Body Fat", icon: "931bf", from: "18.7%", to: "14.3%", delta: "-4.4%" },
  { label: "Chest", icon: "394e7", from: "103 cm", to: "108 cm", delta: "+5 cm" },
  { label: "Waist", icon: "455d4", from: "87 cm", to: "82 cm", delta: "-5 cm" },
  { label: "Hips", icon: "713d4", from: "100 cm", to: "98 cm", delta: "-2 cm" },
];

export function BodyMetrics() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Body Metrics" subtitle="Weight, composition and measurements, with the run behind each." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Weight" icon="dacb7" value={[{ n: 75.3, decimals: 1, unit: "kg" }]} sub="down 0.6kg" bars={[1, 0.85, 0.75, 0.68, 0.62, 0.55, 0.5]} delay={0} />
        <MiniStatCard label="Body Fat" icon="71ba5" value={[{ n: 14.3, decimals: 1, unit: "%" }]} sub="down 0.9%" bars={[1, 0.85, 0.75, 0.68, 0.62, 0.55, 0.5]} delay={70} />
        <MiniStatCard label="Muscle Mass" icon="566e4" value={[{ n: 62.6, decimals: 1, unit: "kg" }]} sub="up 0.5kg" bars={[0.5, 0.6, 0.68, 0.76, 0.84, 0.92, 1]} delay={140} />
        <MiniStatCard label="Waist" icon="05ce8" value={[{ n: 82, unit: "cm" }]} sub="down 1.7cm" bars={[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <BodyCompositionCard />
        <MeasurementsCard />
        <ProgressPhotoCard className="md:col-span-2 wide:col-span-1" />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <BodyMetricsCard />
        <TrainingSplitCard />
        <RecentSessionsCard className="md:col-span-2 wide:col-span-1" />
      </div>
    </div>
  );
}

export function MeasurementsCard({ className, legend = false }: { className?: string; legend?: boolean }) {
  return (
    <Card delay={140} className={cn("p-5", className)} aria-label="Body measurements">
          <div className="flex items-center justify-between gap-2">
        <h2 className="text-[17px] font-semibold text-ink">Body Measurements</h2>
        {legend && (
          <Link href="/dashboard/progress/body-metrics" className="text-[13px] text-muted transition-colors hover:text-accent-ink">
            View All
          </Link>
        )}
      </div>
          <ul className="mt-3">
            {MEASUREMENTS.map((m, i) => (
              <li key={m.label} className={cn("k-in-left flex items-center gap-3 py-[12px] text-[13.5px]", i > 0 && "border-t border-divider")} style={{ "--d": `${200 + i * 70}ms` } as React.CSSProperties}>
                <IcoChip h={m.icon} size={30} iconSize={19} />
                <span className="flex-1 text-body">{m.label}</span>
                <span className="text-[12.5px] text-muted">{m.from}</span>
                <span className="inline-block text-muted rtl:-scale-x-100">→</span>
                <span className="w-[56px] font-medium text-ink">{m.to}</span>
                <span className="min-w-[50px] whitespace-nowrap text-end font-semibold text-accent-ink">{m.delta}</span>
              </li>
            ))}
          </ul>
      {legend && (
        <p className="mt-2 flex items-center gap-4 text-[12px] text-muted">
          <span>↓ Decrease</span>
          <span>↑ Increase</span>
        </p>
      )}
        </Card>
  );
}
