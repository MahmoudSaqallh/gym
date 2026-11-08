"use client";

import { useEffect } from "react";
import { createValueStore } from "@/lib/set-store";
import { needsWork, toArabic } from "@/lib/i18n/translate";

export type Lang = "en" | "ar";

const useLangValue = createValueStore("kinora-lang", "en");

export function useLang() {
  const [value, set] = useLangValue();
  return [(value === "ar" ? "ar" : "en") as Lang, set as (next: Lang) => void] as const;
}

/** Runs before first paint: direction and language, so Arabic never flashes as left-to-right English. */
export const langInitScript = `(function(){try{if(localStorage.getItem('kinora-lang')==='ar'){var d=document.documentElement;d.lang='ar';d.dir='rtl';d.dataset.i18n='pending';setTimeout(function(){d.dataset.i18n='ready'},2500)}}catch(e){}})();`;

const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;
const SKIP = "script,style,textarea,pre,code,[translate='no']";

/* Originals are remembered per node, so switching back restores whatever React last rendered. */
let englishTitle = "";
const texts = new WeakMap<Text, { en: string; ar: string }>();
const attrs = new WeakMap<Element, Partial<Record<(typeof ATTRS)[number], { en: string; ar: string }>>>();
const skipped = (el: Element | null) => !!el?.closest(SKIP);

function translateText(node: Text) {
  const value = node.nodeValue ?? "";
  if (!needsWork(value) || skipped(node.parentElement)) return;
  const ar = toArabic(value);
  if (ar !== value) {
    texts.set(node, { en: value, ar });
    node.nodeValue = ar;
  }
}

function translateAttrs(el: Element) {
  for (const name of ATTRS) {
    const value = el.getAttribute(name);
    if (!value || !/[A-Za-z]/.test(value)) continue;
    const ar = toArabic(value);
    if (ar === value) continue;
    attrs.set(el, { ...attrs.get(el), [name]: { en: value, ar } });
    el.setAttribute(name, ar);
  }
}

function translateTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root as Text);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (skipped(el)) return;
  translateAttrs(el);
  el.querySelectorAll("*").forEach(translateAttrs);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) translateText(walker.currentNode as Text);
}

function restoreTree(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const rec = texts.get(node);
    if (rec && node.nodeValue === rec.ar) node.nodeValue = rec.en;
  }
  for (const el of [root, ...root.querySelectorAll("*")]) {
    const rec = attrs.get(el);
    if (!rec) continue;
    for (const name of ATTRS) if (rec[name] && el.getAttribute(name) === rec[name].ar) el.setAttribute(name, rec[name].en);
  }
}

/**
 * Touching server-rendered text before React has claimed it causes a hydration mismatch, and
 * Suspense boundaries hydrate after the root effect runs. So wait until every element has a fiber.
 */
function whenHydrated(done: () => void) {
  const started = performance.now();
  const claimed = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));
  const ignored = /^(SCRIPT|STYLE|TEMPLATE|LINK|META|NOSCRIPT)$/;
  let timer = 0;
  const tick = () => {
    const pending = [...document.body.querySelectorAll("*")].some((el) => !ignored.test(el.tagName) && !el.tagName.includes("-") && !el.closest("[data-nextjs-toast],nextjs-portal") && !claimed(el));
    if (!pending || performance.now() - started > 2200) done();
    else timer = window.setTimeout(tick, 30);
  };
  tick();
  return () => window.clearTimeout(timer);
}

/**
 * Applies the chosen language to the whole document. The UI is authored in English; in Arabic a
 * MutationObserver translates every text node and label as React renders or updates it.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang] = useLang();

  useEffect(() => {
    const root = document.documentElement;
    const title = () => {
      const ar = toArabic(document.title);
      if (ar !== document.title) {
        englishTitle = document.title;
        document.title = ar;
      }
    };

    if (lang !== "ar") {
      root.lang = "en";
      root.dir = "ltr";
      delete root.dataset.i18n;
      restoreTree(document.body);
      if (englishTitle) document.title = englishTitle;
      return;
    }

    root.lang = "ar";
    root.dir = "rtl";
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") translateText(r.target as Text);
        else if (r.type === "attributes") translateAttrs(r.target as Element);
        else r.addedNodes.forEach(translateTree);
      }
      title();
    });
    const cancel = whenHydrated(() => {
      translateTree(document.body);
      title();
      root.dataset.i18n = "ready";
      observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
      const head = document.querySelector("head");
      if (head) observer.observe(head, { subtree: true, childList: true, characterData: true });
    });
    return () => {
      cancel();
      observer.disconnect();
    };
  }, [lang]);

  return children;
}
