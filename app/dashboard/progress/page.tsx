import type { Metadata } from "next";
import { ProgressOverview } from "@/components/dashboard/progress/progress-overview";

export const metadata: Metadata = { title: "Progress – Kinora" };

export default function ProgressPage() {
  return <ProgressOverview />;
}
