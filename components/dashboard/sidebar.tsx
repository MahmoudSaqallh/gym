"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CountUp, DIcon, Reveal, ThemedImg } from "@/components/ui/primitives";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/cn";
import { Ico } from "@/components/ui/ico";
import { HOME, useSession } from "@/lib/session";
import { COACH_DEMOS, COACH_GYM, COACH_NAV, DEMO_NAV, MAIN_NAV, type NavItem } from "./nav";
import { useShell } from "./shell-context";

export function Sidebar() {
  const { role, collapsed, mobileOpen, closeMobile } = useShell();
  const { signOut } = useSession();
  const coach = role === "coach";

  return (
    <>
      {/* mobile scrim */}
      <div
        aria-hidden
        onClick={closeMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Main navigation"
        className={cn(
          "z-50 flex flex-col overflow-hidden transition-[width,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // mobile: fixed drawer
          "fixed inset-y-0 start-0 w-[216px] rounded-e-[22px] lg:rounded-none",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full rtl:translate-x-full lg:rtl:translate-x-0",
          // desktop: sticky rail inside the frame
          "lg:sticky lg:top-[9px] lg:bottom-auto lg:h-[calc(100vh-18px)] lg:translate-x-0 lg:rounded-none lg:shadow-none",
          collapsed ? "lg:w-[76px]" : "lg:w-[216px]",
        )}
        style={{ background: "var(--sidebar-bg)" }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 end-0 w-px"
          style={{ background: "linear-gradient(180deg, var(--hairline-from), var(--hairline-to))" }}
        />

        {/* logo */}
        <Link
          href={HOME[role]}
          className={cn("group flex h-[70px] flex-none items-center gap-[10px] ps-[20px] transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", collapsed && "lg:ps-[24px]")}
          onClick={closeMobile}
        >
          <ThemedImg light="/assets/dashboard/logo.svg" size={28} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" />
          <span
            className={cn(
              "text-[17px] leading-[25.5px] font-semibold tracking-[3.06px] text-ink uppercase transition-opacity duration-300",
              collapsed && "lg:opacity-0",
            )}
          >
            Kinora
          </span>
        </Link>

        <Reveal className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-[22.4px] pb-4 pt-2 [scrollbar-width:none]", collapsed && "lg:px-[14px]")}>
          <nav className="flex flex-col gap-1">
            {(coach ? COACH_NAV : MAIN_NAV).map((item, i) => (
              <NavLink key={item.href} item={item} index={i} />
            ))}
          </nav>

          {!coach && (
          <div className={cn("transition-opacity duration-300", collapsed && "lg:pointer-events-none lg:hidden")}>
            <div
              aria-hidden
              className="mb-[16px] mt-[36px] h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, var(--hairline-from) 50%, transparent)" }}
            />
            <StreakCard />
            <HydrationCard />
          </div>
          )}

          {coach ? (
            <>
              <NavGroup label="Gym" items={COACH_GYM} delayBase={260} />
              <NavGroup label="Demos" items={COACH_DEMOS} delayBase={520} />
            </>
          ) : (
            <NavGroup label="Demos" items={DEMO_NAV} delayBase={700} />
          )}
        </Reveal>

        {/* logout */}
        <div className={cn("flex-none border-t-[0.8px] border-divider px-[26.4px] pb-2 pt-2", collapsed && "lg:px-[14px]")}>
          <Link
            href="/login"
            onClick={signOut}
            title={collapsed ? "Logout" : undefined}
            className={cn("group flex h-[44px] items-center gap-2 overflow-hidden rounded-[12px] ps-[10px] text-[14px] text-body transition-colors hover:bg-[var(--nav-hover)]", collapsed && "lg:ps-[14px]")}
          >
            <span className="flex-none transition-transform duration-300 group-hover:-translate-x-0.5">
              <DIcon name="logout" size={20} />
            </span>
            <span className={cn("transition-opacity duration-300", collapsed && "lg:opacity-0")}>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function NavLink({ item, index, delayBase = 80 }: { item: NavItem; index: number; delayBase?: number }) {
  const pathname = usePathname();
  const { role, collapsed, closeMobile } = useShell();
  const active = item.href === HOME[role] ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={closeMobile}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "k-in-left group relative flex h-[44px] flex-none items-center gap-2 overflow-hidden rounded-[12px] ps-[10px] text-[14px] leading-[19.25px] transition-[background-color,color] duration-300",
        collapsed && "lg:ps-[14px]",
        active ? "text-accent-ink" : "text-body hover:bg-[var(--nav-hover)]",
      )}
      style={{ "--d": `${delayBase + index * 45}ms`, ...(active ? { background: "var(--nav-active-bg)" } : null) } as React.CSSProperties}
    >
      {active && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[12px] border" style={{ borderColor: "var(--nav-active-border)" }} />
      )}
      <span className={cn("flex-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", !active && (collapsed ? "group-hover:scale-110" : "group-hover:translate-x-[3px] rtl:group-hover:-translate-x-[3px] group-hover:scale-110"))}>
        {item.ico ? <Ico h={item.ico} size={20} color={active ? "var(--accent-ink)" : undefined} /> : <DIcon name={item.icon!} size={20} />}
      </span>
      <span className={cn("whitespace-nowrap transition-[opacity,translate] duration-300", collapsed && "lg:pointer-events-none lg:translate-x-2 lg:opacity-0")}>
        {item.label}
      </span>
    </Link>
  );
}

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_AR = ["ن", "ث", "ر", "خ", "ج", "س", "ح"];

