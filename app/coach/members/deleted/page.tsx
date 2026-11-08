import { CoachMembers } from "@/components/dashboard/coach/members";

export const metadata = { title: "Deleted Members – Kinora" };

export default function CoachDeletedMembersPage() {
  return <CoachMembers view="deleted" />;
}
