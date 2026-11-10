import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { NAV_STATES } from "../styles/constants";
import type { NavigateTo } from "../types";
import type { EntrySnapshot } from "../utils/appHistory";
import { getAppHistory } from "../utils/browserHistory";
import { hashToState, resolveNextRoute, routeToHash, type NavigationHashState } from "../utils/navigationState";

const PAGE_TITLES: Record<string, string> = {
  [NAV_STATES.HOME]: "PharmRef",
  [NAV_STATES.COMPARE]: "Compare Drugs — PharmRef",
  [NAV_STATES.CALCULATORS]: "Calculators — PharmRef",
  [NAV_STATES.BREAKPOINTS]: "Breakpoint Workspace — PharmRef",
  audit: "Content Audit — PharmRef",
};

export interface EntryChange {
  /** Sections to show expanded. */
  open: Record<string, boolean>;
  /** Search query to restore; null leaves the search box alone. */
  q: string | null;
  /** True when the entry came from back/forward rather than a fresh visit. */
  restored: boolean;
}

interface NavigationOptions {
  /** What to remember about the page being left. */
  captureEntry: () => EntrySnapshot;
  /** Called whenever the visible history entry changes. */
  onEntryChange: (change: EntryChange) => void;
}

// Restoring scroll has to wait for the page being returned to: it may still be
// rendering, or its content may be loading. Once the page is tall enough the
// offset is applied, then re-checked for a few ticks in case late layout (fonts,
// the sticky header) moved things. Any user input cancels it.
const SCROLL_RESTORE_MAX_FRAMES = 90;
const SCROLL_SETTLE_FRAMES = 12;
let cancelScrollRestore: (() => void) | null = null;

function restoreScroll(targetY: number) {
  cancelScrollRestore?.();

  if (targetY <= 0) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  let waited = 0;
  let settled = 0;
  let handle = 0;
  const stop = () => {
    window.clearTimeout(handle);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    cancelScrollRestore = null;
  };

  const attempt = () => {
    const reachable = document.documentElement.scrollHeight - window.innerHeight;
    const ready = reachable >= targetY - 2;

    if (!ready && waited < SCROLL_RESTORE_MAX_FRAMES) {
      waited += 1;
      handle = window.setTimeout(attempt, 16);
      return;
    }

    const top = Math.max(0, Math.min(targetY, reachable));
    if (Math.abs(window.scrollY - top) > 1) {
      window.scrollTo({ top, behavior: "auto" });
    }

    settled += 1;
    if (!ready || settled > SCROLL_SETTLE_FRAMES) {
      stop();
      return;
    }
    handle = window.setTimeout(attempt, 16);
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelScrollRestore = stop;
  handle = window.setTimeout(attempt, 16);
}

export function useNavigation({ captureEntry, onEntryChange }: NavigationOptions) {
  const [route, setRoute] = useState<NavigationHashState>(() => hashToState(window.location.hash || "#/"));
  const routeRef = useRef(route);
  const captureRef = useRef(captureEntry);
  const changeRef = useRef(onEntryChange);

  useEffect(() => {
    captureRef.current = captureEntry;
    changeRef.current = onEntryChange;
  }, [captureEntry, onEntryChange]);

  useEffect(() => {
    // The app restores scroll itself, once the returning page has rendered.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return getAppHistory().start({
      capture: () => captureRef.current(),
      onRouteChange: (change) => {
        const next = hashToState(change.hash);
        routeRef.current = next;
        setRoute(next);
        changeRef.current({ open: change.open, q: change.q, restored: true });
        restoreScroll(change.y);
      },
    });
  }, []);

  const navState = route.nav;

  const updatePageTitle = useCallback((entityName?: string | null) => {
    if (entityName) {
      document.title = `${entityName} — PharmRef`;
    } else {
      document.title = PAGE_TITLES[navState] ?? "PharmRef";
    }
  }, [navState]);

  useEffect(() => {
    updatePageTitle();
  }, [updatePageTitle]);

  const navigateTo = useCallback<NavigateTo>((state, data = {}, options = {}) => {
    const next = resolveNextRoute(routeRef.current, state, data);
    getAppHistory().navigate(routeToHash(next), options);
    routeRef.current = next;
    cancelScrollRestore?.();
    startTransition(() => setRoute(next));
    changeRef.current({ open: {}, q: null, restored: false });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return {
    navState,
    navigateTo,
    selectedDiseaseId: route.diseaseId,
    selectedMonographId: route.monographId,
    selectedBreakpointPreset: route.breakpointPreset,
    selectedPathogenId: route.pathogenId,
    selectedSubcategoryId: route.subcategoryId,
    updatePageTitle,
  };
}
