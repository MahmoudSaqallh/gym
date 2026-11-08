import type { Metadata } from "next";
import { BodyMetrics } from "@/components/dashboard/progress/body-metrics";

export const metadata: Metadata = { title: "Body Metrics – Kinora" };

export default function BodyMetricsPage() {
  return <BodyMetrics />;
}
