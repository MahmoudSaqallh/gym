import type { Metadata } from "next";
import { Groups } from "@/components/dashboard/community/groups";

export const metadata: Metadata = { title: "Groups – Kinora" };

export default function GroupsPage() {
  return <Groups />;
}
