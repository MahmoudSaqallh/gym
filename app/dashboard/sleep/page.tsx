import type { Metadata } from "next";
import { SleepOverview } from "@/components/dashboard/sleep/sleep-overview";

export const metadata: Metadata = { title: "Sleep – Kinora" };

export default function SleepPage() {
  return <SleepOverview />;
}
