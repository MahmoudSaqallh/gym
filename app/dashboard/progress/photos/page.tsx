import type { Metadata } from "next";
import { Photos } from "@/components/dashboard/progress/photos";

export const metadata: Metadata = { title: "Progress Photos – Kinora" };

export default function PhotosPage() {
  return <Photos />;
}
