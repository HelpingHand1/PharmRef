// ============================================================
// APP HISTORY — browser history that behaves like a native app
// ============================================================
// PharmRef routes live in the URL hash. This module owns every write to the
// history stack so that:
//   - each page visit is a real history entry (back/forward and the phone's
//     back gesture step through pages instead of leaving the app),
//   - each entry remembers its scroll offset and open sections,
//   - a dismissible layer (search results, dialogs, sheets) costs exactly one
//     extra "overlay" entry, so back closes the layer before leaving the page.
//
// The environment is injected so the stack logic can be regression-tested
// without a browser.

export interface EntrySnapshot {
  /** Section ids that are expanded on the page. */
  open: Record<string, boolean>;
  /** Active search query, or "" when search is closed. */
  q: string;
}

export interface EntryState {
  __pr: true;
  kind: "route" | "overlay";
  y?: number;
  open?: Record<string, boolean>;
  q?: string;
}

export interface RouteChange {
  hash: string;
  /** Scroll offset to restore, 0 for a fresh page. */
  y: number;
  open: Record<string, boolean>;
  /** Search query to restore; null leaves the search box alone. */
  q: string | null;
}

export interface HistoryEnvironment {
  history: {
    readonly state: unknown;
    pushState(state: unknown, unused: string, url?: string): void;
    replaceState(state: unknown, unused: string, url?: string): void;
    back(): void;
  };
  getHash(): string;
  getScrollY(): number;
  onPopState(listener: () => void): () => void;
  /** Deferred call, used to let a burst of open/close settle before touching history. */
  defer(callback: () => void): void;
}

export interface AppHistoryHandlers {
  capture(): EntrySnapshot;
  onRouteChange(change: RouteChange): void;
}

interface OverlayRecord {
  id: number;
  dismiss: () => void;
}

export function normalizeHash(hash: string | null | undefined): string {
  if (!hash || hash === "#" || hash === "#/") return "#/";
  return hash.startsWith("#") ? hash : `#${hash}`;
}

function isEntryState(value: unknown): value is EntryState {
  return Boolean(value) && typeof value === "object" && (value as EntryState).__pr === true;
}

function isOverlayState(value: unknown): value is EntryState {
  return isEntryState(value) && value.kind === "overlay";
}

function routeState(extra: Partial<EntryState> = {}): EntryState {
  return { __pr: true, kind: "route", ...extra };
}

