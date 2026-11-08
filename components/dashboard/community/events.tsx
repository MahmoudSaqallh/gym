"use client";

import { MiniStatCard, PageHeader } from "../section-ui";
import { EVENTS } from "./data";
import { ActiveDiscussionsCard, ContributorsCard, LeaderboardCard, TrendingTopicsCard } from "./community-ui";
import { EventCard } from "./events-ui";
import { PopularGroupsCard } from "./groups";

export function Events() {
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Events" subtitle="Sessions, clinics and meetups you can turn up to." />

      <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Upcoming events" icon="3ce4a" value={[{ n: 9 }]} sub="in the next 2 wks" bars={[1, 1, 1, 1, 1, 0.72, 0.45]} delay={0} />
        <MiniStatCard label="Members" icon="2ff15" value={[{ n: 24 }]} sub="in the community" bars={[0.45, 0.5, 0.55, 0.62, 0.68, 0.78, 1]} delay={70} />
        <MiniStatCard label="Active this week" icon="c1b41" value={[{ n: 8 }]} sub="posted or replied" bars={[0.45, 0.75, 0.45, 0.8, 0.9, 0.9, 1]} delay={140} />
        <MiniStatCard label="Groups" icon="2be52" value={[{ n: 4 }]} sub="open to join" bars={[1, 1, 1, 1, 1, 1, 1]} delay={210} />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        {EVENTS.map((e, i) => (
          <EventCard key={e.id} e={e} delay={40 + i * 60} />
        ))}
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <ActiveDiscussionsCard limit={4} delay={120} />
        <TrendingTopicsCard delay={160} />
        <ContributorsCard className="md:col-span-2 wide:col-span-1" delay={200} />
      </div>

      <div className="grid gap-[14px] wide:grid-cols-[minmax(0,379fr)_minmax(0,771fr)]">
        <LeaderboardCard rows={5} delay={200} />
        <PopularGroupsCard delay={240} />
      </div>
    </div>
  );
}
