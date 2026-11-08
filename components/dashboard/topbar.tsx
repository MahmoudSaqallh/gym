"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabsFor } from "./nav";
import { DIcon } from "@/components/ui/primitives";
import { Ico, IcoChip } from "@/components/ui/ico";
import { Popover } from "@/components/ui/popover";
import { LanguageMenu } from "@/components/i18n/language-menu";
import { useProfile } from "@/components/dashboard/settings/profile-store";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useShell } from "./shell-context";

const iconBtn =
  "group grid size-10 flex-none place-items-center rounded-[12px] transition-[background-color,transform] duration-200 hover:bg-[var(--nav-hover)] active:scale-95";

const menuItem =
  "group/item flex h-11 items-center gap-[10px] px-3 text-[14px] leading-5 font-medium text-muted transition-colors hover:bg-[var(--menu-hover)] hover:text-ink";

const USER_MENU = [
  { label: "Profile", href: "/dashboard/settings", icon: ["8ffd8", "b076c"] },
  { label: "Messages", href: "/dashboard/community", icon: ["e02db", "524e4"] },
  { label: "Settings", href: "/dashboard/settings", icon: ["b2149", "694bc"], chevron: true },
];

const COACH_MENU = [
  { label: "Profile", href: "/coach/settings", icon: ["8ffd8", "b076c"] },
  { label: "Messages", href: "/coach/clients", icon: ["e02db", "524e4"] },
  { label: "Settings", href: "/coach/settings", icon: ["b2149", "694bc"], chevron: true },
];

