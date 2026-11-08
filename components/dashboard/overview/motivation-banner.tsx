"use client";

import Image from "next/image";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

export function MotivationBanner({ className }: { className?: string }) {
  return (
    <Card delay={540} className={cn("group min-h-[285.9px] p-6", className)} aria-label="Keep moving forward">
      <div className="absolute inset-0 overflow-hidden">
        <div className="k-in-fade absolute inset-0" style={{ "--d": "200ms" } as React.CSSProperties}>
          <Image
            src="/assets/dashboard/banner.png"
            alt=""
            fill
            sizes="(min-width:1380px) 644px, 100vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(6,8,7,0.96) 0%, rgba(6,8,7,0.8) 38%, rgba(6,8,7,0.28) 62%, rgba(6,8,7,0.06) 82%)" }}
      />

      <div className="relative">
        <p className="k-in-left text-[13px] leading-[19.5px] font-semibold tracking-[2.34px] text-lime uppercase" style={{ "--d": "350ms" } as React.CSSProperties}>
          Keep moving forward
        </p>
        <h2 className="mt-[9.5px] text-[26px] leading-[34px] font-semibold text-white sm:text-[30px] sm:leading-[39px]">
          <span className="k-in-left block" style={{ "--d": "450ms" } as React.CSSProperties}>
            Stronger Every Day.
          </span>
          <span className="k-in-left block" style={{ "--d": "560ms" } as React.CSSProperties}>
            Better Every <span className="inline-block text-lime transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110">You.</span>
          </span>
        </h2>
        <p className="k-in mt-[12.1px] max-w-[246px] text-[15px] leading-[24.375px] text-white/72" style={{ "--d": "660ms" } as React.CSSProperties}>
          Your progress is built one rep, one choice, one day at a time.
        </p>
        <a
          href="#"
          className="k-in k-shine group/btn mt-[24.4px] inline-flex h-11 items-center gap-[9px] rounded-[12px] ps-6 pe-6 text-[15px] leading-[22.5px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(var(--grad-rgb)/0.9)] transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-110"
          style={{ "--d": "760ms", backgroundImage: "linear-gradient(180deg, var(--grad-from) 0%, var(--grad-to) 100%)" } as React.CSSProperties}
        >
          Let&apos;s Go
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/dashboard/chevron-right.svg" alt="" width={18} height={18} className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
        </a>
      </div>
    </Card>
  );
}
