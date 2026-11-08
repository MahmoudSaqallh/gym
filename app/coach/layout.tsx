import { DashboardShell } from "@/components/dashboard/shell";

export default function CoachLayout({ children }: LayoutProps<"/coach">) {
  return <DashboardShell role="coach">{children}</DashboardShell>;
}
