"use client";

import Link from "next/link";
import { useShell } from "../shell-context";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Card } from "@/components/ui/primitives";
import { IcoChip } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { createSetStore } from "@/lib/set-store";
import { PageHeader } from "../section-ui";
import { AppSettings } from "./app-settings";
import { Field, Glyph, ghostButton, HeadChip, inputClass, primaryButton, SectionHead, Select } from "./field-ui";
import { type Profile, useProfile } from "./profile-store";
import { Switch } from "./settings";

const TABS = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "app", label: "App Settings", icon: "gear" },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* The tab lives in the URL hash so Settings rows can deep-link to it and Back works. */
const subscribeHash = (l: () => void) => {
  window.addEventListener("hashchange", l);
  return () => window.removeEventListener("hashchange", l);
};
const readHash = (): TabId => {
  const h = window.location.hash.slice(1);
  return TABS.some((t) => t.id === h) ? (h as TabId) : "profile";
};

/* ---------- profile ---------- */

const GENDERS = [
  { value: "", label: "Prefer not to say" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

type Errors = Partial<Record<keyof Profile, string>>;

function validateProfile(p: Profile): Errors {
  const e: Errors = {};
  if (p.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) e.email = "Enter an email like name@example.com.";
  if (p.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(p.phone.trim())) e.phone = "Enter a phone number with digits only.";
  const height = Number(p.height);
  if (p.height.trim() && !(height >= 100 && height <= 250)) e.height = "Enter a height from 100 to 250 cm.";
  const weight = Number(p.weight);
  if (p.weight.trim() && !(weight >= 30 && weight <= 300)) e.weight = "Enter a weight from 30 to 300 kg.";
  return e;
}

async function toThumbnail(file: File) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 160;
  canvas.getContext("2d")!.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 160, 160);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

function ProfileForm({ saved, onSave }: { saved: Profile; onSave: (p: Profile) => void }) {
  const [form, setForm] = useState(saved);
  const [touched, setTouched] = useState<Partial<Record<keyof Profile, boolean>>>({});
  const [photoError, setPhotoError] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const errors = validateProfile(form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const shown = (k: keyof Profile) => (touched[k] ? errors[k] : undefined);
  const set = (k: keyof Profile, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const text = (k: keyof Profile, extra?: React.InputHTMLAttributes<HTMLInputElement>) => ({
    id: `profile-${k}`,
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    "aria-invalid": !!shown(k),
    "aria-describedby": shown(k) ? `profile-${k}-error` : undefined,
    className: cn(inputClass, shown(k) && "border-[#ef4444] focus:border-[#ef4444]"),
    ...extra,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad = Object.keys(errors) as (keyof Profile)[];
    if (bad.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(bad.map((k) => [k, true])) }));
      document.getElementById(`profile-${bad[0]}`)?.focus();
      return;
    }
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() });
  };

  return (
    <form onSubmit={submit} noValidate className="mt-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-[72px] flex-none place-items-center overflow-hidden rounded-[17px]" style={{ background: "var(--chip-bg)" }}>
          {form.photo ? (
            // Member-supplied data URL, which next/image cannot optimise.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.photo} alt="" className="size-full animate-[k-fade_0.3s_ease-out] object-cover" />
          ) : (
            <Glyph name="user" size={36} className="text-accent-ink" />
          )}
        </span>
        <div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => file.current?.click()} className={ghostButton}>
              <Glyph name="camera" size={16} />
              Change Photo
            </button>
            {form.photo && (
              <button type="button" onClick={() => set("photo", "")} className={cn(ghostButton, "text-[#ef4444]")}>
                Remove Photo
              </button>
            )}
          </div>
          <p className={cn("mt-[6px] text-[12px] leading-[18px]", photoError ? "text-[#ef4444]" : "text-muted")} role={photoError ? "alert" : undefined}>
            {photoError ? "We couldn't read that image. Try a JPG or PNG." : "JPG or PNG. A square photo works best."}
          </p>
        </div>
        <input
          ref={file}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try {
              set("photo", await toThumbnail(f));
              setPhotoError(false);
            } catch {
              setPhotoError(true);
            }
          }}
        />
      </div>

      <div className="mt-6 grid gap-x-4 gap-y-4 md:grid-cols-2">
        <Field id="profile-name" label="Full Name" error={shown("name")}>
          <input {...text("name", { autoComplete: "name" })} />
        </Field>
        <Field id="profile-email" label="Email Address" error={shown("email")}>
          <input {...text("email", { type: "email", autoComplete: "email", dir: "ltr" })} />
        </Field>
        <Field id="profile-phone" label="Phone Number" error={shown("phone")}>
          <input {...text("phone", { type: "tel", autoComplete: "tel", dir: "ltr", placeholder: "+966 5X XXX XXXX" })} />
        </Field>
        <Field id="profile-birthDate" label="Date of Birth">
          <input {...text("birthDate", { type: "date", autoComplete: "bday" })} />
        </Field>
        <Field id="profile-gender" label="Gender">
          <Select id="profile-gender" label="Gender" value={form.gender} options={GENDERS} placeholder="Prefer not to say" onChange={(v) => set("gender", v)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field id="profile-height" label="Height (cm)" error={shown("height")}>
            <input {...text("height", { inputMode: "decimal" })} />
          </Field>
          <Field id="profile-weight" label="Weight (kg)" error={shown("weight")}>
            <input {...text("weight", { inputMode: "decimal" })} />
          </Field>
        </div>
        <Field id="profile-bio" label="Bio" className="md:col-span-2">
          <textarea
            id="profile-bio"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={3}
            maxLength={240}
            placeholder="A line or two about your training."
            className={cn(inputClass, "h-auto resize-none py-[10px] leading-[22px]")}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-divider pt-4">
        <button type="button" disabled={!dirty} onClick={() => { setForm(saved); setTouched({}); }} className={ghostButton}>
          Discard Changes
        </button>
        <button type="submit" className={primaryButton}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function useFlash() {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = () => {
    setOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), 2600);
  };
  return [on, flash] as const;
}

