"use client";

import { Popover } from "@/components/ui/popover";
import { DIcon, ThemedImg } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useLang, type Lang } from "./language-provider";

const OPTIONS: { id: Lang; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "/assets/dashboard/light/flag-us.svg" },
  { id: "ar", label: "العربية", flag: "/assets/flags/sa.svg" },
];

function Flag({ id, width, height }: { id: Lang; width: number; height: number }) {
  const o = OPTIONS.find((x) => x.id === id)!;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={o.flag} alt="" width={width} height={height} className="block flex-none rounded-[2px] object-cover" style={{ width, height }} draggable={false} />
  );
}

/** Language switcher: an icon button in the dashboard, a labelled pill on the sign-in screens. */
export function LanguageMenu({ variant = "icon", className, style }: { variant?: "icon" | "pill"; className?: string; style?: React.CSSProperties }) {
  const [lang, setLang] = useLang();

  return (
    <Popover
      offset={6}
      role="listbox"
      label="Change language"
      className="w-[150px] py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button ref={ref} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open} aria-label="Change language" className={className} style={style}>
          {variant === "icon" ? (
            <Flag id={lang} width={20} height={13.33} />
          ) : (
            <>
              <Flag id={lang} width={16} height={10.66} />
              <span translate="no">{lang === "ar" ? "AR" : "EN"}</span>
              <span className={cn("transition-transform duration-300", open && "rotate-180")}>
                <DIcon name="chevron-down" size={16} />
              </span>
            </>
          )}
        </button>
      )}
    >
      {(close) =>
        OPTIONS.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={o.id === lang}
            translate="no"
            onClick={() => {
              setLang(o.id);
              close();
            }}
            className={cn("flex h-10 w-full items-center gap-[10px] px-3 text-start text-[14px] text-ink transition-colors hover:bg-[var(--menu-hover)]", o.id === lang && "font-medium text-accent-ink")}
            style={{ animation: `k-slide-right 0.3s var(--ease-out) ${i * 40}ms both` }}
          >
            <Flag id={o.id} width={20} height={13.33} />
            {o.label}
          </button>
        ))
      }
    </Popover>
  );
}

export { ThemedImg };
