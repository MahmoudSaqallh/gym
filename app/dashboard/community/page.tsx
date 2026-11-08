import type { Metadata } from "next";
import { CommunityOverview } from "@/components/dashboard/community/community-overview";

export const metadata: Metadata = { title: "Community – Kinora" };

export default function CommunityPage() {
  return <CommunityOverview />;
}
