import { ALL_EXERCISES } from "../workouts/exercises-data";

export type ContentRow = { id: string; title: string; sub: string; image: string; cells: Record<string, string> };
export type ContentColumn = { key: string; label: string; width: number; muted?: boolean; badge?: boolean; small?: boolean };
export type ContentFilter = { key: string; label: string; options?: string[]; sort?: boolean; test?: (row: ContentRow, want: string) => boolean };
export type ContentConfig = {
  crumb: string;
  root?: string;
  rowHeight?: number;
  title: string;
  subtitle: string;
  search: string;
  first: { label: string; width: number };
  columns: ContentColumn[];
  actionsWidth: number;
  minWidth?: number;
  filters: ContentFilter[];
  rows: ContentRow[];
};

const UPDATED = "Nov 7, 2026, 2:01 AM";
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SORT = ["Newest first", "Name A to Z", "Name Z to A"];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const distinct = (values: string[]) => [...new Set(values)];

const row = (title: string, sub: string, image: string, cells: Record<string, string>): ContentRow => ({ id: slug(title), title, sub, image, cells: { updated: UPDATED, ...cells } });

/* The Figma table lists the library newest first, the reverse of the client grid. */
const EXERCISE_ROWS = [...ALL_EXERCISES].reverse().map((e) =>
  row(e.name, e.muscles.join(" • "), e.thumb ?? e.img, { group: e.group, equipment: e.equipment, difficulty: e.difficulty, featured: "" }),
);

const WORKOUT_ROWS = [
  row("Core & Mobility", "Core • Legs", "c567f.png", { focus: "Core", level: "Beginner", length: "30 min", movements: "4 movements" }),
  row("Conditioning", "Back • Chest • Core • Legs", "4ec50.png", { focus: "Core", level: "Beginner", length: "35 min", movements: "4 movements" }),
  row("Upper Body Strength", "Arms • Back • Chest • Shoulders", "33412.png", { focus: "Push", level: "Intermediate", length: "45 min", movements: "6 movements" }),
  row("Leg Day", "Core • Legs", "44336.png", { focus: "Legs", level: "Intermediate", length: "60 min", movements: "5 movements" }),
  row("Pull Day", "Arms • Back", "351e8.png", { focus: "Pull", level: "Intermediate", length: "50 min", movements: "6 movements" }),
  row("Push Day", "Arms • Chest • Shoulders", "dd43f.png", { focus: "Push", level: "Intermediate", length: "55 min", movements: "6 movements" }),
];

const PROGRAM_ROWS = [
  row("Conditioning", "Endurance", "eeef3.png", { level: "Intermediate", length: "4 weeks", sessions: "4 a week" }),
  row("First Steps", "Full body", "01d9f.png", { level: "Beginner", length: "6 weeks", sessions: "3 a week" }),
  row("Lean Build", "Hypertrophy", "cf702.png", { level: "Advanced", length: "12 weeks", sessions: "5 a week" }),
  row("Strength Foundation", "Strength", "44336.png", { level: "Intermediate", length: "8 weeks", sessions: "4 a week" }),
];

const macros = (p: number, c: number, f: number) => `${p}g protein, ${c}g carbs, ${f}g fats`;

