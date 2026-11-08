import type { Metadata } from "next";
import { Trends } from "@/components/dashboard/health/trends";

export const metadata: Metadata = { title: "Health Trends – Kinora" };

export default function TrendsPage() {
  return <Trends />;
}
