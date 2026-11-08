import { createSetStore } from "@/lib/set-store";

export type Group = {
  id: string;
  name: string;
  blurb: string;
  icon: string;
  cover: string;
  members: number;
  avatars: string[];
};

export type Challenge = {
  id: string;
  name: string;
  blurb: string;
  days: number;
  pct: number;
  ends: string;
};

export const AVATARS = ["624cb", "65fc9", "d50bb"];

export const GROUPS: Group[] = [
  { id: "strength-warriors", name: "Strength Warriors", blurb: "Building strength, one rep at a time.", icon: "7efdf", cover: "e1a15", members: 15, avatars: ["624cb", "65fc9", "d50bb"] },
  { id: "cardio-crushers", name: "Cardio Crushers", blurb: "Run, sweat, repeat. We love endurance.", icon: "d1a8d", cover: "5dcdf", members: 10, avatars: ["624cb", "d50bb", "65fc9"] },
  { id: "nutrition-hub", name: "Nutrition Hub", blurb: "Eat smart, fuel your best performance.", icon: "0a09b", cover: "382db", members: 9, avatars: ["65fc9", "65fc9", "624cb"] },
  { id: "mind-body", name: "Mind & Body", blurb: "Balance your mind, transform your life.", icon: "5124e", cover: "7837c", members: 7, avatars: ["d50bb", "624cb", "624cb"] },
];

export const CHALLENGES: Challenge[] = [
  { id: "strength-30", name: "30 Day Strength Challenge", blurb: "Thirty training days, no week skipped.", days: 30, pct: 0.14, ends: "Ends in 3 weeks" },
  { id: "steps-10k", name: "10K Steps Challenge", blurb: "Twenty days over ten thousand steps.", days: 20, pct: 0.42, ends: "Ends in 2 weeks" },
  { id: "hydration-7", name: "Hydration Challenge", blurb: "Seven days at ten glasses of water.", days: 7, pct: 0.57, ends: "Ends in 7 days" },
  { id: "endurance-21", name: "21 Day Endurance Push", blurb: "Twenty-one days past eight kilometres.", days: 21, pct: 0.18, ends: "Ends in 2 weeks" },
  { id: "protein-14", name: "Protein Streak", blurb: "A fortnight of hitting the protein target.", days: 14, pct: 0.65, ends: "Ends in 2 weeks" },
  { id: "mobility-30", name: "Daily Mobility", blurb: "Thirty days over ninety active minutes.", days: 30, pct: 0.23, ends: "Ends in 3 weeks" },
];

export const CONTRIBUTORS = [
  { name: "John Doe", avatar: "624cb", crown: "0ec6a", pts: 4820 },
  { name: "Mike Johnson", avatar: "65fc9", crown: "f8630", pts: 4310 },
  { name: "David Brown", avatar: "d50bb", crown: "edcf3", pts: 3970 },
] as { name: string; avatar: string; crown: string | null; pts: number }[];

/* Membership is shared across the overview and the section pages, and survives reloads. */
export const useJoinedGroups = createSetStore("kinora-joined-groups");
export const useJoinedChallenges = createSetStore("kinora-joined-challenges");

export const MEMBERS_TOP = [
  ...CONTRIBUTORS,
  { name: "Robert Miller", avatar: "624cb", crown: null, pts: 3540 },
];

export const LEADERBOARD = [
  { name: "John Doe", avatar: "624cb", pts: 4820, move: 0 },
  { name: "Mike Johnson", avatar: "65fc9", pts: 4310, move: 2 },
  { name: "David Brown", avatar: "d50bb", pts: 3970, move: -1 },
  { name: "Robert Miller", avatar: "624cb", pts: 3540, move: 1 },
  { name: "James Garcia", avatar: "65fc9", pts: 3120, move: 0 },
  { name: "William Rodriguez", avatar: "d50bb", pts: 2880, move: 3 },
  { name: "Charles Wilson", avatar: "624cb", pts: 2510, move: -2 },
  { name: "Thomas Taylor", avatar: "65fc9", pts: 2190, move: 1 },
  { name: "Jane Smith", avatar: "d50bb", pts: 2100, move: 0 },
  { name: "Malik Diallo", avatar: "d50bb", pts: 2093, move: 0 },
];

export const DISCUSSIONS = [
  { title: "How do you stay consistent on rest days?", author: "Robert Miller", avatar: "624cb", ago: "10 hours ago", replies: 23 },
  { title: "Best pre-workout meal for morning sessions?", author: "James Garcia", avatar: "65fc9", ago: "12 hours ago", replies: 18 },
  { title: "Overcoming plateau, what worked for you?", author: "Mike Johnson", avatar: "65fc9", ago: "14 hours ago", replies: 31 },
  { title: "Share your 7-day progress photos!", author: "William Rodriguez", avatar: "d50bb", ago: "16 hours ago", replies: 27 },
];

export const TOPICS = [
  { tag: "progress-photos", posts: 128 },
  { tag: "meal-prep", posts: 96 },
  { tag: "rest-days", posts: 74 },
  { tag: "pull-ups", posts: 61 },
  { tag: "sleep", posts: 43 },
];

export const DIRECTORY = [
  { name: "John Doe", role: "Admin", avatar: "624cb", streak: 96, pts: 4820, online: true },
  { name: "Mike Johnson", role: "Moderator", avatar: "65fc9", streak: 74, pts: 4310, online: true },
  { name: "David Brown", role: "Moderator", avatar: "d50bb", streak: 61, pts: 3970, online: false },
  { name: "Robert Miller", role: "Member", avatar: "624cb", streak: 55, pts: 3540, online: false },
  { name: "James Garcia", role: "Member", avatar: "65fc9", streak: 48, pts: 3120, online: false },
  { name: "William Rodriguez", role: "Member", avatar: "d50bb", streak: 41, pts: 2880, online: false },
  { name: "Charles Wilson", role: "Member", avatar: "624cb", streak: 33, pts: 2510, online: false },
  { name: "Thomas Taylor", role: "Member", avatar: "65fc9", streak: 27, pts: 2190, online: false },
];

export const EVENTS = [
  { id: "park-run", name: "Saturday Park Run", date: "Sun, Nov 8", place: "Riverside Trail", going: 18, cap: 120, cover: "9ab28" },
  { id: "barbell-clinic", name: "Barbell Technique Clinic", date: "Mon, Nov 9", place: "Downtown Gym", going: 12, cap: 40, cover: "304ea" },
  { id: "mobility-workshop", name: "Mobility Workshop", date: "Thu, Nov 12", place: "Studio Two", going: 9, cap: 25, cover: "1850a" },
  { id: "nutrition-qa", name: "Nutrition Q&A", date: "Sat, Nov 14", place: "Online", going: 17, cap: 500, cover: "7f8c8" },
  { id: "strength-meetup", name: "Strength Meet-Up", date: "Sun, Nov 15", place: "Downtown Gym", going: 14, cap: 60, cover: "c37aa" },
  { id: "sunrise-ride", name: "Sunrise Group Ride", date: "Mon, Nov 16", place: "Riverside Trail", going: 11, cap: 90, cover: "369e5" },
];

export const useAttending = createSetStore("kinora-attending-events");