const DISH_ROWS = [
  row("Overnight Oats", "Oats, milk, chia, banana, cinnamon", "317af.png", { meal: "Breakfast", calories: "350", macros: macros(20, 45, 10), flags: "Recommended" }),
  row("Salmon Avocado Salad", "Smoked salmon, avocado, leaves, lemon dressing", "10111.png", { meal: "Dinner", calories: "470", macros: macros(38, 30, 22), flags: "Recommended" }),
  row("High Protein Veggie Wrap", "Whole wheat wrap, grilled tofu, peppers, hummus", "364bf.png", { meal: "Lunch", calories: "464", macros: macros(35, 45, 16), flags: "Recommended" }),
  row("Berry & Nut Smoothie", "Antioxidant rich and refreshing", "9ec90.png", { meal: "Snack", calories: "280", macros: macros(12, 31, 12), flags: "Healthy choice" }),
  row("Quinoa Power Bowl", "Balanced carbs and protein", "6f86d.png", { meal: "Lunch", calories: "450", macros: macros(28, 53, 14), flags: "Healthy choice" }),
  row("Avocado & Egg Toast", "High in healthy fats and fiber", "ad00c.png", { meal: "Breakfast", calories: "350", macros: macros(15, 32, 18), flags: "Healthy choice" }),
  row("Baked Salmon & Veggies", "Baked salmon, sweet potato, asparagus, lemon", "db30c.png", { meal: "Dinner", calories: "658", macros: macros(67, 48, 22), flags: "" }),
  row("Apple & Almond Butter", "Apple sliced, almond butter", "8d71f.png", { meal: "Snack", calories: "226", macros: macros(6, 28, 10), flags: "" }),
  row("Grilled Chicken Quinoa Bowl", "Grilled chicken, quinoa, avocado, broccoli, chickpeas, olive oil", "ebec3.png", { meal: "Lunch", calories: "569", macros: macros(46, 58, 17), flags: "" }),
  row("Greek Yogurt Bowl", "Greek yogurt, blueberries, almonds, honey, chia seeds", "6ffc2.png", { meal: "Breakfast", calories: "388", macros: macros(24, 46, 12), flags: "" }),
];

const U2 = "Nov 7, 2026, 2:02 AM";
const COMMUNITY_ROOT = "/coach/community";
const under = (key: string, limit: number) => (r: ContentRow, want: string) => (Number(r.cells[key].split(" of ").pop()) < limit) === want.startsWith("Under");

const GROUP_ROWS = [
  row("Mind & Body", "Balance your mind, transform your life.", "7837c.png", { glyph: "Mind", visibility: "Private", members: "7", rules: "5", updated: U2 }),
  row("Nutrition Hub", "Eat smart, fuel your best performance.", "382db.png", { glyph: "Nutrition", visibility: "Public", members: "9", rules: "5", updated: U2 }),
  row("Cardio Crushers", "Run, sweat, repeat. We love endurance.", "5dcdf.png", { glyph: "Cardio", visibility: "Public", members: "10", rules: "5", updated: U2 }),
  row("Strength Warriors", "Building strength, one rep at a time.", "e1a15.png", { glyph: "Strength", visibility: "Public", members: "15", rules: "5", updated: U2 }),
];

const EVENT_ROWS = [
  row("Form Check Night", "Downtown Gym", "ff6ae.png", { starts: "Oct 28, 2026, 7:00 PM", seats: "3 of 30", place: "Downtown Gym", updated: U2 }),
  row("Hill Repeats Morning", "Riverside Trail", "087c2.png", { starts: "Nov 4, 2026, 7:00 AM", seats: "5 of 50", place: "Riverside Trail", updated: U2 }),
  row("Weekend Trail Hike", "Riverside Trail", "087c2.png", { starts: "Nov 23, 2026, 7:30 AM", seats: "7 of 70", place: "Riverside Trail", updated: U2 }),
  row("Beginners' Lifting Session", "Downtown Gym", "ff6ae.png", { starts: "Nov 20, 2026, 11:00 AM", seats: "8 of 45", place: "Downtown Gym", updated: U2 }),
  row("Recovery & Stretch Clinic", "Studio Two", "c567f.png", { starts: "Nov 18, 2026, 5:30 PM", seats: "11 of 35", place: "Studio Two", updated: U2 }),
  row("Sunrise Group Ride", "Riverside Trail", "369e5.png", { starts: "Nov 16, 2026, 6:30 AM", seats: "11 of 90", place: "Riverside Trail", updated: U2 }),
  row("Strength Meet-Up", "Downtown Gym", "c37aa.png", { starts: "Nov 15, 2026, 9:00 AM", seats: "14 of 60", place: "Downtown Gym", updated: U2 }),
  row("Nutrition Q&A", "Online", "7f8c8.png", { starts: "Nov 14, 2026, 7:00 PM", seats: "17 of 500", place: "Online", updated: U2 }),
  row("Mobility Workshop", "Studio Two", "1850a.png", { starts: "Nov 12, 2026, 6:30 PM", seats: "9 of 25", place: "Studio Two", updated: U2 }),
  row("Barbell Technique Clinic", "Downtown Gym", "304ea.png", { starts: "Nov 9, 2026, 10:00 AM", seats: "12 of 40", place: "Downtown Gym", updated: U2 }),
  row("Saturday Park Run", "Riverside Trail", "9ab28.png", { starts: "Nov 8, 2026, 8:00 AM", seats: "18 of 120", place: "Riverside Trail", updated: U2 }),
];

