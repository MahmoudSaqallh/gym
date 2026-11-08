export type Client = {
  slug: string;
  name: string;
  avatar: string;
  note: string;
  danger?: boolean;
  plan: number;
  sessions: number;
  minutes: number;
  since: string;
  last: string;
};

export const CLIENTS: Client[] = [
  { slug: "david-brown", name: "David Brown", avatar: "d50bb", note: "Has never finished a session", danger: true, plan: 0, sessions: 0, minutes: 0, since: "August 25, 2026", last: "Never" },
  { slug: "mike-johnson", name: "Mike Johnson", avatar: "65fc9", note: "Last trained 14 days ago", danger: true, plan: 1, sessions: 0, minutes: 0, since: "July 14, 2026", last: "14 days ago" },
  { slug: "john-doe", name: "John Doe", avatar: "624cb", note: "Last trained 10 days ago", danger: true, plan: 1, sessions: 0, minutes: 0, since: "June 2, 2026", last: "10 days ago" },
  { slug: "sarah-williams", name: "Sarah Williams", avatar: "624cb", note: "Last trained 5 days ago", plan: 2, sessions: 1, minutes: 55, since: "May 19, 2026", last: "5 days ago" },
  { slug: "jane-smith", name: "Jane Smith", avatar: "d50bb", note: "Last trained 3 days ago", plan: 2, sessions: 2, minutes: 105, since: "April 7, 2026", last: "3 days ago" },
  { slug: "demo-member", name: "Demo Member", avatar: "624cb", note: "Trained yesterday", plan: 2, sessions: 3, minutes: 165, since: "March 3, 2026", last: "Yesterday" },
];

export const clientBySlug = (slug: string) => CLIENTS.find((c) => c.slug === slug);
export const slugOfName = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const WORKOUTS = [
  { name: "Core & Mobility", image: "c8645" },
  { name: "Conditioning", image: "25f3b" },
  { name: "Upper Body Strength", image: "1100b" },
  { name: "Leg Day", image: "6bb73" },
  { name: "Pull Day", image: "53231" },
  { name: "Push Day", image: "55a3b" },
];

export type Assignment = { id: string; name: string; image: string; date: string; status: "Upcoming" | "Missed" };

export const ASSIGNMENTS: Assignment[] = [
  { id: "a1", name: "Core & Mobility", image: "c8645", date: "Nov 10", status: "Upcoming" },
  { id: "a2", name: "Conditioning", image: "25f3b", date: "Nov 8", status: "Upcoming" },
  { id: "a3", name: "Upper Body Strength", image: "1100b", date: "Nov 7", status: "Missed" },
  { id: "a4", name: "Leg Day", image: "6bb73", date: "Nov 3", status: "Missed" },
  { id: "a5", name: "Pull Day", image: "53231", date: "Oct 27", status: "Missed" },
  { id: "a6", name: "Push Day", image: "55a3b", date: "Oct 20", status: "Missed" },
];

export type CheckIn = { id: string; date: string; weight: number; mood: string; text: string; reply?: string };

export const CHECK_INS: CheckIn[] = [
  { id: "c1", date: "November 2", weight: 86.4, mood: "Strong", text: "Good week. Bench moved up 2.5kg and legs felt fresh on Friday." },
  { id: "c2", date: "October 26", weight: 86.9, mood: "Good", text: "Slept badly Tuesday and Wednesday. Trained anyway, felt flat.", reply: "Flat weeks after bad sleep are normal. Keep the weights, drop a set if it happens again." },
  { id: "c3", date: "October 19", weight: 87.3, mood: "Strong", text: "Three sessions, all done. Shoulder twinge on overhead press has gone.", reply: "Good. Keep the warm-up you added, it is doing the work." },
  { id: "c4", date: "October 12", weight: 87.6, mood: "Steady", text: "Travelled Thursday to Sunday. Only one session and a lot of walking.", reply: "One session in a travel week is a win. Pick up on Monday where we left off." },
];
