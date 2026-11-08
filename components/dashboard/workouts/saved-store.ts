"use client";

import { useSyncExternalStore } from "react";
import { ALL_EXERCISES } from "./exercises-data";

/* Saved exercises, persisted to localStorage and shared by the library + detail pages. */
const KEY = "kinora-saved-exercises";
const DEFAULT = ALL_EXERCISES.filter((e) => e.saved).map((e) => e.slug);
const listeners = new Set<() => void>();
let cache: string[] | null = null;
let raw: string | null | undefined;

function read(): string[] {
  let r: string | null = null;
  try {
    r = localStorage.getItem(KEY);
  } catch {
    /* storage unavailable */
  }
  if (cache && r === raw) return cache;
  raw = r;
  try {
    cache = r ? (JSON.parse(r) as string[]) : DEFAULT;
  } catch {
    cache = DEFAULT;
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
  } catch {
    /* keep in memory */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, read, () => DEFAULT);
  const toggle = (slug: string) => write(saved.includes(slug) ? saved.filter((x) => x !== slug) : [...saved, slug]);
  return { saved, isSaved: (slug: string) => saved.includes(slug), toggle };
}
