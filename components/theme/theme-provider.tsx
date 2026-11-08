"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: (origin?: { x: number; y: number }) => void };

const STORAGE_KEY = "kinora-theme";
const Ctx = createContext<ThemeCtx | null>(null);

/** Runs before paint (inlined in <head>) so the first frame already has the right theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='dark'&&t!=='light'){t='light'}var d=document.documentElement;d.classList.toggle('dark',t==='dark');var a=localStorage.getItem('kinora-accent');if(a&&a!=='#9ae600'&&/^#[0-9a-f]{6}$/.test(a)){d.dataset.accent=a.slice(1)}var o=JSON.parse(localStorage.getItem('kinora-settings-off')||'[]');d.classList.toggle('no-motion',o.indexOf('animations')>-1);}catch(e){}})();`;

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage may be unavailable (private mode) — theme still applies for this session */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read what the init script already applied. Only toggle logic reads this (nothing renders from it),
  // so the server/client difference can't cause a hydration mismatch.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };

      if (!doc.startViewTransition || reduce) {
        const root = document.documentElement;
        root.classList.add("theme-fade");
        flushSync(() => setTheme(next));
        apply(next);
        window.setTimeout(() => root.classList.remove("theme-fade"), 400);
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const transition = doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
        apply(next);
      });
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      });
    },
    [theme],
  );

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
