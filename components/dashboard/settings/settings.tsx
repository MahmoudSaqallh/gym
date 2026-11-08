"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Popover } from "@/components/ui/popover";
import { Ico, IcoChip } from "@/components/ui/ico";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";
import { useSession } from "@/lib/session";
import { createSetStore, createValueStore } from "@/lib/set-store";
import { PageHeader } from "../section-ui";
import { useShell } from "../shell-context";
import { useProfile } from "./profile-store";

const useOff = createSetStore("kinora-settings-off");
const useAccent = createValueStore("kinora-accent", "#9ae600");

const ACCENTS = [
  { label: "Default", color: "#9ae600" },
  { label: "Neon red", color: "#e60000" },
  { label: "Neon orange", color: "#e67c00" },
  { label: "Neon cyan", color: "#00cee6" },
  { label: "Neon violet", color: "#8400e6" },
  { label: "Neon magenta", color: "#e600b4" },
];

const GOALS = [
  { name: "Build Strength", text: "Focus on strength training and muscle building." },
  { name: "Lose Body Fat", text: "Hold a steady deficit and keep the sessions coming." },
  { name: "Run Further", text: "Add distance week on week without losing pace." },
  { name: "Stay Consistent", text: "Show up on schedule and keep the streak alive." },
];

const NOTIFICATIONS = [
  { id: "workout-reminders", icon: "7efdf", title: "Workout Reminders", sub: "Get reminded about your scheduled workouts" },
  { id: "daily-progress", icon: "90d39", title: "Daily Progress", sub: "Receive your daily activity summary" },
  { id: "achievement-alerts", icon: "23ec1", title: "Achievement Alerts", sub: "Celebrate your milestones and achievements" },
  { id: "weekly-reports", icon: "52a09", title: "Weekly Reports", sub: "Get weekly insights and progress reports" },
];

const DEVICES = [
  { name: "GPS Sports Watch", img: "6e3a0", synced: "synced Nov 7, 10:14 AM", battery: 78, connected: true },
  { name: "Kinora Band Pro", img: "465c5", synced: "synced Nov 7, 8:46 AM", battery: 54, connected: true },
  { name: "Smart Body Scale", img: "fa906", synced: "", battery: 0, connected: false },
];

/* ---------- shared rows ---------- */

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[15.5px] leading-[23px] font-semibold text-ink">
      <Ico h={icon} size={17} />
      {title}
    </h2>
  );
}

function RowText({ title, sub, danger }: { title: string; sub: string; danger?: boolean }) {
  return (
    <span className="min-w-0 flex-1">
      <span className={cn("block truncate text-[14px] leading-[17.5px] font-medium", danger ? "text-[#ef4444]" : "text-ink")}>{title}</span>
      <span className={cn("mt-[2px] block truncate text-[12px] leading-[18px]", danger ? "text-[#ef4444]/75" : "text-muted")}>{sub}</span>
    </span>
  );
}

function NavRow({ icon, title, sub, onClick, href, danger, chevron = "2dbce", delay }: { href?: string; icon: string; title: string; sub: string; onClick?: () => void; danger?: boolean; chevron?: string; delay: number }) {
  const rowClass = "k-in-left group/row flex h-[57.5px] w-full items-center gap-3 rounded-[12px] px-2 text-start transition-colors hover:bg-row";
  const rowStyle = { "--d": `${delay}ms` } as React.CSSProperties;
  const body = (
    <>
      <IcoChip h={icon} size={36} iconSize={22} className="transition-transform duration-300 group-hover/row:rotate-[-8deg]" />
      <RowText title={title} sub={sub} danger={danger} />
      <span className="transition-transform duration-300 group-hover/row:translate-x-1 rtl:group-hover/row:-translate-x-1">
        <Ico h={chevron} size={16} />
      </span>
    </>
  );
  return href ? (
    <Link href={href} className={rowClass} style={rowStyle}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={rowClass} style={rowStyle}>
      {body}
    </button>
  );
}

export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn("relative h-[26px] w-[46px] flex-none rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime", on ? "bg-[var(--cta)]" : "bg-track-2")}
    >
      <span
        className="absolute top-[3px] start-[3px] size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: on ? "translateX(calc(20px * var(--dir)))" : "none" }}
      />
    </button>
  );
}

