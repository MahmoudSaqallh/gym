import type { Metadata } from "next";
import { UiLibrary } from "@/components/dashboard/ui-library/ui-library";

export const metadata: Metadata = { title: "UI Component – Kinora" };

export default function UiComponentPage() {
  return <UiLibrary />;
}
