import type { Metadata } from "next";
import { ActivityView } from "@/components/dashboard/activity/activity-view";

export const metadata: Metadata = { title: "Activity – Kinora" };

export default function ActivityDailyPage() {
  return <ActivityView period="daily" />;
}
