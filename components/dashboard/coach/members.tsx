"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/primitives";
import { Ico } from "@/components/ui/ico";
import { createValueStore } from "@/lib/set-store";
import { Select } from "../settings/field-ui";
import { MiniStatCard } from "../section-ui";
import { ActionsMenu, AdminHeader, DayField, FilterButtons, FilterInput, FilterLabel, FormDialog, Pager, smallCta, StatusBadge, type MenuItem } from "./admin-ui";
import { CLIENTS, slugOfName } from "./data";
import { COUNTRIES, DELETED_MEMBERS, MEMBERS, type Member } from "./members-data";

type Saved = { deleted: string[]; restored: string[]; created: Member[]; verified: string[] };
const EMPTY: Saved = { deleted: [], restored: [], created: [], verified: [] };
const useSaved = createValueStore("kinora-coach-members", JSON.stringify(EMPTY));

function useMembers() {
  const [raw, set] = useSaved();
  const saved = useMemo<Saved>(() => {
    try {
      return { ...EMPTY, ...(JSON.parse(raw) as Partial<Saved>) };
    } catch {
      return EMPTY;
    }
  }, [raw]);
  const everyone = useMemo(() => [...saved.created, ...MEMBERS, ...DELETED_MEMBERS].map((x) => (saved.verified.includes(x.id) ? { ...x, verified: true } : x)), [saved]);
  const isDeleted = (x: Member) => (DELETED_MEMBERS.some((d) => d.id === x.id) ? !saved.restored.includes(x.id) : saved.deleted.includes(x.id));
  const update = (patch: Partial<Saved>) => set(JSON.stringify({ ...saved, ...patch }));
  return {
    active: everyone.filter((x) => !isDeleted(x)),
    removed: everyone.filter(isDeleted),
    create: (x: Member) => update({ created: [x, ...saved.created] }),
    verify: (id: string) => update({ verified: [...saved.verified, id] }),
    remove: (x: Member) => (DELETED_MEMBERS.some((d) => d.id === x.id) ? update({ restored: saved.restored.filter((r) => r !== x.id) }) : update({ deleted: [...saved.deleted, x.id] })),
    restore: (x: Member) => (DELETED_MEMBERS.some((d) => d.id === x.id) ? update({ restored: [...saved.restored, x.id] }) : update({ deleted: saved.deleted.filter((r) => r !== x.id) })),
  };
}

const NO_FILTERS = { email: "", phone: "", country: "", username: "", first: "", last: "", status: "", from: null as Date | null, to: null as Date | null };
type Filters = typeof NO_FILTERS;
const has = (hay: string, needle: string) => hay.toLowerCase().includes(needle.trim().toLowerCase());

function matches(x: Member, f: Filters) {
  const [first, ...rest] = x.name.split(" ");
  const joined = new Date(x.joined);
  return (
    has(x.email, f.email) &&
    has(x.phone, f.phone) &&
    (!f.country || x.country === f.country) &&
    has(x.email.split("@")[0], f.username) &&
    has(first, f.first) &&
    has(rest.join(" "), f.last) &&
    (!f.status || x.verified === (f.status === "Verified")) &&
    (!f.from || joined >= f.from) &&
    (!f.to || joined <= f.to)
  );
}