export function createAppHistory(env: HistoryEnvironment) {
  let handlers: AppHistoryHandlers | null = null;
  let appliedHash = normalizeHash(env.getHash());
  let overlays: OverlayRecord[] = [];
  let nextOverlayId = 1;
  let selfBackPending = false;
  let reconcileQueued = false;
  let detach: (() => void) | null = null;
  // The page as it was when the first layer opened; the layer may scroll or
  // re-render it before the overlay entry is written.
  let pageBeforeOverlay: { y: number; open: Record<string, boolean> } | null = null;
  // After landing back on kept search results, the app needs a moment to
  // re-open search and claim the entry before it is treated as abandoned.
  let claimGrace = 0;

  const capture = (): EntrySnapshot => handlers?.capture() ?? { open: {}, q: "" };

  // History writes can throw (Safari rate-limits them, sandboxed frames forbid them).
  // Navigation must still work in-memory, so failures are swallowed.
  const safely = (write: () => void) => {
    try {
      write();
    } catch {
      // Ignore: the in-app state has already moved on.
    }
  };

  function reconcile() {
    reconcileQueued = false;
    if (selfBackPending) return;

    const current = env.history.state;
    const onOverlay = isOverlayState(current);
    const wanted = overlays.length > 0;

    if (wanted && !onOverlay) {
      const page = pageBeforeOverlay ?? { y: env.getScrollY(), open: capture().open };
      pageBeforeOverlay = null;
      safely(() => {
        env.history.replaceState(routeState(page), "");
        env.history.pushState({ __pr: true, kind: "overlay" } satisfies EntryState, "");
      });
      return;
    }

    pageBeforeOverlay = null;

    if (!wanted && onOverlay && claimGrace > 0) {
      claimGrace -= 1;
      queueReconcile();
      return;
    }

    if (!wanted && onOverlay) {
      selfBackPending = true;
      safely(() => env.history.back());
      // If the browser never reports that step, stop waiting for it.
      env.defer(() =>
        env.defer(() => {
          selfBackPending = false;
        }),
      );
    }
  }

  function queueReconcile() {
    if (reconcileQueued) return;
    reconcileQueued = true;
    env.defer(reconcile);
  }

  function emitRoute(hash: string, state: unknown, q: string | null) {
    appliedHash = hash;
    const entry = isEntryState(state) ? state : null;
    handlers?.onRouteChange({
      hash,
      y: entry?.y ?? 0,
      open: entry?.open ?? {},
      q,
    });
  }

  function handlePopState() {
    const state = env.history.state;
    const hash = normalizeHash(env.getHash());

    // Our own step back off a spent overlay entry: the page is already showing,
    // so this only puts its scroll offset and sections back.
    if (selfBackPending) {
      selfBackPending = false;
      emitRoute(hash, state, null);
      queueReconcile();
      return;
    }

    // Back pressed while a layer is open: close the top layer and put the page
    // underneath back the way it was when the layer opened.
    if (overlays.length > 0 && !isOverlayState(state)) {
      const top = overlays[overlays.length - 1];
      overlays = overlays.slice(0, -1);
      top.dismiss();
      emitRoute(hash, state, null);
      queueReconcile();
      return;
    }

    // Landed on an overlay entry: either kept search results, or a stale one.
    if (isOverlayState(state)) {
      if (state.q) {
        claimGrace = 10;
        emitRoute(hash, state, state.q);
      } else if (hash !== appliedHash) {
        emitRoute(hash, null, null);
      }
      queueReconcile();
      return;
    }

    emitRoute(hash, state, "");
  }

  return {
    /** Attach listeners and normalize the entry the app booted on. */
    start(nextHandlers: AppHistoryHandlers) {
      handlers = nextHandlers;
      appliedHash = normalizeHash(env.getHash());
      overlays = [];
      selfBackPending = false;

      // A reload can land on a leftover overlay entry; treat it as a plain page.
      if (isOverlayState(env.history.state)) {
        safely(() => env.history.replaceState(routeState(), ""));
      }

      detach?.();
      detach = env.onPopState(handlePopState);
      return () => {
        detach?.();
        detach = null;
        handlers = null;
      };
    },

    /** Record a forward navigation. Returns false when the URL did not change. */
    navigate(hash: string, options: { replace?: boolean } = {}): boolean {
      const target = normalizeHash(hash);
      const current = env.history.state;
      const snapshot = capture();
      const sameHash = target === normalizeHash(env.getHash());

      if (options.replace) {
        safely(() => env.history.replaceState(isOverlayState(current) ? current : routeState(), "", target));
        appliedHash = target;
        return !sameHash;
      }

      if (isOverlayState(current)) {
        if (snapshot.q) {
          // Leaving search results for a page: keep the results as their own entry.
          safely(() => {
            env.history.replaceState(
              { __pr: true, kind: "overlay", q: snapshot.q, y: env.getScrollY() } satisfies EntryState,
              "",
            );
            env.history.pushState(routeState(), "", target);
          });
          appliedHash = target;
          return true;
        }

        if (sameHash) {
          queueReconcile();
          return false;
        }

        // A dialog launched this navigation: its entry becomes the new page.
        safely(() => env.history.replaceState(routeState(), "", target));
        appliedHash = target;
        queueReconcile();
        return true;
      }

      if (sameHash) return false;

      safely(() => {
        env.history.replaceState(routeState({ y: env.getScrollY(), open: snapshot.open }), "");
        env.history.pushState(routeState(), "", target);
      });
      appliedHash = target;
      return true;
    },

    /** Register a dismissible layer. Returns the function that unregisters it. */
    openOverlay(dismiss: () => void): () => void {
      const record: OverlayRecord = { id: nextOverlayId++, dismiss };
      if (overlays.length === 0 && !isOverlayState(env.history.state)) {
        pageBeforeOverlay = { y: env.getScrollY(), open: capture().open };
      }
      overlays = [...overlays, record];
      claimGrace = 0;
      queueReconcile();
      return () => {
        const before = overlays.length;
        overlays = overlays.filter((item) => item.id !== record.id);
        if (overlays.length !== before) queueReconcile();
      };
    },

    /** Test and debugging aid. */
    inspect() {
      return { appliedHash, overlayCount: overlays.length, selfBackPending };
    },
  };
}

export type AppHistory = ReturnType<typeof createAppHistory>;
