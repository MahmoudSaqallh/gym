import type { Metadata } from "next";
import { HealthOverview } from "@/components/dashboard/health/health-overview";

export const metadata: Metadata = { title: "Health – Kinora" };

export default function HealthPage() {
  return <HealthOverview />;
}
