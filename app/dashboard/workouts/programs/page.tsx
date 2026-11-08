import type { Metadata } from "next";
import { Programs } from "@/components/dashboard/workouts/programs";

export const metadata: Metadata = { title: "Training Programs – Kinora" };

export default function ProgramsPage() {
  return <Programs />;
}
