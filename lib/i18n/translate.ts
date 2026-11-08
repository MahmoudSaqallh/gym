import DICT from "./ar.json";

const AR = DICT as Record<string, string>;

const MONTHS: Record<string, string> = {
  Jan: "يناير", Feb: "فبراير", Mar: "مارس", Apr: "أبريل", May: "مايو", Jun: "يونيو",
  Jul: "يوليو", Aug: "أغسطس", Sep: "سبتمبر", Oct: "أكتوبر", Nov: "نوفمبر", Dec: "ديسمبر",
};
const DAYS: Record<string, string> = { Sun: "الأحد", Mon: "الاثنين", Tue: "الثلاثاء", Wed: "الأربعاء", Thu: "الخميس", Fri: "الجمعة", Sat: "السبت" };
const UNITS: Record<string, string> = {
  min: "د", km: "كم", kg: "كجم", cm: "سم", kcal: "سعرة", steps: "خطوات", reps: "تكرارات", sets: "مجموعات", days: "أيام", day: "يوم", weeks: "أسابيع", week: "أسبوع",
  pts: "نقطة", hr: "ساعة", hrs: "ساعات", pcs: "قطع", moves: "تمارين", g: "جرام", L: "لتر", sessions: "جلسات", BPM: "نبضة/د", ms: "مللي ثانية", "br/min": "نفس/د",
};

const MONTH = Object.keys(MONTHS).join("|");
const DAY = Object.keys(DAYS).join("|");
const UNIT = Object.keys(UNITS).map((u) => u.replace("/", "\\/")).join("|");
const NUM = "[+-]?[\\d][\\d.,]*(?:[–-][\\d.,]+)?";
const PLAIN_NAMES = /^(SpO2|HRV|REM|React|TypeScript|Node\.js|CSS|GraphQL)$/;

/** Keeps numbers, signs and ranges in reading order inside right-to-left text. */
const ltr = (s: string) => `⁦${s}⁩`;
const meridiem = (a: string) => (a === "AM" ? "ص" : "م");
const date = (m: string, d: string, y?: string) => `${d} ${MONTHS[m]}${y ? ` ${y}` : ""}`;

/** Translated when known; product and people names stay as written. */
const T = (x: string) => lookup(x) ?? x;

type Rule = [RegExp, (...g: string[]) => string];

const FULL_MONTHS: Record<string, string> = {
  January: "يناير", February: "فبراير", March: "مارس", April: "أبريل", May: "مايو", June: "يونيو",
  July: "يوليو", August: "أغسطس", September: "سبتمبر", October: "أكتوبر", November: "نوفمبر", December: "ديسمبر",
};
const FULL = Object.keys(FULL_MONTHS).join("|");
const fullDate = (m: string, d: string, y?: string) => `${d} ${FULL_MONTHS[m]}${y ? ` ${y}` : ""}`;
const days = (n: string) => (+n <= 10 ? `${n} أيام` : `${n} يومًا`);

