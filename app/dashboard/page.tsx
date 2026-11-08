import type { Metadata } from "next";
import { FitnessOverviewCard } from "@/components/dashboard/overview/fitness-overview-card";
import { ActivityProgressCard } from "@/components/dashboard/overview/activity-progress-card";
import { CaloriesMacrosCard } from "@/components/dashboard/overview/calories-macros-card";
import { SleepCard } from "@/components/dashboard/overview/sleep-card";
import { HeartRateCard } from "@/components/dashboard/overview/heart-rate-card";
import { UpcomingWorkoutsCard } from "@/components/dashboard/overview/upcoming-workouts-card";
import { DailyStepsCard } from "@/components/dashboard/overview/daily-steps-card";
import { MotivationBanner } from "@/components/dashboard/overview/motivation-banner";

export const metadata: Metadata = { title: "Dashboard – Kinora" };

/* Column ratios mirror the 1440px Figma frame; below 1380px the grid reflows to 2 / 1 columns. */
export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[514.6fr_318.3fr_302.7fr]">
        <FitnessOverviewCard className="md:col-span-2 wide:col-span-1" />
        <ActivityProgressCard />
        <CaloriesMacrosCard />
      </div>
      <div className="grid gap-[14px] md:grid-cols-2 wide:grid-cols-[374.8fr_374.8fr_386fr]">
        <SleepCard />
        <HeartRateCard />
        <UpcomingWorkoutsCard className="md:col-span-2 wide:col-span-1" />
      </div>
      <div className="grid gap-[14px] wide:grid-cols-[505.9fr_643.7fr]">
        <DailyStepsCard />
        <MotivationBanner />
      </div>
    </div>
  );
}
