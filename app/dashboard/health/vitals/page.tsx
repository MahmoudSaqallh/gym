import type { Metadata } from "next";
import { Vitals } from "@/components/dashboard/health/vitals";

export const metadata: Metadata = { title: "Vitals – Kinora" };

export default function VitalsPage() {
  return <Vitals />;
}