export function Topbar() {
  const { profile } = useProfile();
  const { role, toggleSidebar, collapsed, mobileOpen } = useShell();
  const { signOut } = useSession();
  const pathname = usePathname();
  const tabs = tabsFor(pathname);

  return (
    <header className="relative flex h-[71px] flex-none items-center gap-3 ps-4 pe-4 animate-[k-fade_0.6s_ease-out_both]">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed || !mobileOpen ? "Expand sidebar" : "Collapse sidebar"}
        className={iconBtn}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          <DIcon name="layout-sidebar" size={24} />
        </span>
      </button>

      {tabs && (
        <nav aria-label="Section views" className="-my-px -ms-1 flex h-[71px] items-stretch gap-1 overflow-x-auto [scrollbar-width:none]">
          {tabs.map((t) => {
            const active = pathname === t.href || (t.href !== tabs[0].href && pathname.startsWith(`${t.href}/`));
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center px-3 text-[15px] leading-[22.5px] whitespace-nowrap transition-colors duration-300",
                  active ? "font-medium text-ink" : "text-muted hover:text-ink",
                )}
              >
                {t.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-px h-[2px] origin-center rounded-[1px] bg-lime transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>
      )}

      <div className="ms-auto flex items-center">
        <label
          className="group relative hidden h-[42px] w-[204px] items-center rounded-[12px] transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-within:w-[280px] focus-within:shadow-[0_0_0_3px_rgb(var(--lime-rgb)/0.22)] md:flex"
          style={{ background: "var(--search-bg)" }}
        >
          <span className="pointer-events-none absolute start-[17px] transition-transform duration-300 group-focus-within:scale-110">
            <DIcon name="search" size={16} />
          </span>
          <input
            type="search"
            placeholder="Search the dashboard..."
            aria-label="Search the dashboard"
            className="h-full w-full truncate rounded-[12px] bg-transparent ps-[45px] pe-3 text-[14px] font-medium text-ink outline-none placeholder:text-muted"
          />
        </label>

        <div className="ms-3 flex items-center gap-3 md:ms-[36px]">
          <LanguageMenu className={iconBtn} />
          <ThemeToggle
            className="size-10 rounded-[12px] hover:bg-[var(--nav-hover)]"
            lightIcon="/assets/dashboard/light/moon-toggle.svg"
            darkIcon="/assets/dashboard/dark/sun.svg"
          />

          {/* Notifications (Figma: "Dashboard Overview / Notifications Open") */}
          <Popover
            offset={8}
            role="dialog"
            label="Notifications"
            className="w-[320px] max-w-[calc(100vw-24px)]"
            trigger={({ ref, open, toggle }) => (
              <button
                ref={ref}
                type="button"
                aria-label="Notifications"
                aria-expanded={open}
                onClick={toggle}
                className={cn(iconBtn, open && "bg-[var(--nav-hover)]")}
              >
                <span className="origin-top transition-transform group-hover:animate-[k-bell_0.9s_ease-in-out]">
                  <DIcon name="bell" size={24} />
                </span>
              </button>
            )}
          >
            {() => (
              <>
                <p className="border-b-[0.8px] border-divider px-4 py-4 text-[16px] leading-6 font-semibold text-ink">Notifications</p>
                <div className="flex h-[179px] flex-col items-center px-6 pt-10 text-center">
                  <span className="origin-top animate-[k-bell_1.1s_ease-in-out_0.15s]">
                    <Ico h="8fe73" size={24} />
                  </span>
                  <p className="mt-2 text-[14px] leading-5 font-medium text-ink">No notifications</p>
                  <p className="mt-[7.5px] max-w-[267px] text-[12px] leading-[19.5px] text-muted">
                    Activity on your workspace lands here as soon as it happens.
                  </p>
                </div>
              </>
            )}
          </Popover>
        </div>

        {/* User menu (Figma: "Dashboard Overview / User Menu Open") */}
        <Popover
          offset={8}
          role="menu"
          label="Account"
          className="w-[208px] border-[var(--menu-border)]"
          trigger={({ ref, open, toggle }) => (
            <button
              ref={ref}
              type="button"
              aria-label="User account menu"
              aria-expanded={open}
              onClick={toggle}
              className="group ms-[11px] flex h-[46px] items-center gap-3 rounded-full"
            >
              <span
                className="grid size-[46px] place-items-center rounded-[11px] transition-transform duration-300 group-hover:scale-105"
                style={{ background: "var(--chip-bg)" }}
              >
                {profile.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photo} alt="" className="size-full rounded-[11px] object-cover" />
                ) : (
                  <DIcon name="user" size={29} />
                )}
              </span>
              <span className={cn("transition-transform duration-300", open ? "rotate-180" : "group-hover:translate-y-0.5")}>
                <DIcon name="chevron-down-user" size={16} />
              </span>
            </button>
          )}
        >
          {(close) => (
            <>
              <div className="mt-1 flex items-center gap-3 border-b-[0.8px] border-divider px-4 pb-[14.8px] pt-[10px]">
                <span className="grid size-10 flex-none place-items-center rounded-[9.6px]" style={{ background: "var(--chip-bg)" }}>
                  {profile.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.photo} alt="" className="size-full rounded-[9.6px] object-cover" />
                  ) : (
                    <Ico h="2996b" dark="2b904" size={25} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[16px] leading-6 font-medium text-ink">{profile.name}</span>
                  <span className="block truncate text-[14px] leading-5 text-muted">{profile.email}</span>
                </span>
              </div>
              {(role === "coach" ? COACH_MENU : USER_MENU).map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={close}
                  className={menuItem}
                  style={{ animation: `k-slide-right 0.3s var(--ease-out) ${60 + i * 40}ms both` }}
                >
                  <IcoChip h={item.icon[0]} dark={item.icon[1]} size={28} iconSize={17} tone="neutral" className="transition-transform duration-300 group-hover/item:scale-110" />
                  {item.label}
                  {item.chevron && (
                    <span className="ms-auto me-[2px]">
                      <DIcon name="chevron-down-sm" size={14} />
                    </span>
                  )}
                </Link>
              ))}
              <div className="border-t-[0.8px] border-[var(--menu-hover)] pb-1 pt-1 dark:border-divider">
                <Link href="/login" onClick={signOut} role="menuitem" className={menuItem} style={{ animation: "k-slide-right 0.3s var(--ease-out) 180ms both" }}>
                  <IcoChip h="5d955" dark="1d584" size={28} iconSize={17} tone="neutral" className="transition-transform duration-300 group-hover/item:-translate-x-0.5" />
                  Logout
                </Link>
              </div>
            </>
          )}
        </Popover>
      </div>

      <span aria-hidden className="k-hairline absolute inset-x-0 bottom-0 h-px" />
    </header>
  );
}
