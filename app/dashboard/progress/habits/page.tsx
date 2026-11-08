import type { Metadata } from "next";
import { Habits } from "@/components/dashboard/progress/habits";

export const metadata: Metadata = { title: "Habits – Kinora" };

export default function HabitsPage() {
  return <Habits />;
}
