import type { Metadata } from "next";
import { Events } from "@/components/dashboard/community/events";

export const metadata: Metadata = { title: "Events – Kinora" };

export default function EventsPage() {
  return <Events />;
}
