import type { Metadata } from "next";
import { Settings } from "@/components/dashboard/settings/settings";

export const metadata: Metadata = { title: "Settings – Kinora" };

export default function SettingsPage() {
  return <Settings />;
}
