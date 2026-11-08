import type { Metadata } from "next";
import { MealPlanner } from "@/components/dashboard/nutrition/meal-planner";

export const metadata: Metadata = { title: "Meal Planner – Kinora" };

export default function MealPlannerPage() {
  return <MealPlanner />;
}