const RULES: Rule[] = [
  [/^Show slide (\d+)$/, (n) => `عرض الشريحة ${n}`],
  [/^Open actions menu for (.+)$/, (x) => `فتح قائمة إجراءات ${T(x)}`],
  [/^Enter .+ to continue\.$/, () => "هذا الحقل مطلوب للمتابعة."],
  [/^Add to (.+)$/, (x) => `إضافة إلى ${T(x)}`],
  [/^Delete (.+)\?$/, (x) => `حذف ${T(x)}؟`],
  [/^Remove (.+)\?$/, (x) => `إزالة ${T(x)}؟`],
  [/^(\d+) of (\d+) done$/, (a, b) => `${a} من ${b} مكتملة`],
  [/^(\d+) of (\d+)$/, (a, b) => `${a} من ${b}`],
  [/^(\d+\/\d+) plan$/, (x) => `الخطة ${ltr(x)}`],
  [/^(\d+) Days$/, (n) => days(n)],
  [/^(\d+) a week$/, (n) => `${n} في الأسبوع`],
  [/^(\d+) weeks$/, (n) => (+n <= 10 ? `${n} أسابيع` : `${n} أسبوعًا`)],
  [/^(\d+) movements$/, (n) => `${n} حركات`],
  [/^(\d+) sessions$/, (n) => `${n} جلسات`],
  [/^(\d+)g protein, (\d+)g carbs, (\d+)g fats$/, (p, c, f) => `${p} جم بروتين، ${c} جم كربوهيدرات، ${f} جم دهون`],
  [/^Last trained (\d+) days ago$/, (n) => `آخر تدريب قبل ${days(n)}`],
  [/^(\d+) days ago$/, (n) => `قبل ${days(n)}`],
  [new RegExp(`^(${MONTH}) (\\d{1,2}), (\\d{4}), (\\d{1,2}:\\d{2}) (AM|PM)$`), (m, d, y, t, a) => `${date(m, d, y)}، ${ltr(t)} ${meridiem(a)}`],
  [new RegExp(`^(${MONTH}) (\\d{1,2}), (\\d{1,2}:\\d{2}) (AM|PM)$`), (m, d, t, a) => `${date(m, d)}، ${ltr(t)} ${meridiem(a)}`],
  [new RegExp(`^(${MONTH}) (\\d{1,2}), (\\d{4}) to (${MONTH}) (\\d{1,2}), (\\d{4})$`), (m, d, y, m2, d2, y2) => `${date(m, d, y)} إلى ${date(m2, d2, y2)}`],
  [new RegExp(`^(${FULL}) (\\d{1,2})(?:, (\\d{4}))?$`), (m, d, y) => fullDate(m, d, y)],
  [new RegExp(`^(${FULL}) (\\d{4})$`), (m, y) => `${FULL_MONTHS[m]} ${y}`],
  [new RegExp(`^On your roster since (${FULL}) (\\d{1,2}), (\\d{4})$`), (m, d, y) => `في قائمتك منذ ${fullDate(m, d, y)}`],
  [new RegExp(`^Answer the week of (${FULL}) (\\d{1,2})$`), (m, d) => `الرد على أسبوع ${fullDate(m, d)}`],
  [new RegExp(`^(${DAY})$`), (d) => DAYS[d]],
  [new RegExp(`^(${DAY}), (${MONTH}) (\\d{1,2})$`), (w, m, d) => `${DAYS[w]}، ${date(m, d)}`],
  [new RegExp(`^(${MONTH}) (\\d{1,2})(?:, (\\d{4}))?$`), (m, d, y) => date(m, d, y)],
  [new RegExp(`^synced (${MONTH}) (\\d{1,2}), (\\d{1,2}:\\d{2}) (AM|PM)$`), (m, d, t, a) => `مزامنة ${date(m, d)}، ${ltr(t)} ${meridiem(a)}`],
  [new RegExp(`^(${DAY}) (\\d{1,2}) (AM|PM)$`), (d, n, a) => `${DAYS[d]} ${n} ${meridiem(a)}`],
  [/^(\d{1,2}(?::\d{2})?) (AM|PM)$/, (t, a) => `${ltr(t)} ${meridiem(a)}`],
  [/^(\d+) hours? ago$/, (n) => `منذ ${n} ساعة`],
  [/^(\d+) minutes? ago$/, (n) => `منذ ${n} دقيقة`],
  [/^(\d+) seconds? ago$/, (n) => `منذ ${n} ثانية`],
  [/^(\d+)h$/, (n) => `${n} س`],
  [/^(\d+)h (\d+)m$/, (h, m) => `${h} س ${m} د`],
  [/^(\d+) h (\d+) m$/, (h, m) => `${h} س ${m} د`],
  [/^(\d+) m$/, (n) => `${n} د`],
  [/^([+-]\d+)m$/, (n) => `${ltr(n)} د`],
  [/^(\d+)g$/, (n) => `${n} جرام`],
  [/^(\d+) replies$/, (n) => `${n} ردود`],
  [/^Glass (\d+)$/, (n) => `الكوب ${n}`],
  [/^Glass (\d+) of (\d+)$/, (a, b) => `الكوب ${a} من ${b}`],
  [/^Go to slide (\d+)$/, (n) => `انتقل إلى الشريحة ${n}`],
  [/^Page (\d+)$/, (n) => `صفحة ${n}`],
  [/^Difficulty (\d+) of (\d+)$/, (a, b) => `الصعوبة ${a} من ${b}`],
  [/^(\d+)% active$/, (n) => `${n}% نشاط`],
  [/^Week (\d+)$/, (n) => `الأسبوع ${n}`],
  [/^Week (\d+) of (\d+)$/, (a, b) => `الأسبوع ${a} من ${b}`],
  [/^Step (\d+) of (\d+)$/, (a, b) => `الخطوة ${a} من ${b}`],
  [/^(\d+)g (Protein|Carbs|Fats)$/, (n, k) => `${n} جرام ${AR[k]}`],
  [/^(up|down) ([\d.]+)(kg|cm|%)$/, (d, n, u) => `${d === "up" ? "ارتفاع" : "انخفاض"} ${n}${u === "%" ? "%" : ` ${UNITS[u]}`}`],
  [new RegExp(`^(${MONTH}): sales (\\d+), profit (\\d+)$`), (m, a, b) => `${MONTHS[m]}: المبيعات ${a}، الربح ${b}`],
  [new RegExp(`^(${DAY}) (\\d+)$`), (d, n) => `${DAYS[d]} ${n}`],
  [/^Choose a checkpoint, (before|after): (.+)$/, (w, d) => `اختر نقطة مقارنة، ${w === "before" ? "قبل" : "بعد"}: ${T(d)}`],
  [/^Compare with this checkpoint, (.+)$/, (d) => `قارن مع هذه النقطة، ${T(d)}`],
  [/^Progress photo, (.+)$/, (d) => `صورة التقدم، ${T(d)}`],
  [/^Add (.+) to today$/, (x) => `إضافة ${T(x)} إلى اليوم`],
  [/^(.+), earned (.+)$/, (x, d) => `${T(x)}، تم الحصول عليه ${T(d)}`],
  [/^(.+), locked$/, (x) => `${T(x)}، مقفل`],
  [/^(.+), last four weeks$/, (x) => `${T(x)}، آخر أربعة أسابيع`],
  [/^(.+) attendance$/, (x) => `حضور ${T(x)}`],
  [/^(.+) habit$/, (x) => `عادة ${T(x)}`],
  [/^(.+) photo$/, (x) => `صورة ${T(x)}`],
  [/^Cancel attendance for (.+)$/, (x) => `إلغاء الحضور في ${T(x)}`],
  [/^Attend (.+)$/, (x) => `حضور ${T(x)}`],
  [/^Join (.+)$/, (x) => `انضمام إلى ${T(x)}`],
  [/^Leave (.+)$/, (x) => `مغادرة ${T(x)}`],
  [/^Remove (.+)$/, (x) => `إزالة ${T(x)}`],
  [/^Save (.+)$/, (x) => `حفظ ${T(x)}`],
  [/^Unsave (.+)$/, (x) => `إلغاء حفظ ${T(x)}`],
  [/^Edit (.+)$/, (x) => `تعديل ${T(x)}`],
  [/^(\d+) need action$/, (n) => `${n} بحاجة لإجراء`],
  [/^(\d+) quiet$/, (n) => `${n} خاملون`],
  [/^Last trained (\d+) days ago$/, (n) => `آخر تمرين منذ ${n} يومًا`],
  [/^View (\d+) more$/, (n) => `عرض ${n} إضافي`],
  [/^View (\d+) more check-ins$/, (n) => `عرض ${n} متابعات أخرى`],
  [/^W(\d+)$/, (n) => `أ${n}`],
  [/^Options for (.+)$/, (x) => `خيارات ${T(x)}`],
  [/^View profile, (.+)$/, (x) => `عرض ملف ${x}`],
  [new RegExp(`^/ (${NUM}) (${UNIT})$`), (n, u) => `/ ${ltr(n)} ${UNITS[u]}`],
  [new RegExp(`^(${NUM}) / (${NUM}) (${UNIT})$`), (a, b, u) => `${ltr(`${a} / ${b}`)} ${UNITS[u]}`],
  [new RegExp(`^(${NUM}) (${UNIT})$`), (n, u) => `${ltr(n)} ${UNITS[u]}`],
  [/^([+-][\d.,]+%?)$/, (n) => ltr(n)],
];

