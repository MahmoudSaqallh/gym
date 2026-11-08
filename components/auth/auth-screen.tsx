"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Reveal, ThemedImg } from "@/components/ui/primitives";
import { LanguageMenu } from "@/components/i18n/language-menu";
import { Ico } from "@/components/ui/ico";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TintImg } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { findAccount, HOME, useSession } from "@/lib/session";

type Role = "member" | "coach";

const A = (theme: "light" | "dark", name: string, ext = "svg") => `/assets/auth/${theme}/${name}.${ext}`;
const pair = (name: string) => ({ light: A("light", name), dark: A("dark", name) });

const ROLE_COPY: Record<Role, { email: string; dots: string }> = {
  member: { email: "member@example.com", dots: "••••••••••" },
  coach: { email: "headcoach@example.com", dots: "•••••••••" },
};

type Feature = { title: string; text: string; icon?: string; ico?: string };
type Slide = { image?: string; title: string; accent: string; rest: string; lines: [string, string]; features: Feature[] };

/* The design has five slide dots but only draws the first slide; the other four use the app's own artwork. */
const SLIDES: Slide[] = [
  {
    title: "Stronger Today",
    accent: "Better",
    rest: "Tomorrow",
    lines: ["Track your progress, stay consistent,", "and become the best version of yourself."],
    features: [
      { icon: "chart", title: "Track Progress", text: "Monitor your workouts and see real results." },
      { icon: "bolt-filled", title: "Stay Motivated", text: "Set goals, beat challenges, and keep moving forward." },
      { icon: "man-filled", title: "Join Community", text: "Connect with people who push you to be better." },
    ],
  },
  {
    image: "25f3b",
    title: "Train With Purpose",
    accent: "Every Session",
    rest: "Matters",
    lines: ["Follow programs built around your goals,", "and log every set as you go."],
    features: [
      { ico: "566e4", title: "Guided Programs", text: "Multi-week plans built around your goal." },
      { ico: "0916b", title: "Exercise Library", text: "Clear steps for every movement you train." },
      { ico: "3ce4a", title: "Weekly Schedule", text: "Know what is next and never miss a day." },
    ],
  },
  {
    image: "7f8c8",
    title: "Fuel Your Body",
    accent: "Feel",
    rest: "The Difference",
    lines: ["Plan your meals, hit your macros,", "and keep your energy steady all day."],
    features: [
      { ico: "d0cbd", title: "Meal Planner", text: "Plan what you eat for the whole week." },
      { ico: "dacb7", title: "Macro Tracking", text: "Hit your protein, carbs and fats every day." },
      { ico: "6aa2b", title: "Hydration Goals", text: "Stay on top of your water through the day." },
    ],
  },
  {
    image: "9ab28",
    title: "Rest Well",
    accent: "Rise",
    rest: "Stronger",
    lines: ["Understand your sleep and your vitals,", "so you know when you are ready to push."],
    features: [
      { ico: "23261", title: "Sleep Insights", text: "See how long and how well you slept." },
      { ico: "55456", title: "Health Vitals", text: "Follow your heart rate, energy and trends." },
      { ico: "41c3d", title: "Recovery Balance", text: "Know when to push and when to rest." },
    ],
  },
  {
    image: "1100b",
    title: "Never Train",
    accent: "Alone",
    rest: "Again",
    lines: ["Work with a coach, join a group,", "and celebrate every win together."],
    features: [
      { ico: "2163e", title: "Personal Coaching", text: "Get plans and feedback from your coach." },
      { ico: "e0d7a", title: "Group Challenges", text: "Compete with friends and climb the board." },
      { ico: "2e5b2", title: "Direct Messages", text: "Ask your coach anything, anytime." },
    ],
  },
];

const SLIDE_MS = 6000;
const SWIPE_PX = 50;

