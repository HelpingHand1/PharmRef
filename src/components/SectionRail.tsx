import { useCallback, useEffect, useRef, useState } from "react";
import type { Styles } from "../types";

interface RailItem {
  id: string;
  label: string;
}

interface SectionRailProps {
  /** Changes whenever the page changes, so the rail rescans. */
  routeKey: string;
  onOpenSection: (id: string) => void;
  S: Styles;
}

const SECTION_SELECTOR = "main [data-section-id]";
const MIN_ITEMS = 3;

function readSections(): RailItem[] {
  const seen = new Set<string>();
  const items: RailItem[] = [];
  document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((element) => {
    const id = element.dataset.sectionId;
    const label = element.dataset.sectionShort || element.dataset.sectionTitle;
    if (!id || !label || seen.has(id)) return;
    seen.add(id);
    items.push({ id, label });
  });
  return items;
}

function sectionElement(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`main [data-section-id="${CSS.escape(id)}"]`);
}

/**
 * A strip of jump links for the sections on the current page. It reads the
 * sections from the DOM, so pages only have to render them: any element with
 * `data-section-id` and `data-section-title` shows up here.
 */
export default function SectionRail({ routeKey, onOpenSection, S }: SectionRailProps) {
  const [items, setItems] = useState<RailItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const jumpTargetRef = useRef<string | null>(null);

  // Keep the list in step with the page as content loads and sections appear.
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    // Timers rather than animation frames: frames stop while the app is in the
    // background, and the list must be right the moment it comes back.
    let timer = 0;
    const rescan = () => {
      timer = 0;
      const next = readSections();
      setItems((current) =>
        current.length === next.length && current.every((item, index) => item.id === next[index].id && item.label === next[index].label)
          ? current
          : next,
      );
    };
    const schedule = () => {
      if (!timer) timer = window.setTimeout(rescan, 60);
    };

    rescan();
    const observer = new MutationObserver(schedule);
    observer.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [routeKey]);

  // Highlight the section currently under the header.
  useEffect(() => {
    if (items.length < MIN_ITEMS) return;

    let timer = 0;
    const measure = () => {
      timer = 0;
      const header = document.querySelector<HTMLElement>(".app-header");
      const line = (header?.getBoundingClientRect().bottom ?? 0) + 28;
      let current: string | null = null;
      for (const item of items) {
        const element = sectionElement(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= line) current = item.id;
        else break;
      }

      // While a jump is animating, hold the highlight on its destination.
      if (jumpTargetRef.current) {
        if (current === jumpTargetRef.current) jumpTargetRef.current = null;
        else return;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (!timer) timer = window.setTimeout(measure, 80);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (timer) window.clearTimeout(timer);
    };
  }, [items]);

  // Keep the active chip in view inside the strip.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !activeId) return;
    const chip = rail.querySelector<HTMLElement>(`[data-rail-id="${CSS.escape(activeId)}"]`);
    if (!chip) return;
    const target = chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2;
    rail.scrollTo({ left: Math.max(0, target), behavior: "auto" });
  }, [activeId]);

  const jumpTo = useCallback(
    (id: string) => {
      onOpenSection(id);
      jumpTargetRef.current = id;
      setActiveId(id);
      // Give the section a beat to open so the scroll lands on its final position.
      window.setTimeout(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        sectionElement(id)?.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
        window.setTimeout(() => {
          if (jumpTargetRef.current === id) jumpTargetRef.current = null;
        }, 900);
      }, 40);
    },
    [onOpenSection],
  );

  if (items.length < MIN_ITEMS) return null;

  return (
    <nav className="section-rail no-print" aria-label="Sections on this page">
      <div ref={railRef} className="section-rail-track">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              data-rail-id={item.id}
              className={active ? "section-rail-chip is-active" : "section-rail-chip"}
              aria-current={active ? "true" : undefined}
              style={{
                color: active ? S.meta.accent : S.meta.textMuted,
                background: active ? S.meta.accentSurfaceStrong : "transparent",
                borderColor: active ? S.meta.accent : S.meta.border,
              }}
              onClick={() => jumpTo(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
