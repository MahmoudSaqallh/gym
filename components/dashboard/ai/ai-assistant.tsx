"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/i18n/language-provider";
import { Ico } from "@/components/ui/ico";
import { cn } from "@/lib/cn";
import { useShell } from "../shell-context";

type Msg = { id: number; role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  { icon: "0943e", dark: "d8e33", label: "3 glasses behind", prompt: "How do I catch up on hydration today?" },
  { icon: "0dca3", dark: "6f5f9", label: "4 exercises left today", prompt: "What exercises are left in today's workout?" },
];

const COACH_SUGGESTIONS = [
  { icon: "8a64d", dark: undefined, label: "3 check-ins need a reply", prompt: "Which check-ins need a reply?" },
  { icon: "fbbf8", dark: undefined, label: "3 clients have gone quiet", prompt: "Which clients have gone quiet?" },
];

function coachReply(q: string) {
  const s = q.toLowerCase();
  if (/check|reply|متابع|رد/.test(s)) return "David Brown, Sarah Williams and Mike Johnson are waiting on a reply. David's week was strong, so start with him: his bench moved up 2.5 kg.";
  if (/quiet|gone|inactive|هادئ|منقطع|غائب/.test(s)) return "David Brown has never finished a session, Mike Johnson last trained 14 days ago and John Doe 10 days ago. A short message today usually brings them back.";
  if (/roster|client|عميل|عملاء/.test(s)) return "You have 6 clients. 3 trained this week for 6 sessions in total, and 3 have gone quiet.";
  return "You have 6 clients, 6 sessions finished this week and 6 check-ins waiting for a reply. Ask me about your roster, check-ins or quiet clients.";
}

/* Demo replies grounded in the dashboard's sample data (no model is called). */
function reply(q: string) {
  const s = q.toLowerCase();
  if (/water|hydrat|glass|drink|ماء|مياه|ترطيب|أكواب|شرب/.test(s))
    return "You're at 1.8 L of your 2.5 L goal (72%). That's about 3 glasses behind — try one glass now, one with your next meal and one after your workout.";
  if (/exercise|workout|train|left|تمرين|تمارين|تدريب/.test(s))
    return "Next up is Upper Body Strength (45 min) today. You have 4 exercises left — keep rest at 60–90 s between sets to stay on pace.";
  if (/sleep|rest|recover|نوم|راحة|تعافي/.test(s))
    return "You're averaging 7h 24m of sleep with a quality score of 82. Recovery is at 91% — a great day to push intensity.";
  if (/calor|macro|protein|carb|eat|food|nutrition|سعر|بروتين|كربوهيدرات|أكل|طعام|تغذية/.test(s))
    return "You've logged 1,841 kcal: 39% carbs (180 g), 31% protein (143 g) and 30% fats (61 g). Protein is on track for muscle recovery.";
  if (/step|walk|خطوات|مشي/.test(s)) return "12,845 steps so far — 85% of your 15,000 goal. A 20-minute walk closes the gap.";
  return "Your resting heart rate is 72 BPM, energy is at 86% and you're on a 12-day streak. Ask me about training, nutrition, sleep or progress.";
}

