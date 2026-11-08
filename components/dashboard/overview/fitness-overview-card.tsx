"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { BodyGlow } from "@/components/ui/body-glow";
import { Card, Chip, CountUp, TintImg } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

const STATS = [
  { icon: "heart-filled", label: "Heart Rate", value: 72, unit: "BPM", status: "Resting", good: false, beat: true },
  { icon: "bolt-filled", label: "Energy", value: 86, unit: "%", status: "Good", good: true },
  { icon: "refresh-dot", label: "Recovery", value: 91, unit: "%", status: "Optimal", good: true, spin: true },
];

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const noopSubscribe = () => () => {};

export function FitnessOverviewCard({ className }: { className?: string }) {
  // Local-time greeting on the client; the server renders the Figma copy.
  const hello = useSyncExternalStore(
    noopSubscribe,
    () => greeting(new Date().getHours()),
    () => "Good afternoon",
  );

  return (
    <Card delay={0} className={cn("min-h-[400px] p-6", className)} aria-label="Fitness overview">
      {/* anatomy render — multiply in light, screen in dark (as in Figma) */}
      <div
        aria-hidden
        className="pointer-events-none absolute end-[-59.4px] top-[31.9px] h-[366.5px] w-[391.3px] mix-blend-multiply max-sm:end-[-190px] max-sm:opacity-50 dark:mix-blend-screen"
      >
        <div className="k-in-fade k-hue size-full" style={{ "--d": "250ms" } as React.CSSProperties}>
          <div className="only-light relative size-full animate-[k-float_8s_ease-in-out_infinite]">
            <Image src="/assets/dashboard/body-light.png" alt="" fill sizes="392px" priority className="object-contain" />
            <BodyGlow src="/assets/dashboard/body-light-glow.png" sizes="392px" dim={false} />
          </div>
          <div className="only-dark relative size-full animate-[k-float_8s_ease-in-out_infinite]">
            <Image src="/assets/dashboard/body-dark.png" alt="" fill sizes="392px" priority className="object-contain" />
            <BodyGlow src="/assets/dashboard/body-dark-glow.png" sizes="392px" />
          </div>
        </div>
      </div>

      <div className="relative">
        <p className="k-in-left text-[16px] leading-[24px] text-subtle" style={{ "--d": "120ms" } as React.CSSProperties}>
          {hello}, Demo
        </p>
        <div className="mt-[13.5px] flex items-center gap-3">
          <h1 className="k-in-left text-[27px] leading-[36px] font-medium whitespace-nowrap text-ink sm:text-[34px] sm:leading-[42.5px]" style={{ "--d": "180ms" } as React.CSSProperties}>
            Fitness Overview
          </h1>
          <span className="k-in-pop grid size-11 flex-none place-items-center rounded-[12px] bg-[rgb(var(--lime-rgb)/0.16)]" style={{ "--d": "420ms" } as React.CSSProperties}>
            { }
            <TintImg src="/assets/dashboard/activity-heartbeat.svg" width={24} height={24} className="animate-[k-glow_1.6s_ease-in-out_infinite]" />
          </span>
        </div>
        <p className="k-in-left mt-[16px] max-w-[274px] text-[15px] leading-[25.5px] text-subtle" style={{ "--d": "240ms" } as React.CSSProperties}>
          You&apos;re doing great! Keep pushing your limits and stay consistent.
        </p>
      </div>

      {/* glass stats */}
      <div
        className="k-in relative mt-[16.35px] grid w-[279px] grid-cols-[74.5px_89.5px_1fr] rounded-[16px] border-[0.8px] px-[19px] py-[19px] backdrop-blur-[4px]"
        style={{
          "--d": "320ms",
          borderColor: "var(--glass-border)",
          background: "linear-gradient(180deg, var(--glass-from), var(--glass-to))",
        } as React.CSSProperties}
      >
        {STATS.map((s, i) => (
          <div key={s.label} className={cn("flex flex-col", i > 0 && "border-s border-divider ps-[14px]")}>
            <Chip icon={s.icon} size={36} iconSize={22} className={cn(s.beat && "[&>*]:animate-[k-heartbeat_1.2s_ease-in-out_infinite]", s.spin && "[&>*]:animate-[k-spin_6s_linear_infinite]")} />
            <span className="mt-[9.85px] text-[13px] leading-[19.5px] font-medium whitespace-nowrap text-muted">{s.label}</span>
            <span className="mt-[16.9px] flex items-baseline gap-[3px] whitespace-nowrap">
              <CountUp value={s.value} delay={450 + i * 120} className="text-[27px] leading-[27px] font-medium text-ink" />
              <span className="text-[13px] leading-[19.5px] font-medium text-muted">{s.unit}</span>
            </span>
            <span className={cn("mt-[16.25px] text-[14px] leading-[21px] font-medium", s.good ? "text-accent-ink" : "text-body")}>{s.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