function FiltersCard({ onApply }: { onApply: (f: Filters) => void }) {
  const [f, setF] = useState(NO_FILTERS);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v }));
  return (
    <Card delay={200} className="!rounded-[16px] p-4" aria-label="Filter members">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onApply(f);
        }}
        className="grid gap-x-4 gap-y-[15.5px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <FilterInput id="f-email" label="Email" value={f.email} onChange={(v) => set("email", v)} placeholder="Filter by email" />
        <FilterInput id="f-phone" label="Phone" value={f.phone} onChange={(v) => set("phone", v)} placeholder="Filter by phone" />
        <div>
          <FilterLabel htmlFor="f-country">Country</FilterLabel>
          <Select compact id="f-country" label="Country" value={f.country} placeholder="All countries" options={[{ value: "", label: "All countries" }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]} onChange={(v) => set("country", v)} />
        </div>
        <FilterInput id="f-username" label="Username" value={f.username} onChange={(v) => set("username", v)} placeholder="Filter by username" />
        <FilterInput id="f-first" label="First Name" value={f.first} onChange={(v) => set("first", v)} placeholder="Filter by first name" />
        <FilterInput id="f-last" label="Last Name" value={f.last} onChange={(v) => set("last", v)} placeholder="Filter by last name" />
        <div>
          <FilterLabel htmlFor="f-status">Verification</FilterLabel>
          <Select compact id="f-status" label="Verification" value={f.status} placeholder="Any status" options={[{ value: "", label: "Any status" }, { value: "Verified", label: "Verified" }, { value: "Unverified", label: "Unverified" }]} onChange={(v) => set("status", v)} />
        </div>
        <div>
          <FilterLabel htmlFor="f-from">From Date</FilterLabel>
          <DayField id="f-from" past iso value={f.from} onChange={(d) => set("from", d)} placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <FilterLabel htmlFor="f-to">To Date</FilterLabel>
          <DayField id="f-to" past iso value={f.to} onChange={(d) => set("to", d)} placeholder="YYYY-MM-DD" />
        </div>
        <FilterButtons
          onReset={() => {
            setF(NO_FILTERS);
            onApply(NO_FILTERS);
          }}
        />
      </form>
    </Card>
  );
}

const COLS = ["Name", "Email", "Phone", "Status", "Joined Date", "Actions"];
const WIDTHS = ["20.3%", "30.9%", "15.3%", "10.5%", "10.9%", "12.1%"];
const PAGE = 10;

