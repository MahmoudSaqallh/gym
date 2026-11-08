import type { Metadata } from "next";
import { ActivityView } from "@/components/dashboard/activity/activity-view";

export const metadata: Metadata = { title: "Activity · Weekly – Kinora" };

export default function ActivityWeeklyPage() {
  return <ActivityView period="weekly" />;
}
