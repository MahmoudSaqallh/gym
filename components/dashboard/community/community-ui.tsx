"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CountUp } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { Ring } from "../charts";
import { CONTRIBUTORS, DISCUSSIONS, LEADERBOARD, MEMBERS_TOP, TOPICS, type Challenge, type Group, useJoinedChallenges, useJoinedGroups } from "./data";

export function CardTitle({ title, href, size = 18 }: { title: string; href?: string; size?: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-semibold text-ink" style={{ fontSize: size, lineHeight: 1.5 }}>
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-[14px] text-muted transition-colors hover:text-accent-ink">
          View All
        </Link>
      )}
    </div>
  );
}

export function AvatarStack({ ids, extra, size = 22 }: { ids: string[]; extra?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {ids.map((a, i) => (
        <Image
          key={i}
          src={`/assets/f/${a}.png`}
          alt=""
          width={size}
          height={size}
          className="rounded-[5px] bg-row object-cover ring-2 ring-[var(--row)] transition-transform duration-300 hover:-translate-y-0.5"
          style={{ width: size, height: size }}
        />
      ))}
      {extra ? <span className="ms-2 text-[12.5px] text-muted">+{extra}</span> : null}
    </div>
  );
}

export function JoinButton({
  joined,
  onClick,
  label,
  variant = "neutral",
  className,
}: {
  joined: boolean;
  onClick: () => void;
  label: string;
  variant?: "neutral" | "lime";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={joined}
      aria-label={`${joined ? "Leave" : "Join"} ${label}`}
      className={cn(
        "relative inline-flex items-center justify-center gap-[6px] overflow-hidden font-medium transition-[background-color,color,scale,box-shadow] duration-300 active:scale-[0.96]",
        joined
          ? "bg-lime text-[var(--on-accent)] shadow-[0_6px_16px_-8px_rgb(var(--lime-rgb)/0.9)]"
          : variant === "lime"
            ? "bg-[rgb(var(--lime-rgb)/0.16)] text-accent-ink hover:bg-[rgb(var(--lime-rgb)/0.26)]"
            : "bg-pill text-ink hover:brightness-95 dark:hover:brightness-125",
        className,
      )}
    >
      {joined && (
        <svg viewBox="0 0 16 16" className="size-[14px] animate-[k-pop_0.4s_ease-out]" aria-hidden>
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {joined ? "Joined" : variant === "lime" ? "Join" : "Join Group"}
    </button>
  );
}

export function GroupCard({ g, delay = 0, surface = "row" }: { g: Group; delay?: number; surface?: "row" | "card" }) {
  const { has, toggle } = useJoinedGroups();
  const joined = has(g.id);
  return (
    <article className={cn("k-in group flex flex-col overflow-hidden", surface === "row" ? "rounded-[16px] bg-row" : "k-card rounded-[20px] transition-[translate,box-shadow] duration-300 hover:-translate-y-1")} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <div className="relative h-[104px] overflow-hidden">
        <Image
          src={`/assets/f/${g.cover}.png`}
          alt=""
          fill
          sizes="(min-width:1380px) 270px, (min-width:768px) 45vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
        />
        <span className="absolute top-2 end-2 rounded-full bg-[rgba(6,8,7,0.72)] px-2 py-1 text-[11px] leading-[16.5px] font-medium text-white backdrop-blur-[4px]">
          {g.members + (joined ? 1 : 0)} Members
        </span>
      </div>
      <IcoChip h={g.icon} size={36} iconSize={22} className="relative z-10 -mt-5 ms-3 transition-transform duration-500 group-hover:rotate-[-10deg]" />
      <div className="flex flex-1 flex-col px-[14px] pt-[7px] pb-[14px]">
        <h3 className="text-[15px] leading-[18.75px] font-semibold text-ink">{g.name}</h3>
        <p className="mt-[10px] text-[12.5px] leading-[17px] text-muted">{g.blurb}</p>
        <div className="mt-3 mb-[14px]">
          <AvatarStack ids={g.avatars} extra={g.members - 3} />
        </div>
        <JoinButton joined={joined} onClick={() => toggle(g.id)} label={g.name} className="mt-auto h-10 w-full rounded-[12px] text-[13.5px]" />
      </div>
    </article>
  );
}

export function ChallengeTile({ c, delay = 0, surface = "row" }: { c: Challenge; delay?: number; surface?: "row" | "card" }) {
  const { has, toggle } = useJoinedChallenges();
  const joined = has(c.id);
  return (
    <article className={cn("k-in flex flex-col p-4", surface === "row" ? "rounded-[16px] bg-row" : "rounded-[20px] bg-row transition-[translate] duration-300 hover:-translate-y-0.5")} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <div className="flex gap-3">
        <div className="relative size-20 flex-none">
          <Ring size={80} stroke={7} pct={c.pct} delay={delay + 150} track="var(--track-2)" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CountUp value={c.days} delay={delay + 150} className="text-[19px] leading-[19px] font-semibold text-ink" />
            <span className="mt-[8px] text-[9px] leading-[9px] font-medium tracking-[0.225px] text-muted uppercase">Days</span>
          </div>
        </div>
        <div className="min-w-0 pt-[1px]">
          <h3 className="text-[14.5px] leading-[18px] font-semibold text-ink">{c.name}</h3>
          <p className="mt-[6px] text-[12.5px] leading-[17px] text-muted">{c.blurb}</p>
          <p className="mt-[5px] text-[12px] leading-[18px] text-body">{Math.round(c.pct * 100)}% as a group</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="flex items-center gap-[6px] text-[12px] text-muted">
          <Ico h="586b6" size={14} />
          {c.ends}
        </span>
        <JoinButton joined={joined} onClick={() => toggle(c.id)} label={c.name} variant="lime" className="h-10 min-w-[66px] rounded-full px-4 text-[13px]" />
      </div>
    </article>
  );
}

export function ContributorsCard({ className, delay = 300, extended = false }: { className?: string; delay?: number; extended?: boolean }) {
  const list = extended ? MEMBERS_TOP : CONTRIBUTORS;
  return (
    <Card delay={delay} className={cn("p-5", className)} aria-label="Top contributors">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[17px] leading-[25.5px] font-semibold text-ink">Top Contributors</h2>
        <Link href="/dashboard/community/members" className="text-[13.5px] text-muted transition-colors hover:text-accent-ink">
          View All
        </Link>
      </div>
      <ol className="mt-2">
        {list.map((c, i) => (
          <li key={c.name} className="k-in-left" style={{ "--d": `${delay + 120 + i * 80}ms` } as React.CSSProperties}>
            <Link
              href="/dashboard/community/members"
              aria-label={`View profile, ${c.name}`}
              className="group/row -mx-2 flex h-[58px] items-center gap-3 rounded-[12px] px-2 transition-colors hover:bg-row"
            >
              <span className="w-4 text-[13px] font-semibold text-muted">{i + 1}</span>
              <Image src={`/assets/f/${c.avatar}.png`} alt="" width={36} height={36} className="size-9 rounded-[8.6px] object-cover transition-transform duration-300 group-hover/row:scale-110" />
              <span className="flex min-w-0 flex-1 items-center gap-[6px] text-[13.5px] font-medium text-ink">
                <span className="truncate">{c.name}</span>
                {c.crown && (
                  <span className="inline-flex transition-transform duration-300 group-hover/row:-rotate-12 group-hover/row:scale-125">
                    <Ico h={c.crown} size={14} />
                  </span>
                )}
              </span>
              <span className="text-[13.5px] whitespace-nowrap text-muted">
                <CountUp value={c.pts} delay={delay + 200} className="font-semibold text-accent-ink" /> pts
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function GlanceTile({
  icon,
  value,
  label,
  delta,
  bars,
  delay,
}: {
  icon: string;
  value: number;
  label: string;
  delta: string;
  bars: number[];
  delay: number;
}) {
  return (
    <div className="k-in rounded-[16px] bg-row p-[14px]" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <div className="flex items-start gap-[10px]">
        <IcoChip h={icon} size={36} iconSize={22} />
        <CountUp value={value} delay={delay + 100} className="mt-[5px] flex-1 text-[21px] leading-[21px] font-semibold text-ink" />
        <div className="flex h-9 items-end gap-[3px]" aria-hidden>
          {bars.map((h, i) => (
            <span
              key={i}
              className="k-bar w-[5px] rounded-[3px] bg-[linear-gradient(180deg,var(--lime)_0%,var(--bar-mid)_55%,rgb(var(--lime-rgb)/0.16)_100%)] dark:bg-[linear-gradient(180deg,var(--lime)_0%,var(--bar-mid)_55%,rgb(var(--lime-rgb)/0.14)_100%)]"
              style={{ height: `${h * 100}%`, "--d": `${delay + 150 + i * 45}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <p className="mt-[10px] text-[12.5px] leading-[18.75px] text-muted">{label}</p>
      <p className="text-[11.5px] leading-[17.25px] font-medium text-accent-ink">{delta}</p>
    </div>
  );
}

export function TrendingTopicsCard({ className, delay = 200 }: { className?: string; delay?: number }) {
  const max = Math.max(...TOPICS.map((t) => t.posts));
  return (
    <Card delay={delay} className={cn("p-5", className)} aria-label="Trending topics">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">Trending Topics</h2>
      <ul className="mt-4 flex flex-col gap-[14px]">
        {TOPICS.map((t, i) => (
          <li key={t.tag} className="k-in-left group/topic" style={{ "--d": `${delay + 100 + i * 70}ms` } as React.CSSProperties}>
            <Link href="/dashboard/community/discussions" className="block">
              <span className="flex items-center gap-2 text-[13.5px]">
                <span className="font-semibold text-accent-ink">#</span>
                <span className="flex-1 truncate text-body transition-colors group-hover/topic:text-ink">{t.tag}</span>
                <span className="text-[12px] text-muted">{t.posts} posts</span>
              </span>
              <span className="mt-[6px] block h-[5px] overflow-hidden rounded-full bg-track">
                <span className="k-fill block h-full rounded-full bg-lime" style={{ width: `${(t.posts / max) * 100}%`, "--d": `${delay + 200 + i * 80}ms` } as React.CSSProperties} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Move({ move }: { move: number }) {
  if (move === 0) return <Ico h="9b86d" size={13} alt="No change" />;
  return (
    <span className="flex items-center gap-1 text-[12px] text-muted">
      <Ico h={move > 0 ? "9f5a5" : "db79b"} size={13} alt={move > 0 ? "Up" : "Down"} />
      {Math.abs(move)}
    </span>
  );
}

export function LeaderboardCard({ className, delay = 260, rows = 3 }: { className?: string; delay?: number; rows?: number }) {
  return (
    <Card delay={delay} className={cn("flex flex-col p-5", className)} aria-label="This week's leaderboard">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">This Week&apos;s Leaderboard</h2>
      <p className="mt-[3px] text-[12.5px] leading-[18.75px] text-muted">Points earned from sessions, posts and challenges.</p>
      <ol
        className="mt-2 overflow-y-auto pe-1 [scrollbar-width:thin]"
        style={{ maxHeight: rows * 58 }}
        tabIndex={0}
        aria-label="Leaderboard, scroll for more"
      >
        {LEADERBOARD.map((r, i) => (
          <li key={r.name} className="k-in-left flex h-[58px] items-center gap-3" style={{ "--d": `${delay + 100 + Math.min(i, 5) * 70}ms` } as React.CSSProperties}>
            <span
              className={cn(
                "grid size-6 flex-none place-items-center rounded-full text-[11.5px] font-semibold",
                i < 3 ? "bg-[rgb(var(--lime-rgb)/0.16)] text-accent-ink" : "text-muted",
              )}
            >
              {i + 1}
            </span>
            <Image src={`/assets/f/${r.avatar}.png`} alt="" width={36} height={36} className="size-9 rounded-[8.6px] object-cover" />
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{r.name}</span>
            <Move move={r.move} />
            <span className="w-[52px] text-end text-[13.5px] font-semibold text-ink">{r.pts.toLocaleString("en-US")}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function ActiveDiscussionsCard({ className, delay = 240, limit = 3, title = "Active Discussions" }: { className?: string; delay?: number; limit?: number; title?: string }) {
  return (
    <Card delay={delay} className={cn("p-5", className)} aria-label={title}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[17px] leading-[25.5px] font-semibold text-ink">{title}</h2>
        <Link href="/dashboard/community/discussions" className="text-[13.5px] text-muted transition-colors hover:text-accent-ink">
          View All
        </Link>
      </div>
      <ul className="mt-2">
        {DISCUSSIONS.slice(0, limit).map((d, i) => (
          <li key={d.title} className={cn("k-in-left", i > 0 && "border-t border-divider")} style={{ "--d": `${delay + 100 + i * 80}ms` } as React.CSSProperties}>
            <Link href="/dashboard/community/discussions" className="group/d -mx-2 flex items-center gap-3 rounded-[12px] px-2 py-[10px] transition-colors hover:bg-row">
              <Image src={`/assets/f/${d.avatar}.png`} alt="" width={36} height={36} className="size-9 flex-none rounded-[8.6px] object-cover" />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 text-[13.5px] leading-[18.5px] font-medium text-ink">{d.title}</span>
                <span className="mt-1 block truncate text-[12px] text-muted">
                  {d.author} · {d.ago}
                </span>
              </span>
              <span
                className="grid h-[26px] min-w-[33px] place-items-center rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] text-[12px] font-semibold text-accent-ink transition-transform group-hover/d:scale-110"
                aria-label={`${d.replies} replies`}
              >
                {d.replies}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