function Saved({ children }: { children: React.ReactNode }) {
  return (
    <span role="status" className="animate-[k-pop_0.35s_ease-out] rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-3 py-[6px] text-[12.5px] font-medium text-accent-ink">
      {children}
    </span>
  );
}

function ProfileTab() {
  const { profile, raw, save } = useProfile();
  const [saved, flash] = useFlash();
  return (
    <Card delay={0} className="p-5 sm:p-6" aria-label="Profile">
      <SectionHead chip={<HeadChip icon="74e2f" />} title="Personal Information" sub="Update your name, email, and personal details">
        {saved && <Saved>Saved ✓</Saved>}
      </SectionHead>
      <ProfileForm
        key={raw}
        saved={profile}
        onSave={(p) => {
          save(p);
          flash();
        }}
      />
    </Card>
  );
}

/* ---------- security ---------- */

const useSecurity = createSetStore("kinora-security-on", ["login-alerts"]);

const INITIAL_SESSIONS = [
  { id: "this", device: "Chrome on Windows", place: "Current session", current: true },
  { id: "iphone", device: "Kinora for iPhone", place: "Last active 2 hours ago", current: false },
  { id: "tablet", device: "Safari on iPad", place: "Last active 3 days ago", current: false },
];

function strength(pw: string) {
  return [pw.length >= 8, /[a-z]/.test(pw) && /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
}
const STRENGTH = ["Too weak", "Weak", "Fair", "Good", "Strong"];

function PasswordField({ id, label, value, onChange, onBlur, error, autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; onBlur: () => void; error?: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          dir="ltr"
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={!!error}
          className={cn(inputClass, "pe-11 rtl:text-right", error && "border-[#ef4444] focus:border-[#ef4444]")}
        />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide the password" : "Show the password"} className="absolute inset-y-0 end-0 grid w-11 place-items-center text-muted transition-colors hover:text-ink">
          <Glyph name={show ? "eyeOff" : "eye"} size={18} />
        </button>
      </div>
    </Field>
  );
}

const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

function PasswordCard() {
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [touched, setTouched] = useState<Partial<Record<keyof typeof EMPTY_PASSWORDS, boolean>>>({});
  const [saved, flash] = useFlash();

  const errors: Partial<Record<keyof typeof EMPTY_PASSWORDS, string>> = {};
  if (!form.current) errors.current = "Enter your current password.";
  if (form.next.length < 8 || !/[A-Za-z]/.test(form.next) || !/\d/.test(form.next)) errors.next = "Use at least 8 characters with a letter and a number.";
  else if (form.next === form.current) errors.next = "Choose a password you aren't using now.";
  if (form.confirm !== form.next || !form.confirm) errors.confirm = "The two passwords don't match.";

  const score = strength(form.next);
  const field = (k: keyof typeof EMPTY_PASSWORDS) => ({
    value: form[k],
    onChange: (v: string) => setForm((f) => ({ ...f, [k]: v })),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    error: touched[k] ? errors[k] : undefined,
  });

  return (
    <Card delay={0} className="p-5 sm:p-6" aria-label="Change Password">
      <SectionHead chip={<HeadChip icon="2fb59" />} title="Change Password" sub="Update your password regularly">
        {saved && <Saved>Password updated ✓</Saved>}
      </SectionHead>
      <form
        noValidate
        className="mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (Object.keys(errors).length) {
            setTouched({ current: true, next: true, confirm: true });
            document.getElementById(`pw-${Object.keys(errors)[0]}`)?.focus();
            return;
          }
          setForm(EMPTY_PASSWORDS);
          setTouched({});
          flash();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <PasswordField id="pw-current" label="Current Password" autoComplete="current-password" {...field("current")} />
          <div className="hidden md:block" />
          <div>
            <PasswordField id="pw-next" label="New Password" autoComplete="new-password" {...field("next")} />
            {form.next && (
              <div className="mt-2 flex items-center gap-2" aria-live="polite">
                <span className="flex flex-1 gap-1" aria-hidden>
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={cn("h-[5px] flex-1 rounded-full transition-colors duration-300", n <= score ? "bg-lime" : "bg-track-2")} />
                  ))}
                </span>
                <span className="text-[12px] text-muted">{STRENGTH[score]}</span>
              </div>
            )}
          </div>
          <PasswordField id="pw-confirm" label="Confirm New Password" autoComplete="new-password" {...field("confirm")} />
        </div>
        <div className="mt-6 flex justify-end border-t border-divider pt-4">
          <button type="submit" className={primaryButton}>
            Update Password
          </button>
        </div>
      </form>
    </Card>
  );
}

