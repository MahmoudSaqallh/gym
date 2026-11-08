export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Equipment = "Barbell" | "Dumbbell" | "Bodyweight" | "Cable";
export type MuscleGroup = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";

export type Exercise = {
  slug: string;
  name: string;
  muscles: string[];
  group: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  img: string; // card photo (Figma export, /assets/f)
  thumb?: string; // 52×40 list thumbnail when Figma exports a separate crop
  saved?: boolean;
  /* Exercise-specific copy — only Barbell Back Squat is written out in the Figma file. */
  detail?: ExerciseDetail;
};

export type ExerciseDetail = {
  tagline: string;
  primary: string;
  secondary: string;
  steps: string[];
  mistakes: { title: string; fix: string }[];
  history: { date: string; sets: number; reps: string; weight: string; volume: string; orm: string; spark: string }[];
  alternatives: string[];
};

const s = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const ex = (e: Omit<Exercise, "slug">): Exercise => ({ ...e, slug: s(e.name) });

export const FEATURED = ex({
  name: "Barbell Back Squat",
  muscles: ["Quads", "Glutes", "Core"],
  group: "Legs",
  equipment: "Barbell",
  difficulty: "Intermediate",
  img: "c37aa.png",
  thumb: "fe37b.png",
  saved: true,
  detail: {
    tagline: "Big breath, brace hard, and drive the floor away. Depth beats load every time.",
    primary: "Quads",
    secondary: "Glutes, Core",
    steps: [
      "Set the bar across your upper traps and grip it just outside your shoulders.",
      "Unrack, step back and set your feet shoulder-width apart, toes slightly out.",
      "Brace your core and sit down between your hips until your thighs pass parallel.",
      "Drive through your whole foot to stand back up tall.",
    ],
    mistakes: [
      { title: "Knees caving inward", fix: "Push your knees out over your toes through the whole rep." },
      { title: "Heels lifting off the floor", fix: "Keep the weight over mid-foot and work on ankle mobility." },
      { title: "Cutting the depth short", fix: "Squat to at least parallel before driving back up." },
    ],
    history: [
      { date: "Nov 4, 2026", sets: 4, reps: "6, 6, 5, 5", weight: "110 kg", volume: "2,420 kg", orm: "132 kg", spark: "de4bc" },
      { date: "Oct 30, 2026", sets: 4, reps: "8, 6, 6, 5", weight: "105 kg", volume: "2,625 kg", orm: "133 kg", spark: "0f2ef" },
      { date: "Oct 25, 2026", sets: 4, reps: "8, 8, 6, 6", weight: "100 kg", volume: "2,800 kg", orm: "126.5 kg", spark: "de4bc" },
    ],
    alternatives: ["walking-lunge", "romanian-deadlift", "plank"],
  },
});

