"use client";

import type { Role } from "@/lib/session";
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";

type ShellCtx = {
  role: Role;
  collapsed: boolean; // desktop: icon-only rail
  mobileOpen: boolean; // < lg: off-canvas drawer
  toggleSidebar: () => void;
  closeMobile: () => void;
};

const Ctx = createContext<ShellCtx | null>(null);

/* Persisted "collapsed" flag as a tiny external store (server snapshot = expanded). */
const KEY = "kinora-sidebar-collapsed";
const listeners = new Set<() => void>();
const readCollapsed = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const writeCollapsed = (v: boolean) => {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* storage unavailable — fall through, listeners still re-read */
  }
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function ShellProvider({ children, role }: { children: React.ReactNode; role: Role }) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      writeCollapsed(!readCollapsed());
    } else {
      setMobileOpen((o) => !o);
    }
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return <Ctx.Provider value={{ role, collapsed, mobileOpen, toggleSidebar, closeMobile }}>{children}</Ctx.Provider>;
}

export function useShell() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShell must be used inside <ShellProvider>");
  return ctx;
}