const SUFFIXES: [string, string][] = [
  [" vs last week", " مقارنة بالأسبوع الماضي"],
  [" vs last month", " مقارنة بالشهر الماضي"],
  [" vs last year", " مقارنة بالعام الماضي"],
  [" on last week", " عن الأسبوع الماضي"],
  [" this week", " هذا الأسبوع"],
];

// "Sales 4000", "Deep 24%", "Resting HR 63", "Revenue 2,400, 1,398", "Respiratory rate 15.1 br/min"
const NAMED = new RegExp(`^(.+?) (\\d(?:[\\d.,%K ]*[\\d%K])?)(?: (${UNIT}))?$`);

function lookup(s: string): string | null {
  const hit = AR[s];
  if (hit !== undefined) return hit;
  for (const [re, fn] of RULES) {
    const m = s.match(re);
    if (m) return fn(...m.slice(1));
  }
  for (const [en, ar] of SUFFIXES) {
    if (s.endsWith(en)) {
      const left = s.slice(0, -en.length);
      const t = lookup(left) ?? (/^[+-]?[\d.,]+%?$/.test(left) ? ltr(left) : null);
      if (t) return t + ar;
    }
  }
  const pair = s.match(/^([^:]+): (.+)$/);
  if (pair) {
    const head = /[A-Za-z]/.test(pair[1]) ? (lookup(pair[1]) ?? lookup(`${pair[1]}:`)?.replace(/:$/, "")) : pair[1];
    const tail = /[A-Za-z]/.test(pair[2]) ? lookup(pair[2]) : pair[2];
    if (head && tail) return `${head}: ${tail}`;
  }
  const named = s.match(NAMED);
  if (named) {
    const head = AR[named[1]] ?? (PLAIN_NAMES.test(named[1]) ? named[1] : undefined);
    if (head) return `${head} ${named[2]}${named[3] ? ` ${UNITS[named[3]]}` : ""}`;
  }
  const brand = s.match(/^(.+) – Kinora$/);
  if (brand) {
    const t = lookup(brand[1]);
    if (t) return `${t} – كينورا`;
  }
  for (const sep of [" · ", " • ", " / ", "; "]) {
    if (s.includes(sep)) {
      const parts = s.split(sep).map((p) => lookup(p));
      if (parts.every(Boolean)) return parts.join(sep);
    }
  }
  if (s.includes(", ")) {
    const parts = s.split(", ").map((p) => lookup(p));
    if (parts.every(Boolean)) return parts.join("، ");
  }
  return null;
}

const BARE_NUMBERS = /^(?:[\d.,]+\s*[–\-/]\s*[\d.,]+|[+-][\d.,]+%?)$/;

/** English text, or a bare range or signed number that right-to-left layout would otherwise scramble. */
export const needsWork = (text: string) => /[A-Za-z]/.test(text) || BARE_NUMBERS.test(text.trim());

/** Arabic for an English UI string, keeping surrounding spaces; the input itself when there is none. */
export function toArabic(text: string): string {
  const core = text.replace(/\s+/g, " ").trim();
  if (!core || !needsWork(core)) return text;
  const hit = BARE_NUMBERS.test(core) ? ltr(core) : lookup(core);
  if (hit === null) return text;
  const lead = /^\s/.test(text) ? " " : "";
  const trail = /\s$/.test(text) ? " " : "";
  return lead + hit + trail;
}
