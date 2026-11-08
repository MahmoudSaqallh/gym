import type { Metadata } from "next";
import { ProgressWorkouts } from "@/components/dashboard/progress/progress-workouts";

export const metadata: Metadata = { title: "Workout Performance – Kinora" };

export default function ProgressWorkoutsPage() {
  return <ProgressWorkouts />;
}
