export type Stat = {
  label: string;
  icon: string;
  value: { n: number; unit?: string; decimals?: number }[]; // e.g. [{n:1,unit:"h"},{n:45,unit:"m"}]
  delta: string;
  bars: number[]; // 0..1 heights of the mini bar chart
};

export type ActivityPeriod = {
  key: "daily" | "weekly" | "monthly";
  vsLabel: string;
  stats: Stat[];
  chart: {
    legend: [string, string];
    unit: string; // pill label: Days / Weeks / Months
    labels: string[];
    max: number;
    ticks: { v: number; label: string }[];
    current: number[];
    previous: number[];
  };
  percentile: number;
};

const ICONS = { steps: "3e4ae", time: "101b3", cal: "d0cbd", dist: "9df5a" };

/* Daily values are taken from the Figma chart vectors (y → value); weekly/monthly from the frames. */
export const ACTIVITY: Record<ActivityPeriod["key"], ActivityPeriod> = {
  daily: {
    key: "daily",
    vsLabel: "vs last week",
    percentile: 19,
    stats: [
      { label: "Steps", icon: ICONS.steps, value: [{ n: 12845 }], delta: "+1,045", bars: [21.6, 36, 48, 33.6, 26.4, 38.4, 46.8].map((h) => h / 48) },
      { label: "Active Time", icon: ICONS.time, value: [{ n: 1, unit: "h" }, { n: 45, unit: "m" }], delta: "+10m", bars: [21.6, 48, 27.3, 38.8, 48, 36.5, 48].map((h) => h / 48) },
      { label: "Calories", icon: ICONS.cal, value: [{ n: 2450 }], delta: "+50", bars: [21.6, 41.6, 29.1, 36.6, 34.1, 44.4, 48].map((h) => h / 48) },
      { label: "Distance", icon: ICONS.dist, value: [{ n: 8.6, unit: "km", decimals: 1 }], delta: "+0.5 km", bars: [29.4, 40.2, 21.6, 32.5, 37.1, 40.2, 48].map((h) => h / 48) },
    ],
    chart: {
      legend: ["This Week", "Last Week"],
      unit: "Days",
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      max: 15000,
      ticks: [
        { v: 0, label: "0" },
        { v: 5000, label: "5K" },
        { v: 10000, label: "10K" },
        { v: 15000, label: "15K" },
      ],
      current: [9782, 11582, 13082, 11282, 10382, 11882, 12927],
      previous: [9178, 8778, 10278, 9878, 11378, 7978, 10478],
    },
  },
  weekly: {
    key: "weekly",
    vsLabel: "vs last month",
    percentile: 9,
    stats: [
      { label: "Steps", icon: ICONS.steps, value: [{ n: 80345 }], delta: "+12,945", bars: [0.45, 0.55, 0.62, 1] },
      { label: "Active Time", icon: ICONS.time, value: [{ n: 11, unit: "h" }, { n: 16, unit: "m" }], delta: "+104m", bars: [0.42, 0.5, 0.6, 1] },
      { label: "Calories", icon: ICONS.cal, value: [{ n: 16020 }], delta: "+1,485", bars: [0.45, 0.55, 0.65, 1] },
      { label: "Distance", icon: ICONS.dist, value: [{ n: 54.6, unit: "km", decimals: 1 }], delta: "+4.3 km", bars: [0.4, 0.55, 0.6, 1] },
    ],
    chart: {
      legend: ["This Month", "Last Month"],
      unit: "Weeks",
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      max: 100000,
      ticks: [
        { v: 20000, label: "20K" },
        { v: 60000, label: "60K" },
        { v: 100000, label: "100K" },
      ],
      current: [63000, 64000, 65000, 76000],
      previous: [62000, 62000, 63000, 62000],
    },
  },
  monthly: {
    key: "monthly",
    vsLabel: "vs last year",
    percentile: 7, // monthly

    stats: [
      { label: "Steps", icon: ICONS.steps, value: [{ n: 294326 }], delta: "+25,032", bars: [0.8, 0.72, 0.78, 0.7, 0.74, 0.8, 0.74, 0.78, 0.7, 0.78, 0.86, 1] },
      { label: "Active Time", icon: ICONS.time, value: [{ n: 41, unit: "h" }, { n: 35, unit: "m" }], delta: "+206m", bars: [0.82, 0.7, 0.76, 0.72, 0.7, 0.8, 0.72, 0.76, 0.7, 0.76, 0.84, 1] },
      { label: "Calories", icon: ICONS.cal, value: [{ n: 62523 }], delta: "+3,793", bars: [0.78, 0.72, 0.76, 0.7, 0.74, 0.8, 0.72, 0.76, 0.7, 0.78, 0.84, 1] },
      { label: "Distance", icon: ICONS.dist, value: [{ n: 212.0, unit: "km", decimals: 1 }], delta: "+15.4 km", bars: [0.8, 0.7, 0.78, 0.72, 0.74, 0.8, 0.74, 0.78, 0.7, 0.8, 0.86, 1] },
    ],
    chart: {
      legend: ["This Year", "Last Year"],
      unit: "Months",
      labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      max: 300000,
      ticks: [
        { v: 0, label: "0" },
        { v: 100000, label: "100K" },
        { v: 200000, label: "200K" },
        { v: 300000, label: "300K" },
      ],
      current: [255000, 262000, 262000, 262000, 261000, 262000, 258000, 256000, 254000, 256000, 256000, 268000],
      previous: [244000, 248000, 248000, 248000, 247000, 248000, 246000, 244000, 243000, 245000, 244000, 252000],
    },
  },
};

