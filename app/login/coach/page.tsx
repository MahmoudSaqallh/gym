import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = { title: "Coach sign in – Kinora" };

export default function CoachLoginPage() {
  return <AuthScreen initialRole="coach" />;
}
