import type { Metadata } from "next";
import { NutritionOverview } from "@/components/dashboard/nutrition/nutrition-overview";

export const metadata: Metadata = { title: "Nutrition – Kinora" };

export default function NutritionPage() {
  return <NutritionOverview />;
}
