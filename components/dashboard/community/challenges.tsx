"use client";

import { Reveal } from "@/components/ui/primitives";
import { MiniStatCard, PageHeader } from "../section-ui";
import { CHALLENGES, useJoinedChallenges } from "./data";
import { ActiveDiscussionsCard, ChallengeTile, ContributorsCard, LeaderboardCard, TrendingTopicsCard } from "./community-ui";
import { PopularGroupsCard } from "./groups";

export function Challenges() {
  const { items } = useJoinedChallenges();
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Challenges" subtitle="Open challenges you can still join, and what each one asks of you." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Open challenges" icon="37fc6" value={[{ n: CHALLENGES.length }]} sub="accepting entries" bars={[0.45, 0.45, 0.45, 0.72, 0.91, 1, 1]} delay={0} />
        <MiniStatCard label="You have joined" icon="2be52" value={[{ n: items.length }]} sub="challenges running" bars={[1, 1, 1, 1, 1, 1, 1]} delay={70} />
        <MiniStatCard label="Members" icon="2ff15" value={[{ n: 24 }]} sub="in the community" bars={[0.45, 0.5, 0.55, 0.62, 0.68, 0.78, 1]} delay={140} />
        <MiniStatCard label="Active this week" icon="c1b41" value={[{ n: 8 }]} sub="posted or replied" bars={[0.45, 0.62, 0.45, 0.8, 0.9, 0.9, 1]} delay={210} />
      </div>

      <Reveal className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        {CHALLENGES.map((c, i) => (
          <ChallengeTile key={c.id} c={c} delay={i * 70} surface="card" />
        ))}
      </Reveal>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <ContributorsCard delay={200} />
        <TrendingTopicsCard delay={240} />
        <ActiveDiscussionsCard className="md:col-span-2 wide:col-span-1" delay={280} limit={4} />
      </div>

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,379fr)_minmax(0,771fr)]">
        <LeaderboardCard rows={5} delay={260} />
        <PopularGroupsCard delay={300} columns="sm:grid-cols-2 xl:grid-cols-4" />
      </div>
    </div>
  );
}