export function AiAssistant() {
  const { role } = useShell();
  const coach = role === "coach";
  const suggestions = coach ? COACH_SUGGESTIONS : SUGGESTIONS;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [credits, setCredits] = useState(5);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing || credits <= 0) return;
    setMsgs((m) => [...m, { id: ++idRef.current, role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setCredits((c) => c - 1);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: ++idRef.current, role: "ai", text: (coach ? coachReply : reply)(t) }]);
      setTyping(false);
    }, 1100);
  };

  const empty = msgs.length === 0;

  return (
    // Full-height chat surface: the negative margin cancels the shell's bottom padding, as in Figma.
    <div className="relative -mb-10 flex min-h-[calc(100vh-160px)] flex-col lg:-mb-[73px]" data-shown="true">
      {/* toolbar */}
      <div className="flex h-12 flex-none items-start justify-between gap-3 px-1 pt-1 sm:px-4">
        <button
          type="button"
          className="group flex h-10 items-center rounded-[12px] px-3 text-[14px] leading-5 text-ink transition-colors hover:bg-[var(--nav-hover)]"
        >
          <Ico h="cf47a" dark="66f3b" size={16} className="me-2 transition-transform duration-500 group-hover:rotate-90" />
          Gemini 3.6 Flash
          <Ico h="834d0" dark="366af" size={16} className="transition-transform group-hover:translate-y-0.5" />
        </button>
        <div className="flex items-center gap-2 pt-1">
          <span className="flex h-8 items-center gap-2 rounded-[12px] bg-lime ps-3 pe-3 text-[12px] leading-4 font-medium text-[var(--on-accent)]">
            <Ico h="fe4d8" size={16} />
            <span className="hidden sm:inline">Demo API key</span>
            <span key={credits} className="opacity-80 animate-[k-pop_0.4s_ease-out]">
              {credits}
            </span>
          </span>
          <button type="button" aria-label="Chat History" className="grid size-8 place-items-center rounded-[12px] border transition-transform hover:-rotate-45 active:scale-90" style={{ background: "var(--ghost-bg)", borderColor: "var(--ghost-border)" }}>
            <Ico h="38ea5" dark="f0021" size={16} />
          </button>
          <button
            type="button"
            aria-label="New Chat"
            onClick={() => {
              setMsgs([]);
              setTyping(false);
            }}
            className="grid size-8 place-items-center rounded-[12px] border transition-transform hover:rotate-90 active:scale-90"
            style={{ background: "var(--ghost-bg)", borderColor: "var(--ghost-border)" }}
          >
            <Ico h="6c679" dark="9d609" size={16} />
          </button>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col items-center px-2", empty ? "justify-center pb-6" : "justify-end pb-6")}>
        {empty ? (
          <Hero />
        ) : (
          <div className="flex w-full max-w-[650px] flex-1 flex-col justify-end gap-3 pt-6" aria-live="polite">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-[18px] px-4 py-3 text-[14.5px] leading-[22px] animate-[k-rise_0.45s_cubic-bezier(0.22,1,0.36,1)_both]",
                  m.role === "user" ? "self-end rounded-ee-[6px] bg-lime text-[var(--on-accent)]" : "self-start rounded-es-[6px] text-ink",
                )}
                style={m.role === "ai" ? { background: "var(--pop-bg)" } : undefined}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 self-start rounded-[18px] rounded-es-[6px] px-4 py-4" style={{ background: "var(--pop-bg)" }} aria-label="Kinora is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2 rounded-full bg-lime animate-[k-float_0.9s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}

        {/* composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className={cn(
            "k-in-fade relative flex h-[71.5px] w-full max-w-[650px] flex-none items-center rounded-[20.8px] ps-[26px] pe-[26px] transition-shadow duration-300 focus-within:shadow-[0_0_0_3px_rgb(var(--lime-rgb)/0.25)]",
            empty ? "mt-8" : "mt-4",
          )}
          style={{ background: "var(--pop-bg)", "--d": "700ms" } as React.CSSProperties}
        >
          <button type="button" aria-label="Attach image" className="grid size-[41.6px] flex-none place-items-center rounded-full transition-transform hover:-rotate-12 hover:bg-[var(--nav-hover)]">
            <Ico h="2e5b8" dark="e5df3" size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder={credits > 0 ? "Ask me anything..." : "Demo limit reached — start a new chat to continue"}
            aria-label="Message Kinora"
            className="h-[28px] min-w-0 flex-1 resize-none bg-transparent text-[16px] leading-[28px] text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || typing || credits <= 0}
            className="grid size-[41.6px] flex-none place-items-center rounded-full transition-all duration-300 enabled:hover:translate-x-0.5 rtl:enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 enabled:hover:bg-[var(--nav-hover)] disabled:opacity-50"
          >
            <Ico h="2eb9a" dark="3c3f8" size={20} />
          </button>
        </form>

        {empty && (
          <div className="k-in-fade mt-4 flex flex-wrap justify-center gap-2" style={{ "--d": "850ms" } as React.CSSProperties}>
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => send(s.prompt)}
                className="flex h-8 items-center gap-2 rounded-[16px] ps-[14px] pe-[14px] text-[12px] leading-4 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:text-ink hover:shadow-[0_6px_16px_-8px_rgb(var(--accent-ink-rgb)/0.5)]"
                style={{ background: "var(--pop-bg)" }}
              >
                <Ico h={s.icon} dark={s.dark} size={16} />
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const GREETING = "Good to see you, Demo.";

function Hero() {
  const coach = useShell().role === "coach";
  // Arabic letters join up, so the greeting can't be animated letter by letter.
  const arabic = useLang()[0] === "ar";
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-[200px]">
        <span aria-hidden className="absolute start-[22px] top-[174px] h-[20px] w-[156px] rounded-[10px] blur-[7px]" style={{ background: "var(--orb-shadow-1)" }} />
        <span aria-hidden className="absolute start-[-12px] top-[164px] h-[40px] w-[224px] rounded-[20px] blur-[13px]" style={{ background: "var(--orb-shadow-2)" }} />
        {/* The blend must sit outside the animated layers, or the render's square backdrop shows. */}
        <div className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen">
          <div className="k-in-pop relative size-full" style={{ "--d": "100ms" } as React.CSSProperties}>
            {/* The sphere stays still; only its iridescent bands change color. */}
            <Image src="/assets/f/b4f8b.png" alt="" fill sizes="200px" priority className="only-light object-contain" />
            <Image src="/assets/f/45c43.png" alt="" fill sizes="200px" priority className="only-dark object-contain" />
            <div aria-hidden className="k-orb-color only-light" style={{ "--orb-mask": "url(/assets/f/b4f8b-chroma.png)" } as React.CSSProperties}>
              <span />
            </div>
            <div aria-hidden className="k-orb-color only-dark" style={{ "--orb-mask": "url(/assets/f/45c43-chroma.png)" } as React.CSSProperties}>
              <span />
            </div>
          </div>
        </div>
      </div>

      <h1 className="mt-[20px] h-[39px] text-center text-[24px] leading-[39.2px] font-semibold text-ink sm:text-[28px]" aria-label={GREETING}>
        {(arabic ? [GREETING] : GREETING.split("")).map((ch, i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block whitespace-pre animate-[k-type_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ animationDelay: `${350 + i * 38}ms` }}
          >
            {ch}
          </span>
        ))}
      </h1>
      <p className="k-in-fade mt-[14px] text-center text-[14px] leading-[21px] text-muted" style={{ "--d": "1100ms" } as React.CSSProperties}>
        {coach ? "Ask Kinora about your roster, your clients and their week." : "Ask Kinora about your training, nutrition and progress."}
      </p>
    </div>
  );
}
