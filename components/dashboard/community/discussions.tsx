"use client";

import { MiniStatCard, PageHeader } from "../section-ui";
import { ActiveDiscussionsCard, ContributorsCard, LeaderboardCard, TrendingTopicsCard } from "./community-ui";
import { PopularGroupsCard } from "./groups";

export function Discussions() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Discussions" subtitle="What the community is asking, and who is answering." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Posts this week" icon="57aab" value={[{ n: 29 }]} sub="across every group" bars={[0.45, 0.5, 0.5, 0.55, 0.6, 0.7, 1]} delay={0} />
        <MiniStatCard label="Members" icon="2ff15" value={[{ n: 24 }]} sub="in the community" bars={[0.45, 0.5, 0.55, 0.62, 0.68, 0.78, 1]} delay={70} />
        <MiniStatCard label="Active this week" icon="c1b41" value={[{ n: 8 }]} sub="posted or replied" bars={[0.45, 0.75, 0.45, 0.8, 0.9, 0.9, 1]} delay={140} />
        <MiniStatCard label="Groups" icon="2be52" value={[{ n: 4 }]} sub="open to join" bars={[1, 1, 1, 1, 1, 1, 1]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <ActiveDiscussionsCard title="Latest threads" limit={4} delay={80} />
        <TrendingTopicsCard delay={140} />
        <ContributorsCard className="md:col-span-2 wide:col-span-1" delay={200} />
      </div>

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,379fr)_minmax(0,771fr)]">
        <LeaderboardCard rows={5} delay={240} />
        <PopularGroupsCard delay={280} />
      </div>
    </div>
  );
}
