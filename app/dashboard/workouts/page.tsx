import type { Metadata } from "next";
import { WorkoutsOverview } from "@/components/dashboard/workouts/workouts-overview";

export const metadata: Metadata = { title: "Workouts – Kinora" };

export default function WorkoutsPage() {
  return <WorkoutsOverview />;
}
