"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Ico } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { PopDot, Ring } from "../charts";
import { MiniStatCard } from "../section-ui";
import { useProfile } from "../settings/profile-store";
import { slugOfName } from "./data";

const STATS = [
  { label: "Clients", icon: "2163e", value: 6, sub: "on your roster", bars: [0.45, 0.725, 0.725, 0.725, 0.725, 1, 1] },
  { label: "Active this week", icon: "5f2e7", value: 3, sub: "had a session", bars: [0.45, 1, 1, 1, 1, 1, 0.45] },
  { label: "Sessions this week", icon: "566e4", value: 6, sub: "finished in 7 days", bars: [0.45, 0.725, 0.86, 1, 0.93, 1, 0.45] },
  { label: "Quiet", icon: "13445", value: 3, sub: "nothing this week", bars: [0.45, 0.45, 0.45, 0.45, 0.45, 0.725, 1], warm: true },
];

const ATTENTION = [
  { name: "David Brown", avatar: "d50bb", note: "Never trained", danger: true, sessions: 0, minutes: 0, done: 0, action: "Open" },
  { name: "Mike Johnson", avatar: "65fc9", note: "Quiet · Last trained 14 days ago", sessions: 0, minutes: 0, done: 1, action: "Message" },
  { name: "John Doe", avatar: "624cb", note: "Quiet · Last trained 10 days ago", sessions: 0, minutes: 0, done: 1, action: "Message" },
  { name: "Sarah Williams", avatar: "624cb", note: "Behind plan this week", sessions: 1, minutes: 38, done: 1, action: "Message" },
];

const CHECK_INS = [
  { name: "David Brown", avatar: "d50bb", score: 5, weight: 86.4 },
  { name: "Sarah Williams", avatar: "624cb", score: 4, weight: 84.8 },
  { name: "Mike Johnson", avatar: "65fc9", score: 3, weight: 83.2 },
  { name: "John Doe", avatar: "624cb", score: 4, weight: 78.1 },
  { name: "Robert Miller", avatar: "65fc9", score: 5, weight: 81.6 },
  { name: "James Garcia", avatar: "d50bb", score: 3, weight: 90.2 },
];

const ACCOUNTS = [
  { label: "Members", value: 25, tone: "text-ink" },
  { label: "Verified", value: 20, tone: "text-accent-ink" },
  { label: "Unverified", value: 5, tone: "text-[#ef4444]" },
  { label: "New this week", value: 6, tone: "text-accent-ink" },
];

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
const SESSIONS = [6, 10, 12, 14, 13, 14, 6];
const ACTIVE = [3, 4, 4, 4, 4, 4, 3];

function greeting(h: number) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
const noopSubscribe = () => () => {};

function Avatar({ id }: { id: string }) {
  return <Image src={`/assets/f/${id}.png`} alt="" width={34} height={34} className="size-[34px] flex-none rounded-[8.16px] object-cover" />;
}

function MoreLink({ open, onClick, closed }: { open: boolean; onClick: () => void; closed: string }) {
  return (
    <div className="mt-auto flex justify-end border-t border-divider pt-[11px]">
      <button type="button" onClick={onClick} aria-expanded={open} className="text-[10px] leading-[15px] font-medium text-accent-ink transition-opacity hover:opacity-70">
        {open ? "Show less" : closed}
      </button>
    </div>
  );
}