const CAL = "chip:3ce4a";
const CHALLENGE_ROWS = [
  row("Daily Mobility", "Thirty days over ninety active minutes.", CAL, { target: "30 Days", window: "Oct 16, 2026 to Nov 29, 2026", joined: "9", counts: "Minutes", group: "Mind & Body", updated: U2 }),
  row("Protein Streak", "A fortnight of hitting the protein target.", CAL, { target: "14 Days", window: "Oct 18, 2026 to Nov 19, 2026", joined: "10", counts: "Protein", group: "Nutrition Hub", updated: U2 }),
  row("21 Day Endurance Push", "Twenty-one days past eight kilometres.", CAL, { target: "21 Days", window: "Oct 12, 2026 to Nov 21, 2026", joined: "13", counts: "Distance", group: "Cardio Crushers", updated: U2 }),
  row("Hydration Challenge", "Seven days at ten glasses of water.", CAL, { target: "7 Days", window: "Oct 29, 2026 to Nov 14, 2026", joined: "10", counts: "Water", group: "Nutrition Hub", updated: U2 }),
  row("10K Steps Challenge", "Twenty days over ten thousand steps.", CAL, { target: "20 Days", window: "Oct 20, 2026 to Nov 19, 2026", joined: "12", counts: "Steps", group: "Cardio Crushers", updated: U2 }),
  row("30 Day Strength Challenge", "Thirty training days, no week skipped.", CAL, { target: "30 Days", window: "Oct 14, 2026 to Nov 28, 2026", joined: "18", counts: "Sessions", group: "Strength Warriors", updated: U2 }),
];

const ACHIEVEMENT_ROWS = [
  row("7 Day Streak", "Keep it up!", "chip:0916b", { key: "streak", awarded: "Yes", updated: U2 }),
  row("Weight Down", "0.6 kg lost this week", "chip:dacb7", { key: "weight", awarded: "Yes", updated: U2 }),
  row("2,500 Calories Burned", "Calories goal achieved!", "chip:d0cbd", { key: "calories", awarded: "Yes", updated: U2 }),
  row("5 Workouts This Week", "Great consistency!", "chip:e0d7a", { key: "workouts", awarded: "Yes", updated: U2 }),
  row("Endurance", "Ran 6+ km", "chip:6b1d8", { key: "endurance", awarded: "Yes" }),
  row("Consistent", "7 runs this month", "chip:41c3d", { key: "consistent", awarded: "Yes" }),
  row("Early Bird", "Completed an activity before 7 AM", "chip:23261", { key: "earlyBird", awarded: "Yes" }),
];

const BADGE_ROWS = [
  row("Perfect Month", "Every planned session done for a whole month.", "chip:e0d7a", { key: "perfectMonth", awarded: "No", updated: U2 }),
  row("Distance", "Run 100 km in a month.", "chip:55456", { key: "distance", awarded: "No", updated: U2 }),
  row("Hydrated", "Hit the water goal seven days running.", "chip:6aa2b", { key: "hydrated", awarded: "Yes", updated: U2 }),
  row("Early Bird", "Ten sessions finished before 8 AM.", "chip:23261", { key: "earlyBird", awarded: "Yes", updated: U2 }),
  row("Heavy Lifter", "Lifted 10,000 kg in one week.", "chip:566e4", { key: "heavyLifter", awarded: "Yes", updated: U2 }),
  row("Consistency", "Trained five times a week for a month.", "chip:9e110", { key: "consistency", awarded: "Yes", updated: U2 }),
];

