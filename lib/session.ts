"use client";

import { createValueStore } from "@/lib/set-store";

export type Role = "member" | "coach";

const KEY = "kinora-session";

/* Demo accounts. There is no backend yet, so this only decides which dashboard opens; it is not security. */
export const ACCOUNTS: Record<Role, { email: string; password: string }> = {
  member: { email: "member@example.com", password: "member-demo" },
  coach: { email: "headcoach@example.com", password: "coach-demo" },
};

export const HOME: Record<Role, string> = { member: "/dashboard", coach: "/coach" };

export function findAccount(email: string, password: string): Role | null {
  const e = email.trim().toLowerCase();
  const hit = (Object.keys(ACCOUNTS) as Role[]).find((r) => ACCOUNTS[r].email === e && ACCOUNTS[r].password === password);
  return hit ?? null;
}

const useRaw = createValueStore(KEY, "");

export function readRole(): Role | null {
  try {
    const r = localStorage.getItem(KEY);
    return r === "member" || r === "coach" ? r : null;
  } catch {
    return null;
  }
}

export function useSession() {
  const [, set] = useRaw();
  return { signIn: (role: Role) => set(role), signOut: () => set("") };
}
