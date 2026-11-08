"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Card, CountUp } from "@/components/ui/primitives";
import { Popover } from "@/components/ui/popover";
import { Ico, IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { Select } from "../settings/field-ui";
import { useProfile } from "../settings/profile-store";
import { coachCta, coachField, dayLabel, DayField, Pill, RequiredLabel } from "./coach-ui";
import { ASSIGNMENTS, CHECK_INS, WORKOUTS, type Assignment, type CheckIn, type Client } from "./data";

function StatCard({ icon, label, delay, children }: { icon: string; label: string; delay: number; children: React.ReactNode }) {
  return (
    <Card delay={delay} className="flex h-[92.75px] items-center gap-3 ps-4 pe-4" aria-label={label}>
      <IcoChip h={icon} size={42} iconSize={26} />
      <div className="min-w-0">
        {children}
        <p className="truncate text-[12.5px] leading-[18.75px] text-muted">{label}</p>
      </div>
    </Card>
  );
}

function AssignedWork({ client }: { client: Client }) {
  const [rows, setRows] = useState<Assignment[]>(ASSIGNMENTS);
  const [workout, setWorkout] = useState("");
  const [day, setDay] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const picked = WORKOUTS.find((w) => w.name === workout);
    if (!picked || !day) {
      setTried(true);
      return;
    }
    setRows((r) => [{ id: `n${Date.now()}`, name: picked.name, image: picked.image, date: dayLabel(day), status: "Upcoming" }, ...r]);
    setWorkout("");
    setDay(null);
    setNote("");
    setTried(false);
  };

  return (
    <Card delay={200} className="flex flex-col px-5 pt-5 pb-5" aria-label="Assigned work">
      <div className="flex items-center gap-[10px]">
        <IcoChip h="68f2a" size={36} iconSize={22} />
        <h2 className="min-w-0 flex-1 truncate text-[18px] leading-[27px] font-semibold text-ink">Assigned work</h2>
        <span className="inline-flex h-[26px] flex-none items-center rounded-full bg-pill px-3 text-[12px] leading-[18px] font-medium whitespace-nowrap text-body">{`${client.plan} of 4 done`}</span>
      </div>

      <ul className="mt-2">
        {rows.map((a, i) => (
          <li key={a.id} className={cn("flex h-[62px] items-center gap-3", i < rows.length - 1 && "border-b border-divider")}>
            <Image src={`/assets/f/${a.image}.png`} alt="" width={38} height={38} className="size-[38px] flex-none rounded-[9.12px] object-cover" />
            <div className="min-w-0 flex-1">
              <Link href="/coach/content/workouts" className="block truncate text-[14px] leading-[21px] font-medium text-ink transition-opacity hover:opacity-70">
                {a.name}
              </Link>
              <p className="mt-[2px] text-[12px] leading-[18px] text-muted">{a.date}</p>
            </div>
            <Pill>{a.status}</Pill>
            <button type="button" aria-label={`Remove ${a.name}`} onClick={() => setRows((r) => r.filter((x) => x.id !== a.id))} className="grid size-8 flex-none place-items-center rounded-full transition-colors hover:bg-row">
              <Ico h="2c0b2" size={15} />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} noValidate className="mt-auto pt-[15px]">
        <div className="grid gap-[14px] sm:grid-cols-2">
          <div>
            <RequiredLabel htmlFor="assign-workout">Workout</RequiredLabel>
            <div className="mt-2">
              <Select compact id="assign-workout" label="Workout" value={workout} placeholder="Choose a workout" options={WORKOUTS.map((w) => ({ value: w.name, label: w.name }))} onChange={setWorkout} />
            </div>
            {tried && !workout && <p role="alert" className="mt-1 text-[12px] leading-[18px] text-[#ef4444]">Choose a workout to assign.</p>}
          </div>
          <div>
            <RequiredLabel htmlFor="assign-day">Day</RequiredLabel>
            <div className="mt-2">
              <DayField id="assign-day" value={day} onChange={setDay} placeholder="Choose the day" />
            </div>
            {tried && !day && <p role="alert" className="mt-1 text-[12px] leading-[18px] text-[#ef4444]">Choose the day it is due.</p>}
          </div>
        </div>
        <label htmlFor="assign-note" className="mt-[13.5px] block text-[14px] leading-5 font-medium text-ink">
          Note
        </label>
        <textarea id="assign-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything they should keep in mind" className={cn(coachField, "mt-2 block h-[120px] resize-none py-2")} />
        <div className="mt-[14px] flex justify-end">
          <button type="submit" className={coachCta}>
            Assign
          </button>
        </div>
      </form>
    </Card>
  );
}

function CheckIns() {
  const [rows, setRows] = useState<CheckIn[]>(CHECK_INS);
  const [draft, setDraft] = useState("");
  const open = rows.find((r) => !r.reply);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!open || !text) return;
    setRows((r) => r.map((x) => (x.id === open.id ? { ...x, reply: text } : x)));
    setDraft("");
  };

  return (
    <Card delay={260} className="flex flex-col px-5 pt-5 pb-[34px]" aria-label="Weekly check-ins">
      <div className="flex items-center gap-[10px]">
        <IcoChip h="9bc4f" size={36} iconSize={22} />
        <h2 className="text-[18px] leading-[27px] font-semibold text-ink">Weekly check-ins</h2>
      </div>
      <ul className="mt-3">
        {rows.map((c, i) => (
          <li key={c.id} className={cn("pt-3 pb-[13px]", i < rows.length - 1 && "border-b border-divider")}>
            <p className="flex flex-wrap items-baseline gap-x-[9px]">
              <span className="text-[13.5px] leading-[20.25px] font-medium text-ink">{c.date}</span>
              <span className="text-[13px] leading-[19.5px] text-body">{`${c.weight} kg`}</span>
              <span className="text-[12.5px] leading-[18.75px] text-muted">{c.mood}</span>
            </p>
            <p className="mt-[5.5px] text-[13px] leading-[21.125px] text-body">{c.text}</p>
            {c.reply && <p className="mt-[6.5px] animate-[k-fade_0.3s_ease-out] rounded-[12px] bg-row px-[10px] py-[9.25px] text-[13px] leading-[19.5px] text-ink">{c.reply}</p>}
          </li>
        ))}
      </ul>
      {open && (
        <form onSubmit={send} className="mt-auto pt-3">
          <label htmlFor="checkin-reply" className="block text-[14px] leading-5 font-medium text-ink">
            {`Answer the week of ${open.date}`}
          </label>
          <textarea id="checkin-reply" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What they should change, and what to keep" className={cn(coachField, "mt-2 block h-[120px] resize-none py-2")} />
          <div className="mt-[10px] flex justify-end">
            <button type="submit" disabled={!draft.trim()} className={coachCta}>
              Send reply
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

type Msg = { id: string; mine: boolean; time: string; text: string; image?: string };

const THREAD: Msg[] = [
  { id: "m1", mine: false, time: "Oct 25, 6:02 AM", text: "Back after the holiday. Where do you want me to pick up?" },
  { id: "m2", mine: true, time: "Oct 25, 4:02 PM", text: "Two weeks back from where you left off, then straight on. Nothing is lost in ten days." },
];

const STAMP = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Who({ mine, client, photo }: { mine: boolean; client: Client; photo: string }) {
  const src = mine ? photo : `/assets/f/${client.avatar}.png`;
  return (
    <span className="relative block size-11 flex-none">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-11 rounded-[10.56px] object-cover" />
      ) : (
        <span className="k-chip size-11 border-0" style={{ borderRadius: "10.56px" }}>
          <Ico h="26894" size={27} />
        </span>
      )}
      <span aria-hidden className="absolute -end-px -bottom-px size-[11px] rounded-full border-2 border-[var(--panel)] bg-lime" />
    </span>
  );
}

function Messages({ client }: { client: Client }) {
  const { profile } = useProfile();
  const [thread, setThread] = useState<Msg[]>(THREAD);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const files = thread.filter((m) => m.image);

  const push = (text: string, image?: string) => {
    setThread((t) => [...t, { id: `n${Date.now()}`, mine: true, time: STAMP.format(new Date()), text, image }]);
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
  };
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    push(text);
    setDraft("");
  };
  const attach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f?.type.startsWith("image/")) push(f.name, URL.createObjectURL(f));
  };

  return (
    <Card delay={320} className="px-5 pt-7 pb-[30px] sm:px-7" aria-label="Messages">
      <div className="flex items-center gap-[14px]">
        <IcoChip h="2e5b2" size={54} iconSize={33} />
        <div className="min-w-0 flex-1">
          <h2 className="text-[28px] leading-[35px] font-semibold text-ink">Messages</h2>
          <p className="mt-1 text-[15px] leading-[22.5px] text-muted">Chat with your coach and share progress.</p>
        </div>
        <Popover
          offset={6}
          role="menu"
          label="Message options"
          className="w-[190px] py-[5px]"
          trigger={({ ref, open, toggle }) => (
            <button ref={ref} type="button" onClick={toggle} aria-expanded={open} aria-label="Message options" className="grid size-11 flex-none place-items-center self-start rounded-[12px] border border-page bg-row transition-[filter] hover:brightness-95 dark:hover:brightness-125">
              <Ico h="f8160" size={18} />
            </button>
          )}
        >
          {(close) => (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setThread([]);
                close();
              }}
              className="flex h-9 w-full items-center px-3 text-start text-[13.5px] text-[#ef4444] transition-colors hover:bg-[var(--menu-hover)]"
            >
              Clear conversation
            </button>
          )}
        </Popover>
      </div>

      <div className="mt-[18px] grid gap-4 wide:grid-cols-[minmax(0,741fr)_minmax(0,349fr)]">
        <div className="flex h-[534px] flex-col rounded-[18px] border border-divider bg-[var(--panel)] p-[18px]">
          <div ref={listRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto [scrollbar-width:thin]" aria-live="polite">
            {thread.length === 0 && <p className="grid h-full place-items-center text-[13px] leading-5 text-muted">No messages yet. Say hello to get started.</p>}
            {thread.map((m) => (
              <div key={m.id} className="animate-[k-fade_0.3s_ease-out]">
                <div className="flex items-center gap-3">
                  <Who mine={m.mine} client={client} photo={profile.photo} />
                  <span className="truncate text-[15px] leading-[22.5px] font-semibold text-ink" translate={m.mine ? undefined : "no"}>
                    {m.mine ? "You" : client.name}
                  </span>
                  <span aria-hidden className="size-[3px] flex-none rounded-full bg-muted" />
                  <span className="text-[13.5px] leading-[20.25px] whitespace-nowrap text-muted">{m.time}</span>
                </div>
                <div className="mt-[10px] flex items-end gap-2">
                  <div className={cn("w-fit", m.mine ? "max-w-[562px] rounded-[16px] border border-[rgb(var(--lime-rgb)/0.4)] px-[18px] py-4" : "max-w-[457px] rounded-[14px] border border-divider bg-row px-[18px] py-4")}>
                    {m.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt={m.text} className="mb-2 max-h-40 rounded-[10px] object-cover" />
                    )}
                    <p className="text-[16px] leading-[26px] text-ink">{m.text}</p>
                    {m.mine && (
                      <div className="mt-2 flex justify-end">
                        <Ico h="0b583" size={16} alt="Read" />
                      </div>
                    )}
                  </div>
                  {!m.mine && (
                    <button
                      type="button"
                      aria-label="React to this message"
                      aria-pressed={liked.includes(m.id)}
                      onClick={() => setLiked((l) => (l.includes(m.id) ? l.filter((x) => x !== m.id) : [...l, m.id]))}
                      className={cn("flex-none transition-[scale,opacity] hover:scale-110", liked.includes(m.id) ? "opacity-100" : "opacity-80")}
                    >
                      {liked.includes(m.id) ? <span className="text-[16px] leading-[18px]">👍</span> : <Ico h="3ff23" size={18} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-4 flex h-[140px] flex-none flex-col rounded-[18px] border border-divider bg-row p-[14px] pb-4"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="Write a message"
              placeholder="Write a message..."
              className="h-[50px] w-full resize-none bg-transparent text-[16px] leading-6 text-ink outline-none placeholder:text-muted"
            />
            <div className="mt-auto flex items-center justify-between">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={attach} />
              <button type="button" aria-label="Attach image" onClick={() => fileRef.current?.click()} className="grid size-[42px] place-items-center rounded-[12px] border border-page bg-[var(--field)] transition-[filter] hover:brightness-95 dark:hover:brightness-125">
                <Ico h="7c08f" size={16} />
              </button>
              <button type="submit" disabled={!draft.trim()} className={cn(coachCta, "h-12 w-[130px] text-[15px]")}>
                Send
                <Ico h="ea460" size={17} className="rtl:-scale-x-100" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex min-h-[320px] flex-col rounded-[18px] border border-divider bg-[var(--panel)] p-[26px]">
          {files.length ? (
            <ul className="grid flex-1 auto-rows-min grid-cols-3 gap-2 overflow-y-auto">
              {files.map((f) => (
                <li key={f.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.text} className="aspect-square w-full rounded-[10px] object-cover" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <IcoChip h="ef275" size={40} iconSize={25} tone="neutral" />
              <p className="mt-[11px] max-w-[263px] text-[13px] leading-[19.5px] text-muted">Nothing has been sent in this conversation yet.</p>
            </div>
          )}
          <div className="mt-5 flex gap-3 border-t border-divider pt-[19px]">
            <IcoChip h="cd0d9" size={32} iconSize={20} tone="neutral" />
            <div className="text-[13px] leading-[21.125px] text-muted">
              <p>Your messages and files are private and secure.</p>
              <p>Only you and your coach can see them.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ClientDetails({ client }: { client: Client }) {
  return (
    <div className="flex flex-col gap-[14px]">
      <Link href="/coach/clients" className="group flex w-fit items-center gap-[6px] text-[13px] leading-[19.5px] text-muted transition-colors hover:text-ink">
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5">
          <Ico h="c3bc6" size={15} />
        </span>
        All clients
      </Link>

      <Card className="flex min-h-[106px] items-center gap-4 p-5" aria-label={client.name}>
        <Image src={`/assets/f/${client.avatar}.png`} alt="" width={64} height={64} className="size-16 flex-none rounded-[15.36px] object-cover" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[24px] leading-9 font-semibold text-ink" translate="no">
            {client.name}
          </h1>
          <p className="mt-[3px] text-[13px] leading-[19.5px] text-muted">{`On your roster since ${client.since}`}</p>
        </div>
        <span className={cn("inline-flex h-[30px] flex-none items-center rounded-full px-3 text-[12px] leading-[18px] font-medium whitespace-nowrap", client.danger ? "bg-[rgba(239,66,66,0.12)] text-[#ef4444]" : "bg-[var(--success-bg)] text-[var(--success-ink)]")}>
          {client.danger ? "Gone quiet" : "On track"}
        </span>
      </Card>

      <div className="grid gap-[14px] md:grid-cols-3">
        <StatCard icon="189a2" label="Sessions this week" delay={60}>
          <CountUp value={client.sessions} delay={200} className="mb-[10px] block text-[24px] leading-6 font-semibold text-ink" />
        </StatCard>
        <StatCard icon="2cd11" label="Minutes this week" delay={120}>
          <CountUp value={client.minutes} delay={260} className="mb-[10px] block text-[24px] leading-6 font-semibold text-ink" />
        </StatCard>
        <StatCard icon="3dcda" label="Last session" delay={180}>
          <p className="mb-[5px] text-[15px] leading-[18.75px] font-semibold text-ink">{client.last}</p>
        </StatCard>
      </div>

      <div className="grid gap-[14px] xl:grid-cols-2">
        <AssignedWork client={client} />
        <CheckIns />
      </div>

      <Messages client={client} />
    </div>
  );
}
