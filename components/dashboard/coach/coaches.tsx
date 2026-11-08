"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico } from "@/components/ui/ico";
import { MiniStatCard } from "../section-ui";
import { useProfile } from "../settings/profile-store";
import { ActionsMenu, AdminHeader, DayField, FilterButtons, FilterInput, FilterLabel, FormDialog, Pager, smallCta, type MenuItem } from "./admin-ui";

type Coach = { id: string; name: string; role: string; email: string; phone: string; created: string; avatar: string };

const c = (name: string, role: string, email: string, phone: string, created: string, avatar: string): Coach => ({ id: email, name, role, email, phone, created, avatar });

const COACHES: Coach[] = [
  c("Demo Trainer", "Personal Trainer", "trainer@example.com", "+1555000222", "11/2/2026", "624cb"),
  c("William Moore", "Viewer", "william.moore@staff.com", "+1555112233", "9/8/2026", "65fc9"),
  c("Jennifer Taylor", "Editor", "jennifer.taylor@staff.com", "+1555990010", "7/9/2026", "d50bb"),
  c("Robert Thomas", "Viewer", "robert.thomas@staff.com", "+1555770880", "5/9/2026", "624cb"),
  c("Maria Martinez", "Coach", "maria.martinez@staff.com", "+1555550660", "3/9/2026", "65fc9"),
  c("James Garcia", "Personal Trainer", "james.garcia@staff.com", "+1555330440", "1/7/2026", "d50bb"),
  c("Lisa Anderson", "Editor", "lisa.anderson@staff.com", "+1555110220", "11/7/2025", "624cb"),
  c("David Wilson", "Gym Manager", "david.wilson@staff.com", "+1555900100", "9/7/2025", "65fc9"),
  c("Emily Davis", "Personal Trainer", "emily.davis@staff.com", "+1555700800", "7/8/2025", "624cb"),
  // Page 2: the design only draws page 1, these fill the "of 14".
  c("Michael Brown", "Coach", "michael.brown@staff.com", "+1555600700", "5/6/2025", "d50bb"),
  c("Sarah Lee", "Editor", "sarah.lee@staff.com", "+1555500600", "3/4/2025", "624cb"),
  c("Daniel White", "Viewer", "daniel.white@staff.com", "+1555400500", "1/9/2025", "65fc9"),
  c("Laura Hall", "Coach", "laura.hall@staff.com", "+1555300400", "11/5/2024", "d50bb"),
];

const ROLE_ICONS: Record<string, string> = { Viewer: "5c033", Editor: "704e5", "Gym Manager": "04006" };
const ROLE_NAMES = ["Member", "Personal Trainer", "Viewer", "Editor", "Gym Manager", "Coach", "Head Coach"];
const PAGE = 10;
const has = (hay: string, needle: string) => hay.toLowerCase().includes(needle.trim().toLowerCase());
const CRUMB = { label: "Dashboard", href: "/coach" };
const STEP = [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 1];

const COACH_STATS = [
  { label: "Total Coaches", icon: "2163e", sub: "Every coach on the staff" },
  { label: "Coaches with Roles", icon: "1eeb1", sub: "Coaches who hold at least one role" },
  { label: "Recently Added", icon: "36a7f", sub: "Added in the last 7 days" },
  { label: "Recently Updated", icon: "f11ff", sub: "Updated in the last 7 days" },
];

const NO_COACH_FILTERS = { search: "", email: "", phone: "", name: "" };

