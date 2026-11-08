import type { Metadata } from "next";
import { Discussions } from "@/components/dashboard/community/discussions";

export const metadata: Metadata = { title: "Discussions – Kinora" };

export default function DiscussionsPage() {
  return <Discussions />;
}
