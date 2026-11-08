"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type Pos = { top: number; right?: number; left?: number; width: number };
type TriggerProps = { ref: React.Ref<HTMLButtonElement>; open: boolean; toggle: () => void };

/**
 * Trigger + floating panel. The panel is portaled to <body> (cards clip overflow),
 * right-aligned under the trigger, and closes on outside pointerdown / Escape.
 */
export function Popover({
  offset = 6,
  trigger,
  children,
  className,
  role,
  label,
  matchWidth = false,
}: {
  offset?: number;
  trigger: (p: TriggerProps) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  className?: string;
  role?: string;
  label?: string;
  matchWidth?: boolean; // panel as wide as its trigger, for form selects
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Panels hang from the trigger's reading-start edge side: right in LTR, left in RTL.
    const rtl = document.documentElement.dir === "rtl";
    setPos(rtl ? { top: r.bottom + offset, left: r.left, width: r.width } : { top: r.bottom + offset, right: document.documentElement.clientWidth - r.right, width: r.width });
  }, [offset]);

  const toggle = useCallback(() => {
    if (!open) measure();
    setOpen(!open);
  }, [open, measure]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  return (
    <>
      {trigger({ ref: anchorRef, open, toggle })}
      {open &&
        pos &&
        createPortal(
          <div ref={panelRef} role={role} aria-label={label} className={cn("k-pop fixed", className)} style={{ top: pos.top, left: pos.left, right: pos.right, width: matchWidth ? pos.width : undefined }}>
            {children(close)}
          </div>,
          document.body,
        )}
    </>
  );
}
