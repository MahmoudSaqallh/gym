import type { Metadata } from "next";
import { Challenges } from "@/components/dashboard/community/challenges";

export const metadata: Metadata = { title: "Challenges – Kinora" };

export default function ChallengesPage() {
  return <Challenges />;
}
