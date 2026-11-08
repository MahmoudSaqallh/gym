"use client";

/**
 * Inline script that runs from the server HTML, before first paint.
 * If React ever re-creates the document in the browser (for example while recovering
 * from an error), the copy it makes is marked as inert data: it must not run a second
 * time, and React logs an error for executable script tags it creates itself.
 */
export function BootScript({ code }: { code: string }) {
  return <script suppressHydrationWarning type={typeof window === "undefined" ? "text/javascript" : "text/plain"} dangerouslySetInnerHTML={{ __html: code }} />;
}
