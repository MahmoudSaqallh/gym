import type { Metadata } from "next";
import { Onboarding } from "@/components/dashboard/onboarding/onboarding";

export const metadata: Metadata = { title: "Onboarding – Kinora" };

export default function OnboardingPage() {
  return <Onboarding />;
}
