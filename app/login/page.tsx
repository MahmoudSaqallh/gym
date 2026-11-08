import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = { title: "Sign in – Kinora" };

export default function LoginPage() {
  return <AuthScreen initialRole="member" />;
}
