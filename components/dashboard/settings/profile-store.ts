"use client";

import { createValueStore } from "@/lib/set-store";
import { useShell } from "../shell-context";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
  bio: string;
  photo: string; // small data URL, "" = default avatar
};

export const DEFAULT_PROFILE: Profile = {
  name: "Demo Member",
  email: "demo-member+b4puomf2@example.com",
  phone: "",
  birthDate: "",
  gender: "",
  height: "180",
  weight: "75.3",
  bio: "",
  photo: "",
};

const DEFAULT_COACH: Profile = { ...DEFAULT_PROFILE, name: "Demo Coach", email: "headcoach@example.com" };
const useMember = createValueStore("kinora-profile", JSON.stringify(DEFAULT_PROFILE));
const useCoach = createValueStore("kinora-profile-coach", JSON.stringify(DEFAULT_COACH));

/** The signed-in user (each role keeps its own profile), shared by the top bar, the Settings card and the edit page. */
export function useProfile() {
  const { role } = useShell();
  const member = useMember();
  const coach = useCoach();
  const [raw, set] = role === "coach" ? coach : member;
  const defaults = role === "coach" ? DEFAULT_COACH : DEFAULT_PROFILE;
  let profile = defaults;
  try {
    profile = { ...defaults, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    /* corrupted entry: fall back to the defaults */
  }
  return { profile, raw, save: (next: Profile) => set(JSON.stringify(next)) };
}
