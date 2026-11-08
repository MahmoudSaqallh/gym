import type { Metadata } from "next";
import { Members } from "@/components/dashboard/community/members";

export const metadata: Metadata = { title: "Members – Kinora" };

export default function MembersPage() {
  return <Members />;
}