function StreakCard() {
  const week = useLang()[0] === "ar" ? WEEK_AR : WEEK;
  return (
    <div className="k-card k-in rounded-[12px]! p-[20px] pb-[16px]" style={{ "--d": "520ms" } as React.CSSProperties}>
      <p className="-mt-1 text-[16px] leading-[24px] font-medium text-ink">Current Streak</p>
      <div className="mt-[20.5px] flex items-center gap-3">
        <span className="k-chip size-9">
          <span className="k-heartbeat inline-block [animation-duration:2.2s]">
            <DIcon name="flame-filled" size={22} />
          </span>
        </span>
        <span className="flex items-baseline gap-[6px]">
          <CountUp value={12} delay={600} className="text-[30px] leading-[30px] font-semibold text-ink" />
          <span className="text-[15px] leading-[15px] text-muted">Days</span>
        </span>
      </div>
      <ul className="mt-[23px] flex justify-between" aria-label="This week">
        {week.map((d, i) => (
          <li key={i} className="flex w-[13px] flex-col items-center gap-[8.7px]">
            <span className="text-[15px] leading-[15px] font-semibold text-ink">{d}</span>
            <span
              className={cn("k-in-pop size-[9px] rounded-full", i < 5 ? "bg-lime" : "bg-[var(--track-2)] dark:bg-[#272728]")}
              style={{ "--d": `${800 + i * 80}ms` } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function HydrationCard() {
  const pct = 72;
  return (
    <div className="k-card k-in mt-[16px] rounded-[12px]! px-[20px] pb-[24px] pt-[16px]" style={{ "--d": "600ms" } as React.CSSProperties}>
      <div className="flex items-center gap-[10px]">
        <span className="k-chip size-8">
          <span className="k-float inline-block [animation-duration:3s]">
            <DIcon name="droplet-filled" size={20} />
          </span>
        </span>
        <span className="text-[16px] leading-[24px] font-medium text-ink">Hydration</span>
      </div>
      <p className="mt-[26.5px] flex items-baseline">
        <CountUp value={1.8} decimals={1} delay={650} className="text-[30px] leading-[30px] font-semibold text-ink" />
        <span className="ms-[8px] text-[20px] leading-[20px] font-semibold text-ink">L</span>
        <span className="ms-[7px] text-[15px] leading-[15px] text-muted">/ 2.5 L</span>
      </p>
      <div className="mt-[31.5px] h-[10px] overflow-hidden rounded-[5px] bg-[var(--track-2)]">
        <div className="k-fill h-full rounded-[5px] bg-lime" style={{ width: `${pct}%`, "--d": "700ms" } as React.CSSProperties} />
      </div>
      <p className="mt-[24.5px] text-[18px] leading-[18px] font-semibold text-accent-ink">
        <CountUp value={pct} delay={700} />%
      </p>
    </div>
  );
}

function NavGroup({ label, items, delayBase }: { label: string; items: NavItem[]; delayBase: number }) {
  const [open, setOpen] = useState(true);
  const { collapsed } = useShell();
  return (
    <div className="mt-[16px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex h-[27px] w-full items-center justify-between px-[4px] text-[10px] leading-[15px] font-medium tracking-[0.5px] text-muted uppercase",
          collapsed && "lg:hidden",
        )}
      >
        {label}
        <span className={cn("transition-transform duration-300", !open && "-rotate-90")}>
          <DIcon name="chevron-down-sm" size={14} />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open || collapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden pt-1">
          {items.map((item, i) => (
            <NavLink key={item.href} item={item} index={i} delayBase={delayBase} />
          ))}
        </div>
      </div>
    </div>
  );
}
