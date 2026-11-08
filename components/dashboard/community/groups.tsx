"use client";

import { Card, Reveal } from "@/components/ui/primitives";
import { MiniStatCard, PageHeader } from "../section-ui";
import { CHALLENGES, GROUPS, useJoinedGroups } from "./data";
import {
  ActiveDiscussionsCard,
  CardTitle,
  ChallengeTile,
  ContributorsCard,
  GroupCard,
  LeaderboardCard,
  TrendingTopicsCard,
} from "./community-ui";

export function OpenChallengesCard({ className, delay = 300 }: { className?: string; delay?: number }) {
  return (
    <Card delay={delay} className={`p-5 ${className ?? ""}`} aria-label="Open challenges">
      <CardTitle title="Open Challenges" href="/dashboard/community/challenges" />
      <div className="mt-4 grid gap-[14px] md:grid-cols-2">
        {CHALLENGES.slice(0, 2).map((c, i) => (
          <ChallengeTile key={c.id} c={c} delay={delay + 80 + i * 90} />
        ))}
      </div>
    </Card>
  );
}

export function PopularGroupsCard({ className, delay = 180, columns = "sm:grid-cols-2 xl:grid-cols-4" }: { className?: string; delay?: number; columns?: string }) {
  return (
    <Card delay={delay} className={`p-5 ${className ?? ""}`} aria-label="Popular groups">
      <CardTitle title="Popular Groups" href="/dashboard/community/groups" />
      <div className={`mt-4 grid gap-[14px] ${columns}`}>
        {GROUPS.map((g, i) => (
          <GroupCard key={g.id} g={g} delay={delay + 80 + i * 80} />
        ))}
      </div>
    </Card>
  );
}

export function Groups() {
  const { items } = useJoinedGroups();
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Groups" subtitle="Find the people training the way you want to train." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Groups" icon="2be52" value={[{ n: GROUPS.length }]} sub={items.length ? `${items.length} joined` : "open to join"} bars={[1, 1, 1, 1, 1, 1, 1]} delay={0} />
        <MiniStatCard label="Members" icon="2ff15" value={[{ n: 24 }]} sub="in the community" bars={[0.45, 0.5, 0.55, 0.62, 0.68, 0.78, 1]} delay={70} />
        <MiniStatCard label="Active this week" icon="c1b41" value={[{ n: 8 }]} sub="posted or replied" bars={[0.45, 0.62, 0.45, 0.8, 0.62, 1, 1]} delay={140} />
        <MiniStatCard label="Posts this week" icon="57aab" value={[{ n: 29 }]} sub="across every group" bars={[0.45, 0.5, 0.5, 0.55, 0.6, 0.7, 1]} delay={210} />
      </div>

      <Reveal className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((g, i) => (
          <GroupCard key={g.id} g={g} delay={80 + i * 70} surface="card" />
        ))}
      </Reveal>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <TrendingTopicsCard />
        <ContributorsCard extended delay={240} />
        <ActiveDiscussionsCard className="md:col-span-2 wide:col-span-1" delay={280} />
      </div>

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,379fr)_minmax(0,771fr)]">
        <LeaderboardCard />
        <OpenChallengesCard />
      </div>
    </div>
  );
}