export const CONTENT = {
  exercises: {
    crumb: "Exercises",
    title: "Exercises",
    subtitle: "The movement library members browse, search and train from.",
    search: "Search by name or muscles",
    first: { label: "Movement", width: 331 },
    columns: [
      { key: "group", label: "Group", width: 113 },
      { key: "equipment", label: "Equipment", width: 126 },
      { key: "difficulty", label: "Difficulty", width: 131 },
      { key: "featured", label: "Featured", width: 115 },
      { key: "updated", label: "Updated", width: 196, muted: true },
    ],
    actionsWidth: 150,
    filters: [
      { key: "group", label: "Muscle group", options: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] },
      { key: "equipment", label: "Equipment", options: ["Barbell", "Dumbbell", "Bodyweight", "Cable"] },
      { key: "difficulty", label: "Difficulty", options: LEVELS },
      { key: "featured", label: "Featured", options: ["Featured", "Not featured"] },
    ],
    rows: EXERCISE_ROWS,
  },
  workouts: {
    crumb: "Workouts",
    title: "Workouts",
    subtitle: "The sessions members train, with their planned movements.",
    search: "Search by name or description",
    first: { label: "Session", width: 331.7 },
    columns: [
      { key: "focus", label: "Focus", width: 91.4 },
      { key: "level", label: "Level", width: 135.9 },
      { key: "length", label: "Length", width: 100.4 },
      { key: "movements", label: "Movements", width: 143.8 },
      { key: "updated", label: "Updated", width: 203.4, muted: true },
    ],
    actionsWidth: 155.4,
    filters: [
      { key: "level", label: "Level", options: LEVELS },
      { key: "focus", label: "Focus", options: distinct(WORKOUT_ROWS.map((r) => r.cells.focus)) },
      { key: "length", label: "Length", options: distinct(WORKOUT_ROWS.map((r) => r.cells.length)) },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: WORKOUT_ROWS,
  },
  programs: {
    crumb: "Programs",
    title: "Programs",
    subtitle: "Multi-week plans that schedule the sessions members train.",
    search: "Search by name or focus",
    first: { label: "Program", width: 316.5 },
    columns: [
      { key: "level", label: "Level", width: 159.6 },
      { key: "length", label: "Length", width: 128.8 },
      { key: "sessions", label: "Sessions", width: 135.9 },
      { key: "updated", label: "Updated", width: 238.8, muted: true },
    ],
    actionsWidth: 182.4,
    filters: [
      { key: "level", label: "Level", options: LEVELS },
      { key: "length", label: "Length", options: distinct(PROGRAM_ROWS.map((r) => r.cells.length)) },
      { key: "sessions", label: "Sessions a week", options: distinct(PROGRAM_ROWS.map((r) => r.cells.sessions)) },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: PROGRAM_ROWS,
  },
  dishes: {
    crumb: "Dishes",
    title: "Dishes",
    subtitle: "Meals and the recommended foods the nutrition pages show members.",
    search: "Search by name or description",
    first: { label: "Dish", width: 443.6 },
    columns: [
      { key: "meal", label: "Meal", width: 94.8 },
      { key: "calories", label: "Calories", width: 96.9 },
      { key: "macros", label: "Macros", width: 245.8 },
      { key: "flags", label: "Flags", width: 140.3, badge: true },
      { key: "updated", label: "Updated", width: 172.1, muted: true },
    ],
    actionsWidth: 131.4,
    minWidth: 1325,
    filters: [
      { key: "meal", label: "Meal", options: ["Breakfast", "Lunch", "Dinner", "Snack"] },
      { key: "flag:Recommended", label: "Recommended", options: ["Yes", "No"] },
      { key: "flag:Healthy choice", label: "Healthy choice", options: ["Yes", "No"] },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: DISH_ROWS,
  },
  groups: {
    crumb: "Groups",
    root: COMMUNITY_ROOT,
    title: "Groups",
    subtitle: "The communities members join, with their rules and their cover art.",
    search: "Search by name or description",
    first: { label: "Group", width: 374 },
    columns: [
      { key: "glyph", label: "Glyph", width: 105 },
      { key: "visibility", label: "Visibility", width: 119 },
      { key: "members", label: "Members", width: 115 },
      { key: "rules", label: "Rules", width: 87 },
      { key: "updated", label: "Updated", width: 222, muted: true },
    ],
    actionsWidth: 140,
    filters: [
      { key: "glyph", label: "Glyph", options: ["Mind", "Nutrition", "Cardio", "Strength"] },
      { key: "visibility", label: "Visibility", options: ["Public", "Private"] },
      { key: "membersSize", label: "Members", options: ["Under 10", "10 or more"], test: under("members", 10) },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: GROUP_ROWS,
  },
  events: {
    crumb: "Events",
    root: COMMUNITY_ROOT,
    title: "Events",
    subtitle: "Meet-ups members can attend, with the place and the seats.",
    search: "Search by name or place",
    first: { label: "Event", width: 362 },
    columns: [
      { key: "starts", label: "Starts", width: 257, muted: true },
      { key: "seats", label: "Seats", width: 126 },
      { key: "updated", label: "Updated", width: 254, muted: true },
    ],
    actionsWidth: 163,
    filters: [
      { key: "when", label: "When", options: ["Upcoming", "Past"], test: (r, want) => (new Date(r.cells.starts) >= new Date()) === (want === "Upcoming") },
      { key: "place", label: "Places", options: distinct(EVENT_ROWS.map((r) => r.cells.place)) },
      { key: "capacity", label: "Capacity", options: ["Under 50 seats", "50 seats or more"], test: under("seats", 50) },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: EVENT_ROWS,
  },
  challenges: {
    crumb: "Challenges",
    root: COMMUNITY_ROOT,
    rowHeight: 56,
    title: "Challenges",
    subtitle: "Targets members compete on, with the window they run in.",
    search: "Search by name or description",
    first: { label: "Challenge", width: 361 },
    columns: [
      { key: "target", label: "Target", width: 99 },
      { key: "window", label: "Window", width: 259, muted: true },
      { key: "joined", label: "Joined", width: 93 },
      { key: "updated", label: "Updated", width: 216, muted: true },
    ],
    actionsWidth: 134,
    filters: [
      { key: "state", label: "State", options: ["Running", "Ended"], test: (r, want) => (new Date(r.cells.window.split(" to ")[1]) >= new Date()) === (want === "Running") },
      { key: "counts", label: "Counts", options: distinct(CHALLENGE_ROWS.map((r) => r.cells.counts)) },
      { key: "group", label: "Group", options: distinct(CHALLENGE_ROWS.map((r) => r.cells.group)) },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: CHALLENGE_ROWS,
  },
  achievements: {
    crumb: "Achievements",
    root: COMMUNITY_ROOT,
    rowHeight: 56,
    title: "Achievements",
    subtitle: "The milestones members reach on the progress pages.",
    search: "Search by name or line",
    first: { label: "Achievement", width: 483.8 },
    columns: [
      { key: "key", label: "Key", width: 164.4, muted: true, small: true },
      { key: "updated", label: "Updated", width: 293.4, muted: true },
    ],
    actionsWidth: 220.4,
    filters: [
      { key: "awarded", label: "Awarded", options: ["Yes", "No"] },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: ACHIEVEMENT_ROWS,
  },
  badges: {
    crumb: "Badges",
    root: COMMUNITY_ROOT,
    rowHeight: 56,
    title: "Badges",
    subtitle: "The marks members earn and wear on their profile.",
    search: "Search by name or line",
    first: { label: "Badge", width: 539 },
    columns: [
      { key: "key", label: "Key", width: 166, muted: true, small: true },
      { key: "updated", label: "Updated", width: 277, muted: true },
    ],
    actionsWidth: 180,
    filters: [
      { key: "awarded", label: "Awarded", options: ["Yes", "No"] },
      { key: "sort", label: "Sort", options: SORT, sort: true },
    ],
    rows: BADGE_ROWS,
  },
} satisfies Record<string, ContentConfig>;

export type ContentTab = keyof typeof CONTENT;