export function CoachCoaches() {
  const { profile } = useProfile();
  const [added, setAdded] = useState<Coach[]>([]);
  const [gone, setGone] = useState<string[]>([]);
  const [draft, setDraft] = useState(NO_COACH_FILTERS);
  const [f, setF] = useState(NO_COACH_FILTERS);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Coach | null>(null);

  const me: Coach = { id: "me", name: profile.name, role: "Head Coach", email: profile.email, phone: profile.phone, created: "11/7/2026", avatar: "" };
  const all = [...added, me, ...COACHES].filter((x) => !gone.includes(x.id));
  const rows = all.filter((x) => has(`${x.name} ${x.role} ${x.email}`, f.search) && has(x.email, f.email) && has(x.phone, f.phone) && has(x.name, f.name));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);
  const values = [all.length, all.length, 2 + added.length, 2];

  const menu = (x: Coach): MenuItem[] => (x.id === "me" ? [{ label: "Edit Profile", href: "/coach/settings/profile" }] : [{ label: "Remove coach", danger: true, onSelect: () => setRemoving(x) }]);

  return (
    <div className="flex flex-col gap-4">
      <div className="-mb-1">
        <AdminHeader crumbs={[CRUMB, { label: "Coaches" }]} title="Coaches" subtitle="The staff who run the gym, and what each of them may do">
          <button type="button" onClick={() => setAdding(true)} className={smallCta}>
            <Ico h="8ffed" size={16} />
            Add Coach
          </button>
        </AdminHeader>
      </div>

      <div className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {COACH_STATS.map((s, i) => (
          <MiniStatCard key={s.label} label={s.label} icon={s.icon} value={[{ n: values[i] }]} sub={s.sub} bars={STEP} delay={i * 60} />
        ))}
      </div>

      <Card delay={200} className="!rounded-[16px] p-4" aria-label="Filter coaches">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setF(draft);
            setPage(1);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FilterInput id="co-search" label="Search" value={draft.search} onChange={(v) => setDraft({ ...draft, search: v })} placeholder="Search coaches..." />
            <FilterInput id="co-email" label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} placeholder="Filter by email" />
            <FilterInput id="co-phone" label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} placeholder="Filter by phone" />
            <FilterInput id="co-name" label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Search by first/last name" />
          </div>
          <div className="mt-4">
            <FilterButtons
              onReset={() => {
                setDraft(NO_COACH_FILTERS);
                setF(NO_COACH_FILTERS);
                setPage(1);
              }}
            />
          </div>
        </form>
      </Card>

      <Card delay={260} className="!rounded-[16px] overflow-hidden" aria-label="Coaches">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[1040px] table-fixed border-collapse">
            <colgroup>
              {["25.5%", "32.5%", "15.2%", "13.3%", "13.5%"].map((w) => (
                <col key={w} style={{ width: w }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-divider bg-[var(--thead)] text-[12px] leading-4 font-semibold tracking-[0.72px] text-muted uppercase">
                {["Name", "Email", "Phone", "Created Date", "Actions"].map((h, i) => (
                  <th key={h} scope="col" className={`h-10 ${i ? "ps-4" : "ps-6"} pe-2 text-start font-semibold`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="h-40 text-center text-[14px] text-muted">
                    No coaches match these filters.
                  </td>
                </tr>
              )}
              {shown.map((x, i) => (
                <tr key={x.id} className="k-in-fade h-[60.28px] transition-colors hover:bg-row" style={{ "--d": `${280 + i * 40}ms` } as React.CSSProperties}>
                  <td className="ps-6">
                    <span className="flex items-center gap-3">
                      {x.avatar ? (
                        <Image src={`/assets/f/${x.avatar}.png`} alt="" width={40} height={40} className="size-10 flex-none rounded-[9.6px] object-cover" />
                      ) : (
                        <span className="k-chip size-10 border-0" style={{ borderRadius: "9.6px" }}>
                          <Ico h="2996b" size={25} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] leading-5 font-medium text-ink" translate="no">
                          {x.name}
                        </span>
                        <span className="mt-1 inline-flex h-[20.28px] items-center rounded-full border border-divider bg-pill px-2 text-[10px] leading-[14.3px] font-medium whitespace-nowrap text-ink">{x.role}</span>
                      </span>
                    </span>
                  </td>
                  <td className="ps-4">
                    <span className="flex items-center gap-2">
                      <Ico h="b4c86" size={16} />
                      <span dir="ltr" translate="no" className="truncate text-[14px] leading-5 text-ink">
                        {x.email}
                      </span>
                    </span>
                  </td>
                  <td className="ps-4">
                    <span className="flex items-center gap-2">
                      <Ico h="d5a6c" size={16} />
                      <span dir="ltr" translate="no" className={x.phone ? "text-[14px] leading-5 text-ink" : "text-[14px] leading-5 text-muted"}>
                        {x.phone || "—"}
                      </span>
                    </span>
                  </td>
                  <td className="ps-4 text-[14px] leading-5 text-ink tabular-nums">{x.created}</td>
                  <td className="ps-4">
                    <ActionsMenu label={`Open actions menu for ${x.name}`} items={menu(x)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Pager page={current} pages={pages} from={rows.length ? (current - 1) * PAGE + 1 : 0} to={Math.min(current * PAGE, rows.length)} total={rows.length} onPage={setPage} />

      {adding && (
        <FormDialog
          title="Add Coach"
          submit="Add Coach"
          onClose={() => setAdding(false)}
          fields={[
            { name: "first", label: "First Name", required: true },
            { name: "last", label: "Last Name", required: true },
            { name: "email", label: "Email", required: true, type: "email", placeholder: "name@example.com" },
            { name: "phone", label: "Phone" },
            { name: "role", label: "Role", required: true, options: ROLE_NAMES.filter((r) => r !== "Member"), placeholder: "Select an option" },
          ]}
          onSubmit={(v) => setAdded((a) => [{ id: `new-${Date.now()}`, name: `${v.first.trim()} ${v.last.trim()}`, role: v.role, email: v.email.trim(), phone: (v.phone ?? "").trim(), created: new Date().toLocaleDateString("en-US"), avatar: "" }, ...a])}
        />
      )}
      {removing && <FormDialog title={`Remove ${removing.name}?`} submit="Remove coach" fields={[]} onClose={() => setRemoving(null)} onSubmit={() => setGone((g) => [...g, removing.id])} />}
    </div>
  );
}

type Role = { name: string; guard: string; created: string; updated: string };
const seed = (name: string): Role => ({ name, guard: "web", created: "11/07/2026", updated: "11/07/2026" });
const ROLE_STATS = [
  { label: "Total Roles", icon: "51153", sub: "All roles in system", bars: STEP },
  { label: "Active Roles", icon: "2163e", sub: "Roles held by at least one coach", bars: STEP },
  { label: "Inactive Roles", icon: "179f8", sub: "Roles nobody holds", bars: [0.725, 0.725, 0.725, 0.725, 0.725, 0.725, 0.725] },
  { label: "Recently Added", icon: "f11ff", sub: "New roles (last 7 days)", bars: STEP },
];
const NO_ROLE_FILTERS = { name: "", guard: "", from: null as Date | null, to: null as Date | null };

export function CoachRoles() {
  const [rows, setRows] = useState<Role[]>(() => ROLE_NAMES.map(seed));
  const [draft, setDraft] = useState(NO_ROLE_FILTERS);
  const [f, setF] = useState(NO_ROLE_FILTERS);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Role | null>(null);

  const visible = useMemo(
    () =>
      rows.filter((r) => {
        const made = new Date(r.created);
        return has(r.name, f.name) && has(r.guard, f.guard) && (!f.from || made >= f.from) && (!f.to || made <= f.to);
      }),
    [rows, f],
  );
  const values = [rows.length, rows.length, 0, rows.length];

  return (
    <div className="flex flex-col gap-4">
      <div className="-mb-1">
        <AdminHeader crumbs={[CRUMB, { label: "Coach Roles" }]} title="Coach Roles" subtitle="Define and manage roles and permissions">
          <button type="button" onClick={() => setAdding(true)} className={smallCta}>
            <Ico h="8ffed" size={16} />
            Add Role
          </button>
        </AdminHeader>
      </div>

      <div className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
        {ROLE_STATS.map((s, i) => (
          <MiniStatCard key={s.label} label={s.label} icon={s.icon} value={[{ n: values[i] }]} sub={s.sub} bars={s.bars} delay={i * 60} />
        ))}
      </div>

      <div className="mt-2">
        <Card delay={200} className="!rounded-[16px] p-4" aria-label="Filter roles">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setF(draft);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <FilterInput id="r-name" label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Search role name" />
              <FilterInput id="r-guard" label="Guard Name" value={draft.guard} onChange={(v) => setDraft({ ...draft, guard: v })} placeholder="Search guard name" />
              <div>
                <FilterLabel htmlFor="r-from">Created From</FilterLabel>
                <DayField id="r-from" past iso value={draft.from} onChange={(d) => setDraft({ ...draft, from: d })} placeholder="Select start date" />
              </div>
              <div>
                <FilterLabel htmlFor="r-to">Created To</FilterLabel>
                <DayField id="r-to" past iso value={draft.to} onChange={(d) => setDraft({ ...draft, to: d })} placeholder="Select end date" />
              </div>
            </div>
            <div className="mt-4">
              <FilterButtons
                resetLabel="Reset"
                onReset={() => {
                  setDraft(NO_ROLE_FILTERS);
                  setF(NO_ROLE_FILTERS);
                }}
              />
            </div>
          </form>
        </Card>
      </div>

      <Card delay={260} className="!rounded-[16px] overflow-hidden" aria-label="Coach roles">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[820px] table-fixed border-collapse">
            <colgroup>
              {["33%", "22.2%", "22.4%", "22.4%"].map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-divider bg-[var(--thead)] text-[12px] leading-4 font-semibold tracking-[0.72px] text-muted uppercase">
                {["Role", "Created Date", "Updated Date", "Actions"].map((h, i) => (
                  <th key={h} scope="col" className={`h-10 ${i ? "ps-4" : "ps-6"} pe-2 text-start font-semibold`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="h-40 text-center text-[14px] text-muted">
                    No roles match these filters.
                  </td>
                </tr>
              )}
              {visible.map((r, i) => (
                <tr key={r.name} className="k-in-fade h-[54px] transition-colors hover:bg-row" style={{ "--d": `${280 + i * 40}ms` } as React.CSSProperties}>
                  <td className="ps-6">
                    <span className="flex items-center gap-3">
                      <span className="grid size-8 flex-none place-items-center rounded-[6px] bg-[var(--thead)]">
                        <Ico h={ROLE_ICONS[r.name] ?? "2be20"} size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] leading-5 font-medium text-ink">{r.name}</span>
                        <span className="mt-[2px] block text-[12px] leading-4 text-muted" translate="no">
                          {r.guard}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="ps-4 text-[14px] leading-5 text-ink tabular-nums">{r.created}</td>
                  <td className="ps-4 text-[14px] leading-5 text-ink tabular-nums">{r.updated}</td>
                  <td className="ps-4">
                    <ActionsMenu label={`Open actions menu for ${r.name}`} items={[{ label: "Delete role", danger: true, onSelect: () => setRemoving(r) }]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {adding && (
        <FormDialog
          title="Add Role"
          submit="Add Role"
          onClose={() => setAdding(false)}
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "guard", label: "Guard Name", placeholder: "web" },
          ]}
          onSubmit={(v) => setRows((all) => [...all, { ...seed(v.name.trim()), guard: (v.guard ?? "").trim() || "web", created: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }), updated: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) }])}
        />
      )}
      {removing && <FormDialog title={`Delete ${removing.name}?`} submit="Delete role" fields={[]} onClose={() => setRemoving(null)} onSubmit={() => setRows((all) => all.filter((x) => x.name !== removing.name))} />}
    </div>
  );
}