function Table({ rows, menu }: { rows: Member[]; menu: (x: Member) => MenuItem[] }) {
  return (
    <Card delay={260} className="!rounded-[16px] overflow-hidden" aria-label="Members">
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[1040px] table-fixed border-collapse">
          <colgroup>
            {WIDTHS.map((w) => (
              <col key={w} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-divider bg-[var(--thead)]">
              {COLS.map((c, i) => (
                <th key={c} scope="col" className={`h-10 ${i ? "ps-4" : "ps-6"} pe-2 text-start text-[12px] leading-4 font-semibold tracking-[0.72px] text-muted uppercase`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="h-40 text-center text-[14px] text-muted">
                  No members match these filters.
                </td>
              </tr>
            )}
            {rows.map((x, i) => (
              <tr key={x.id} className="k-in-fade h-14 transition-colors hover:bg-row" style={{ "--d": `${280 + i * 40}ms` } as React.CSSProperties}>
                <td className="ps-6">
                  <span className="flex items-center gap-3">
                    {x.avatar ? (
                      <Image src={`/assets/f/${x.avatar}.png`} alt="" width={40} height={40} className="size-10 flex-none rounded-[9.6px] object-cover" />
                    ) : (
                      <span className="k-chip size-10 border-0" style={{ borderRadius: "9.6px" }}>
                        <Ico h="2996b" size={25} />
                      </span>
                    )}
                    <span className="truncate text-[14px] leading-5 font-medium text-ink" translate="no">
                      {x.name}
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
                    <span dir="ltr" translate="no" className="text-[14px] leading-5 text-ink">
                      {x.phone || "—"}
                    </span>
                  </span>
                </td>
                <td className="ps-4">
                  <StatusBadge ok={x.verified}>{x.verified ? "Verified" : "Unverified"}</StatusBadge>
                </td>
                <td className="ps-4 text-[14px] leading-5 text-ink tabular-nums">{x.joined}</td>
                <td className="ps-4">
                  <ActionsMenu label={`Open actions menu for ${x.name}`} items={menu(x)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const STATS = [
  { label: "Total Members", icon: "2163e", sub: "on the platform", bars: [0.45, 0.45, 0.52, 0.6, 0.75, 0.92, 1] },
  { label: "Verified Members", icon: "67f16", sub: "address confirmed", bars: [0.45, 0.45, 0.505, 0.56, 0.725, 0.89, 1] },
  { label: "Unverified Members", icon: "e75de", sub: "not confirmed", bars: [0.45, 0.45, 0.56, 0.78, 0.89, 1, 1] },
  { label: "New This Week", icon: "36a7f", sub: "joined in 7 days", bars: [0.45, 0.45, 0.685, 0.765, 1, 1, 0.765] },
];

export function CoachMembers({ view }: { view: "all" | "deleted" }) {
  const store = useMembers();
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const deleted = view === "deleted";

  const source = deleted ? store.removed : store.active;
  const rows = source.filter((x) => matches(x, filters));
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);
  const verified = store.active.filter((x) => x.verified).length;
  const values = [store.active.length, verified, store.active.length - verified, 6 + store.active.filter((x) => x.id.startsWith("new:")).length];

  const menu = (x: Member): MenuItem[] => {
    if (deleted) return [{ label: "Restore member", onSelect: () => store.restore(x) }];
    const onRoster = CLIENTS.some((c) => c.slug === slugOfName(x.name));
    return [
      ...(onRoster ? [{ label: "Open client", href: `/coach/clients/${slugOfName(x.name)}` }] : []),
      ...(x.verified ? [] : [{ label: "Mark as verified", onSelect: () => store.verify(x.id) }]),
      { label: "Delete member", danger: true, onSelect: () => store.remove(x) },
    ];
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <AdminHeader
          crumbs={[{ label: "Dashboard", href: "/coach" }, { label: "Members", href: "/coach/members" }, { label: deleted ? "Deleted Members" : "All Members" }]}
          title={deleted ? "Deleted Members" : "All Members"}
          subtitle={deleted ? "Manage deleted members and restore accounts" : "Manage platform members and accounts"}
        >
          {!deleted && (
            <button type="button" onClick={() => setCreating(true)} className={smallCta}>
              <Ico h="8ffed" size={16} />
              Create Member
            </button>
          )}
        </AdminHeader>
      </div>

      {deleted ? (
        <div aria-hidden className="hidden h-24 xl:block" />
      ) : (
        <div className="grid gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <MiniStatCard key={s.label} label={s.label} icon={s.icon} value={[{ n: values[i] }]} sub={s.sub} bars={s.bars} delay={i * 60} />
          ))}
        </div>
      )}

      <FiltersCard
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
      <Table rows={shown} menu={menu} />
      <Pager page={current} pages={pages} from={rows.length ? (current - 1) * PAGE + 1 : 0} to={Math.min(current * PAGE, rows.length)} total={rows.length} onPage={setPage} />

      {creating && (
        <FormDialog
          title="Create Member"
          submit="Create Member"
          onClose={() => setCreating(false)}
          fields={[
            { name: "first", label: "First Name", required: true, placeholder: "Sara" },
            { name: "last", label: "Last Name", required: true, placeholder: "Ali" },
            { name: "email", label: "Email", required: true, type: "email", placeholder: "name@example.com" },
            { name: "phone", label: "Phone", placeholder: "+966500000000" },
            { name: "country", label: "Country", options: COUNTRIES, placeholder: "All countries" },
          ]}
          onSubmit={(v) =>
            store.create({
              id: `new:${v.email}:${Date.now()}`,
              name: `${v.first.trim()} ${v.last.trim()}`,
              email: v.email.trim(),
              phone: (v.phone ?? "").trim(),
              verified: false,
              joined: new Date().toLocaleDateString("en-US"),
              avatar: "",
              country: v.country ?? "",
            })
          }
        />
      )}
    </div>
  );
}