function AttentionCard() {
  const [all, setAll] = useState(false);
  const rows = all ? ATTENTION : ATTENTION.slice(0, 3);
  return (
    <Card delay={100} className="flex min-h-[330px] flex-col p-5" aria-label="Clients needing attention">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] leading-6 font-semibold text-ink">Clients needing attention</h2>
        <span className="text-[14px] leading-5 font-semibold whitespace-nowrap text-[#d9a400]">{`${ATTENTION.length} need action`}</span>
      </div>
      <div className="mt-3 -mx-1 flex-1 overflow-x-auto px-1 [scrollbar-width:thin]">
        <table className="w-full min-w-[372px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--divider)] text-[9px] leading-3 font-normal text-subtle">
              <th scope="col" className="pb-[6px] text-start font-normal">Client</th>
              <th scope="col" className="w-[55px] pb-[6px] text-center font-normal">Sessions</th>
              <th scope="col" className="w-[30px] pb-[6px] text-center font-normal">Time</th>
              <th scope="col" className="w-[60px] pb-[6px] text-center font-normal">Compliance</th>
              <th scope="col" className="w-[56px] pb-[6px] text-end font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.name} className="k-in-left" style={{ "--d": `${all && i === 3 ? 0 : 180 + i * 70}ms` } as React.CSSProperties}>
                <td className="h-[58px]">
                  <span className="flex items-center gap-[10px]">
                    <Avatar id={c.avatar} />
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] leading-4 font-medium text-ink">{c.name}</span>
                      <span className={cn("mt-[2px] block truncate text-[9px] leading-3 font-medium", c.danger ? "text-[#ef4444]" : "text-[#d9a400]")}>{c.note}</span>
                    </span>
                  </span>
                </td>
                <td className="text-center text-[9px] leading-3 whitespace-nowrap text-body">{c.sessions} sessions</td>
                <td className="text-center text-[9px] leading-3 whitespace-nowrap text-body">{c.minutes} min</td>
                <td className="text-center text-[9px] leading-3 font-medium text-[#ef4444]">{c.done}/4</td>
                <td className="text-end">
                  <Link href={`/coach/clients/${slugOfName(c.name)}`} className="inline-grid h-7 w-14 place-items-center rounded-[12px] border border-divider text-[9px] font-medium text-ink transition-[background-color,scale] duration-200 hover:bg-row active:scale-95">
                    {c.action}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MoreLink open={all} onClick={() => setAll(!all)} closed={`View ${ATTENTION.length - 3} more`} />
    </Card>
  );
}

/* Same plot geometry as the design: 0 sits on y=193 and each unit is 10.6875 tall. */
const X = (i: number) => 14 + (i * 272) / 6;
const Y = (v: number) => 193 - v * 10.6875;
const line = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join("");

