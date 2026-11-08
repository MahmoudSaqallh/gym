import type { Metadata } from "next";
import { ExerciseLibrary } from "@/components/dashboard/workouts/exercise-library";

export const metadata: Metadata = { title: "Exercise Library – Kinora" };

export default function ExercisesPage() {
  return <ExerciseLibrary />;
}