export const BREAKDOWN = [
  { label: "Walking", icon: "b5f8f", pct: 56, detail: "45,000 steps", fill: 57.42 / 102.54 },
  { label: "Running", icon: "c40c3", pct: 24, detail: "19,300 steps", fill: 24.6 / 102.54 },
  { label: "Cycling", icon: "fef5f", pct: 0, detail: "240 steps", fill: 0 },
  { label: "Other", icon: "e6478", pct: 20, detail: "", fill: 20.5 / 102.54 },
];

/* Hourly heat map: light-mode cell colors from Figma (rows = 3-hour blocks, cols = Sun..Sat).
   "" = empty track. Intensity is derived from the red channel so dark mode can re-mix it. */
export const HOURLY: string[][] = [
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["#e7f0d7", "", "#e7f0d7", "#deefbf", "#e7f0d7", "#d1ed9b", "#e7f0d7"],
  ["#d1ed9b", "#e7f0d7", "#d6eea7", "#c4eb77", "#daeeb3", "#c0eb6c", "#d6eea7"],
  ["#d6eea7", "#e2efcb", "#bcea60", "#a3e718", "#d1ed9b", "#b4e948", "#c4eb77"],
  ["#c4eb77", "#deefbf", "#a7e824", "#abe830", "#c4eb77", "#c0eb6c", "var(--lime)"],
  ["#a7e824", "#c9ec83", "#c4eb77", "#c4eb77", "#9ee70c", "#abe830", "#bcea60"],
  ["#daeeb3", "#e7f0d7", "#e2efcb", "#deefbf", "#d6eea7", "#d1ed9b", "#deefbf"],
];

export const RECENT = [
  { title: "Morning Run", when: "Nov 7 · 8:45 AM", dist: "6.81 km", time: "34 min", img: "33f23.png", icon: "c40c3" },
  { title: "Outdoor Walk", when: "Nov 6 · 8:10 PM", dist: "5.2 km", time: "58 min", img: "56f08.png", icon: "b5f8f" },
  { title: "Cycling", when: "Nov 5 · 7:30 PM", dist: "12.3 km", time: "37 min", img: "efcb0.png", icon: "fef5f" },
  { title: "Evening Walk", when: "Nov 4 · 9:05 PM", dist: "4.1 km", time: "46 min", img: "237c3.png", icon: "b5f8f" },
];
