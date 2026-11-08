import manifest from "@/public/assets/f/manifest.json";
import { cn } from "@/lib/cn";

type Entry = { colors: string[]; gradient: boolean; w: number; h: number; auto?: boolean };
const MAN = manifest as Record<string, Entry>;

/* Light-mode colors baked into Figma exports → theme tokens that flip in dark mode. */
const THEMED: Record<string, string> = {
  "#0a0a0a": "var(--ink)",
  black: "var(--ink)",
  "#40433f": "var(--body)",
  "#636768": "var(--subtle)",
  "#6d6e6e": "var(--muted)",
  "#4c7a02": "var(--accent-ink)",
  "#9ae600": "var(--lime)",
  "#b4ff00": "var(--lime-bright)",
  "#101401": "var(--on-accent)",
};

/**
 * Figma asset by content hash (files live in /public/assets/f).
 * Single-color SVG icons render as a mask filled with the matching theme token,
 * so one exported file serves both light and dark mode. Everything else is a plain <img>.
 */
type IcoProps = {
  h: string; // e.g. "5742b" or "351e8.png"
  dark?: string; // separate dark-mode export (for multi-color / gradient assets)
  size?: number;
  width?: number;
  height?: number;
  color?: string; // force a fill color for mask icons
  className?: string;
  alt?: string;
};

export function Ico({ dark, ...props }: IcoProps) {
  const [hash] = props.h.split(".");
  const e = MAN[hash];
  // gradient chip icons get an auto-generated "-d" twin (see scripts: light→dark color swap)
  const darkHash = dark ?? (e?.auto ? `${hash}-d` : undefined);
  if (darkHash) {
    const dims = { width: props.width ?? props.size ?? e?.w, height: props.height ?? props.size ?? e?.h };
    return (
      <>
        <IcoOne {...props} {...dims} className={cn("only-light", props.className)} />
        <IcoOne {...props} {...dims} h={darkHash} className={cn("only-dark", props.className)} />
      </>
    );
  }
  return <IcoOne {...props} />;
}

function IcoOne({ h, size, width, height, color, className, alt = "" }: Omit<IcoProps, "dark">) {
  const [hash, ext = "svg"] = h.split(".");
  const src = `/assets/f/${hash}.${ext}`;
  const e = MAN[hash];
  const w = width ?? size ?? e?.w ?? 20;
  const ht = height ?? size ?? e?.h ?? 20;
  const single = ext === "svg" && e && !e.gradient && e.colors.length === 1;
  const fill = color ?? (single ? THEMED[e.colors[0]] ?? e.colors[0] : undefined);

  if (single || (color && ext === "svg")) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn("inline-block flex-none", className)}
        style={{
          width: w,
          height: ht,
          backgroundColor: fill,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    );
  }
  // Green gradient chip icons (and their "-d" dark twins) follow the accent color through a mask.
  const base = MAN[hash.replace(/-d$/, "")];
  if (ext === "svg" && base?.gradient && (base.colors.includes("#8fd400") || base.colors.includes("#b8eb14"))) {
    return (
      <span className={cn("k-tint block flex-none", className)} data-paint="grad" style={{ width: w, height: ht, "--m": `url(${src})` } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={w} height={ht} draggable={false} />
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={w} height={ht} className={cn("block flex-none", className)} draggable={false} />;
}

/** Round gradient badge holding a Figma icon (same surface as <Chip>). */
export function IcoChip({
  h,
  dark,
  size = 36,
  iconSize = 22,
  tone,
  className,
}: {
  h: string;
  dark?: string;
  size?: number;
  iconSize?: number;
  tone?: "warm" | "neutral" | "onDark";
  className?: string;
}) {
  return (
    <span className={cn("k-chip", className)} data-tone={tone} style={{ width: size, height: size }}>
      <Ico h={h} dark={dark} size={iconSize} />
    </span>
  );
}
