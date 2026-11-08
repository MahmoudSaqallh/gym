export type NavItem = { label: string; href: string; icon?: string; ico?: string; built?: boolean };

/* `built` = has a dedicated route; everything else falls back to app/dashboard/[section]. */
export const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard", built: true },
  { label: "AI Assistant", href: "/dashboard/ai-assistant", icon: "robot", built: true },
  { label: "Activity", href: "/dashboard/activity", icon: "bolt", built: true },
  { label: "Workouts", href: "/dashboard/workouts", icon: "barbell", built: true },
  { label: "Nutrition", href: "/dashboard/nutrition", icon: "apple", built: true },
  { label: "Sleep", href: "/dashboard/sleep", icon: "moon", built: true },
  { label: "Health", href: "/dashboard/health", icon: "heartbeat", built: true },
  { label: "Progress", href: "/dashboard/progress", icon: "chart-bar", built: true },
  { label: "Community", href: "/dashboard/community", icon: "users-group", built: true },
  { label: "Settings", href: "/dashboard/settings", icon: "settings", built: true },
];

export const DEMO_NAV: NavItem[] = [
  { label: "UI Component", href: "/dashboard/ui-component", icon: "palette", built: true },
  { label: "Onboarding", href: "/dashboard/onboarding", icon: "rocket", built: true },
];

export const ALL_NAV = [...MAIN_NAV, ...DEMO_NAV];

/* Header "Section views" tabs (Figma: Top Navigation / Header with tabs), keyed by section root. */
export const SECTION_TABS: Record<string, { label: string; href: string }[]> = {
  "/coach/members": [
    { label: "All Members", href: "/coach/members" },
    { label: "Deleted Members", href: "/coach/members/deleted" },
  ],
  "/coach/content": [
    { label: "Exercises", href: "/coach/content" },
    { label: "Workouts", href: "/coach/content/workouts" },
    { label: "Programs", href: "/coach/content/programs" },
    { label: "Dishes", href: "/coach/content/dishes" },
  ],
  "/coach/community": [
    { label: "Groups", href: "/coach/community" },
    { label: "Events", href: "/coach/community/events" },
    { label: "Challenges", href: "/coach/community/challenges" },
    { label: "Achievements", href: "/coach/community/achievements" },
    { label: "Badges", href: "/coach/community/badges" },
  ],
  "/dashboard/activity": [
    { label: "Daily", href: "/dashboard/activity" },
    { label: "Weekly", href: "/dashboard/activity/weekly" },
    { label: "Monthly", href: "/dashboard/activity/monthly" },
  ],
  "/dashboard/workouts": [
    { label: "Overview", href: "/dashboard/workouts" },
    { label: "Programs", href: "/dashboard/workouts/programs" },
    { label: "Exercises", href: "/dashboard/workouts/exercises" },
  ],
  "/dashboard/nutrition": [
    { label: "Overview", href: "/dashboard/nutrition" },
    { label: "Plan", href: "/dashboard/nutrition/planner" },
  ],
  "/dashboard/health": [
    { label: "Overview", href: "/dashboard/health" },
    { label: "Vitals", href: "/dashboard/health/vitals" },
    { label: "Trends", href: "/dashboard/health/trends" },
  ],
  "/dashboard/progress": [
    { label: "Overview", href: "/dashboard/progress" },
    { label: "Workouts", href: "/dashboard/progress/workouts" },
    { label: "Body Metrics", href: "/dashboard/progress/body-metrics" },
    { label: "Habits", href: "/dashboard/progress/habits" },
    { label: "Achievements", href: "/dashboard/progress/achievements" },
    { label: "Photos", href: "/dashboard/progress/photos" },
  ],
  "/dashboard/community": [
    { label: "Overview", href: "/dashboard/community" },
    { label: "Groups", href: "/dashboard/community/groups" },
    { label: "Challenges", href: "/dashboard/community/challenges" },
    { label: "Discussions", href: "/dashboard/community/discussions" },
    { label: "Members", href: "/dashboard/community/members" },
    { label: "Events", href: "/dashboard/community/events" },
  ],
};

export function tabsFor(pathname: string) {
  const root = Object.keys(SECTION_TABS).find((r) => pathname === r || pathname.startsWith(`${r}/`));
  return root ? SECTION_TABS[root] : null;
}

export const COACH_NAV: NavItem[] = [
  { label: "Dashboard", href: "/coach", ico: "4375a", built: true },
  { label: "AI Assistant", href: "/coach/ai-assistant", ico: "c75c1", built: true },
  { label: "My Clients", href: "/coach/clients", ico: "86e52", built: true },
  { label: "Settings", href: "/coach/settings", ico: "e7e21", built: true },
];

export const COACH_GYM: NavItem[] = [
  { label: "Members", href: "/coach/members", ico: "c8a02", built: true },
  { label: "Content", href: "/coach/content", ico: "738d9", built: true },
  { label: "Community & awards", href: "/coach/community", ico: "81716", built: true },
  { label: "Coaches", href: "/coach/coaches", ico: "c8a02", built: true },
  { label: "Coach Roles", href: "/coach/roles", ico: "b4668", built: true },
];

export const COACH_DEMOS: NavItem[] = [{ label: "UI Component", href: "/coach/ui-component", ico: "1a140", built: true }];

