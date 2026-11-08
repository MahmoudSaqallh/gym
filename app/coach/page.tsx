import type { Metadata } from "next";
import { CoachOverview } from "@/components/dashboard/coach/coach-overview";

export const metadata: Metadata = { title: "Coaching Overview – Kinora" };

export default function CoachPage() {
  return <CoachOverview />;
}
