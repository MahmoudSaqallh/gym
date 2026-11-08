import type { Metadata } from "next";
import { Achievements } from "@/components/dashboard/progress/achievements";

export const metadata: Metadata = { title: "Achievements – Kinora" };

export default function AchievementsPage() {
  return <Achievements />;
}