/* Grid order matches the Figma frame "Client – Workouts / Exercise Library". */
export const EXERCISES: Exercise[] = [
  ex({ name: "Barbell Bench Press", muscles: ["Chest", "Triceps", "Shoulders"], group: "Chest", equipment: "Barbell", difficulty: "Intermediate", img: "96311.png", thumb: "74012.png", saved: true }),
  ex({ name: "Push Up", muscles: ["Chest", "Triceps", "Core"], group: "Chest", equipment: "Bodyweight", difficulty: "Beginner", img: "d2360.png" }),
  ex({ name: "Dumbbell Bench Press", muscles: ["Chest", "Triceps", "Shoulders"], group: "Chest", equipment: "Dumbbell", difficulty: "Intermediate", img: "8658d.png", thumb: "4f460.png", saved: true }),
  ex({ name: "Bent Over Row", muscles: ["Upper Back", "Lats", "Biceps"], group: "Back", equipment: "Dumbbell", difficulty: "Intermediate", img: "ccb43.png" }),
  ex({ name: "Romanian Deadlift", muscles: ["Hamstrings", "Glutes"], group: "Legs", equipment: "Barbell", difficulty: "Intermediate", img: "20c0c.png", thumb: "207bc.png", saved: true }),
  ex({ name: "Overhead Press", muscles: ["Shoulders", "Triceps"], group: "Shoulders", equipment: "Barbell", difficulty: "Intermediate", img: "71e8f.png" }),
  ex({ name: "Pull Up", muscles: ["Lats", "Upper Back", "Biceps"], group: "Back", equipment: "Bodyweight", difficulty: "Intermediate", img: "7d47c.png", thumb: "06ccb.png", saved: true }),
  ex({ name: "Walking Lunge", muscles: ["Legs", "Glutes"], group: "Legs", equipment: "Dumbbell", difficulty: "Beginner", img: "56de5.png", thumb: "7e243.png" }),
  ex({ name: "Plank", muscles: ["Core", "Shoulders"], group: "Core", equipment: "Bodyweight", difficulty: "Beginner", img: "1850a.png", thumb: "c567f.png" }),
  ex({ name: "Bicep Curl", muscles: ["Biceps", "Forearms"], group: "Arms", equipment: "Dumbbell", difficulty: "Beginner", img: "84055.png" }),
  ex({ name: "Tricep Dips", muscles: ["Triceps", "Chest"], group: "Arms", equipment: "Bodyweight", difficulty: "Beginner", img: "1af50.png" }),
  ex({ name: "Incline Dumbbell Press", muscles: ["Upper Chest", "Shoulders", "Triceps"], group: "Chest", equipment: "Dumbbell", difficulty: "Intermediate", img: "e7db9.png" }),
  ex({ name: "Seated Cable Row", muscles: ["Mid Back", "Lats", "Biceps"], group: "Back", equipment: "Cable", difficulty: "Beginner", img: "a72e8.png", thumb: "2ce08.png" }),
  ex({ name: "Lateral Raise", muscles: ["Side Delts", "Traps"], group: "Shoulders", equipment: "Dumbbell", difficulty: "Beginner", img: "196ef.png" }),
  ex({ name: "Triceps Pushdown", muscles: ["Triceps", "Forearms"], group: "Arms", equipment: "Cable", difficulty: "Beginner", img: "cd9b8.png" }),
  ex({ name: "Leg Press", muscles: ["Quads", "Glutes"], group: "Legs", equipment: "Cable", difficulty: "Beginner", img: "a7e04.png", thumb: "cf8c3.png" }),
  ex({ name: "Face Pull", muscles: ["Rear Delts", "Upper Back"], group: "Shoulders", equipment: "Cable", difficulty: "Beginner", img: "94b52.png", thumb: "02b8a.png" }),
  ex({ name: "Machine Chest Press", muscles: ["Chest", "Triceps"], group: "Chest", equipment: "Cable", difficulty: "Beginner", img: "8658d.png" }),
  ex({ name: "Side Plank", muscles: ["Obliques", "Core"], group: "Core", equipment: "Bodyweight", difficulty: "Beginner", img: "1850a.png" }),
  ex({ name: "Goblet Squat", muscles: ["Quads", "Glutes", "Core"], group: "Legs", equipment: "Dumbbell", difficulty: "Beginner", img: "304ea.png" }),
  ex({ name: "Dumbbell Shoulder Press", muscles: ["Shoulders", "Triceps"], group: "Shoulders", equipment: "Dumbbell", difficulty: "Intermediate", img: "e7db9.png" }),
  ex({ name: "Tricep Overhead Extension", muscles: ["Triceps"], group: "Arms", equipment: "Dumbbell", difficulty: "Beginner", img: "cd9b8.png" }),
];

export const ALL_EXERCISES = [FEATURED, ...EXERCISES];
export const findExercise = (slug: string) => ALL_EXERCISES.find((e) => e.slug === slug);

export const DIFF_LEVEL: Record<Difficulty, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

/* Saved list order + recent views as shown in the Figma aside. */
export const SAVED_ORDER = ["barbell-bench-press", "barbell-back-squat", "dumbbell-bench-press", "romanian-deadlift", "pull-up"];
export const RECENT_VIEWS = [
  { slug: "barbell-back-squat", ago: "18 seconds ago" },
  { slug: "seated-cable-row", ago: "35 minutes ago" },
  { slug: "leg-press", ago: "48 minutes ago" },
  { slug: "face-pull", ago: "2 hours ago" },
];
