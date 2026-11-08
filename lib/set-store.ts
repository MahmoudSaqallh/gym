"use client";

import { useSyncExternalStore } from "react";

/** One string value persisted to localStorage and shared live across components. */
export function createValueStore(key: string, fallback: string) {
  const listeners = new Set<() => void>();
  const read = () => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  return function useValueStore() {
    const value = useSyncExternalStore(subscribe, read, () => fallback);
    const set = (next: string) => {
      try {
        localStorage.setItem(key, next);
      } catch {
        /* storage unavailable */
      }
      listeners.forEach((l) => l());
    };
    return [value, set] as const;
  };
}

/** A string set persisted to localStorage and shared live across every component that reads it. */
export function createSetStore(key: string, defaults: string[] = []) {
  const listeners = new Set<() => void>();
  let cache: string[] | null = null;
  let raw: string | null | undefined;

  function read(): string[] {
    let r: string | null = null;
    try {
      r = localStorage.getItem(key);
    } catch {
      /* storage unavailable */
    }
    if (cache && r === raw) return cache;
    raw = r;
    try {
      cache = r ? (JSON.parse(r) as string[]) : defaults;
    } catch {
      cache = defaults;
    }
    return cache;
  }

  function write(next: string[]) {
    cache = next;
    try {
      raw = JSON.stringify(next);
      localStorage.setItem(key, raw);
    } catch {
      /* keep in memory */
    }
    listeners.forEach((l) => l());
  }

  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };

  return function useSetStore() {
    const items = useSyncExternalStore(subscribe, read, () => defaults);
    const toggle = (id: string) => write(items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
    return { items, has: (id: string) => items.includes(id), toggle };
  };
}
