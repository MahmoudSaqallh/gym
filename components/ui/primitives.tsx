"use client";

import { createContext, useContext, useState } from "react";
import { useCountUp, useInView } from "@/lib/hooks";
import { Popover } from "./popover";
import { cn } from "@/lib/cn";
import { TINT } from "@/lib/tint-map";

/* ───────── Shown context: children animate when their card enters the viewport ───────── */
const ShownCtx = createContext(true);
export const useShown = () => useContext(ShownCtx);

type CardProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "article" | "div";
  "aria-label"?: string;
};

/** Dashboard card surface with an entrance animation. */
export function Card({ delay = 0, className, children, as: Tag = "section", ...rest }: CardProps) {
  const [ref, shown] = useInView<HTMLElement>(0.12);
  return (
    <ShownCtx.Provider value={shown}>
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        data-shown={shown}
        style={{ "--d": `${delay}ms` } as React.CSSProperties}
        className={cn("k-card k-in", className)}
        {...rest}
      >
        {children}
      </Tag>
    </ShownCtx.Provider>
  );
}

/** Block that fires child entrance animations when visible (no surface styling). */
export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const [ref, shown] = useInView<HTMLDivElement>(0.1);
  return (
    <ShownCtx.Provider value={shown}>
      <div ref={ref} data-shown={shown} className={className}>
        {children}
      </div>
    </ShownCtx.Provider>
  );
}

/* ───────── Images that swap with the theme (Figma exports a baked asset per theme) ───────── */
type ThemedImgProps = {
  light: string;
  dark?: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

/** <img> that follows the accent color when the file is a baked-green SVG. */
export function TintImg({ src, width, height, className, alt = "" }: { src: string; width?: number; height?: number; className?: string; alt?: string }) {
  const paint = TINT[src];
  // eslint-disable-next-line @next/next/no-img-element
  if (!paint) return <img src={src} alt={alt} width={width} height={height} className={className} draggable={false} />;
  return (
    <span className={cn("k-tint", className)} data-paint={paint} style={{ width, height, "--m": `url(${src})` } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={width} height={height} draggable={false} />
    </span>
  );
}

export function ThemedImg({ light, dark, size, width, height, className, alt = "" }: ThemedImgProps) {
  const w = width ?? size;
  const h = height ?? size;
  if (!dark) {
    return <TintImg src={light} alt={alt} width={w} height={h} className={cn("block flex-none", className)} />;
  }
  return (
    <>
      <TintImg src={light} alt={alt} width={w} height={h} className={cn("only-light flex-none", className)} />
      <TintImg src={dark} alt={alt} width={w} height={h} className={cn("only-dark flex-none", className)} />
    </>
  );
}

/** Dashboard icon by name — resolves to /assets/dashboard/{light|dark}/{name}.svg */
export function DIcon({
  name,
  darkName,
  size = 20,
  width,
  height,
  className,
}: {
  name: string;
  darkName?: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <ThemedImg
      light={`/assets/dashboard/light/${name}.svg`}
      dark={`/assets/dashboard/dark/${darkName ?? name}.svg`}
      size={size}
      width={width}
      height={height}
      className={className}
    />
  );
}

/** Round gradient badge holding an icon. */
export function Chip({
  icon,
  size = 36,
  iconSize = 22,
  tone,
  className,
}: {
  icon: string;
  size?: number;
  iconSize?: number;
  tone?: "warm";
  className?: string;
}) {
  return (
    <span className={cn("k-chip", className)} data-tone={tone} style={{ width: size, height: size }}>
      <DIcon name={icon} size={iconSize} />
    </span>
  );
}

/** Animated number that counts up when its card becomes visible. */
export function CountUp({
  value,
  decimals = 0,
  delay = 0,
  duration,
  className,
}: {
  value: number;
  decimals?: number;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const shown = useShown();
  const v = useCountUp(value, shown, { delay, duration });
  const text = v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={cn("tabular-nums", className)} aria-label={value.toLocaleString("en-US")}>
      {text}
    </span>
  );
}

/** Rounded "Today ▾" select pill with a Today / Week / Month menu (Figma: "Select Content"). */
export function PeriodPill({
  label,
  options = ["Today", "Week", "Month"],
  onChange,
  icon = true,
  className,
}: {
  label: string;
  options?: string[];
  onChange?: (v: string) => void;
  icon?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState(label);
  return (
    <Popover
      offset={5}
      role="listbox"
      label="Period"
      className="w-[144px] py-[5px]"
      trigger={({ ref, open, toggle }) => (
        <button
          ref={ref}
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "group inline-flex h-[37px] flex-none items-center gap-[6px] rounded-full bg-pill ps-[14px] pe-[14px] text-[14px] leading-[21px] font-medium text-body transition-[filter,transform] duration-200 hover:brightness-95 active:scale-[0.97] dark:hover:brightness-125",
            className,
          )}
        >
          {icon && <DIcon name="calendar" size={15} />}
          <span>{value}</span>
          <span className={cn("transition-transform duration-300", open && "rotate-180")}>
            <DIcon name="chevron-down" size={16} />
          </span>
        </button>
      )}
    >
      {(close) =>
        options.map((o, i) => (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={o === value}
            onClick={() => {
              setValue(o);
              onChange?.(o);
              close();
            }}
            className={cn(
              "flex h-9 w-full items-center px-3 text-start text-[14px] leading-5 text-ink transition-colors hover:bg-[var(--menu-hover)]",
              o === value && "font-medium text-accent-ink",
            )}
            style={{ "--d": `${i * 40}ms`, animation: `k-slide-right 0.3s var(--ease-out) ${i * 40}ms both` } as React.CSSProperties}
          >
            {o}
          </button>
        ))
      }
    </Popover>
  );
}