function SwitchRow({ id, icon, title, sub, delay, onChange }: { id: string; icon: string; title: string; sub: string; delay: number; onChange?: (on: boolean) => void }) {
  const { has, toggle } = useOff();
  const on = !has(id);
  return (
    <div className="k-in-left flex h-[57.5px] items-center gap-3 px-2" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <IcoChip h={icon} size={36} iconSize={22} />
      <RowText title={title} sub={sub} />
      <Switch
        on={on}
        label={title}
        onToggle={() => {
          toggle(id);
          onChange?.(!on);
        }}
      />
    </div>
  );
}

function ValueRow({ icon, title, delay, children }: { icon: string; title: string; delay: number; children: React.ReactNode }) {
  return (
    <div className="k-in-left flex h-14 items-center gap-3 px-2" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <IcoChip h={icon} size={36} iconSize={22} />
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{title}</span>
      {children}
    </div>
  );
}

/* ---------- cards ---------- */

function ProfileCard() {
  const { profile } = useProfile();
  const [goal, setGoal] = useState(0);
  const g = GOALS[goal];
  const stats = [
    { label: "Workouts", icon: "12b7c", value: <CountUp value={20} delay={300} /> },
    { label: "Active Days", icon: "5a45e", value: <CountUp value={17} delay={300} /> },
    { label: "Total Time", icon: "ca648", value: "15h 37m" },
    { label: "Current Streak", icon: "be7ac", value: "6 days" },
  ];
  return (
    <Card delay={0} className="flex flex-col gap-5 p-6 xl:flex-row xl:items-center xl:gap-0" aria-label="Profile">
      <div className="flex min-w-0 items-center gap-4 xl:w-[354px] xl:flex-none xl:pe-5">
        <span className="grid size-16 flex-none place-items-center overflow-hidden rounded-[15.4px]" style={{ background: "var(--chip-bg)" }}>
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photo} alt="" className="size-full object-cover" />
          ) : (
            <Ico h="b3a20" size={40} />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[19px] leading-[23.75px] font-semibold text-ink">{profile.name}</p>
          <p className="mt-[2px] truncate text-[13px] leading-[19.5px] text-muted">{profile.email}</p>
          <p className="mt-2 flex flex-wrap items-center gap-[10px]">
            <span className="inline-flex h-[25px] items-center gap-[6px] rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] text-[11.5px] font-medium text-accent-ink">
              <Ico h="d83bf" size={13} />
              Pro Member
            </span>
            <span className="flex items-center gap-[6px] text-[12px] text-muted">
              <Ico h="e5757" size={13} />
              Joined Nov 2026
            </span>
          </p>
        </div>
      </div>

      <div className="border-divider xl:w-[241px] xl:flex-none xl:border-s xl:px-5">
        <p className="text-[12.5px] leading-[19px] text-muted">Current Goal</p>
        <div key={goal} className="animate-[k-fade_0.35s_ease-out]">
          <p className="mt-1 text-[15.5px] leading-[23px] font-semibold text-ink">{g.name}</p>
          <p className="mt-1 min-h-[34px] text-[12.5px] leading-[17px] text-muted">{g.text}</p>
        </div>
        <div className="mt-2 flex items-center" role="group" aria-label="Choose a goal">
          {GOALS.map((x, i) => (
            <button key={x.name} type="button" onClick={() => setGoal(i)} aria-label={x.name} aria-pressed={i === goal} className="grid size-3 place-items-center">
              <span className={cn("block rounded-full transition-[width,height,background-color] duration-300", i === goal ? "size-[7px] bg-lime" : "size-[6px] bg-track-2")} />
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 border-divider xl:border-s xl:ps-5">
        <p className="text-[12.5px] leading-[19px] text-muted">Profile Summary</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3">
          {stats.map((s, i) => (
            <div key={s.label} className="k-in-pop flex items-center gap-2" style={{ "--d": `${200 + i * 70}ms` } as React.CSSProperties}>
              <IcoChip h={s.icon} size={30} iconSize={19} />
              <div className="min-w-0">
                <dt className="truncate text-[11.5px] leading-[17px] text-muted">{s.label}</dt>
                <dd className="text-[17px] leading-[21px] font-semibold whitespace-nowrap text-ink">{s.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <Link href="/dashboard/settings/profile" className="group/btn inline-flex h-10 flex-none items-center gap-2 self-start rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-[0.97] xl:self-center dark:hover:brightness-125">
        Edit Profile
        <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
          <Ico h="f674e" size={15} />
        </span>
      </Link>
    </Card>
  );
}

function ThemeSelect() {
  const { toggle } = useTheme();
  return (
    <Popover
      offset={5}
      role="listbox"
      label="Theme"
      className="w-[120px] py-[5px]"
      trigger={({ ref, open, toggle: toggleMenu }) => (
        <button ref={ref} type="button" onClick={toggleMenu} aria-haspopup="listbox" aria-expanded={open} aria-label="Theme" className="inline-flex h-[31px] flex-none items-center gap-2 rounded-full bg-row px-3 text-[12.5px] font-medium text-body transition-[filter] hover:brightness-95 dark:hover:brightness-125">
          <span className="only-light">Light</span>
          <span className="only-dark">Dark</span>
          <span className={cn("transition-transform duration-300", open && "rotate-180")}>
            <Ico h="d0eed" size={13} />
          </span>
        </button>
      )}
    >
      {(close) =>
        (["light", "dark"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="option"
            aria-selected={false}
            onClick={(e) => {
              if (document.documentElement.classList.contains("dark") !== (t === "dark")) toggle({ x: e.clientX, y: e.clientY });
              close();
            }}
            className="flex h-9 w-full items-center px-3 text-start text-[13px] text-ink capitalize transition-colors hover:bg-[var(--menu-hover)]"
          >
            {t}
          </button>
        ))
      }
    </Popover>
  );
}

function AppearanceCard() {
  const [stored, setAccent] = useAccent();
  const accent = ACCENTS.some((a) => a.color === stored) ? stored : ACCENTS[0].color;

  useEffect(() => {
    const root = document.documentElement;
    if (accent === ACCENTS[0].color) delete root.dataset.accent;
    else root.dataset.accent = accent.slice(1);
  }, [accent]);

  return (
    <Card delay={120} className="p-4" aria-label="Appearance">
      <SectionTitle icon="851af" title="Appearance" />
      <div className="mt-2 -mx-2">
        <div className="k-in-left flex h-[57.5px] items-center gap-3 px-2" style={{ "--d": "200ms" } as React.CSSProperties}>
          <IcoChip h="5124e" size={36} iconSize={22} />
          <RowText title="Theme" sub="Choose your preferred theme" />
          <ThemeSelect />
        </div>
        <div className="k-in-left flex min-h-[57.5px] items-center gap-3 px-2" style={{ "--d": "270ms" } as React.CSSProperties}>
          <IcoChip h="02d12" size={36} iconSize={22} />
          <RowText title="Accent Color" sub="Select your accent color" />
          <div className="flex flex-none gap-[6px]" role="radiogroup" aria-label="Accent color">
            {ACCENTS.map((a) => {
              const on = accent === a.color;
              return (
                <button
                  key={a.color}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={a.label}
                  title={a.label}
                  onClick={() => setAccent(a.color)}
                  className={cn("grid size-[18px] place-items-center rounded-full transition-transform duration-200 hover:scale-125 active:scale-95", on && "scale-110")}
                  style={{ background: a.color }}
                >
                  {on && (
                    <span className="animate-[k-pop_0.3s_ease-out]">
                      <Ico h="dcb8f" size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <SwitchRow
          id="animations"
          icon="c5d95"
          title="Animations"
          sub="Turn off entrance and chart animations"
          delay={340}
          onChange={(on) => document.documentElement.classList.toggle("no-motion", !on)}
        />
      </div>
    </Card>
  );
}

function downloadData() {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("kinora")) continue;
    const raw = localStorage.getItem(key);
    try {
      data[key] = JSON.parse(raw ?? "null");
    } catch {
      data[key] = raw;
    }
  }
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "kinora-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function PrivacyCard() {
  const router = useRouter();
  const { signOut } = useSession();
  const [confirming, setConfirming] = useState(false);
  return (
    <Card delay={180} className="p-4 md:col-span-2 wide:col-span-1" aria-label="Privacy and data">
      <SectionTitle icon="a2dc7" title="Privacy & Data" />
      <div className="mt-2 -mx-2">
        <SwitchRow id="activity-data" icon="d1a8d" title="Activity Data" sub="Show your training in the community standings" delay={260} />
        <NavRow icon="2107f" title="Download My Data" sub="Save everything this account has recorded" onClick={downloadData} delay={330} />
        {confirming ? (
          <div className="flex h-[57.5px] animate-[k-fade_0.25s_ease-out] items-center gap-2 px-2" role="alertdialog" aria-label="Confirm account deletion">
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#ef4444]">Delete Demo Member&apos;s account?</span>
            <button type="button" autoFocus onClick={() => setConfirming(false)} className="h-8 rounded-full bg-row px-3 text-[12.5px] font-medium text-ink">
              Keep account
            </button>
            <button type="button" onClick={() => { signOut(); router.push("/login"); }} className="h-8 rounded-full bg-[#ef4444] px-3 text-[12.5px] font-medium text-white transition-[filter] hover:brightness-110">
              Delete account
            </button>
          </div>
        ) : (
          <NavRow icon="09083" title="Delete Account" sub="Close this account and stop signing in" onClick={() => setConfirming(true)} danger chevron="60807" delay={400} />
        )}
      </div>
    </Card>
  );
}

function DeviceRow({ d, delay }: { d: (typeof DEVICES)[number]; delay: number }) {
  const [connected, setConnected] = useState(d.connected);
  return (
    <li className="k-in flex h-[72px] items-center gap-3 rounded-[12px] bg-row p-[10px]" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <Image src={`/assets/f/${d.img}.png`} alt="" width={52} height={52} className="size-[52px] flex-none rounded-[8px] object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] leading-5 font-medium text-ink">{d.name}</p>
        <p className="mt-[2px] flex items-center gap-[6px] text-[12px] leading-[18px] whitespace-nowrap text-muted">
          <span className={cn("size-[6px] flex-none rounded-full transition-colors", connected ? "bg-lime" : "bg-muted")} />
          <span className={cn(connected && "text-accent-ink")}>{connected ? "Connected" : "Not connected"}</span>
          {connected && d.synced && (
            <>
              <span className="min-w-0 truncate" title={d.synced}>
                • {d.synced}
              </span>
              <span>• {d.battery}% battery</span>
            </>
          )}
        </p>
      </div>
      <Popover
        offset={5}
        role="menu"
        label={`Options for ${d.name}`}
        className="w-[140px] py-[5px]"
        trigger={({ ref, open, toggle }) => (
          <button ref={ref} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={`Options for ${d.name}`} className="grid size-8 flex-none place-items-center rounded-full transition-colors hover:bg-[var(--menu-hover)]">
            <Ico h="b6ee4" size={16} />
          </button>
        )}
      >
        {(close) => (
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setConnected((c) => !c);
              close();
            }}
            className="flex h-9 w-full items-center px-3 text-start text-[13px] text-ink transition-colors hover:bg-[var(--menu-hover)]"
          >
            {connected ? "Disconnect" : "Connect"}
          </button>
        )}
      </Popover>
    </li>
  );
}

function AccountCard({ base }: { base: string }) {
  return (
    <Card delay={60} className="p-4" aria-label="Account settings">
      <SectionTitle icon="c1b47" title="Account Settings" />
      <div className="mt-2 -mx-2">
        <NavRow icon="74e2f" title="Personal Information" sub="Update your name, email, and personal details" href={`${base}/settings/profile#profile`} delay={140} />
        <NavRow icon="2fb59" title="Change Password" sub="Update your password regularly" href={`${base}/settings/profile#security`} delay={210} />
        <NavRow icon="f4169" title="Language & Region" sub="Select your preferred language and region" href={`${base}/settings/profile#app`} delay={280} />
      </div>
    </Card>
  );
}

function CoachSettings() {
  const { profile } = useProfile();
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Settings" subtitle="Manage your profile, preferences, and account settings." />
      <Card delay={0} className="flex flex-wrap items-center gap-4 p-6" aria-label="Profile">
        <span className="grid size-16 flex-none place-items-center overflow-hidden rounded-[15.4px]" style={{ background: "var(--chip-bg)" }}>
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photo} alt="" className="size-full object-cover" />
          ) : (
            <Ico h="b3a20" size={40} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[19px] leading-[23.75px] font-semibold text-ink">{profile.name}</p>
          <p className="mt-[2px] truncate text-[13px] leading-[19.5px] text-muted">{profile.email}</p>
          <p className="mt-2 flex items-center gap-[6px] text-[12px] text-muted">
            <Ico h="e5757" size={13} />
            Joined Nov 2026
          </p>
        </div>
        <Link href="/coach/settings/profile" className="group/btn inline-flex h-10 flex-none items-center gap-2 rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-[0.97] dark:hover:brightness-125">
          Edit Profile
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1">
            <Ico h="f674e" size={15} />
          </span>
        </Link>
      </Card>
      <div className="grid gap-[14px] md:grid-cols-2">
        <AccountCard base="/coach" />
        <AppearanceCard />
      </div>
    </div>
  );
}

export function Settings() {
  const { role } = useShell();
  if (role === "coach") return <CoachSettings />;
  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Settings" subtitle="Manage your profile, preferences, and account settings." />
      <ProfileCard />

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <AccountCard base="/dashboard" />
        <AppearanceCard />
        <PrivacyCard />
      </div>

      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-3">
        <Card delay={200} className="p-4" aria-label="Notifications">
          <SectionTitle icon="a755a" title="Notifications" />
          <div className="mt-2 -mx-2">
            {NOTIFICATIONS.map((n, i) => (
              <SwitchRow key={n.id} {...n} delay={280 + i * 70} />
            ))}
          </div>
        </Card>

        <Card delay={260} className="flex flex-col p-4" aria-label="Connected devices">
          <SectionTitle icon="5155c" title="Connected Devices" />
          <ul className="mt-3 flex flex-col gap-2">
            {DEVICES.map((d, i) => (
              <DeviceRow key={d.name} d={d} delay={340 + i * 80} />
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-[16.5px] text-muted">Pairing works here. Readings arrive the other way: a device provider writes them in with a key.</p>
          <button type="button" className="mt-3 h-10 w-full rounded-[12px] bg-row text-[13.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-[0.98] dark:hover:brightness-125">
            Connect a data source
          </button>
        </Card>

        <Card delay={320} className="p-4 md:col-span-2 wide:col-span-1" aria-label="Billing and subscription">
          <SectionTitle icon="10c06" title="Billing & Subscription" />
          <div className="mt-2 -mx-2">
            <ValueRow icon="a26e2" title="Current Plan" delay={400}>
              <span className="flex items-center gap-[10px] text-[13px] whitespace-nowrap text-body">
                Pro · Monthly
                <span className="grid h-[25px] place-items-center rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] text-[11.5px] font-medium text-accent-ink">Active</span>
              </span>
            </ValueRow>
            <ValueRow icon="e852a" title="Next Billing Date" delay={470}>
              <span className="text-[13px] whitespace-nowrap text-body">December 1, 2026</span>
            </ValueRow>
            <ValueRow icon="bfa0c" title="Payment Method" delay={540}>
              <span className="text-[13px] whitespace-nowrap text-body">Visa •••• 4242</span>
            </ValueRow>
            <NavRow icon="f1e7f" title="Billing History" sub="View your billing and payment history" delay={610} />
          </div>
          <button type="button" className="group/btn mt-2 inline-flex h-10 w-full items-center gap-2 rounded-[12px] bg-row px-4 text-[13.5px] font-medium text-ink transition-[filter,scale] hover:brightness-95 active:scale-[0.98] dark:hover:brightness-125">
            View Subscription
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
              <Ico h="f674e" size={15} />
            </span>
          </button>
        </Card>
      </div>
    </div>
  );
}
