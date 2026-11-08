"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { Ico } from "@/components/ui/ico";
import { PageHeader, RangeSelect } from "../section-ui";
import { OpenChallengesCard, PopularGroupsCard } from "./groups";
import { ContributorsCard, GlanceTile } from "./community-ui";

const GLANCE = [
  { icon: "2ff15", value: 24, label: "Members", delta: "+4 this week", bars: [0.45, 0.49, 0.53, 0.62, 0.66, 0.75, 1] },
  { icon: "01200", value: 15, label: "Discussions", delta: "+4 this week", bars: [0.45, 0.53, 0.57, 0.65, 0.69, 0.8, 1] },
  { icon: "6f113", value: 6, label: "Challenges", delta: "-1 this week", bars: [0.45, 0.45, 0.45, 0.72, 0.91, 1, 1] },
  { icon: "fcb5c", value: 9, label: "Events", delta: "+2 this week", bars: [1, 1, 1, 1, 1, 0.72, 0.45] },
];

export function CommunityHero({ className }: { className?: string }) {
  return (
    <Card delay={40} className={`group min-h-[303px] overflow-hidden p-6 ${className ?? ""}`} aria-label="Join a community">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#08090a_0%,#010102_40%,#000_100%)]" />
      <div className="absolute inset-y-0 end-0 w-[58%] overflow-hidden">
        <div className="k-in-fade absolute inset-0" style={{ "--d": "150ms" } as React.CSSProperties}>
          <Image
            src="/assets/f/3fd23.png"
            alt=""
            fill
            sizes="(min-width:1380px) 440px, 60vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(6,9,8,0.97) 0%, rgba(6,9,8,0.9) 34%, rgba(6,9,8,0.5) 62%, rgba(6,9,8,0.2) 100%)" }}
      />
      <div className="relative pt-3">
        <p className="k-in-left text-[12px] leading-[18px] font-semibold tracking-[2.16px] text-[var(--lime-bright)] uppercase" style={{ "--d": "300ms" } as React.CSSProperties}>
          We rise by lifting others
        </p>
        <h2 className="mt-3 text-[26px] leading-[33px] font-semibold text-white sm:text-[30px] sm:leading-[37.5px]">
          <span className="k-in-left block" style={{ "--d": "400ms" } as React.CSSProperties}>
            Join a community
          </span>
          <span className="k-in-left block" style={{ "--d": "500ms" } as React.CSSProperties}>
            that <span className="inline-block text-[var(--lime-bright)] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-105">motivates</span> you.
          </span>
        </h2>
        <p className="k-in mt-3 max-w-[320px] text-[14px] leading-[22.75px] text-white/72" style={{ "--d": "600ms" } as React.CSSProperties}>
          Share your progress, get support, and celebrate every win together.
        </p>
        <Link
          href="/dashboard/community/groups"
          className="k-in k-shine group/btn mt-[26px] inline-flex h-11 items-center gap-[9px] rounded-[12px] px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(var(--grad-rgb)/0.9)] transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-110"
          style={{ "--d": "700ms", backgroundImage: "linear-gradient(180deg, var(--grad-from) 0%, var(--grad-to) 100%)" } as React.CSSProperties}
        >
          Explore Groups
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
            <Ico h="8165f" size={17} />
          </span>
        </Link>
      </div>
    </Card>
  );
}

export function CommunityOverview() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Community" subtitle="Connect, share, and grow together. You're not alone on this journey.">
        <RangeSelect value="Last 7 Days" options={["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"]} />
      </PageHeader>

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,759fr)_minmax(0,391fr)]">
        <CommunityHero />
        <Card delay={120} className="p-5" aria-label="Community at a glance">
          <h2 className="text-[17px] leading-[25.5px] font-semibold text-ink">Community at a Glance</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {GLANCE.map((g, i) => (
              <GlanceTile key={g.label} {...g} delay={200 + i * 70} />
            ))}
          </div>
        </Card>
      </div>

      <PopularGroupsCard />

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,759fr)_minmax(0,391fr)]">
        <OpenChallengesCard delay={240} />
        <ContributorsCard />
      </div>
    </div>
  );
}