function SecurityToggle({ id, icon, title, sub }: { id: string; icon: string; title: string; sub: string }) {
  const { has, toggle } = useSecurity();
  return (
    <div className="flex items-center gap-3 py-[10px]">
      <IcoChip h={icon} size={36} iconSize={22} />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] leading-[18px] font-medium text-ink">{title}</span>
        <span className="mt-[2px] block text-[12px] leading-[18px] text-muted">{sub}</span>
      </span>
      <Switch on={has(id)} label={title} onToggle={() => toggle(id)} />
    </div>
  );
}

function SecurityTab() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const others = sessions.filter((s) => !s.current);
  return (
    <div className="flex flex-col gap-[14px]">
      <PasswordCard />
      <Card delay={80} className="p-5 sm:p-6" aria-label="Sign-in Protection">
        <SectionHead chip={<HeadChip icon="5e505" />} title="Sign-in Protection" sub="Extra checks that keep other people out of your account" />
        <div className="mt-3 divide-y divide-divider">
          <SecurityToggle id="two-factor" icon="1eeb1" title="Two-Factor Authentication" sub="Ask for a code from your phone at every sign-in" />
          <SecurityToggle id="login-alerts" icon="52a09" title="Sign-in Alerts" sub="Email me when a new device signs in" />
        </div>
      </Card>
      <Card delay={140} className="p-5 sm:p-6" aria-label="Active Sessions">
        <SectionHead chip={<HeadChip icon="b3a40" />} title="Active Sessions" sub="Devices signed in to this account">
          {others.length > 0 && (
            <button type="button" onClick={() => setSessions((s) => s.filter((x) => x.current))} className={ghostButton}>
              Sign Out Other Devices
            </button>
          )}
        </SectionHead>
        <ul className="mt-3 divide-y divide-divider">
          {sessions.map((s) => (
            <li key={s.id} className="flex animate-[k-fade_0.3s_ease-out] items-center gap-3 py-[10px]">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] leading-[18px] font-medium text-ink">{s.device}</span>
                <span className="mt-[2px] block text-[12px] leading-[18px] text-muted">{s.place}</span>
              </span>
              {s.current ? (
                <span className="rounded-full bg-[rgb(var(--lime-rgb)/0.16)] px-[10px] py-[3px] text-[11.5px] font-medium text-accent-ink">This Device</span>
              ) : (
                <button type="button" onClick={() => setSessions((list) => list.filter((x) => x.id !== s.id))} className="h-8 rounded-full px-3 text-[12.5px] font-medium text-[#ef4444] transition-colors hover:bg-[rgba(239,68,68,0.1)]">
                  Sign Out
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ---------- page ---------- */

export function EditProfile() {
  const { role } = useShell();
  const tab = useSyncExternalStore(subscribeHash, readHash, () => "profile" as TabId);

  return (
    <div className="flex flex-col gap-[14px]">
      <PageHeader title="Edit Profile" subtitle="Manage your account settings and preferences">
        <Link href={role === "coach" ? "/coach/settings" : "/dashboard/settings"} className={ghostButton}>
          Back to Settings
        </Link>
      </PageHeader>

      <div className="grid items-start gap-[14px] lg:grid-cols-[247px_minmax(0,1fr)]">
        <Card delay={0} className="p-[10px] lg:sticky lg:top-[90px]" aria-label="Edit profile sections">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col" role="tablist" aria-orientation="vertical">
            {TABS.map((t) => {
              const on = t.id === tab;
              return (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  role="tab"
                  aria-selected={on}
                  className={cn(
                    "relative flex h-10 flex-none items-center gap-[10px] rounded-[12px] px-3 text-[14px] whitespace-nowrap transition-colors duration-300 lg:w-full",
                    on ? "font-medium text-accent-ink" : "text-body hover:bg-[var(--nav-hover)]",
                  )}
                  style={on ? { background: "var(--nav-active-bg)" } : undefined}
                >
                  {on && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[12px] border" style={{ borderColor: "var(--nav-active-border)" }} />}
                  <Glyph name={t.icon} size={18} />
                  {t.label}
                </a>
              );
            })}
          </div>
        </Card>

        <div key={tab} className="min-w-0 animate-[k-fade_0.35s_ease-out]">
          {tab === "profile" && <ProfileTab />}
          {tab === "security" && <SecurityTab />}
          {tab === "app" && <AppSettings />}
        </div>
      </div>
    </div>
  );
}
