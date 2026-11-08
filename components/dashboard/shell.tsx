"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HOME, readRole, type Role } from "@/lib/session";
import { ShellProvider } from "./shell-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({ children, role = "member" }: { children: React.ReactNode; role?: Role }) {
  const router = useRouter();

  // The inline script covers full page loads; this covers in-app navigation such as Back after logging out.
  useEffect(() => {
    const current = readRole();
    if (current !== role) router.replace(current ? HOME[current] : "/login");
  }, [role, router]);

  return (
    <ShellProvider role={role}>
      <div className="min-h-screen bg-page p-2">
        <div
          className="relative flex min-h-[calc(100vh-16px)] overflow-clip rounded-[22px] border"
          style={{ borderColor: "var(--frame-border)", backgroundImage: "var(--frame-glow)" }}
        >
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-3 pb-10 pt-5 sm:px-4 lg:pb-[73px]">{children}</main>
            <footer className="relative flex h-10 flex-none items-center justify-between px-4 text-[12px] leading-4 text-muted sm:px-10">
              <span aria-hidden className="k-hairline absolute inset-x-0 top-0 h-px" />
              <span>
                ©&nbsp;2026<span className="mx-[14px]">•</span>v1.0.0
              </span>
              <span>
                by <span className="font-medium text-ink">Aniq UI</span>
              </span>
            </footer>
          </div>
        </div>
      </div>
    </ShellProvider>
  );
}