export function AuthScreen({ initialRole = "member" }: { initialRole?: Role }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: "var(--auth-base)" }}>
      <Backdrop />

      {/* Header */}
      <header className="relative z-10 flex h-[76px] items-center justify-between px-4 sm:px-[28px]">
        <Link href="/login" className="group flex items-center gap-3">
          <ThemedImg light={A("light", "logo")} size={40} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]" />
          <span className="text-[27px] leading-[27px] font-bold text-ink">Kinora</span>
        </Link>
        <div className="flex items-center gap-[10px]">
          <LanguageMenu
            variant="pill"
            className="flex h-10 items-center gap-2 rounded-[12px] border-[0.8px] ps-[14px] pe-[13px] text-[15px] font-semibold text-ink transition-colors hover:brightness-95 dark:hover:brightness-125"
            style={{ background: "var(--auth-control)", borderColor: "var(--auth-control-border)" }}
          />
          <ThemeToggle
            className="size-10 rounded-[12px] border-[0.8px]"
            style={{ background: "var(--auth-control)", borderColor: "var(--auth-control-border)" }}
            iconSize={20}
            lightIcon={A("light", "moon")}
            darkIcon={A("dark", "sun")}
          />
        </div>
      </header>

      {/* Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:py-[37.5px]">
        <Reveal className="w-full max-w-[1100px]">
          <div
            className="k-in relative grid w-full overflow-hidden rounded-[14px] shadow-[0px_24px_70px_-30px_rgba(0,0,0,0.7)] lg:h-[704.5px] lg:grid-cols-[585.97fr_514.03fr]"
            style={{ background: "var(--auth-card)" }}
          >
            <Hero />
            <SignInPanel initialRole={initialRole} />
            <div className="pointer-events-none absolute inset-0 rounded-[14px] border" style={{ borderColor: "var(--auth-card-border)" }} />
          </div>
        </Reveal>
      </main>

      <footer className="relative z-10 flex h-[44.5px] items-start justify-center text-[15px] leading-[22.5px] text-body">
        <span>©&nbsp;2026&nbsp;</span>
        <Link href="/login" className="text-auth-link underline decoration-from-font underline-offset-2 hover:opacity-80">
          Kinora
        </Link>
        <span>. All rights reserved.</span>
      </footer>
    </div>
  );
}

/* ───────────────────────── Background ───────────────────────── */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image src="/assets/auth/light/bg.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ background: "var(--auth-overlay)" }} />
      <div
        className="absolute inset-0 animate-[k-fade_1.6s_ease-out_both]"
        style={{ maskImage: `url(${A("light", "bg-pattern-mask")})`, maskSize: "100% 100%", WebkitMaskImage: `url(${A("light", "bg-pattern-mask")})`, WebkitMaskSize: "100% 100%" }}
      >
        <Image src={A("light", "bg-pattern", "png")} alt="" fill sizes="100vw" className="only-light object-cover" />
        <Image src={A("dark", "bg-pattern", "png")} alt="" fill sizes="100vw" className="only-dark object-cover" />
      </div>
      {/* bottom glow strip */}
      <div className="absolute start-[-12%] top-[89%] h-[17.7%] w-[124%] animate-[k-glow_6s_ease-in-out_infinite]">
        <div
          className="only-light absolute inset-0"
          style={{ maskImage: `url(${A("light", "bottom-glow-mask")})`, maskSize: "100% 100%", WebkitMaskImage: `url(${A("light", "bottom-glow-mask")})`, WebkitMaskSize: "100% 100%" }}
        >
          <Image src={A("light", "bottom-glow", "png")} alt="" fill sizes="124vw" className="k-hue object-cover" />
        </div>
        <div
          className="only-dark absolute inset-0"
          style={{ maskImage: `url(${A("dark", "bottom-glow-mask")})`, maskSize: "100% 100%", WebkitMaskImage: `url(${A("dark", "bottom-glow-mask")})`, WebkitMaskSize: "100% 100%" }}
        >
          <Image src={A("dark", "bottom-glow", "png")} alt="" fill sizes="124vw" className="k-hue object-cover" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Left hero ───────────────────────── */
function Hero() {
  const [index, setIndex] = useState(0);
  const [moved, setMoved] = useState(false);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    setMoved(true);
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  // Restarts on every change, so a manual pick always gets its full time on screen.
  useEffect(() => {
    if (paused) return;
    if (document.documentElement.classList.contains("no-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const forward = () => (document.documentElement.dir === "rtl" ? -1 : 1);
  const slide = SLIDES[index];
  const delay = (first: number, later: number) => ({ "--d": `${moved ? later : first}ms` }) as React.CSSProperties;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Kinora highlights"
      className="relative hidden h-full touch-pan-y overflow-hidden select-none lg:block"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={(e) => {
        startX.current = (e.target as HTMLElement).closest("button") ? null : e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = (e.clientX - startX.current) * forward();
        startX.current = null;
        if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="absolute inset-0 animate-[k-kenburns_2.8s_cubic-bezier(0.22,1,0.36,1)_both]">
        {SLIDES.map((sl, i) => (
          <div key={sl.title} aria-hidden className={cn("absolute inset-0 transition-[opacity,scale] duration-[900ms] ease-out", i === index ? "scale-100 opacity-100" : "scale-[1.06] opacity-0")}>
            {sl.image ? (
              <Image src={`/assets/f/${sl.image}.png`} alt="" fill sizes="(min-width:1024px) 586px, 0px" className="object-cover" />
            ) : (
              <>
                <Image src={A("light", "hero", "png")} alt="" fill priority sizes="(min-width:1024px) 586px, 0px" className="only-light object-cover" />
                <Image src={A("dark", "hero", "png")} alt="" fill priority sizes="(min-width:1024px) 586px, 0px" className="only-dark object-cover" />
              </>
            )}
          </div>
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4,6,5,0.4) 0%, rgba(4,6,5,0.28) 40%, rgba(3,5,4,0.86) 78%, rgba(3,5,4,0.95) 100%), linear-gradient(calc(var(--dir, 1) * 90deg), rgba(2,4,3,0.92) 0%, rgba(2,4,3,0.5) 40%, rgba(2,4,3,0.12) 70%, rgba(2,4,3,0) 100%)",
        }}
      />
      {/* grid overlay */}
      <div
        className="only-light absolute inset-0"
        style={{ maskImage: `url(${A("light", "hero-grid-mask")})`, maskSize: "100% 100%", WebkitMaskImage: `url(${A("light", "hero-grid-mask")})`, WebkitMaskSize: "100% 100%" }}
      >
        <Image src={A("light", "hero-grid", "png")} alt="" fill sizes="586px" className="object-cover" />
      </div>
      <div
        className="only-dark absolute inset-0"
        style={{ maskImage: `url(${A("dark", "hero-grid-mask")})`, maskSize: "100% 100%", WebkitMaskImage: `url(${A("dark", "hero-grid-mask")})`, WebkitMaskSize: "100% 100%" }}
      >
        <Image src={A("dark", "hero-grid", "png")} alt="" fill sizes="586px" className="object-cover" />
      </div>

      {/* pulse line — draws in, then glows */}
      <div className="absolute start-[104px] top-[105px] h-[30px] w-[110px] animate-[k-reveal-x_1.4s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]">
        <div className="size-full animate-[k-glow_2.4s_ease-in-out_2s_infinite]">
          <ThemedImg light={A("light", "pulse")} width={110} height={30} />
        </div>
      </div>

      {/* floating barbell */}
      <div className="k-float absolute start-[24.44px] top-[152.44px] size-[55.12px]">
        <div className="only-light absolute inset-y-0 start-[-4.9%] end-[-4.9%]">
          { }
          <TintImg src={A("light", "barbell")} className="block size-full" />
        </div>
        <div className="only-dark absolute inset-0 grid place-items-center opacity-65 blur-[2.5px]">
          { }
          <TintImg src={A("dark", "barbell")} width={50.5} height={32.15} className="block -rotate-32" />
        </div>
      </div>

      {/* Keyed so the entrance animations replay on each slide. */}
      <Fragment key={index}>
        <div className="absolute start-[33px] top-[248.9px] w-[460px]">
          <h1 className="text-[36px] leading-[38.88px] font-bold text-white">
            <span className="k-in-left block" style={delay(250, 0)}>
              {slide.title}
            </span>
            <span className="k-in-left block" style={delay(380, 80)}>
              <span className="text-[var(--cta)]">{slide.accent}</span> <span>{slide.rest}</span>
            </span>
          </h1>
          <p className="k-in mt-[11.8px] text-[15px] leading-[24px] whitespace-nowrap text-white/88" style={delay(520, 160)}>
            {slide.lines[0]}
            <br />
            {slide.lines[1]}
          </p>
        </div>

        <ul className="absolute start-[33px] top-[408.25px] flex flex-col gap-[16px]">
          {slide.features.map((f, i) => (
            <li key={f.title} className="k-in-left group flex gap-[14px]" style={delay(640 + i * 120, 220 + i * 70)}>
              <span
                className="grid size-[44px] flex-none place-items-center rounded-full border-[0.8px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]"
                style={{ borderColor: "var(--auth-feature-border)", background: "var(--chip-bg)" }}
              >
                {f.ico ? <Ico h={f.ico} size={27} /> : <ThemedImg {...pair(f.icon!)} size={27} />}
              </span>
              <span className="w-[200px]">
                <span className="block text-[15px] leading-[18.75px] font-semibold text-white">{f.title}</span>
                <span className="mt-[4px] block text-[15px] leading-[20.7px] text-white/82">{f.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Fragment>

      <div
        role="group"
        aria-label="Choose a slide"
        className="absolute start-[85.5px] top-[654px] flex items-center"
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          go(index + (e.key === "ArrowRight" ? 1 : -1) * forward());
        }}
      >
        {SLIDES.map((sl, i) => {
          const on = i === index;
          return (
            <button key={sl.title} type="button" aria-label={`Show slide ${i + 1}`} aria-current={on || undefined} onClick={() => go(i)} className="group/dot grid h-6 w-5 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-lime">
              <span className={cn("relative block rounded-full transition-[width,height,background-color] duration-300", on ? "size-[9px] bg-lime shadow-[0_0_6px_rgb(var(--lime-rgb)/0.2)]" : "size-[7px] bg-white/35 group-hover/dot:bg-white/70")}>
                {on && <span className="absolute inset-0 animate-[k-ping_1.8s_ease-out_infinite] rounded-full bg-lime" />}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── Right: sign-in form ───────────────────────── */
function SignInPanel({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(0);
  const [picked, setPicked] = useState<Role | null>(null);
  const [error, setError] = useState(false);
  const { signIn } = useSession();

  // Next keeps this route's state while it is hidden, so leaving it must clear the form:
  // otherwise logging out returns to a button stuck on "Signing in…" with the password still filled in.
  useEffect(
    () => () => {
      setRole(initialRole);
      setEmail("");
      setPassword("");
      setShowPw(false);
      setLoading(false);
      setPicked(null);
      setError(false);
    },
    [initialRole],
  );

  const copy = ROLE_COPY[role];

  const fillDemo = (r: Role) => {
    setRole(r);
    setPicked(r);
    setError(false);
    setEmail(ROLE_COPY[r].email);
    setPassword(r === "coach" ? "coach-demo" : "member-demo");
    setFlash((n) => n + 1);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const account = findAccount(email, password);
    if (!account) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    signIn(account);
    window.setTimeout(() => router.push(HOME[account]), 900);
  };

  return (
    <div
      className="relative flex flex-col items-center px-6 pb-8 pt-[35px] sm:px-[28px] lg:border-s-[0.8px]"
      style={{ background: "var(--auth-panel)", borderColor: "var(--auth-panel-border)" }}
    >
      {/* badge */}
      <div className="k-in-pop relative grid size-[98px] place-items-center rounded-full border-[0.8px] border-[rgb(var(--cta-rgb)/0.38)]" style={{ "--d": "150ms" } as React.CSSProperties}>
        <span className="absolute inset-0 animate-[k-ping_2.6s_ease-out_1.2s_infinite] rounded-full border border-[rgb(var(--cta-rgb)/0.45)]" />
        <ThemedImg light={A("light", "badge")} size={46} className="k-float" />
      </div>

      <h2 className="k-in mt-[9.25px] text-[30px] leading-[37.5px] font-bold text-ink" style={{ "--d": "220ms" } as React.CSSProperties}>
        Welcome Back
      </h2>
      <p className="k-in mt-2 text-[15px] leading-[22.5px] text-subtle" style={{ "--d": "280ms" } as React.CSSProperties}>
        Please sign in to continue
      </p>

      <form onSubmit={onSubmit} className="mt-[26.5px] w-full max-w-[452px]" noValidate>
        <div className="k-in" style={{ "--d": "340ms" } as React.CSSProperties}>
          <label htmlFor="email" className="block text-[14px] leading-[20px] font-semibold text-ink">
            Email Address
          </label>
          <Field key={`e${flash}`} flash={flash > 0} icon="mail">
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(false); }}
              placeholder={copy.email}
              className="h-full w-full bg-transparent ps-[49px] pe-4 text-[15px] text-ink outline-none placeholder:text-subtle"
            />
          </Field>
        </div>

        <div className="k-in mt-[19.5px]" style={{ "--d": "400ms" } as React.CSSProperties}>
          <label htmlFor="password" className="block text-[14px] leading-[20px] font-semibold text-ink">
            Password
          </label>
          <Field key={`p${flash}`} flash={flash > 0} icon="lock">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder={copy.dots}
              className="h-full w-full bg-transparent ps-[49px] pe-12 text-[15px] text-ink outline-none placeholder:text-subtle"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide the password" : "Show the password"}
              aria-pressed={showPw}
              className="absolute end-[12px] top-1/2 grid size-[20px] -translate-y-1/2 place-items-center transition-transform active:scale-90"
            >
              <span className={cn("transition-[opacity,scale] duration-300", showPw ? "scale-110 opacity-100" : "opacity-80")}>
                <ThemedImg {...pair("eye")} size={20} />
              </span>
            </button>
          </Field>
        </div>

        <div className="k-in mt-[20.5px] flex items-center justify-between" style={{ "--d": "460ms" } as React.CSSProperties}>
          <label className="flex cursor-pointer select-none items-center gap-[10px] text-[14.5px] leading-[21.75px] text-ink/90">
            <button
              type="button"
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember((v) => !v)}
              className={cn(
                "grid size-[20px] place-items-center rounded-[6px] border-[0.8px] transition-all duration-300",
                remember ? "scale-100 border-transparent bg-cta" : "bg-[color:var(--auth-input)]",
              )}
              style={remember ? undefined : { borderColor: "var(--auth-input-border)" }}
            >
              <span className={cn("transition-all duration-300", remember ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
                <ThemedImg light={A("light", "check")} size={14} />
              </span>
            </button>
            Remember me
          </label>
          <a href="#" className="text-[14.5px] leading-[21.75px] text-auth-link transition-opacity hover:opacity-75">
            Forgot your password?
          </a>
        </div>

        {error && (
          <p role="alert" className="mt-4 animate-[k-fade_0.25s_ease-out] rounded-[10px] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-[13px] leading-5 text-[#ef4444]">
            We couldn&apos;t sign you in with those details. Check them, or use a demo account below.
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="k-in k-shine mt-[28.25px] flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-cta text-[15.5px] font-semibold text-[var(--on-accent)] transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.985] disabled:cursor-wait"
          style={{ "--d": "520ms" } as React.CSSProperties}
        >
          {loading ? (
            <span className="size-[18px] animate-[k-spin_0.7s_linear_infinite] rounded-full border-2 border-[var(--on-accent)]/25 border-t-[var(--on-accent)]" />
          ) : (
            <ThemedImg light={A("light", "login")} size={21} />
          )}
          <span>{loading ? "Signing in…" : "Sign In"}</span>
        </button>

        <p className="k-in-fade mt-[23.25px] text-center text-[13px] leading-[19.5px] text-subtle" style={{ "--d": "600ms" } as React.CSSProperties}>
          Or try the demo as
        </p>
        <div className="k-in mt-[12.75px] grid grid-cols-2 gap-3" style={{ "--d": "660ms" } as React.CSSProperties}>
          <DemoButton icon="shield-check" label="Head Coach" active={picked === "coach"} onClick={() => fillDemo("coach")} />
          <DemoButton icon="user" label="Member" active={picked === "member"} onClick={() => fillDemo("member")} />
        </div>
      </form>

      <p className="k-in-fade mt-[32px] text-[15.5px] leading-[23.25px] text-ink/95" style={{ "--d": "740ms" } as React.CSSProperties}>
        Don&apos;t have an account?{" "}
        <a href="#" className="font-medium text-auth-link transition-opacity hover:opacity-75">
          Sign up
        </a>
      </p>
    </div>
  );
}

function Field({ icon, flash, children }: { icon: string; flash: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative mt-[10px] h-[46px] overflow-hidden rounded-[12px] border-[0.8px] transition-[border-color,box-shadow] duration-300 focus-within:border-lime focus-within:shadow-[0_0_0_4px_rgb(var(--lime-rgb)/0.18)]",
        flash && "animate-[k-flash_0.9s_ease-out]",
      )}
      style={{ background: "var(--auth-input)", borderColor: "var(--auth-input-border)" }}
    >
      <span className="pointer-events-none absolute start-[18px] top-1/2 -translate-y-1/2">
        <ThemedImg {...pair(icon)} size={20} />
      </span>
      {children}
    </div>
  );
}

function DemoButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-10 items-center justify-center gap-2 rounded-[12px] border-[0.8px] border-transparent text-[14.5px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--cta-rgb)/0.45)] active:translate-y-0",
        active && "border-[rgb(var(--cta-rgb)/0.45)]",
      )}
      style={{ background: "var(--auth-input)" }}
    >
      <ThemedImg {...pair(icon)} size={20} />
      {label}
    </button>
  );
}