function MomentumChart() {
  const [hover, setHover] = useState<number | null>(null);
  const series = [
    { id: "sessions", values: SESSIONS, color: "var(--lime)", top: 0.5 },
    { id: "active", values: ACTIVE, color: "var(--muted)", top: 0.28 },
  ];
  return (
    <svg
      viewBox="0 0 300 212"
      className="mt-3 block h-auto w-full overflow-visible"
      role="img"
      aria-label={`Sessions ${SESSIONS.join(", ")}; Active clients ${ACTIVE.join(", ")}`}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        {series.map((s) => (
          <linearGradient key={s.id} id={`coach-${s.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={s.color} stopOpacity={s.top} />
            <stop offset="1" stopColor={s.color} stopOpacity={0.06} />
          </linearGradient>
        ))}
      </defs>
      <line x1={14} x2={286} y1={193} y2={193} stroke="var(--muted)" strokeOpacity={0.55} />
      {WEEKS.map((w, i) => (
        <g key={w}>
          <line x1={X(i)} x2={X(i)} y1={193} y2={199} stroke="var(--muted)" strokeOpacity={0.55} />
          <text x={X(i)} y={208} textAnchor="middle" fontSize={10} fill="var(--muted)" className={cn("transition-[fill]", hover === i && "fill-[var(--ink)]")}>
            {w}
          </text>
        </g>
      ))}
      {hover !== null && <line x1={X(hover)} x2={X(hover)} y1={30} y2={193} stroke="var(--lime)" strokeOpacity={0.5} strokeDasharray="3 3" />}
      {series.map((s, si) => (
        <g key={s.id}>
          <path d={`${line(s.values)}L286 193L14 193Z`} fill={`url(#coach-${s.id})`} className="k-in-fade" style={{ "--d": "700ms" } as React.CSSProperties} />
          <path d={line(s.values)} pathLength={1} fill="none" stroke={s.color} strokeWidth={2} className="k-draw" style={{ "--d": `${250 + si * 200}ms`, "--dur": "1.3s" } as React.CSSProperties} />
          {s.values.map((v, i) => (
            <g key={i}>
              <PopDot cx={X(i)} cy={Y(v)} r={hover === i ? 4.5 : 3.5} fill={s.color} delay={500 + i * 80} />
              <text x={X(i)} y={Y(v) - 9} textAnchor="middle" fontSize={10} fill="var(--ink)" className="k-in-fade" style={{ "--d": `${650 + i * 80}ms` } as React.CSSProperties}>
                {v}
              </text>
            </g>
          ))}
        </g>
      ))}
      {WEEKS.map((w, i) => (
        <rect key={w} x={X(i) - 22.6} y={20} width={45.3} height={190} fill="transparent" onMouseEnter={() => setHover(i)} />
      ))}
    </svg>
  );
}

function MomentumCard() {
  return (
    <Card delay={160} className="min-h-[330px] p-5" aria-label="Roster momentum">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[16px] leading-6 font-semibold text-ink">Roster momentum</h2>
        <span className="flex items-center gap-2 text-[14px] leading-5 font-semibold whitespace-nowrap text-[#d9a400]">
          <span className="size-2 rounded-full bg-[#d9a400]" />3 quiet
        </span>
      </div>
      <div className="mt-[10px] flex items-center gap-6 text-[9px] leading-3 font-medium text-body">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-lime" />
          Sessions
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-muted" />
          Active clients
        </span>
      </div>
      <MomentumChart />
    </Card>
  );
}

function CheckInsCard() {
  const [all, setAll] = useState(false);
  const rows = all ? CHECK_INS : CHECK_INS.slice(0, 3);
  return (
    <Card delay={220} className="flex min-h-[330px] flex-col p-5" aria-label="Weekly check-ins">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">Weekly check-ins</h2>
      <div className="mt-[11px] grid grid-cols-2 pb-3 text-center">
        <div>
          <CountUp value={CHECK_INS.length} delay={250} className="block pt-2 text-[30px] leading-[30px] font-medium text-ink" />
          <p className="mt-[9px] text-[9px] leading-3 text-muted">received</p>
        </div>
        <div className="border-s border-divider">
          <CountUp value={CHECK_INS.length} delay={300} className="block pt-2 text-[30px] leading-[30px] font-medium text-ink" />
          <p className="mt-[9px] text-[9px] leading-3 text-muted">awaiting reply</p>
        </div>
      </div>
      <ul className="border-t border-divider">
        {rows.map((c, i) => (
          <li key={c.name} className="k-in-left flex h-[42px] items-center gap-[10px]" style={{ "--d": `${i > 2 ? 0 : 260 + i * 70}ms` } as React.CSSProperties}>
            <Avatar id={c.avatar} />
            <span className="min-w-0 flex-1 truncate text-[11px] leading-4 font-medium text-ink">{c.name}</span>
            <span className="text-[9px] leading-3 font-semibold text-accent-ink">{c.score}/5</span>
            <span className="w-[46px] text-center text-[9px] leading-3 whitespace-nowrap text-body">{c.weight} kg</span>
            <span className="w-[62px] text-end text-[9px] leading-3 font-medium whitespace-nowrap text-[#d9a400]">Awaiting reply</span>
          </li>
        ))}
      </ul>
      <MoreLink open={all} onClick={() => setAll(!all)} closed={`View ${CHECK_INS.length - 3} more check-ins`} />
    </Card>
  );
}

function AssignedWorkCard() {
  return (
    <Card delay={280} className="flex min-h-[235px] flex-col p-5 pt-4" aria-label="Assigned work">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">Assigned work</h2>
      <div className="flex flex-1 flex-col items-center justify-center pb-5 text-center">
        <p className="text-[14px] leading-[21px] font-medium text-ink">No assigned work yet.</p>
        <p className="mt-[5px] text-[13px] leading-[18px] text-muted">Assign a workout from a client&apos;s page.</p>
        <Link href="/coach/clients" className="mt-[21px] text-[10px] leading-[15px] font-medium text-accent-ink transition-opacity hover:opacity-70">
          Open my clients
        </Link>
      </div>
    </Card>
  );
}

function GymAccountsCard() {
  return (
    <Card delay={340} className="min-h-[235px] p-5" aria-label="Gym accounts">
      <h2 className="text-[16px] leading-6 font-semibold text-ink">Gym accounts</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3 sm:flex-nowrap">
        <div className="relative mt-[13px] size-[132px] flex-none">
          <Ring size={132} stroke={11} pct={0.8} delay={300} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="flex items-baseline">
              <CountUp value={80} delay={300} className="text-[30px] leading-[30px] font-medium text-ink" />
              <span className="ms-[3px] text-[30px] leading-[34px] font-medium text-ink">%</span>
            </span>
            <span className="mt-1 text-[9px] leading-3 text-muted">verified</span>
          </div>
        </div>
        <div className="min-w-[180px] flex-1">
          <ul>
            {ACCOUNTS.map((a, i) => (
              <li key={a.label} className={cn("k-in-left flex h-[33px] items-center justify-between text-[11px] leading-4", i < ACCOUNTS.length - 1 && "border-b border-divider")} style={{ "--d": `${360 + i * 60}ms` } as React.CSSProperties}>
                <span className="text-body">{a.label}</span>
                <span className={cn("font-semibold", a.tone)}>{a.value}</span>
              </li>
            ))}
          </ul>
          <Link href="/coach/members" className="group mt-3 ms-auto flex w-fit items-center gap-2 text-[10px] leading-[15px] font-medium text-accent-ink transition-opacity hover:opacity-70">
            Manage members
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
              <Ico h="ca9db" size={12} />
            </span>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function CoachOverview() {
  const { profile } = useProfile();
  const hello = useSyncExternalStore(
    noopSubscribe,
    () => greeting(new Date().getHours()),
    () => "Good evening",
  );

  return (
    <div className="flex flex-col gap-3">
      <header className="relative flex min-h-[98px] flex-wrap items-start justify-between gap-4 px-7 max-sm:px-1">
        {/* Sits behind the stat cards, as in the design. */}
        <div aria-hidden data-shown="true" className="pointer-events-none absolute -top-5 end-[233px] hidden h-[153px] w-[306px] lg:block">
          <div className="k-in-fade relative size-full" style={{ "--d": "150ms" } as React.CSSProperties}>
            <Image src="/assets/f/9049e.png" alt="" fill sizes="306px" priority className="only-light object-cover" />
            <Image src="/assets/f/0863e.png" alt="" fill sizes="306px" priority className="only-dark object-cover" />
          </div>
        </div>
        <div className="relative min-w-0">
          <p className="animate-[k-fade_0.5s_ease-out_both] text-[16px] leading-[22px] text-body">
            {hello}, {profile.name}
          </p>
          <h1 className="mt-1 animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_both] text-[26px] leading-9 font-semibold text-ink sm:text-[30px]">Coaching Overview</h1>
          <p className="mt-[7px] animate-[k-slide-right_0.6s_cubic-bezier(0.22,1,0.36,1)_80ms_both] text-[14px] leading-5 text-muted">Focus on the clients who need you today.</p>
        </div>
        <div className="relative flex animate-[k-fade_0.6s_ease-out_150ms_both] items-center gap-3 sm:mt-[25px]">
          <Link href="/coach/clients" className="grid h-10 place-items-center rounded-[12px] border border-divider px-4 text-[14px] font-medium whitespace-nowrap text-ink backdrop-blur-[2px] transition-[background-color,scale] duration-200 hover:bg-row active:scale-[0.97]">
            Open my clients
          </Link>
          <Link href="/coach/ai-assistant" className="k-shine group inline-flex h-10 items-center gap-2 rounded-[12px] bg-lime px-4 text-[14px] font-medium whitespace-nowrap text-[var(--on-accent)] transition-[filter,translate] duration-200 hover:-translate-y-0.5 hover:brightness-105">
            <Ico h="e4b35" size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
            Ask AI
          </Link>
        </div>
      </header>

      <div className="relative grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <MiniStatCard key={s.label} label={s.label} icon={s.icon} tone={s.warm ? "warm" : undefined} value={[{ n: s.value }]} sub={s.sub} bars={s.bars} delay={i * 60} />
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 wide:grid-cols-[minmax(0,427.5fr)_minmax(0,342fr)_minmax(0,370.5fr)]">
        <AttentionCard />
        <MomentumCard />
        <div className="md:col-span-2 wide:col-span-1">
          <CheckInsCard />
        </div>
      </div>

      <div className="grid gap-3 wide:grid-cols-[minmax(0,717fr)_minmax(0,435fr)]">
        <AssignedWorkCard />
        <GymAccountsCard />
      </div>
    </div>
  );
}
